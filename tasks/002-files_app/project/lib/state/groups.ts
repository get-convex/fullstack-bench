import { atom, useAtom } from "jotai";
import { store } from ".";
import { Group, Member } from "../types";
import { members } from "./membership";
import { initialGroups } from "./init";
import { hasAccessToGroup, userPermissions } from "./userPermissions";
import { users } from "./users";

export function useGroups(actingUserId: string): Group[] | undefined {
  const [currentUsers] = useAtom(users);
  const [currentMembers] = useAtom(members);
  const [currentUserPermissions] = useAtom(userPermissions);
  const [currentGroups] = useAtom(groups);
  return currentGroups.filter((group) => hasAccessToGroup(currentUsers, currentUserPermissions, currentMembers, currentGroups, actingUserId, group.id));
}

export function useGroup(actingUserId: string, groupId: string): Group | undefined {
  const [currentUsers] = useAtom(users);
  const [currentMembers] = useAtom(members);
  const [currentUserPermissions] = useAtom(userPermissions);
  const [currentGroups] = useAtom(groups);

  const group = currentGroups.find((group) => group.id === groupId);
  if (!group) {
    throw new Error(`Group ${groupId} not found`);
  }
  if (!hasAccessToGroup(currentUsers, currentUserPermissions, currentMembers, currentGroups, actingUserId, group.id)) {
    throw new Error(`User ${actingUserId} does not have access to group ${groupId}`);
  }
  return group;
}

export async function createGroup(actingUserId: string, name: string) {
  const currentUserPermissions = store.get(userPermissions);
  if (!currentUserPermissions.find((permission) => permission.userId === actingUserId)?.isAdmin) {
    throw new Error(`User ${actingUserId} is not an admin`);
  }
  const currentGroups = store.get(groups);
  const currentMembers = store.get(members);
  const id = crypto.randomUUID();
  const newGroup: Group = { id, createdAt: Date.now(), name };
  store.set(groups, [...currentGroups, newGroup]);

  const newMember: Member = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    subject: { type: "user", userId: actingUserId },
    object: { type: "group", groupId: id },
  };
  store.set(members, [...currentMembers, newMember]);
}

export async function updateGroupName(actingUserId: string, groupId: string, name: string) {
  const currentUserPermissions = store.get(userPermissions);
  if (!currentUserPermissions.find((permission) => permission.userId === actingUserId)?.isAdmin) {
    throw new Error(`User ${actingUserId} is not an admin`);
  }
  const currentGroups = store.get(groups);
  const group = currentGroups.find((group) => group.id === groupId);
  if (!group) {
    throw new Error(`Group ${groupId} not found`);
  }
  const newGroup = { ...group, name };
  store.set(groups, currentGroups.map((group) => group.id === groupId ? newGroup : group));
}

export async function removeGroup(actingUserId: string, groupId: string) {
  const currentUserPermissions = store.get(userPermissions);
  if (!currentUserPermissions.find((permission) => permission.userId === actingUserId)?.isAdmin) {
    throw new Error(`User ${actingUserId} is not an admin`);
  }
  const currentGroups = store.get(groups);
  store.set(groups, currentGroups.filter((group) => group.id !== groupId));

  const currentMembers = store.get(members);
  const newMembers = currentMembers
    .filter((member) => member.object.type !== "group" || member.object.groupId !== groupId)
    .filter((member) => member.subject.type !== "group" || member.subject.groupId !== groupId);
  store.set(members, newMembers);
}

export const groups = atom<Group[]>(initialGroups);
