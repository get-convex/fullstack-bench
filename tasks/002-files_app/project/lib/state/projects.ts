import { atom, useAtom } from "jotai";
import { store } from ".";
import { Directory, Member, Project } from "../types";
import { initialProjects } from "./init";
import { hasAccessToProject, userPermissions } from "./userPermissions";
import { directories } from "./filesystem";
import { members } from "./membership";

export function useProjects() {
  const [currentProjects, _] = useAtom(projects);
  return currentProjects;
}

export function useProject(actingUserId: string, projectId: string) {
  const [currentProjects, _] = useAtom(projects);
  if (!hasAccessToProject(actingUserId, projectId)) {
    throw new Error(`User ${actingUserId} does not have access to project ${projectId}`);
  }
  return currentProjects.find((project) => project.id === projectId);
}

export async function addProject(actingUserId: string, name: string, description: string, emoji: string) {
  const currentDirectories = store.get(directories);
  const currentUserPermissions = store.get(userPermissions);
  if (!currentUserPermissions.find((permission) => permission.userId === actingUserId)?.isAdmin) {
    throw new Error(`User ${actingUserId} is not an admin`);
  }
  const currentProjects = store.get(projects);
  const currentMembers = store.get(members);
  const id = crypto.randomUUID();
  const newRootDir: Directory = { id: crypto.randomUUID(), createdAt: Date.now() };
  const newProject: Project = { id, createdAt: Date.now(), name, description, emoji, rootDirectoryId: newRootDir.id };
  store.set(directories, [...currentDirectories, newRootDir]);
  store.set(projects, [...currentProjects, newProject]);
  const newMember: Member = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    subject: { type: "user", userId: actingUserId },
    object: { type: "project", projectId: id },
  };
  store.set(members, [...currentMembers, newMember]);
  return id;
}

export async function deleteProject(actingUserId: string, projectId: string) {
  const currentProjects = store.get(projects);
  const currentUserPermissions = store.get(userPermissions);
  const currentMembers = store.get(members);
  if (!currentUserPermissions.find((permission) => permission.userId === actingUserId)?.isAdmin) {
    throw new Error(`User ${actingUserId} is not an admin`);
  }
  const project = currentProjects.find((project) => project.id === projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }
  store.set(projects, currentProjects.filter((project) => project.id !== projectId));
  store.set(members, currentMembers.filter((member) => member.object.type !== "project" || member.object.projectId !== projectId));
}

export async function updateProjectMetadata(actingUserId: string, projectId: string, name?: string, description?: string, emoji?: string) {
  const currentProjects = store.get(projects);
  const currentUserPermissions = store.get(userPermissions);
  if (!currentUserPermissions.find((permission) => permission.userId === actingUserId)?.isAdmin) {
    throw new Error(`User ${actingUserId} is not an admin`);
  }
  const project = currentProjects.find((project) => project.id === projectId);
  if (!project) {
    return;
  }
  const newProject = { ...project };
  if (name) newProject.name = name;
  if (description) newProject.description = description;
  if (emoji) newProject.emoji = emoji;
  store.set(projects, currentProjects.map((project) => project.id === projectId ? newProject : project));
}

export const projects = atom<Project[]>(initialProjects);

