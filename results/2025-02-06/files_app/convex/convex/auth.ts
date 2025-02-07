import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/password";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLoggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  }
})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});

// Check if the workspace has any users
export const hasUsers = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const users = await ctx.db.query("workspace_users").collect();
    return users.length > 0;
  },
});

// Get the current user's information
export const getUser = query({
  args: {},
  returns: v.union(
    v.object({
      userId: v.string(),
      email: v.string(),
      isAdmin: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (!user) {
      return null;
    }

    return {
      userId: user.userId,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  },
});

// Provision a new user when they first sign in
export const provisionUser = mutation({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db.get(userId);
    if (!user || !user.email) {
      throw new Error("User not found");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("workspace_users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingUser) {
      return false; // User already exists
    }

    // Check if this is the first user
    const isFirstUser = !(await ctx.db.query("workspace_users").collect()).length;

    // Create the user
    await ctx.db.insert("workspace_users", {
      userId: userId,
      email: user.email,
      isAdmin: isFirstUser, // First user is automatically an admin
    });

    return true; // User was provisioned
  },
});