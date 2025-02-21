"use client";

import { Spinner } from "@/components/Spinner";
import { useLoggedInUser } from "@/lib/BackendContext";
import { initialUserPermissions } from "@/lib/exampleData";
import { notFound } from "next/navigation";

export default function WorkspaceAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useLoggedInUser();
  const isAdmin = initialUserPermissions.some(
    (p) => p.userId === user.id && p.isAdmin
  );
  if (isAdmin === undefined) {
    return <Spinner />;
  }
  if (!isAdmin) {
    notFound();
  }

  return <>{children}</>;
}
