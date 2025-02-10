"use client";

import { Spinner } from "@/components/Spinner";
import { useLoggedInUser } from "@/lib/BackendContext";
import { useIsAdmin } from "@/lib/state/userPermissions";
import { redirect } from "next/navigation";

export default function WorkspaceAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useLoggedInUser();
  const isAdmin = useIsAdmin(user?.id);
  if (isAdmin === undefined) {
    return <Spinner />;
  }
  if (!isAdmin) {
    redirect("/");
  }
  return <div>{children}</div>;
}
