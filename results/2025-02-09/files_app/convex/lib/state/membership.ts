import { atom, useAtom } from "jotai";
import { store } from ".";
import { Member } from "../types";
import { initialMembers } from "./init";
import { hasAccessToGroup } from "./userPermissions";
import { hasAccessToProject } from "./userPermissions";

export function useMembers(object: Member["object"]) {
  const [currentMembers, _] = useAtom(members);
  return currentMembers.filter((member) => objectEquals(member.object, object));
}

export function subjectEquals(a: Member["subject"], b: Member["subject"]) {
  if (a.type === "user" && b.type === "user") {
    return a.userId === b.userId;
  }
  if (a.type === "group" && b.type === "group") {
    return a.groupId === b.groupId;
  }
  return false;
}

export function objectEquals(a: Member["object"], b: Member["object"]) {
  if (a.type === "project" && b.type === "project") {
    return a.projectId === b.projectId;
  }
  if (a.type === "group" && b.type === "group") {
    return a.groupId === b.groupId;
  }
  return false;
}

export async function addMember(actingUserId: string, subject: Member["subject"], object: Member["object"]) {
  if (object.type === "project") {
    if (!hasAccessToProject(actingUserId, object.projectId)) {
      throw new Error(`User ${actingUserId} does not have access to project ${object.projectId}`);
    }
  } else {
    if (!hasAccessToGroup(actingUserId, object.groupId)) {
      throw new Error(`User ${actingUserId} does not have access to group ${object.groupId}`);
    }
  }
  const currentMembers = store.get(members);

  // Check that the membership doesn't already exist.
  if (currentMembers.some((member) => subjectEquals(member.subject, subject) && objectEquals(member.object, object))) {
    return;
  }

  // Check that we're not introducing a cycle in the group hierarchy.
  if (subject.type === "group" && object.type === "group") {
    // Do a DFS starting from the subject group and see if we can reach the object group.
    const stack = [subject.groupId]
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === object.groupId) {
        throw new Error("Introducing a cycle in the group hierarchy.");
      }
      for (const member of currentMembers) {
        if (member.subject.type !== "group") {
          continue;
        }
        if (member.object.type !== "group" || member.object.groupId !== current) {
          continue;
        }
        stack.push(member.subject.groupId);
      }
    }
  }

  const id = crypto.randomUUID();
  const newMember: Member = { id, createdAt: Date.now(), subject, object };
  store.set(members, [...currentMembers, newMember]);
}

export async function removeMember(actingUserId: string, memberId: string) {
  const currentMembers = store.get(members);
  const member = currentMembers.find((member) => member.id === memberId);
  if (!member) {
    throw new Error(`Member ${memberId} not found`);
  }
  if (member.object.type === "project") {
    if (!hasAccessToProject(actingUserId, member.object.projectId)) {
      throw new Error(`User ${actingUserId} does not have access to project ${member.object.projectId}`);
    }
  } else {
    if (!hasAccessToGroup(actingUserId, member.object.groupId)) {
      throw new Error(`User ${actingUserId} does not have access to group ${member.object.groupId}`);
    }
  }
  store.set(members, currentMembers.filter((member) => member.id !== memberId));
}

export const members = atom<Member[]>(initialMembers);
