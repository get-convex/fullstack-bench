"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@/components/UserContext";
import { useConvexAuth } from "convex/react";

export function useFilesystem(projectId: Id<"projects">) {
  const { isAuthenticated } = useConvexAuth();
  const { userId, isLoading: userLoading } = useUser();
  const workspaceUser = useQuery(api.workspace.getCurrentUserRole);
  const isReady = isAuthenticated && userId && !userLoading && workspaceUser !== undefined;

  const listDirectory = useQuery(
    api.filesystem.listDirectory,
    isReady ? { projectId, parentId: undefined } : "skip"
  );

  const createEntry = useMutation(api.filesystem.createEntry);
  const updateEntry = useMutation(api.filesystem.updateEntry);
  const deleteEntry = useMutation(api.filesystem.deleteEntry);

  return {
    rootEntries: listDirectory ?? [],
    isLoading: userLoading || workspaceUser === undefined || (isReady && listDirectory === undefined),

    // List contents of a directory
    listDirectory: (parentId?: Id<"filesystem_entries">) => {
      return useQuery(api.filesystem.listDirectory, isReady ? {
        projectId,
        parentId,
      } : "skip") ?? [];
    },

    // Get a file's contents
    getFile: (fileId: Id<"filesystem_entries">) => {
      return useQuery(api.filesystem.getFile, isReady ? {
        projectId,
        fileId,
      } : "skip");
    },

    // Create a new file or directory
    createEntry: async (
      parentId: Id<"filesystem_entries"> | undefined,
      name: string,
      type: "file" | "directory",
      content?: string
    ) => {
      return await createEntry({
        projectId,
        parentId,
        name,
        type,
        content,
      });
    },

    // Update a file or directory
    updateEntry: async (
      entryId: Id<"filesystem_entries">,
      updates: {
        name?: string;
        content?: string;
        parentId?: Id<"filesystem_entries">;
      }
    ) => {
      return await updateEntry({
        projectId,
        entryId,
        ...updates,
      });
    },

    // Delete a file or directory
    deleteEntry: async (entryId: Id<"filesystem_entries">) => {
      return await deleteEntry({
        projectId,
        entryId,
      });
    },
  };
}