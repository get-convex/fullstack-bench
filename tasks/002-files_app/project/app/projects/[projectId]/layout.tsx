"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  addMemberToProject,
  removeMemberFromProject,
  updateProjectMemberRole,
  useProject,
  useProjectMembers,
  useUsers,
  useGroups,
  updateProjectMetadata,
} from "@/testData";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectSettingsModal from "@/components/ProjectSettingsModal";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = useProject(projectId);
  const projectMembers = useProjectMembers(projectId);
  const users = useUsers();
  const groups = useGroups();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState<
    "details" | "members"
  >("details");

  useEffect(() => {
    const handleOpenSettings = (
      e: CustomEvent<{ tab: "details" | "members" }>
    ) => {
      setSettingsModalTab(e.detail.tab);
      setIsSettingsModalOpen(true);
    };

    window.addEventListener(
      "openProjectSettings",
      handleOpenSettings as EventListener
    );
    return () =>
      window.removeEventListener(
        "openProjectSettings",
        handleOpenSettings as EventListener
      );
  }, []);

  if (!project) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Project not found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0D1117]">
      <ProjectHeader project={project} />
      <div className="flex-1 overflow-auto">{children}</div>

      <ProjectSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        project={project}
        initialTab={settingsModalTab}
        projectMembers={projectMembers}
        users={users}
        groups={groups}
        addMemberToProject={addMemberToProject}
        removeMemberFromProject={removeMemberFromProject}
        updateProjectMemberRole={updateProjectMemberRole}
        updateProjectMetadata={updateProjectMetadata}
      />
    </div>
  );
}
