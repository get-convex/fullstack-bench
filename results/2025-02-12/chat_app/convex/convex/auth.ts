import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { query, mutation } from "./_generated/server";

export const getLoggedInUser = query({
  handler: async (ctx) => {
    // For testing, create a temporary user if none exists
    const users = await ctx.db.query("users").collect();
    if (users.length === 0) {
      return null;
    }
    return users[0];
  },
});

export const ensureTestUser = mutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    if (users.length === 0) {
      return await ctx.db.insert("users", { email: "test@example.com" });
    }
    return users[0]._id;
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
