"use client";

import Sidebar from "@/components/Sidebar";
import { Spinner } from "@/components/Spinner";
import { useLoggedInUser } from "@/lib/BackendContext";
import {
  initialGroups,
  initialProjects,
  initialUserPermissions,
} from "@/lib/exampleData";

export function ProjectSidebar() {
  const user = useLoggedInUser();
  const isAdmin = initialUserPermissions.some(
    (p) => p.userId === user.id && p.isAdmin
  );
  if (isAdmin === undefined) {
    return <Spinner />;
  }
  return (
    <Sidebar
      projects={initialProjects}
      groups={initialGroups}
      user={user}
      isAdmin={isAdmin}
    />
  );
}
