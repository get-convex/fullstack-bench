import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAllUserGroups, getAllAccessibleProjects } from "./lib/access";
import { getAuthUserId } from "@convex-dev/auth/server";

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get all groups (direct and inherited)
    const allGroupIds = await getAllUserGroups(ctx, args.userId);

    // Get direct memberships
    const directGroups = await ctx.db
      .query("group_members")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const directGroupIds = new Set(directGroups.map((g) => g.groupId));

    // Fetch all group details
    const groups = await Promise.all(
      Array.from(allGroupIds).map(async (groupId) => {
        const group = await ctx.db.get(groupId);
        if (!group) throw new Error("Group not found");
        return {
          _id: group._id,
          name: group.name,
          parentGroupId: group.parentGroupId,
          isDirect: directGroupIds.has(groupId),
        };
      })
    );

    return groups;
  },
});

// Get all projects a user has access to with membership information
export const getUserProjects = query({
  args: {
    userId: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
      emoji: v.string(),
      access: v.union(
        v.literal("direct"), // Direct member
        v.literal("group"), // Access through group
        v.literal("admin") // Admin access
      ),
      accessGroups: v.array(
        v.object({
          _id: v.id("groups"),
          name: v.string(),
        })
      ),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const isAdmin = user?.isAdmin ?? false;

    // Get all accessible projects
    const projectIds = await getAllAccessibleProjects(ctx, userId);

    // Get direct memberships
    const directProjects = await ctx.db
      .query("project_members")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const directProjectIds = new Set(directProjects.map((p) => p.projectId));

    // Get user's groups
    const userGroups = await getAllUserGroups(ctx, userId);

    // Build the result
    const projects = await Promise.all(
      Array.from(projectIds).map(async (projectId) => {
        const project = await ctx.db.get(projectId);
        if (!project) throw new Error("Project not found");

        // If admin, no need to check other access methods
        if (isAdmin) {
          return {
            ...project,
            access: "admin" as const,
            accessGroups: [],
          };
        }

        // If direct member, that's the primary access method
        if (directProjectIds.has(projectId)) {
          return {
            ...project,
            access: "direct" as const,
            accessGroups: [],
          };
        }

        // Must be accessing through groups, find which ones
        const projectGroups = await ctx.db
          .query("project_group_members")
          .withIndex("by_project", (q) => q.eq("projectId", projectId))
          .collect();

        const accessGroupIds = projectGroups
          .filter((pg) => userGroups.has(pg.groupId))
          .map((pg) => pg.groupId);

        const accessGroups = await Promise.all(
          accessGroupIds.map(async (groupId) => {
            const group = await ctx.db.get(groupId);
            if (!group) throw new Error("Group not found");
            return {
              _id: group._id,
              name: group.name,
            };
          })
        );

        return {
          ...project,
          access: "group" as const,
          accessGroups,
        };
      })
    );

    return projects;
  },
});

// Get detailed information about a group's membership
export const getGroupMembers = query({
  args: {
    groupId: v.id("groups"),
  },
  returns: v.object({
    directMembers: v.array(v.string()),
    childGroups: v.array(
      v.object({
        _id: v.id("groups"),
        name: v.string(),
      })
    ),
    parentGroup: v.union(
      v.object({
        _id: v.id("groups"),
        name: v.string(),
      }),
      v.null()
    ),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get direct members
    const members = await ctx.db
      .query("group_members")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    // Get child groups
    const children = await ctx.db
      .query("groups")
      .withIndex("by_parent", (q) => q.eq("parentGroupId", args.groupId))
      .collect();

    // Get parent group
    const group = await ctx.db.get(args.groupId);
    if (!group) throw new Error("Group not found");

    let parentGroup = null;
    if (group.parentGroupId) {
      const parent = await ctx.db.get(group.parentGroupId);
      if (parent) {
        parentGroup = {
          _id: parent._id,
          name: parent.name,
        };
      }
    }

    return {
      directMembers: members.map((m) => m.userId),
      childGroups: children.map((c) => ({
        _id: c._id,
        name: c.name,
      })),
      parentGroup,
    };
  },
});