"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreateProject } from "./CreateProject";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/lib/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface SidebarProps {
  currentProjectId: string;
}

export function Sidebar({ currentProjectId }: SidebarProps) {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Get user email
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);

      // Get projects the user is a member of
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        return;
      }

      setProjects(projectsData);
      setLoading(false);
    };

    fetchData();

    // Subscribe to changes
    const supabase = createClient();
    const channel = supabase
      .channel("projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="w-[240px] bg-[#0C0C0D] text-[#E1E1E3] border-r border-[#1A1A1A] flex flex-col">
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-[240px] bg-[#0C0C0D] text-[#E1E1E3] border-r border-[#1A1A1A] flex flex-col">
      <div className="p-4 border-b border-[#1A1A1A]">
        <h2 className="text-xs font-medium text-[#8A8A8A]">Welcome,</h2>
        <h1 className="text-sm font-medium text-white mt-0.5">{email}</h1>
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
                      createProject={async (name, emoji, description) => {
                        const supabase = createClient();
                        const { data: project, error: projectError } =
                          await supabase
                            .from("projects")
                            .insert({ name, emoji, description })
                            .select()
                            .single();

                        if (projectError) {
                          console.error(
                            "Error creating project:",
                            projectError
                          );
                          return;
                        }

                        // Add the current user as a member
                        const {
                          data: { user },
                        } = await supabase.auth.getUser();
                        if (!user) return;

                        const { error: memberError } = await supabase
                          .from("project_members")
                          .insert({ project_id: project.id, user_id: user.id });

                        if (memberError) {
                          console.error(
                            "Error adding project member:",
                            memberError
                          );
                          return;
                        }

                        setIsCreatingProject(false);
                      }}
                      setIsCreatingProject={setIsCreatingProject}
                    />
                  </div>
                )}

                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={`flex items-center px-2 py-1 rounded text-sm transition-colors ${
                      currentProjectId === project.id.toString()
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
