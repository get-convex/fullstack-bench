import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Define the valid task statuses as a union type
const taskStatus = v.union(
  v.literal("Todo"),
  v.literal("In Progress"),
  v.literal("In Review"),
  v.literal("Done"),
  v.literal("Canceled")
);

const schema = defineSchema({
  ...authTables,

  // Projects table
  projects: defineTable({
    name: v.string(),
    emoji: v.string(),
    description: v.string(),
    creatorId: v.id("users"),
    members: v.array(v.id("users")),
  })
    .index("by_creator", ["creatorId"])
    .index("by_member", ["members"]),

  // Tasks table
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    dueDate: v.optional(v.number()), // Unix timestamp
    status: taskStatus,
    projectId: v.id("projects"),
    assigneeId: v.optional(v.id("users")),
  })
    .index("by_project", ["projectId"])
    .index("by_assignee", ["assigneeId"]),

  // Comments table
  comments: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    taskId: v.id("tasks"),
  })
    .index("by_task", ["taskId"]),
});

export default schema;