import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  channels: defineTable({
    name: v.string(),
  }).index("name", ["name"]),
  messages: defineTable({
    content: v.string(),
    channelId: v.id("channels"),
    userId: v.id("users"),
  }).index("byChannel", ["channelId"]),
});

export default schema;