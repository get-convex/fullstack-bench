"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { createContext, useContext, useEffect } from "react";
import { useConvexAuth } from "convex/react";
import toast from "react-hot-toast";

type UserContextType = {
  userId: string | null;
  isAdmin: boolean;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
  userId: null,
  isAdmin: false,
  isLoading: true,
});

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.auth.getUser);
  const provisionUser = useMutation(api.auth.provisionUser);

  // Provision the user when they first sign in
  useEffect(() => {
    if (isAuthenticated && user === null) {
      provisionUser()
        .catch((error) => {
          toast.error(
            "Failed to provision user. Please contact an administrator."
          );
        });
    }
  }, [isAuthenticated, user, provisionUser]);

  const contextValue = {
    userId: user?.userId ?? null,
    isAdmin: user?.isAdmin ?? false,
    isLoading: authLoading || user === undefined,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}