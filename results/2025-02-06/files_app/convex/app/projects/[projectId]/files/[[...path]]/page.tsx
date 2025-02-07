"use client";

import { notFound, useParams } from "next/navigation";
import DirectoryView from "@/components/DirectoryView";
import FileView from "@/components/FileView";
import { useFilesystem } from "@/hooks/useFilesystem";
import { Id } from "@/convex/_generated/dataModel";

export default function ProjectFilesPage() {
  const params = useParams();
  const projectId = params.projectId as Id<"projects">;
  const pathSegments = (params.path as string[]) || [];

  const { rootEntries, listDirectory, getFile, isLoading } = useFilesystem(projectId);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-32 bg-[#26262b] rounded-md animate-pulse"></div>
      </div>
    );
  }

  // If no path segments, show root directory
  if (pathSegments.length === 0) {
    return (
      <DirectoryView
        projectId={projectId}
        parentId={undefined}
      />
    );
  }

  // Navigate through the path segments to find the target entry
  let currentEntries = rootEntries;
  let currentEntry = undefined;
  let parentId = undefined;

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentEntry = currentEntries.find(e => e.name === segment);

    if (!currentEntry) {
      notFound();
    }

    if (i === pathSegments.length - 1) {
      // We've reached the target entry
      break;
    }

    if (currentEntry.type !== "directory") {
      // Can't navigate into a file
      notFound();
    }

    // Get the contents of this directory for the next iteration
    parentId = currentEntry._id;
    currentEntries = listDirectory(parentId) ?? [];
  }

  if (!currentEntry) {
    notFound();
  }

  if (currentEntry.type === "file") {
    return (
      <FileView
        projectId={projectId}
        fileId={currentEntry._id}
      />
    );
  } else {
    return (
      <DirectoryView
        projectId={projectId}
        parentId={currentEntry._id}
      />
    );
  }
}
