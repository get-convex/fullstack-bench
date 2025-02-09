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
import { useUserByEmail, useUsersById } from "@/lib/state/users";
import { useUserEmail } from "@/components/WithUserEmail";

export default function ProjectFilesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const pathSegments = (params.path as string[]) || [];
  const email = useUserEmail();
  const user = useUserByEmail(email);
  if (!user) {
    notFound();
  }
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
          await editFile(user.id, node.id, content);
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
          await create(user.id, node.id, name, newNode);
        }}
        handleRename={async (node, newName) => {
          await rename(user.id, node, newName);
        }}
        handleDelete={async (node) => {
          await deleteNode(user.id, node);
        }}
      />
    );
  }
}
