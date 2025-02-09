"use client";

import Sidebar from "@/components/Sidebar";
import { useUserEmail } from "@/components/WithUserEmail";
import { useGroups } from "@/lib/state/groups";
import { useProjects } from "@/lib/state/projects";
import { useIsAdmin } from "@/lib/state/userPermissions";
import { useUserByEmail } from "@/lib/state/users";

export function ProjectSidebar() {
  const projects = useProjects();
  const userEmail = useUserEmail();
  const user = useUserByEmail(userEmail);
  if (!user) {
    throw new Error("User not found");
  }
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
