import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  channels: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  messages: defineTable({
    channelId: v.id("channels"),
    author: v.string(),
    body: v.string(),
    userId: v.id("users"),
  })
    .index("by_channel", ["channelId"]),
});

export default schema;