"use client";

import { useLoggedInUser } from "@/lib/BackendContext";
import { useIsAdmin } from "@/lib/state/userPermissions";
import { redirect } from "next/navigation";

export default function WorkspaceAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useLoggedInUser();
  if (!user) {
    console.error("User not found");
    redirect("/");
  }
  const isAdmin = useIsAdmin(user.id);
  if (!isAdmin) {
    console.error("User is not an admin");
    redirect("/");
  }
  return <div>{children}</div>;
}
