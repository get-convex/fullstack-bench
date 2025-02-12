import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const existing = await ctx.db
      .query("channels")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();

    if (existing) throw new Error(`Channel "${name}" already exists`);

    return await ctx.db.insert("channels", { name });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("channels").collect();
  },
});

export const get = query({
  args: { id: v.id("channels") },
  handler: async (ctx, { id }) => {
    const channel = await ctx.db.get(id);
    if (!channel) throw new Error("Channel not found");
    return channel;
  },
});
