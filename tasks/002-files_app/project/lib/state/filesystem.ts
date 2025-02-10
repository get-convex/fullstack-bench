import { atom, useAtom } from "jotai";
import { store } from ".";
import { Directory, File, Node, Project } from "../types";
import { projects, useProject } from "./projects";
import { initialDirectories, initialFiles } from "./init";
import { hasAccessToProject, userPermissions } from "./userPermissions";
import { users } from "./users";
import { members } from "./membership";

function directoryChildren(dirId: string, allFiles: File[], allDirectories: Directory[]): Array<Node> {
  const children = [
    ...allFiles
      .filter((f) => f.parentEdge.directoryId === dirId)
      .map((f) => ({ type: "file" as const, ...f })),
    ...allDirectories
      .filter((d) => d.parentEdge && d.parentEdge.directoryId === dirId)
      .map((d) => ({ type: "directory" as const, ...d })),
  ];
  children.sort((a, b) => a.parentEdge!.name.localeCompare(b.parentEdge!.name));
  return children;
}

type FilePathResult = ({ type: "file" } & File) | { type: "directory", id: string, children: Array<Node> } | null;

export function useFilePath(actingUserId: string, projectId: string, pathSegments: string[]): FilePathResult | undefined {
  const [currentUsers] = useAtom(users);
  const [currentProjects] = useAtom(projects);
  const [currentMembers] = useAtom(members);
  const [currentUserPermissions] = useAtom(userPermissions);
  if (!hasAccessToProject(currentUsers, currentUserPermissions, currentProjects, currentMembers, actingUserId, projectId)) {
    throw new Error(`User ${actingUserId} does not have access to project ${projectId}`);
  }
  const project = useProject(actingUserId, projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }
  const [allFiles] = useAtom(files);
  const [allDirectories] = useAtom(directories);

  // Start with the root.
  let current: { type: "directory"; id: string; } | { type: "file"; id: string; } = { type: "directory", id: project.rootDirectoryId };

  for (const segment of pathSegments) {
    if (current.type !== "directory") {
      throw new Error(`${pathSegments.join("/")} navigates within a file`);
    }
    const matches = [
      ...allFiles
        .filter((f) => f.parentEdge.directoryId === current.id && f.parentEdge.name === segment)
        .map((f) => ({ type: "file" as const, id: f.id })),
      ...allDirectories
        .filter((d) => d.parentEdge && d.parentEdge.directoryId === current.id && d.parentEdge.name === segment)
        .map((d) => ({ type: "directory" as const, id: d.id })),
    ]
    if (matches.length === 0) {
      return null;
    }
    if (matches.length > 1) {
      throw new Error(`Ambiguous path ${pathSegments.join("/")}`);
    }
    const entry = matches[0];
    current = { type: entry.type, id: entry.id };
  }
  if (current.type === "file") {
    const file = allFiles.find((f) => f.id === current.id);
    if (!file) {
      return null;
    }
    return { type: "file", ...file };
  } else {
    const children = directoryChildren(current.id, allFiles, allDirectories);
    return { type: "directory", id: current.id, children };
  }
}

function projectDirectory(allProjects: Project[], allDirectories: Directory[], dirId: string) {
  while (true) {
    const directory = allDirectories.find((d) => d.id === dirId);
    if (!directory) {
      throw new Error(`Directory ${dirId} not found`);
    }
    if (!directory.parentEdge) {
      const project = allProjects.find((p) => p.rootDirectoryId === dirId);
      if (!project) {
        throw new Error(`Project ${dirId} not found`);
      }
      return project;
    }
    dirId = directory.parentEdge.directoryId;
  }
}

export async function create(actingUserId: string, dirId: string, name: string, node: { type: "file", content: string } | { type: "directory" }) {
  const currentProjects = store.get(projects);
  const currentUsers = store.get(users);
  const currentMembers = store.get(members);
  const currentUserPermissions = store.get(userPermissions);
  const currentFiles = store.get(files);
  const currentDirectories = store.get(directories);

  const parentDirectory = currentDirectories.find((d) => d.id === dirId);
  if (!parentDirectory) {
    throw new Error(`Parent directory ${dirId} not found`);
  }

  const project = projectDirectory(currentProjects, currentDirectories, dirId);
  if (!hasAccessToProject(currentUsers, currentUserPermissions, currentProjects, currentMembers, actingUserId, project.id)) {
    throw new Error(`User ${actingUserId} does not have access to project ${project.id}`);
  }

  if (!nameFreeInDirectory(dirId, name, currentFiles, currentDirectories)) {
    throw new Error(`File ${name} already exists in directory ${dirId}`);
  }
  if (node.type === "file") {
    const newFile: File = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      parentEdge: { directoryId: dirId, name },
      content: node.content,
    }
    store.set(files, [...currentFiles, newFile]);
  } else {
    const newDirectory: Directory = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      parentEdge: { directoryId: dirId, name },
    }
    store.set(directories, [...currentDirectories, newDirectory]);
  }
}

