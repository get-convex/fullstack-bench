"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectSettingsModal from "@/components/ProjectSettingsModal";
import { Member } from "@/lib/types";
import { useLoggedInUser } from "@/lib/BackendContext";
import toast from "react-hot-toast";
import { Spinner } from "@/components/Spinner";
import {
  initialGroups,
  initialMembers,
  initialProjects,
  initialUsers,
} from "@/lib/exampleData";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.projectId as string;
  const user = useLoggedInUser();

  const project = initialProjects.find((project) => project.id === projectId);
  const projectMembers = initialMembers.filter(
    (member) =>
      member.object.type === "project" && member.object.projectId === projectId
  );
  const users = initialUsers;
  const groups = initialGroups;

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

  if (
    project === undefined ||
    projectMembers === undefined ||
    users === undefined ||
    groups === undefined
  ) {
    return <Spinner />;
  }

  if (!project) {
    notFound();
  }

  const addMemberToProject = async (subject: Member["subject"]) => {
    throw new Error("Not implemented");
  };

  const removeMemberFromProject = async (memberId: string) => {
    throw new Error("Not implemented");
  };

  const updateProject = async (
    name?: string,
    description?: string,
    emoji?: string
  ) => {
    throw new Error("Not implemented");
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
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
