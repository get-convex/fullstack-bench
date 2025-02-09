"use client";

import { useUserEmail } from "@/components/WithUserEmail";
import { useIsAdmin } from "@/lib/state/userPermissions";
import { useUserByEmail } from "@/lib/state/users";
import { redirect } from "next/navigation";

export default function WorkspaceAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = useUserEmail();
  const user = useUserByEmail(email);
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
