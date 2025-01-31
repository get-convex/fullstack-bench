import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_name")
      .collect();

    return channels;
  },
});

export const get = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    return await ctx.db.get(channelId);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if channel with this name already exists
    const existing = await ctx.db
      .query("channels")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();

    if (existing) {
      throw new Error("Channel with this name already exists");
    }

    return await ctx.db.insert("channels", {
      name,
    });
  },
});

export const ensureDefaultChannels = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_name")
      .collect();

    if (channels.length === 0) {
      await ctx.db.insert("channels", { name: "general" });
      await ctx.db.insert("channels", { name: "random" });
    }
  },
});
