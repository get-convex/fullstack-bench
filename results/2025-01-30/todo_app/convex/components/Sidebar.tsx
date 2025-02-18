"use client";

import { useState } from "react";
import Link from "next/link";
import { CreateProject } from "./CreateProject";
import { Id } from "../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

interface SidebarProps {
  currentProjectId: Id<"projects">;
  projects: {
    _id: Id<"projects">;
    name: string;
    emoji: string;
  }[];
}

export function Sidebar({ currentProjectId, projects }: SidebarProps) {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const user = useQuery(api.auth.getLoggedInUser);

  if (!user) {
    return null;
  }

  return (
    <div className="w-[240px] bg-[#0C0C0D] text-[#E1E1E3] border-r border-[#1A1A1A] flex flex-col">
      <div className="p-4 border-b border-[#1A1A1A]">
        <h2 className="text-xs font-medium text-[#8A8A8A]">Welcome,</h2>
        <h1 className="text-sm font-medium text-white mt-0.5">{user.email}</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="mb-4">
            <div
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-[#8A8A8A] hover:text-white transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <span
                  className={`transform transition-transform ${
                    isProjectsExpanded ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
                PROJECTS
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreatingProject(true);
                }}
                className="opacity-0 group-hover:opacity-100 text-[#8A8A8A] hover:text-white transition-opacity"
              >
                +
              </button>
            </div>

            {isProjectsExpanded && (
              <div className="mt-1 space-y-0.5">
                {isCreatingProject && (
                  <div className="px-2">
                    <CreateProject
                      setIsCreatingProject={setIsCreatingProject}
                    />
                  </div>
                )}

                {projects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/projects/${project._id}`}
                    className={`flex items-center px-2 py-1 rounded text-sm transition-colors ${
                      currentProjectId === project._id
                        ? "bg-[#1A1A1A] text-white"
                        : "text-[#8A8A8A] hover:text-white"
                    }`}
                  >
                    <span className="w-4 text-center">{project.emoji}</span>
                    <span className="ml-2 truncate">{project.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
