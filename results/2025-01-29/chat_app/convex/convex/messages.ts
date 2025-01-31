import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channelId", channelId))
      .order("asc")
      .take(50);
  },
});

export const send = mutation({
  args: {
    channelId: v.id("channels"),
    body: v.string(),
  },
  handler: async (ctx, { channelId, body }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("No user found");
    }

    // Verify the channel exists
    const channel = await ctx.db.get(channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }

    await ctx.db.insert("messages", {
      channelId,
      body,
      author: user.name ?? user.email ?? "Anonymous",
      userId,
    });
  },
});
