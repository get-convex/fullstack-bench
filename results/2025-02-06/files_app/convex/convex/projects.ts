import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import {
  hasProjectAccess,
  isAdmin,
  isProjectNameUnique,
} from "./lib/access";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all accessible projects for the current user
export const listAccessibleProjects = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      name: v.string(),
      description: v.string(),
      emoji: v.string(),
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

    // If admin, return all projects
    if (user?.isAdmin) {
      return await ctx.db.query("projects").collect();
    }

    // Get user's direct project memberships
    const directMemberships = await ctx.db
      .query("project_members")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const directProjectIds = new Set(directMemberships.map((m) => m.projectId));

    // Get user's group memberships
    const userGroups = await ctx.db
      .query("group_members")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const userGroupIds = userGroups.map((g) => g.groupId);

    // Get projects accessible through groups
    const groupProjectMemberships = await ctx.db
      .query("project_group_members")
      .collect();

    const groupProjectIds = new Set(
      groupProjectMemberships
        .filter((m) => userGroupIds.includes(m.groupId))
        .map((m) => m.projectId)
    );

    // Combine all accessible project IDs
    const allProjectIds = new Set([...directProjectIds, ...groupProjectIds]);

    // Fetch and return all accessible projects
    const projects = await Promise.all(
      Array.from(allProjectIds).map((id) => ctx.db.get(id))
    );

    return projects.filter((p): p is NonNullable<typeof p> => p !== null);
  },
});

// Get a single project's details
export const getProject = query({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.object({
    _id: v.id("projects"),
    name: v.string(),
    description: v.string(),
    emoji: v.string(),
    members: v.array(v.id("users")),
    groups: v.array(
      v.object({
        _id: v.id("groups"),
        name: v.string(),
      })
    ),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check project access
    const hasAccess = await hasProjectAccess(ctx, args.projectId, userId);
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    // Get project members
    const members = await ctx.db
      .query("project_members")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Get project groups
    const groupMembers = await ctx.db
      .query("project_group_members")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const groups = await Promise.all(
      groupMembers.map(async (gm) => {
        const group = await ctx.db.get(gm.groupId);
        if (!group) throw new Error("Group not found");
        return {
          _id: group._id,
          name: group.name,
        };
      })
    );

    return {
      ...project,
      members: members.map((m) => m.userId),
      groups,
    };
  },
});

// Create a new project
export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    emoji: v.string(),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Create project
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      emoji: args.emoji,
    });

    // Add creator as a member
    await ctx.db.insert("project_members", {
      projectId,
      userId,
    });

    return projectId;
  },
});

// Update a project
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    description: v.string(),
    emoji: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check project access
    const hasAccess = await hasProjectAccess(ctx, args.projectId, userId);
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.projectId, {
      name: args.name,
      description: args.description,
      emoji: args.emoji,
    });

    return null;
  },
});

// Delete a project
export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check project access
    const hasAccess = await hasProjectAccess(ctx, args.projectId, userId);
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    // Delete project memberships
    const memberships = await ctx.db
      .query("project_members")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const membership of memberships) {
      await ctx.db.delete(membership._id);
    }

    // Delete project group memberships
    const groupMemberships = await ctx.db
      .query("project_group_members")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const membership of groupMemberships) {
      await ctx.db.delete(membership._id);
    }

    // Delete project
    await ctx.db.delete(args.projectId);
    return null;
  },
});

// Add a user to a project
export const addProjectMember = mutation({
  args: {
    projectId: v.id("projects"),
    userId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    // Check if current user has access to the project
    const hasAccess = await hasProjectAccess(ctx, args.projectId, currentUserId);
    if (!hasAccess) {
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
      .query("project_members")
      .withIndex("by_project_user", (q) =>
        q.eq("projectId", args.projectId).eq("userId", args.userId)
      )
      .unique();

    if (existingMembership) {
      throw new Error("User is already a member of this project");
    }

    await ctx.db.insert("project_members", {
      projectId: args.projectId,
      userId: args.userId,
    });

    return null;
  },
});

// Remove a user from a project
export const removeProjectMember = mutation({
  args: {
    projectId: v.id("projects"),
    userId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    // Check if current user has access to the project
    const hasAccess = await hasProjectAccess(ctx, args.projectId, currentUserId);
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    const membership = await ctx.db
      .query("project_members")
      .withIndex("by_project_user", (q) =>
        q.eq("projectId", args.projectId).eq("userId", args.userId)
      )
      .unique();

    if (!membership) {
      throw new Error("User is not a member of this project");
    }

    await ctx.db.delete(membership._id);
    return null;
  },
});

// Add a group to a project
export const addProjectGroupMember = mutation({
  args: {
    projectId: v.id("projects"),
    groupId: v.id("groups"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if current user has access to the project
    const hasAccess = await hasProjectAccess(ctx, args.projectId, userId);
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    // Check if membership already exists
    const existingMembership = await ctx.db
      .query("project_group_members")
      .withIndex("by_project_group", (q) =>
        q.eq("projectId", args.projectId).eq("groupId", args.groupId)
      )
      .unique();

    if (existingMembership) {
      throw new Error("Group is already a member of this project");
    }

    await ctx.db.insert("project_group_members", {
      projectId: args.projectId,
      groupId: args.groupId,
    });

    return null;
  },
});

// Remove a group from a project
export const removeProjectGroupMember = mutation({
  args: {
    projectId: v.id("projects"),
    groupId: v.id("groups"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if current user has access to the project
    const hasAccess = await hasProjectAccess(ctx, args.projectId, userId);
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    const membership = await ctx.db
      .query("project_group_members")
      .withIndex("by_project_group", (q) =>
        q.eq("projectId", args.projectId).eq("groupId", args.groupId)
      )
      .unique();

    if (!membership) {
      throw new Error("Group is not a member of this project");
    }

    await ctx.db.delete(membership._id);
    return null;
  },
});

// Get all groups a user is a member of (including parent groups)
export const getUserGroups = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(
    v.object({
      _id: v.id("groups"),
      name: v.string(),
      parentGroupId: v.optional(v.id("groups")),
      isDirect: v.boolean(), // Whether the user is a direct member of this group
    })
  ),
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    // Get direct memberships
    const directGroups = await ctx.db
      .query("group_members")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const directGroupIds = new Set(directGroups.map((g) => g.groupId));

    // Get all groups this user has access to (including parent groups)
    const groups = await ctx.db.query("groups").collect();
    const result = groups.map(group => ({
      _id: group._id,
      name: group.name,
      parentGroupId: group.parentGroupId,
      isDirect: directGroupIds.has(group._id),
    }));

    return result;
  },
});