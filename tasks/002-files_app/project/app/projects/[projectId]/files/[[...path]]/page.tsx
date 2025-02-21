"use client";

import { notFound, useParams } from "next/navigation";
import DirectoryView from "@/components/DirectoryView";
import FileView from "@/components/FileView";
import { useLoggedInUser } from "@/lib/BackendContext";
import toast from "react-hot-toast";
import { Spinner } from "@/components/Spinner";
import {
  initialDirectories,
  initialFiles,
  initialProjects,
} from "@/lib/exampleData";
import { Node } from "@/lib/types";

function directoryChildren(dirId: string): Array<Node> {
  const children = [
    ...initialFiles
      .filter((f) => f.parentEdge.directoryId === dirId)
      .map((f) => ({ type: "file" as const, ...f })),
    ...initialDirectories
      .filter((d) => d.parentEdge && d.parentEdge.directoryId === dirId)
      .map((d) => ({ type: "directory" as const, children: [], ...d })),
  ];
  children.sort((a, b) => a.parentEdge!.name.localeCompare(b.parentEdge!.name));
  return children;
}

function findNodeByPath(
  projectId: string,
  pathSegments: string[]
): Node | undefined | null {
  const project = initialProjects.find((p) => p.id === projectId);
  if (!project) {
    return null;
  }

  let currentDirId = project.rootDirectoryId;
  for (let i = 0; i < pathSegments.length - 1; i++) {
    const segment = pathSegments[i];
    const children = directoryChildren(currentDirId);
    const nextDir = children.find(
      (child) =>
        child.type === "directory" && child.parentEdge?.name === segment
    );
    if (!nextDir) {
      return null;
    }
    currentDirId = nextDir.id;
  }

  if (pathSegments.length === 0) {
    return {
      type: "directory" as const,
      id: currentDirId,
      createdAt: Date.now(),
      children: directoryChildren(currentDirId),
    };
  }

  const lastSegment = pathSegments[pathSegments.length - 1];
  const children = directoryChildren(currentDirId);
  const node = children.find((child) => child.parentEdge?.name === lastSegment);
  if (!node) {
    return null;
  }

  if (node.type === "directory") {
    return {
      ...node,
      children: directoryChildren(node.id),
    };
  }
  return node;
}

export default function ProjectFilesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const pathSegments = (params.path as string[]) || [];
  const user = useLoggedInUser();
  const node = findNodeByPath(projectId, pathSegments);

  if (node === undefined) {
    return <Spinner />;
  }

  if (node === null) {
    notFound();
  }

  if (node.type === "file") {
    return (
      <FileView
        file={node}
        pathSegments={pathSegments}
        projectId={projectId}
        handleEditFile={async (content) => {
          throw new Error("Not implemented");
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
          throw new Error("Not implemented");
        }}
        handleRename={async (node, newName) => {
          throw new Error("Not implemented");
        }}
        handleDelete={async (node) => {
          throw new Error("Not implemented");
        }}
      />
    );
  }
}
