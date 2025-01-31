"use client";

import { useParams } from "next/navigation";
import { Sidebar } from "../../../../../components/Sidebar";
import { TaskDetails } from "../../../../../components/TaskDetails";
import { CommentList } from "../../../../../components/CommentList";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function TaskPage() {
  const params = useParams();
  const projectId = params.id as Id<"projects">;
  const taskId = params.taskId as Id<"tasks">;

  const project = useQuery(api.projects.get, { projectId });
  const task = useQuery(api.tasks.get, { taskId });
  const allProjects = useQuery(api.projects.list);

  if (!project || !task || !allProjects) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0C0C0D] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0C0C0D]">
      <Sidebar currentProjectId={projectId} projects={allProjects} />
      <main className="flex-1 overflow-auto flex">
        <div className="flex-1 p-6">
          <div className="max-w-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-[#8A8A8A] text-xs mb-2">
                <span>{project.emoji}</span>
                <span>{project.name}</span>
                <span className="mx-1">•</span>
                <span>Task-{taskId}</span>
              </div>
              <h1 className="text-xl font-medium text-white mb-4">
                {task.title}
              </h1>
              <p className="text-[#8A8A8A] text-sm whitespace-pre-wrap">
                {task.description}
              </p>
            </div>

            <CommentList taskId={taskId} />
          </div>
        </div>
        <TaskDetails taskId={taskId} />
      </main>
    </div>
  );
}
