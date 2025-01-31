import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get a single task by ID
export const get = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the task
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Get the project to check membership
    const project = await ctx.db.get(task.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is a member of the project
    if (!project.members.includes(userId)) {
      throw new Error("Not authorized");
    }

    return task;
  },
});

// List all tasks in a project
export const list = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the project to check membership
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is a member of the project
    if (!project.members.includes(userId)) {
      throw new Error("Not authorized");
    }

    // Get all tasks for this project
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return tasks;
  },
});

// Create a new task
export const create = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.string(),
    dueDate: v.optional(v.number()),
    assigneeId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the project to check membership
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is a member of the project
    if (!project.members.includes(userId)) {
      throw new Error("Not authorized");
    }

    // If assignee is specified, verify they are a project member
    if (args.assigneeId && !project.members.includes(args.assigneeId)) {
      throw new Error("Assignee must be a project member");
    }

    const taskId = await ctx.db.insert("tasks", {
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      assigneeId: args.assigneeId,
      status: "Todo",
    });

    return taskId;
  },
});

// Update a task's status
export const updateStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("Todo"),
      v.literal("In Progress"),
      v.literal("In Review"),
      v.literal("Done"),
      v.literal("Canceled")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the task and its project
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ctx.db.get(task.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is a member of the project
    if (!project.members.includes(userId)) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.taskId, {
      status: args.status,
    });

    return null;
  },
});

// Update a task's assignee
export const updateAssignee = mutation({
  args: {
    taskId: v.id("tasks"),
    assigneeId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the task and its project
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ctx.db.get(task.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is a member of the project
    if (!project.members.includes(userId)) {
      throw new Error("Not authorized");
    }

    // If assignee is specified, verify they are a project member
    if (args.assigneeId && !project.members.includes(args.assigneeId)) {
      throw new Error("Assignee must be a project member");
    }

    await ctx.db.patch(args.taskId, {
      assigneeId: args.assigneeId,
    });

    return null;
  },
});

// Update a task's due date
export const updateDueDate = mutation({
  args: {
    taskId: v.id("tasks"),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the task and its project
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ctx.db.get(task.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is a member of the project
    if (!project.members.includes(userId)) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.taskId, {
      dueDate: args.dueDate,
    });

    return null;
  },
});