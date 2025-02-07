"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/components/UserContext";
import { Id } from "@/convex/_generated/dataModel";

export function useWorkspace() {
  const { isAdmin } = useUser();
  const users = useQuery(api.workspace.listUsers);
  const addUser = useMutation(api.workspace.addUser);
  const removeUser = useMutation(api.workspace.removeUser);
  const updateUserRole = useMutation(api.workspace.updateUserRole);

  return {
    users: isAdmin ? (users ?? []).map(user => ({
      _id: user._id,
      userId: user.userId,
      email: user.email,
      isAdmin: user.isAdmin,
    })) : [],
    isLoading: users === undefined,
    addUser: async (email: string, isAdmin: boolean) => {
      return await addUser({ email, isAdmin });
    },
    removeUser: async (userId: Id<"users">) => {
      return await removeUser({ userId });
    },
    updateUserRole: async (userId: Id<"users">, isAdmin: boolean) => {
      return await updateUserRole({ userId, isAdmin });
    },
  };
}