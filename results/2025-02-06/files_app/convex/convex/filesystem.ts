import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import {
  hasProjectAccess,
  wouldCreateFilesystemCycle,
  getFullPath,
  isNameUniqueUnderParent,
} from "./lib/access";
import { getAuthUserId } from "@convex-dev/auth/server";

// List contents of a directory
export const listDirectory = query({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("filesystem_entries")),
  },
  returns: v.array(
    v.object({
      _id: v.id("filesystem_entries"),
      _creationTime: v.number(),
      name: v.string(),
      type: v.union(v.literal("file"), v.literal("directory")),
      fullPath: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    // Check project access
    const hasAccess = await hasProjectAccess(
      ctx,
      args.projectId,
      userId
    );
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    // Get directory contents
    const entries = await ctx.db
      .query("filesystem_entries")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();

    // Get full paths
    const entriesWithPaths = await Promise.all(
      entries.map(async (entry) => ({
        _id: entry._id,
        _creationTime: entry._creationTime,
        name: entry.name,
        type: entry.type,
        fullPath: await getFullPath(ctx, entry._id),
      }))
    );

    return entriesWithPaths;
  },
});

// Get a single file's contents
export const getFile = query({
  args: {
    projectId: v.id("projects"),
    fileId: v.id("filesystem_entries"),
  },
  returns: v.object({
    _id: v.id("filesystem_entries"),
    _creationTime: v.number(),
    name: v.string(),
    type: v.literal("file"),
    content: v.string(),
    fullPath: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check project access
    const hasAccess = await hasProjectAccess(
      ctx,
      args.projectId,
      userId
    );
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    // Get file
    const file = await ctx.db.get(args.fileId);
    if (!file || file.type !== "file") {
      throw new Error("File not found");
    }

    if (file.projectId !== args.projectId) {
      throw new Error("File not found in project");
    }

    return {
      _id: file._id,
      _creationTime: file._creationTime,
      name: file.name,
      type: "file" as const,
      content: file.content ?? "",
      fullPath: await getFullPath(ctx, file._id),
    };
  },
});

// Create a new file or directory
export const createEntry = mutation({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("filesystem_entries")),
    name: v.string(),
    type: v.union(v.literal("file"), v.literal("directory")),
    content: v.optional(v.string()),
  },
  returns: v.id("filesystem_entries"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check project access
    const hasAccess = await hasProjectAccess(
      ctx,
      args.projectId,
      userId
    );
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    // Check if parent exists and is a directory
    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (!parent || parent.type !== "directory") {
        throw new Error("Parent directory not found");
      }
      if (parent.projectId !== args.projectId) {
        throw new Error("Parent directory not in project");
      }
    }

    // Check for name uniqueness under parent
    if (
      !(await isNameUniqueUnderParent(
        ctx,
        args.projectId,
        args.parentId,
        args.name
      ))
    ) {
      throw new Error(
        `A ${args.type} with this name already exists in this directory`
      );
    }

    // Create entry
    return await ctx.db.insert("filesystem_entries", {
      projectId: args.projectId,
      parentId: args.parentId,
      name: args.name,
      type: args.type,
      content: args.type === "file" ? args.content ?? "" : undefined,
    });
  },
});

// Update a file or directory
export const updateEntry = mutation({
  args: {
    projectId: v.id("projects"),
    entryId: v.id("filesystem_entries"),
    name: v.optional(v.string()),
    content: v.optional(v.string()),
    parentId: v.optional(v.id("filesystem_entries")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check project access
    const hasAccess = await hasProjectAccess(
      ctx,
      args.projectId,
      userId
    );
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    // Get entry
    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Entry not found");
    }

    if (entry.projectId !== args.projectId) {
      throw new Error("Entry not found in project");
    }

    const updates: any = {};

    // Handle name update
    if (args.name !== undefined) {
      // Check for name uniqueness under parent
      if (
        !(await isNameUniqueUnderParent(
          ctx,
          args.projectId,
          entry.parentId,
          args.name,
          args.entryId
        ))
      ) {
        throw new Error(
          `A ${entry.type} with this name already exists in this directory`
        );
      }

      updates.name = args.name;
    }

    // Handle content update
    if (args.content !== undefined) {
      if (entry.type !== "file") {
        throw new Error("Cannot set content on a directory");
      }
      updates.content = args.content;
    }

    // Handle parent update
    if (args.parentId !== undefined) {
      if (args.parentId) {
        // Check if new parent exists and is a directory
        const newParent = await ctx.db.get(args.parentId);
        if (!newParent || newParent.type !== "directory") {
          throw new Error("New parent directory not found");
        }
        if (newParent.projectId !== args.projectId) {
          throw new Error("New parent directory not in project");
        }

        // Check for cycles
        if (entry.type === "directory") {
          if (
            await wouldCreateFilesystemCycle(ctx, args.entryId, args.parentId)
          ) {
            throw new Error("Cannot create cycle in directory structure");
          }
        }

        // Check for name uniqueness under new parent
        if (
          !(await isNameUniqueUnderParent(
            ctx,
            args.projectId,
            args.parentId,
            args.name ?? entry.name,
            args.entryId
          ))
        ) {
          throw new Error(
            `A ${entry.type} with this name already exists in the target directory`
          );
        }
      }

      updates.parentId = args.parentId;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.entryId, updates);
    }

    return null;
  },
});

// Delete a file or directory
export const deleteEntry = mutation({
  args: {
    projectId: v.id("projects"),
    entryId: v.id("filesystem_entries"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check project access
    const hasAccess = await hasProjectAccess(
      ctx,
      args.projectId,
      userId
    );
    if (!hasAccess) {
      throw new Error("Not authorized");
    }

    // Get entry
    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Entry not found");
    }

    if (entry.projectId !== args.projectId) {
      throw new Error("Entry not found in project");
    }

    if (entry.type === "directory") {
      // Check if directory is empty
      const children = await ctx.db
        .query("filesystem_entries")
        .withIndex("by_parent", (q) => q.eq("parentId", args.entryId))
        .collect();

      if (children.length > 0) {
        throw new Error("Cannot delete non-empty directory");
      }
    }

    await ctx.db.delete(args.entryId);
    return null;
  },
});