import { atom, useAtom } from "jotai";
import { Member, UserPermissions } from "../types";
import { users } from "./users";
import { initialUserPermissions } from "./init";
import { store } from ".";
import { projects } from "./projects";
import { members, subjectEquals } from "./membership";

export function useAdminUsers() {
  const [currentUserPermissions, _] = useAtom(userPermissions);
  return currentUserPermissions
    .filter((permission) => permission.isAdmin)
    .map((permission) => permission.userId);
}

export function useIsAdmin(userId: string) {
  const [currentUserPermissions, _] = useAtom(userPermissions);
  return currentUserPermissions.find((permission) => permission.userId === userId)?.isAdmin ?? false;
}

export function setIsAdmin(userId: string, isAdmin: boolean) {
  const currentUserPermissions = store.get(userPermissions);
  const existing = currentUserPermissions.find((permission) => permission.userId === userId);
  if (existing) {
    store.set(userPermissions, currentUserPermissions.map((permission) => permission.userId === userId ? { ...permission, isAdmin } : permission));
  } else {
    store.set(userPermissions, [...currentUserPermissions, { userId, isAdmin, id: crypto.randomUUID(), createdAt: Date.now() }]);
  }
}

export function hasAccessToProject(actingUserId: string, projectId: string) {
  const user = store.get(users).find((user) => user.id === actingUserId);
  if (!user) {
    throw new Error(`User ${actingUserId} not found`);
  }
  const project = store.get(projects).find((project) => project.id === projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }
  const currentUserPermissions = store.get(userPermissions);
  const actingUserPermission = currentUserPermissions.find((permission) => permission.userId === actingUserId);
  const isAdmin = actingUserPermission?.isAdmin ?? false;
  if (isAdmin) {
    return true;
  }
  const currentMembers = store.get(members);

  const projectMembers = currentMembers.filter((member) => member.object.type === 'project' && member.object.projectId === projectId);

  // Stack of subjects to check project membership for.
  let stack: Array<Member["subject"]> = [
    { type: "user", userId: actingUserId },
  ];
  while (stack.length > 0) {
    const subject = stack.pop()!;
    const isProjectMember = projectMembers.some((m) => subjectEquals(m.subject, subject));
    if (isProjectMember) {
      return true;
    }
    // Explore all of the groups the current subject is a member of.
    for (const member of currentMembers) {
      if (subjectEquals(member.subject, subject) && member.object.type === "group") {
        stack.push({ type: "group", groupId: member.object.groupId });
      }
    }
  }
  return false;
}

export function hasAccessToGroup(actingUserId: string, groupId: string) {
  const user = store.get(users).find((user) => user.id === actingUserId);
  if (!user) {
    throw new Error(`User ${actingUserId} not found`);
  }
  const currentMembers = store.get(members);

  const stack: Array<Member["subject"]> = [
    { type: "user", userId: actingUserId },
  ];
  while (stack.length > 0) {
    const subject = stack.pop()!;
    const isGroupMember = currentMembers.some((m) => subjectEquals(m.subject, subject) && m.object.type === "group" && m.object.groupId === groupId);
    if (isGroupMember) {
      return true;
    }
    for (const member of currentMembers) {
      if (subjectEquals(member.subject, subject) && member.object.type === "group") {
        stack.push({ type: "group", groupId: member.object.groupId });
      }
    }
  }
  return false;
}

export const userPermissions = atom<UserPermissions[]>(initialUserPermissions);