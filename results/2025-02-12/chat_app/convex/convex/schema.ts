import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
  }),

  channels: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  messages: defineTable({
    channelId: v.id("channels"),
    userId: v.id("users"),
    content: v.string(),
  }).index("by_channel", ["channelId"]),
});
