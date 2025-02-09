"use client";

import Sidebar from "@/components/Sidebar";
import { useLoggedInUser } from "@/lib/BackendContext";
import { useGroups } from "@/lib/state/groups";
import { useProjects } from "@/lib/state/projects";
import { useIsAdmin } from "@/lib/state/userPermissions";

export function ProjectSidebar() {
  const projects = useProjects();
  const user = useLoggedInUser();
  const isAdmin = useIsAdmin(user.id);
  const groups = useGroups(user.id);
  return (
    <Sidebar
      projects={projects}
      groups={groups}
      user={user}
      isAdmin={isAdmin}
    />
  );
}
