"use client";

import Sidebar from "@/components/Sidebar";
import { Spinner } from "@/components/Spinner";
import { useLoggedInUser } from "@/lib/BackendContext";
import { useSidebarQuery } from "@/lib/state/users";

export function ProjectSidebar() {
  const user = useLoggedInUser();
  const sidebarQuery = useSidebarQuery(user?.id);
  if (!sidebarQuery) {
    return <Spinner />;
  }
  const { isAdmin, projects, groups } = sidebarQuery;
  return (
    <Sidebar
      projects={projects}
      groups={groups}
      user={user}
      isAdmin={isAdmin}
    />
  );
}
