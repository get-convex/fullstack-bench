"use client";

import { notFound, useParams } from "next/navigation";
import DirectoryView from "@/components/DirectoryView";
import FileView from "@/components/FileView";
import {
  editFile,
  useFilePath,
  create,
  rename,
  deleteNode,
} from "@/lib/state/filesystem";
import { useLoggedInUser } from "@/lib/BackendContext";
import toast from "react-hot-toast";

export default function ProjectFilesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const pathSegments = (params.path as string[]) || [];
  const user = useLoggedInUser();
  // Start with the root.
  const node = useFilePath(user.id, projectId, pathSegments);
  if (!node) {
    notFound();
  }

  if (node.type === "file") {
    // This is a file
    return (
      <FileView
        file={node}
        pathSegments={pathSegments}
        projectId={projectId}
        handleEditFile={async (content) => {
          try {
            await editFile(user.id, node.id, content);
          } catch (error) {
            toast.error(`Failed to edit file: ${error}`);
          }
        }}
      />
    );
  } else {
    return (
      <DirectoryView
        projectId={projectId}
        pathSegments={pathSegments}
        currentDirId={node.id}
        dirChildren={node.children}
        handleCreate={async (name, newNode) => {
          try {
            await create(user.id, node.id, name, newNode);
          } catch (error) {
            toast.error(`Failed to create file: ${error}`);
          }
        }}
        handleRename={async (node, newName) => {
          try {
            await rename(user.id, node, newName);
          } catch (error) {
            toast.error(`Failed to rename file: ${error}`);
          }
        }}
        handleDelete={async (node) => {
          try {
            await deleteNode(user.id, node);
          } catch (error) {
            toast.error(`Failed to delete file: ${error}`);
          }
        }}
      />
    );
  }
}
