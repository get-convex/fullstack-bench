"use client";

import { notFound, useParams } from "next/navigation";
import {
  useFilePath,
  createFile,
  createDirectory,
  renameFile,
  deleteFile,
  editFile,
} from "../../../../../testData";
import DirectoryView from "@/components/DirectoryView";
import FileView from "@/components/FileView";

export default function ProjectFilesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const pathSegments = (params.path as string[]) || [];

  // Start with the root.
  const currentFile = useFilePath(projectId, pathSegments);
  if (!currentFile) {
    notFound();
  }
  if (currentFile.type === "file") {
    return (
      <FileView
        file={currentFile}
        pathSegments={pathSegments}
        projectId={projectId}
        handleEditFile={editFile}
      />
    );
  } else {
    return (
      <DirectoryView
        projectId={projectId}
        pathSegments={pathSegments}
        currentDirId={currentFile.id}
        dirChildren={currentFile.children}
        handleCreateFile={createFile}
        handleCreateDirectory={createDirectory}
        handleRenameFile={renameFile}
        handleDeleteFile={deleteFile}
      />
    );
  }
}
