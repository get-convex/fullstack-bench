import { atom, useAtom } from "jotai";
import { Group, Project, User } from "../types";
import { initialUsers } from "./init";
import { projects } from "./projects";
import { members } from "./membership";
import { hasAccessToGroup, hasAccessToProject, userPermissions } from "./userPermissions";
import { groups } from "./groups";

export function useUsers(): User[] | undefined {
  const [currentUsers, _] = useAtom(users);
  return currentUsers;
}

export function useSidebarQuery(userId: string): { isAdmin: boolean, projects: Project[], groups: Group[] } | undefined {
  const [currentUsers] = useAtom(users);
  const [currentProjects] = useAtom(projects);
  const [currentMembers] = useAtom(members);
  const [currentUserPermissions] = useAtom(userPermissions);
  const [currentGroups] = useAtom(groups);
  return {
    isAdmin: currentUserPermissions.find((permission) => permission.userId === userId)?.isAdmin ?? false,
    projects: currentProjects.filter((project) => hasAccessToProject(currentUsers, currentUserPermissions, currentProjects, currentMembers, userId, project.id)),
    groups: currentGroups.filter((group) => hasAccessToGroup(currentUsers, currentUserPermissions, currentMembers, currentGroups, userId, group.id)),
  }
}

export function useUserByEmail(email: string): User | undefined {
  const [currentUsers, _] = useAtom(users);
  return currentUsers.find((user) => user.email === email);
}

export function useUser(id: string): User | undefined {
  const [currentUsers, _] = useAtom(users);
  return currentUsers.find((user) => user.id === id);
}

export function useUsersById(ids: string[]): Record<string, User> | undefined {
  const [currentUsers, _] = useAtom(users);
  return Object.fromEntries(currentUsers.filter((user) => ids.includes(user.id)).map((user) => [user.id, user])) as Record<string, User>;
}

export const users = atom<User[]>(initialUsers);

