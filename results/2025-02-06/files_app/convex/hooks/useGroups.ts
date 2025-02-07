"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/components/UserContext";
import { Id } from "@/convex/_generated/dataModel";

export function useGroups() {
  const { userId } = useUser();
  const groups = useQuery(api.queries.getUserGroups,
    userId ? { userId: userId as Id<"users"> } : "skip"
  );
  const createGroup = useMutation(api.groups.createGroup);
  const updateGroup = useMutation(api.groups.updateGroup);
  const deleteGroup = useMutation(api.groups.deleteGroup);
  const addGroupMember = useMutation(api.groups.addGroupMember);
  const removeGroupMember = useMutation(api.groups.removeGroupMember);

  return {
    groups: groups ?? [],
    isLoading: groups === undefined,
    createGroup: async (name: string, parentGroupId?: Id<"groups">) => {
      return await createGroup({ name, parentGroupId });
    },
    updateGroup: async (
      groupId: Id<"groups">,
      name: string,
      parentGroupId?: Id<"groups">
    ) => {
      return await updateGroup({ groupId, name, parentGroupId });
    },
    deleteGroup: async (groupId: Id<"groups">) => {
      return await deleteGroup({ groupId });
    },
    addGroupMember: async (groupId: Id<"groups">, userId: Id<"users">) => {
      return await addGroupMember({ groupId, userId });
    },
    removeGroupMember: async (groupId: Id<"groups">, userId: Id<"users">) => {
      return await removeGroupMember({ groupId, userId });
    },
  };
}