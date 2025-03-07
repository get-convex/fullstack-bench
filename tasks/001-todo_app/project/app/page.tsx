"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { CreateProject } from "../components/CreateProject";
import { useLoggedInUser } from "@/lib/BackendContext";
import { Spinner } from "@/components/Spinner";
import { initialProjects } from "@/lib/exampleData";

export default function Home() {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const projects = initialProjects;
  const user = useLoggedInUser();

  if (projects === undefined) {
    return <Spinner />;
  }

  // Redirect to the most recently created project, or show a message if no projects exist
  if (projects.length > 0) {
    redirect(`/projects/${projects[projects.length - 1].id}`);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-50 p-4">
      <div className="w-full max-w-md">
        {isCreatingProject ? (
          <CreateProject
            userId={user.id}
            createProject={() => {
              throw new Error("Not implemented");
            }}
            setIsCreatingProject={setIsCreatingProject}
          />
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">
              Welcome to the TODO App
            </h1>
            <p className="text-slate-300 mb-8">
              Create your first project to get started
            </p>
            <button
              onClick={() => setIsCreatingProject(true)}
              className="px-4 py-2 bg-slate-700 text-slate-50 text-sm rounded hover:bg-slate-600 transition-colors"
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
