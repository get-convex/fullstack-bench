"use client";

import { notFound, useParams } from "next/navigation";
import DirectoryView from "@/components/DirectoryView";
import FileView from "@/components/FileView";
import {
  deleteFile,
  createDirectory,
  createFile,
  editFile,
  renameFile,
  useFilePath,
} from "@/lib/state/filesystem";
import type { File, Directory } from "@/lib/types";

export default function ProjectFilesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const pathSegments = (params.path as string[]) || [];

  // Start with the root.
  const node = useFilePath(projectId, pathSegments);
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
          await editFile(node.id, content);
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
        handleCreateFile={async (name, content) => {
          await createFile(node.id, name, content);
        }}
        handleCreateDirectory={async (name) => {
          await createDirectory(node.id, name);
        }}
        handleRenameFile={renameFile}
        handleDeleteFile={deleteFile}
      />
    );
  }
}
