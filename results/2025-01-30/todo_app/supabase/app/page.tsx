"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { CreateProject } from "../components/CreateProject";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/lib/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function Home() {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();

    // Subscribe to changes
    const supabase = createClient();
    const channel = supabase
      .channel("projects_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
        },
        () => fetchProjects()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_members",
        },
        () => fetchProjects()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const createProject = async (
    name: string,
    emoji: string,
    description: string
  ) => {
    const supabase = createClient();

    try {
      // Get the current user first
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", userError);
        return;
      }
      if (!user) {
        console.error("No user found");
        return;
      }

      // Insert the project first
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name,
          emoji,
          description,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (projectError) {
        console.error("Error creating project:", projectError);
        return;
      }

      console.log("Project created:", project);

      // Then create the membership
      const { error: memberError } = await supabase
        .from("project_members")
        .insert({
          project_id: project.id,
          user_id: user.id,
          created_at: new Date().toISOString(),
        });

      if (memberError) {
        console.error("Error adding project member:", memberError);
        // Should probably delete the project here since member creation failed
        return;
      }

      setIsCreatingProject(false);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#151517] text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect to the most recently created project
  if (projects.length > 0) {
    redirect(`/projects/${projects[0].id}`);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#151517] text-white p-4">
      <div className="w-full max-w-md">
        {isCreatingProject ? (
          <CreateProject
            createProject={createProject}
            setIsCreatingProject={setIsCreatingProject}
          />
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">
              Welcome to the TODO App
            </h1>
            <p className="text-[#A1A1A3] mb-8">
              Create your first project to get started
            </p>
            <button
              onClick={() => setIsCreatingProject(true)}
              className="px-4 py-2 bg-[#26262b] text-white text-sm rounded hover:bg-[#363639] transition-colors"
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
