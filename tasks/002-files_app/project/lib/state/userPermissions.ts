import { atom, useAtom } from "jotai";
import { Group, Member, Project, User, UserPermissions } from "../types";
import { initialUserPermissions } from "./init";
import { store } from ".";
import { subjectEquals } from "./membership";

export function useAdminUsers(): string[] | undefined {
  const [currentUserPermissions, _] = useAtom(userPermissions);
  return currentUserPermissions
    .filter((permission) => permission.isAdmin)
    .map((permission) => permission.userId);
}

export function useIsAdmin(userId: string): boolean | undefined {
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

export function hasAccessToProject(
  currentUsers: User[],
  currentUserPermissions: UserPermissions[],
  currentProjects: Project[],
  currentMembers: Member[],
  actingUserId: string,
  projectId: string,
) {
  const user = currentUsers.find((user) => user.id === actingUserId);
  if (!user) {
    throw new Error(`User ${actingUserId} not found`);
  }
  const project = currentProjects.find((project) => project.id === projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }
  const actingUserPermission = currentUserPermissions.find((permission) => permission.userId === actingUserId);
  const isAdmin = actingUserPermission?.isAdmin ?? false;
  if (isAdmin) {
    return true;
  }

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

export function hasAccessToGroup(
  currentUsers: User[],
  currentUserPermissions: UserPermissions[],
  currentMembers: Member[],
  currentGroups: Group[],
  actingUserId: string,
  groupId: string,
) {
  const user = currentUsers.find((user) => user.id === actingUserId);
  if (!user) {
    throw new Error(`User ${actingUserId} not found`);
  }
  const group = currentGroups.find((group) => group.id === groupId);
  if (!group) {
    throw new Error(`Group ${groupId} not found`);
  }
  const actingUserPermission = currentUserPermissions.find((permission) => permission.userId === actingUserId);
  const isAdmin = actingUserPermission?.isAdmin ?? false;
  if (isAdmin) {
    return true;
  }

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