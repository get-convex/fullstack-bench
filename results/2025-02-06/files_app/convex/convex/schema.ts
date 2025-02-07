import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Workspace users table - stores user roles (member/admin)
  workspace_users: defineTable({
    userId: v.id("users"), // Auth system user ID
    email: v.string(), // User's email address
    isAdmin: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"]),

  // Groups table - stores group information
  groups: defineTable({
    name: v.string(),
    parentGroupId: v.optional(v.id("groups")), // Parent group ID for hierarchy
  }).index("by_parent", ["parentGroupId"]),

  // Group members table - stores group membership
  group_members: defineTable({
    groupId: v.id("groups"),
    userId: v.id("users"), // Auth system user ID
  }).index("by_group", ["groupId"])
    .index("by_user", ["userId"])
    .index("by_group_user", ["groupId", "userId"]),

  // Projects table - stores project metadata
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    emoji: v.string(),
  }).index("by_name", ["name"]), // For uniqueness checks

  // Project members table - stores project membership for users
  project_members: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"), // Auth system user ID
  }).index("by_project", ["projectId"])
    .index("by_user", ["userId"])
    .index("by_project_user", ["projectId", "userId"]),

  // Project group members table - stores project membership for groups
  project_group_members: defineTable({
    projectId: v.id("projects"),
    groupId: v.id("groups"),
  }).index("by_project", ["projectId"])
    .index("by_group", ["groupId"])
    .index("by_project_group", ["projectId", "groupId"]),

  // Filesystem entries table - stores both files and directories
  filesystem_entries: defineTable({
    projectId: v.id("projects"),
    parentId: v.optional(v.id("filesystem_entries")), // Parent directory ID, null for root
    name: v.string(),
    type: v.union(v.literal("file"), v.literal("directory")),
    content: v.optional(v.string()), // Only for files
  }).index("by_project", ["projectId"])
    .index("by_parent", ["parentId"])
    .index("by_parent_name", ["parentId", "name"]), // For uniqueness under a directory
});