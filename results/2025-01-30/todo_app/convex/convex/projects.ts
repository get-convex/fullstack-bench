import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all projects the current user is a member of
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Query projects where user is either creator or member
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_member", (q) => q.eq("members", [userId]))
      .collect();

    return projects;
  },
});

// Create a new project
export const create = mutation({
  args: {
    name: v.string(),
    emoji: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      emoji: args.emoji,
      description: args.description,
      creatorId: userId,
      members: [userId], // Creator is automatically a member
    });

    return projectId;
  },
});

// Get a single project by ID
export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is a member
    if (!project.members.includes(userId)) {
      throw new Error("Not authorized");
    }

    return project;
  },
});

// Add a member to a project
export const addMember = mutation({
  args: {
    projectId: v.id("projects"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Only creator can add members
    if (project.creatorId !== currentUserId) {
      throw new Error("Not authorized");
    }

    // Add the new member if they're not already in the list
    if (!project.members.includes(args.userId)) {
      await ctx.db.patch(args.projectId, {
        members: [...project.members, args.userId],
      });
    }

    return null;
  },
});

// Remove a member from a project
export const removeMember = mutation({
  args: {
    projectId: v.id("projects"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Only creator can remove members
    if (project.creatorId !== currentUserId) {
      throw new Error("Not authorized");
    }

    // Cannot remove the creator
    if (args.userId === project.creatorId) {
      throw new Error("Cannot remove project creator");
    }

    await ctx.db.patch(args.projectId, {
      members: project.members.filter(id => id !== args.userId),
    });

    return null;
  },
});
