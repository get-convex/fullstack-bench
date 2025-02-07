"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import ProjectSettingsModal from "@/components/ProjectSettingsModal";
import { Id } from "@/convex/_generated/dataModel";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#0D1117]">
      <div className="flex-1 overflow-auto">{children}</div>

      <ProjectSettingsModal
        projectId={params.projectId as Id<"projects">}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
