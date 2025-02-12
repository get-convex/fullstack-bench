import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: {
    channelId: v.id("channels"),
    content: v.string(),
  },
  handler: async (ctx, { channelId, content }) => {
    // Get first user for testing
    const users = await ctx.db.query("users").collect();
    if (!users.length) throw new Error("No users found");

    const userId = users[0]._id;
    const channel = await ctx.db.get(channelId);
    if (!channel) throw new Error("Channel not found");

    return await ctx.db.insert("messages", {
      channelId,
      userId,
      content,
    });
  },
});

export const list = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const channel = await ctx.db.get(channelId);
    if (!channel) throw new Error("Channel not found");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channelId", channelId))
      .order("desc")
      .collect();

    // Fetch user info for each message
    const messagesWithUsers = [];
    for (const message of messages) {
      const user = await ctx.db.get(message.userId);
      if (!user) throw new Error("User not found");

      messagesWithUsers.push({
        ...message,
        userEmail: user.email,
      });
    }

    return messagesWithUsers;
  },
});
