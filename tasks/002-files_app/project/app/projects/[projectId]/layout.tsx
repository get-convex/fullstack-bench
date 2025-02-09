"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectSettingsModal from "@/components/ProjectSettingsModal";
import { updateProjectMetadata, useProject } from "@/lib/state/projects";
import { addMember, removeMember, useMembers } from "@/lib/state/membership";
import { useGroups } from "@/lib/state/groups";
import { useUsers } from "@/lib/state/users";
import { Member } from "@/lib/types";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = useProject(projectId);
  const projectMembers = useMembers({ type: "project", projectId });
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

  const addMemberToProject = async (subject: Member["subject"]) => {
    await addMember(subject, { type: "project", projectId: project.id });
  };

  const removeMemberFromProject = async (memberId: string) => {
    await removeMember(memberId);
  };

  const updateProject = async (
    name?: string,
    description?: string,
    emoji?: string
  ) => {
    await updateProjectMetadata(project.id, name, description, emoji);
  };

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
        addMember={addMemberToProject}
        removeMember={removeMemberFromProject}
        updateProjectMetadata={updateProject}
      />
    </div>
  );
}
