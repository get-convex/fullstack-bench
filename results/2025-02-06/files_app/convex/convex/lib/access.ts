import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to check if a user has access to a project
export async function hasProjectAccess(
  ctx: QueryCtx,
  projectId: Id<"projects">,
  userId: Id<"users">
): Promise<boolean> {
  // Check if user is admin
  const user = await ctx.db
    .query("workspace_users")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  if (user?.isAdmin) return true;

  // Check direct user membership
  const directMembership = await ctx.db
    .query("project_members")
    .withIndex("by_project_user", (q) =>
      q.eq("projectId", projectId).eq("userId", userId)
    )
    .unique();

  if (directMembership) return true;

  // Check group memberships
  const userGroups = await ctx.db
    .query("group_members")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  const userGroupIds = userGroups.map((g) => g.groupId);

  if (userGroupIds.length === 0) return false;

  const groupMemberships = await ctx.db
    .query("project_group_members")
    .withIndex("by_project", (q) => q.eq("projectId", projectId))
    .collect();

  for (const membership of groupMemberships) {
    if (userGroupIds.includes(membership.groupId)) return true;
  }

  return false;
}

// Helper function to check if a user is a workspace admin
export async function isAdmin(ctx: QueryCtx): Promise<boolean> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;

  const user = await ctx.db
    .query("workspace_users")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  return user?.isAdmin ?? false;
}

// Helper function to check if adding a parent would create a cycle in groups
export async function wouldCreateGroupCycle(
  ctx: QueryCtx,
  groupId: Id<"groups">,
  parentId: Id<"groups">
): Promise<boolean> {
  if (groupId === parentId) return true;

  const parent = await ctx.db.get(parentId);
  if (!parent) return false;

  if (!parent.parentGroupId) return false;
  return wouldCreateGroupCycle(ctx, groupId, parent.parentGroupId);
}

// Helper function to check if adding a parent would create a cycle in filesystem
export async function wouldCreateFilesystemCycle(
  ctx: QueryCtx,
  entryId: Id<"filesystem_entries">,
  parentId: Id<"filesystem_entries">
): Promise<boolean> {
  if (entryId === parentId) return true;

  const parent = await ctx.db.get(parentId);
  if (!parent) return false;

  if (!parent.parentId) return false;
  return wouldCreateFilesystemCycle(ctx, entryId, parent.parentId);
}

// Helper function to get the full path of a filesystem entry
export async function getFullPath(
  ctx: QueryCtx,
  entryId: Id<"filesystem_entries">
): Promise<string> {
  const entry = await ctx.db.get(entryId);
  if (!entry) throw new Error("Entry not found");

  if (!entry.parentId) return entry.name;

  const parentPath = await getFullPath(ctx, entry.parentId);
  return `${parentPath}/${entry.name}`;
}

// Helper function to check if a name is unique under a parent directory
export async function isNameUniqueUnderParent(
  ctx: QueryCtx,
  projectId: Id<"projects">,
  parentId: Id<"filesystem_entries"> | undefined,
  name: string,
  excludeId?: Id<"filesystem_entries">
): Promise<boolean> {
  const existing = await ctx.db
    .query("filesystem_entries")
    .withIndex("by_parent_name", (q) =>
      q.eq("parentId", parentId).eq("name", name)
    )
    .filter((q) => q.eq(q.field("projectId"), projectId))
    .unique();

  if (!existing) return true;
  if (excludeId && existing._id === excludeId) return true;
  return false;
}

// Helper function to check if a project name is unique
export async function isProjectNameUnique(
  ctx: QueryCtx,
  name: string,
  excludeId?: Id<"projects">
): Promise<boolean> {
  const existing = await ctx.db
    .query("projects")
    .filter((q) => q.eq(q.field("name"), name))
    .unique();

  if (!existing) return true;
  if (excludeId && existing._id === excludeId) return true;
  return false;
}

// Helper function to get all groups a user is a member of (including parent groups)
export async function getAllUserGroups(
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<Set<Id<"groups">>> {
  // Get direct group memberships
  const directGroups = await ctx.db
    .query("group_members")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  const groupIds = new Set<Id<"groups">>(directGroups.map((g) => g.groupId));
  const processedGroups = new Set<Id<"groups">>();

  // Process each group to add its parent groups
  for (const groupId of groupIds) {
    await addParentGroups(ctx, groupId, groupIds, processedGroups);
  }

  return groupIds;
}

// Helper function to recursively add parent groups
async function addParentGroups(
  ctx: QueryCtx,
  groupId: Id<"groups">,
  groupIds: Set<Id<"groups">>,
  processedGroups: Set<Id<"groups">>
): Promise<void> {
  if (processedGroups.has(groupId)) {
    return;
  }

  processedGroups.add(groupId);
  const group = await ctx.db.get(groupId);
  if (!group || !group.parentGroupId) {
    return;
  }

  groupIds.add(group.parentGroupId);
  await addParentGroups(ctx, group.parentGroupId, groupIds, processedGroups);
}

// Helper function to get all projects a user has access to
export async function getAllAccessibleProjects(
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<Set<Id<"projects">>> {
  // Check if user is admin
  const user = await ctx.db
    .query("workspace_users")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  if (user?.isAdmin) {
    // Admins can access all projects
    const allProjects = await ctx.db.query("projects").collect();
    return new Set(allProjects.map((p) => p._id));
  }

  // Get direct project memberships
  const directProjects = await ctx.db
    .query("project_members")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  const projectIds = new Set<Id<"projects">>(
    directProjects.map((p) => p.projectId)
  );

  // Get group memberships and add projects accessible through groups
  const groupIds = await getAllUserGroups(ctx, userId);

  for (const groupId of groupIds) {
    const groupProjects = await ctx.db
      .query("project_group_members")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();

    for (const project of groupProjects) {
      projectIds.add(project.projectId);
    }
  }

  return projectIds;
}