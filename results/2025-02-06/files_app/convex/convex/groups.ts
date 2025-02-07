import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { isAdmin } from "./lib/access";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to check if adding a parent would create a cycle
async function wouldCreateCycle(
  ctx: QueryCtx,
  groupId: Id<"groups">,
  parentId: Id<"groups">
): Promise<boolean> {
  if (groupId === parentId) return true;

  const parent = await ctx.db.get(parentId);
  if (!parent) return false;

  if (!parent.parentGroupId) return false;
  return wouldCreateCycle(ctx, groupId, parent.parentGroupId);
}

// List all groups
export const listGroups = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("groups"),
      _creationTime: v.number(),
      name: v.string(),
      parentGroupId: v.optional(v.id("groups")),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!user?.isAdmin) {
      throw new Error("Not authorized");
    }

    return await ctx.db.query("groups").collect();
  },
});

// Get a single group's details
export const getGroup = query({
  args: {
    groupId: v.id("groups"),
  },
  returns: v.object({
    _id: v.id("groups"),
    name: v.string(),
    parentGroupId: v.optional(v.id("groups")),
    members: v.array(v.id("users")),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const members = await ctx.db
      .query("group_members")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    return {
      _id: group._id,
      name: group.name,
      parentGroupId: group.parentGroupId,
      members: members.map((m) => m.userId as Id<"users">),
    };
  },
});

// Create a new group
export const createGroup = mutation({
  args: {
    name: v.string(),
    parentGroupId: v.optional(v.id("groups")),
  },
  returns: v.id("groups"),
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }

    if (args.parentGroupId) {
      const parent = await ctx.db.get(args.parentGroupId);
      if (!parent) {
        throw new Error("Parent group not found");
      }
    }

    return await ctx.db.insert("groups", {
      name: args.name,
      parentGroupId: args.parentGroupId,
    });
  },
});

// Update a group
export const updateGroup = mutation({
  args: {
    groupId: v.id("groups"),
    name: v.optional(v.string()),
    parentGroupId: v.optional(v.id("groups")),
  },
  handler: async (ctx, args) => {
    const { groupId, name, parentGroupId } = args;
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }

    // Check for circular dependencies if parentGroupId is provided
    if (parentGroupId) {
      let currentGroup = await ctx.db.get(parentGroupId);
      while (currentGroup?.parentGroupId) {
        if (currentGroup.parentGroupId === groupId) {
          throw new Error("Circular group dependency detected");
        }
        currentGroup = await ctx.db.get(currentGroup.parentGroupId);
      }
    }

    const update: { name?: string; parentGroupId?: Id<"groups"> } = {};
    if (name !== undefined) {
      update.name = name;
    }
    if (parentGroupId !== undefined) {
      update.parentGroupId = parentGroupId;
    }

    return await ctx.db.patch(groupId, update);
  },
});

// Delete a group
export const deleteGroup = mutation({
  args: {
    groupId: v.id("groups"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }

    // Check if group has children
    const children = await ctx.db
      .query("groups")
      .withIndex("by_parent", (q) => q.eq("parentGroupId", args.groupId))
      .collect();

    if (children.length > 0) {
      throw new Error("Cannot delete group with children");
    }

    // Delete group memberships
    const memberships = await ctx.db
      .query("group_members")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    for (const membership of memberships) {
      await ctx.db.delete(membership._id);
    }

    // Delete project group memberships
    const projectMemberships = await ctx.db
      .query("project_group_members")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    for (const membership of projectMemberships) {
      await ctx.db.delete(membership._id);
    }

    await ctx.db.delete(args.groupId);
    return null;
  },
});

// Add a user to a group
export const addGroupMember = mutation({
  args: {
    groupId: v.id("groups"),
    userId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }

    // Check if user exists in workspace
    const workspaceUser = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!workspaceUser) {
      throw new Error("User not found in workspace");
    }

    // Check if membership already exists
    const existingMembership = await ctx.db
      .query("group_members")
      .withIndex("by_group_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.userId)
      )
      .unique();

    if (existingMembership) {
      throw new Error("User is already a member of this group");
    }

    await ctx.db.insert("group_members", {
      groupId: args.groupId,
      userId: args.userId,
    });

    return null;
  },
});

// Remove a user from a group
export const removeGroupMember = mutation({
  args: {
    groupId: v.id("groups"),
    userId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }

    const membership = await ctx.db
      .query("group_members")
      .withIndex("by_group_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.userId)
      )
      .unique();

    if (!membership) {
      throw new Error("User is not a member of this group");
    }

    await ctx.db.delete(membership._id);
    return null;
  },
});

export const getChildGroups = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Not authorized");
    }

    return await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("parentGroupId"), args.groupId))
      .collect();
  },
});