import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Get the current user's workspace role (admin/member/none)
export const getCurrentUserRole = query({
  args: {},
  returns: v.union(v.literal("admin"), v.literal("member"), v.literal("none")),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return "none";
    }

    const user = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!user) {
      return "none";
    }

    return user.isAdmin ? "admin" : "member";
  },
});

// List all workspace users with their roles
export const listUsers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("workspace_users"),
      _creationTime: v.number(),
      userId: v.id("users"),
      email: v.string(),
      isAdmin: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is an admin
    const user = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!user?.isAdmin) {
      throw new Error("Not authorized");
    }

    return await ctx.db.query("workspace_users").collect();
  },
});

// Add a user to the workspace
export const addUser = mutation({
  args: {
    email: v.string(),
    isAdmin: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if current user is an admin
    const user = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!user?.isAdmin) {
      throw new Error("Not authorized");
    }

    // Check if user already exists by email
    const existingUser = await ctx.db
      .query("workspace_users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      throw new Error("User already exists in workspace");
    }

    const recipient = await ctx.db.query("users").withIndex("email", q => q.eq("email", args.email)).unique();
    if (!recipient) {
      throw new Error(`User with email ${args.email} not found`);
    }

    await ctx.db.insert("workspace_users", {
      userId: recipient._id,
      email: args.email,
      isAdmin: args.isAdmin,
    });

    return null;
  },
});

// Remove a user from the workspace
export const removeUser = mutation({
  args: {
    userId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    // Check if current user is an admin
    const user = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .unique();

    if (!user?.isAdmin) {
      throw new Error("Not authorized");
    }

    // Get the user to remove
    const userToRemove = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!userToRemove) {
      throw new Error("User not found");
    }

    // Don't allow removing the last admin
    if (userToRemove.isAdmin) {
      const adminCount = await ctx.db
        .query("workspace_users")
        .filter((q) => q.eq(q.field("isAdmin"), true))
        .collect()
        .then((users) => users.length);

      if (adminCount <= 1) {
        throw new Error("Cannot remove the last admin");
      }
    }

    await ctx.db.delete(userToRemove._id);
    return null;
  },
});

// Update a user's admin status
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    isAdmin: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    // Check if current user is an admin
    const user = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .unique();

    if (!user?.isAdmin) {
      throw new Error("Not authorized");
    }

    // Get the user to update
    const userToUpdate = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!userToUpdate) {
      throw new Error("User not found");
    }

    // Don't allow removing admin status from the last admin
    if (userToUpdate.isAdmin && !args.isAdmin) {
      const adminCount = await ctx.db
        .query("workspace_users")
        .filter((q) => q.eq(q.field("isAdmin"), true))
        .collect()
        .then((users) => users.length);

      if (adminCount <= 1) {
        throw new Error("Cannot remove admin status from the last admin");
      }
    }

    await ctx.db.patch(userToUpdate._id, { isAdmin: args.isAdmin });
    return null;
  },
});