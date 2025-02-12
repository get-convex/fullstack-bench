"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function EnsureTestUser({ children }: { children: React.ReactNode }) {
  const ensureTestUser = useMutation(api.auth.ensureTestUser);

  useEffect(() => {
    ensureTestUser();
  }, [ensureTestUser]);

  return <>{children}</>;
}

export function BackendContext(props: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <EnsureTestUser>{props.children}</EnsureTestUser>
    </ConvexProvider>
  );
}

export function useLoggedInUser() {
  return useQuery(api.auth.getLoggedInUser);
}
