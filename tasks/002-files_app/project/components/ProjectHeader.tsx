"use client";

import { Project } from "@/lib/types";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{project.emoji}</span>
        <h1 className="text-xl font-semibold text-white">{project.name}</h1>
      </div>
    </div>
  );
}
