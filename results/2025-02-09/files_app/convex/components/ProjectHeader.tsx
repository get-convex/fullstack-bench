"use client";

import { Project } from "@/lib/types";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="border-b border-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{project.emoji}</span>
          <div>
            <h1 className="text-xl font-medium text-white">{project.name}</h1>
            <p className="text-sm text-gray-400">{project.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
