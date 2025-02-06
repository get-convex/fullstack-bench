"use client";

import { notFound, useParams } from "next/navigation";
import {
  useFilePath,
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
    return <FileView file={currentFile} pathSegments={pathSegments} projectId={projectId} />
  } else {
    return <DirectoryView
      projectId={projectId}
      pathSegments={pathSegments}
      currentDir={currentFile.children}
      handleNavigateUp={() => {}}
      handleFileClick={() => {}}
      handleDeleteFile={() => {}}
    />
  }
}
