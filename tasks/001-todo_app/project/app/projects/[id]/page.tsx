"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Sidebar } from "../../../components/Sidebar";
import { CreateTask } from "../../../components/CreateTask";
import { useLoggedInUser } from "@/lib/BackendContext";
import { Spinner } from "@/components/Spinner";
import { initialTasks } from "@/lib/exampleData";
import { initialProjects } from "@/lib/exampleData";

const statusColors = {
  Todo: "bg-gray-400",
  "In Progress": "bg-blue-400",
  "In Review": "bg-purple-400",
  Done: "bg-green-400",
  Canceled: "bg-red-400",
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const user = useLoggedInUser();

  const projects = initialProjects;
  const projectTasks = initialTasks;

  if (projects === undefined || projectTasks === undefined) {
    return <Spinner />;
  }

  const currentProject = projects.find((p) => p.id === projectId);
  if (!currentProject) {
    notFound();
  }

  const tasksByStatus = {
    Todo: projectTasks.filter((t) => t.status === "Todo"),
    "In Progress": projectTasks.filter((t) => t.status === "In Progress"),
    "In Review": projectTasks.filter((t) => t.status === "In Review"),
    Done: projectTasks.filter((t) => t.status === "Done"),
    Canceled: projectTasks.filter((t) => t.status === "Canceled"),
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar
        user={user}
        currentProjectId={projectId}
        projects={projects}
        onCreateProject={() => {
          throw new Error("Not implemented");
        }}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-medium text-slate-50 flex items-center gap-2">
                <span>{currentProject.emoji}</span>
                {currentProject.name}
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {currentProject.description}
              </p>
            </div>
            <button
              onClick={() => setIsCreatingTask(true)}
              className="px-3 py-1.5 bg-plum text-slate-50 text-sm rounded hover:bg-plum/80 transition-colors"
            >
              New Task
            </button>
          </div>

          {isCreatingTask && (
            <CreateTask
              project={currentProject}
              createTask={() => {
                throw new Error("Not implemented");
              }}
              setIsCreatingTask={setIsCreatingTask}
            />
          )}

          <div className="space-y-6">
            {Object.entries(tasksByStatus).map(
              ([status, tasks]) =>
                tasks.length > 0 && (
                  <div key={status}>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          statusColors[status as keyof typeof statusColors]
                        }`}
                      />
                      <h2 className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                        {status} ({tasks.length})
                      </h2>
                    </div>
                    <div className="space-y-px">
                      {tasks.map((task) => (
                        <a
                          key={task.id}
                          href={`/projects/${projectId}/tasks/${task.id}`}
                          className="block px-3 py-2 -mx-3 hover:bg-slate-800 transition-colors group rounded"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-slate-200 text-sm group-hover:text-slate-50 transition-colors truncate">
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            {task.dueDate && (
                              <p className="text-slate-400 text-xs shrink-0">
                                Due{" "}
                                {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
