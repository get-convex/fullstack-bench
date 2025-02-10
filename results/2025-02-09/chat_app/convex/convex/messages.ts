import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const listMessages = query({
  args: {
    channelId: v.id("channels"),
  },
  returns: v.array(v.object({
    _id: v.id("messages"),
    _creationTime: v.number(),
    content: v.string(),
    channelId: v.id("channels"),
    userId: v.id("users"),
    userEmail: v.string(),
  })),
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("byChannel", (q) => q.eq("channelId", args.channelId))
      .collect();
    const userIds = new Set(messages.map((message) => message.userId));
    const results = await Promise.all([...userIds].map((userId) => ctx.db.get(userId)));
    const usersById: Record<Id<"users">, { _id: Id<"users">, email: string }> = {};
    for (const user of results) {
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.email) {
        throw new Error("User email not found");
      }
      usersById[user._id] = { _id: user._id, email: user.email };
    }
    return messages.map((message) => ({
      ...message,
      userEmail: usersById[message.userId].email,
    }));
  },
});

export const createMessage = mutation({
  args: {
    content: v.string(),
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUserId(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }
    await ctx.db.insert("messages", {
      content: args.content,
      channelId: args.channelId,
      userId: user,
    });
  },
});