export async function rename(actingUserId: string, node: { type: "file" | "directory", id: string }, newName: string) {
  const currentFiles = store.get(files);
  const currentDirectories = store.get(directories);
  const currentProjects = store.get(projects);
  const currentUsers = store.get(users);
  const currentMembers = store.get(members);
  const currentUserPermissions = store.get(userPermissions);

  const checkParentDirectory = (dirId: string) => {
    const parentDirectory = currentDirectories.find((d) => d.id === dirId);
    if (!parentDirectory) {
      throw new Error(`Parent directory ${dirId} not found`);
    }
    const project = projectDirectory(currentProjects, currentDirectories, dirId);
    if (!hasAccessToProject(currentUsers, currentUserPermissions, currentProjects, currentMembers, actingUserId, project.id)) {
      throw new Error(`User ${actingUserId} does not have access to project ${project.id}`);
    }
    if (!nameFreeInDirectory(dirId, newName, currentFiles, currentDirectories)) {
      throw new Error(`File ${newName} already exists in directory ${dirId}`);
    }
  }

  if (node.type === "file") {
    const file = currentFiles.find((f) => f.id === node.id);
    if (!file) {
      throw new Error(`File ${node.id} not found`);
    }
    checkParentDirectory(file.parentEdge.directoryId);
    const newFile = { ...file, parentEdge: { ...file.parentEdge, name: newName } };
    store.set(files, currentFiles.map((f) => f.id === node.id ? newFile : f));
  } else {
    const directory = currentDirectories.find((d) => d.id === node.id);
    if (!directory || !directory.parentEdge) {
      throw new Error(`Directory ${node.id} not found`);
    }
    checkParentDirectory(directory.parentEdge.directoryId);
    const newDirectory = { ...directory, parentEdge: { ...directory.parentEdge, name: newName } };
    store.set(directories, currentDirectories.map((d) => d.id === node.id ? newDirectory : d));
  }
}

export async function editFile(actingUserId: string, fileId: string, content: string) {
  const currentFiles = store.get(files);
  const currentDirectories = store.get(directories);
  const currentProjects = store.get(projects);
  const currentUsers = store.get(users);
  const currentMembers = store.get(members);
  const currentUserPermissions = store.get(userPermissions);

  const file = currentFiles.find((f) => f.id === fileId);
  if (!file) {
    throw new Error(`File ${fileId} not found`);
  }
  const project = projectDirectory(currentProjects, currentDirectories, file.parentEdge.directoryId);
  if (!hasAccessToProject(currentUsers, currentUserPermissions, currentProjects, currentMembers, actingUserId, project.id)) {
    throw new Error(`User ${actingUserId} does not have access to project ${project.id}`);
  }
  store.set(files, currentFiles.map((f) => f.id === fileId ? { ...f, content } : f));
}

export async function deleteNode(actingUserId: string, node: { type: "file" | "directory", id: string }) {
  const currentFiles = store.get(files);
  const currentDirectories = store.get(directories);
  const currentProjects = store.get(projects);
  const currentUsers = store.get(users);
  const currentMembers = store.get(members);
  const currentUserPermissions = store.get(userPermissions);

  if (node.type === "file") {
    const file = currentFiles.find((f) => f.id === node.id);
    if (!file) {
      throw new Error(`File ${node.id} not found`);
    }
    const project = projectDirectory(currentProjects, currentDirectories, file.parentEdge.directoryId);
    if (!hasAccessToProject(currentUsers, currentUserPermissions, currentProjects, currentMembers, actingUserId, project.id)) {
      throw new Error(`User ${actingUserId} does not have access to project ${project.id}`);
    }
    store.set(files, currentFiles.filter((f) => f.id !== node.id));
  } else {
    const directory = currentDirectories.find((d) => d.id === node.id);
    if (!directory) {
      throw new Error(`Directory ${node.id} not found`);
    }
    if (!directory.parentEdge) {
      throw new Error(`Directory ${node.id} is the root directory`);
    }
    const project = projectDirectory(currentProjects, currentDirectories, directory.parentEdge.directoryId);
    if (!hasAccessToProject(currentUsers, currentUserPermissions, currentProjects, currentMembers, actingUserId, project.id)) {
      throw new Error(`User ${actingUserId} does not have access to project ${project.id}`);
    }
    const children = directoryChildren(node.id, currentFiles, currentDirectories);
    if (children.length > 0) {
      throw new Error(`Directory ${node.id} is not empty`);
    }
    store.set(directories, currentDirectories.filter((d) => d.id !== node.id));
  }
}

function nameFreeInDirectory(dirId: string, name: string, allFiles: File[], allDirectories: Directory[]) {
  const siblings = directoryChildren(dirId, allFiles, allDirectories);
  const existing = siblings.find((s) => s.parentEdge!.name === name);
  return existing === undefined;
}

export const directories = atom<Directory[]>(initialDirectories);
export const files = atom<File[]>(initialFiles);

