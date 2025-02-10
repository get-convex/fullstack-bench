import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getChannel = query({
  args: {
    channelId: v.id("channels"),
  },
  returns: v.object({
    _id: v.id("channels"),
    _creationTime: v.number(),
    name: v.string(),
  }),
  handler: async (ctx, args) => {
    const channel = await ctx.db.get(args.channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    return channel;
  },
});

export const listChannels = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("channels"),
    _creationTime: v.number(),
    name: v.string(),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("channels").collect();
  },
});

export const createChannel = mutation({
  args: {
    name: v.string(),
  },
  returns: v.id("channels"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("channels")
      .withIndex("name", (q) => q.eq("name", args.name))
      .unique();
    if (existing) {
      throw new Error("Channel already exists");
    }
    return await ctx.db.insert("channels", {
      name: args.name,
    });
  },
});
