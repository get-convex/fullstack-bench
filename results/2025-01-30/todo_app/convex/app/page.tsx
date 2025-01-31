"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { CreateProject } from "../components/CreateProject";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const projects = useQuery(api.projects.list);

  // Show loading state while we fetch projects
  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#151517] text-white">
        Loading...
      </div>
    );
  }

  // Redirect to the most recently created project, or show a message if no projects exist
  if (projects.length > 0) {
    redirect(`/projects/${projects[projects.length - 1]._id}`);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#151517] text-white p-4">
      <div className="w-full max-w-md">
        {isCreatingProject ? (
          <CreateProject setIsCreatingProject={setIsCreatingProject} />
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
