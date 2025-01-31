"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "../../../components/Sidebar";
import { CreateTask } from "../../../components/CreateTask";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const statusColors = {
  Todo: "bg-gray-400",
  "In Progress": "bg-blue-400",
  "In Review": "bg-purple-400",
  Done: "bg-green-400",
  Canceled: "bg-red-400",
} as const;

type TaskStatus = keyof typeof statusColors;

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as Id<"projects">;
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const project = useQuery(api.projects.get, { projectId });
  const tasks = useQuery(api.tasks.list, { projectId });
  const allProjects = useQuery(api.projects.list);

  if (!project || !tasks || !allProjects) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0C0C0D] text-white">
        Loading...
      </div>
    );
  }

  const tasksByStatus = {
    Todo: tasks.filter((t) => t.status === "Todo"),
    "In Progress": tasks.filter((t) => t.status === "In Progress"),
    "In Review": tasks.filter((t) => t.status === "In Review"),
    Done: tasks.filter((t) => t.status === "Done"),
    Canceled: tasks.filter((t) => t.status === "Canceled"),
  };

  return (
    <div className="flex h-screen bg-[#0C0C0D]">
      <Sidebar currentProjectId={projectId} projects={allProjects} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-medium text-white flex items-center gap-2">
                <span>{project.emoji}</span>
                {project.name}
              </h1>
              <p className="text-[#8A8A8A] text-sm mt-0.5">
                {project.description}
              </p>
            </div>
            <button
              onClick={() => setIsCreatingTask(true)}
              className="px-3 py-1.5 bg-[#4A4A4A] text-white text-sm rounded hover:bg-[#5A5A5A] transition-colors"
            >
              New Task
            </button>
          </div>

          {isCreatingTask && (
            <CreateTask
              projectId={projectId}
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
                          statusColors[status as TaskStatus]
                        }`}
                      />
                      <h2 className="text-xs font-medium text-[#8A8A8A] tracking-wide uppercase">
                        {status} ({tasks.length})
                      </h2>
                    </div>
                    <div className="space-y-px">
                      {tasks.map((task) => (
                        <a
                          key={task._id}
                          href={`/projects/${projectId}/tasks/${task._id}`}
                          className="block px-3 py-2 -mx-3 hover:bg-[#1A1A1A] transition-colors group rounded"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-[#E1E1E1] text-sm group-hover:text-white transition-colors truncate">
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-[#8A8A8A] text-xs line-clamp-1 mt-0.5">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            {task.dueDate && (
                              <p className="text-[#8A8A8A] text-xs shrink-0">
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
