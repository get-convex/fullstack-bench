"use client";

import { notFound, useParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TaskDetails } from "@/components/TaskDetails";
import { CommentList } from "@/components/CommentList";
import { useLoggedInUser } from "@/lib/BackendContext";
import { Spinner } from "@/components/Spinner";
import { initialUsers } from "@/lib/exampleData";
import { initialProjects } from "@/lib/exampleData";
import { initialTasks } from "@/lib/exampleData";
import { initialComments } from "@/lib/exampleData";

export default function TaskPage() {
  const params = useParams();
  const projectId = params.id as string;
  const taskId = params.taskId as string;

  const user = useLoggedInUser();

  const currentTask = initialTasks.find((t) => t.id === taskId);
  const taskComments = initialComments
    .filter((c) => c.taskId === taskId)
    .map((task) => {
      const user = initialUsers.find((u) => u.id === task.authorId);
      if (!user) {
        throw new Error("User not found");
      }
      return {
        ...task,
        authorEmail: user?.email,
      };
    });
  const projects = initialProjects;
  const users = initialUsers;

  if (
    currentTask === undefined ||
    taskComments === undefined ||
    projects === undefined ||
    users === undefined
  ) {
    return <Spinner />;
  }

  const currentProject = projects.find((p) => p.id === projectId);
  if (!currentProject || !currentTask) {
    notFound();
  }

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
      <main className="flex-1 overflow-auto flex">
        <div className="flex-1 p-6">
          <div className="max-w-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                <span>{currentProject.emoji}</span>
                <span>{currentProject.name}</span>
                <span className="mx-1">•</span>
                <span>Task-{taskId}</span>
              </div>
              <h1 className="text-xl font-medium text-white mb-4">
                {currentTask.title}
              </h1>
              <p className="text-slate-400 text-sm whitespace-pre-wrap">
                {currentTask.description}
              </p>
            </div>

            <CommentList
              comments={taskComments}
              onAddComment={() => {
                throw new Error("Not implemented");
              }}
            />
          </div>
        </div>
        <TaskDetails
          task={currentTask}
          users={users}
          updateTaskStatus={(status) => {
            throw new Error("Not implemented");
          }}
          updateTaskAssignee={(assigneeId) => {
            throw new Error("Not implemented");
          }}
          updateTaskDueDate={(dueDate) => {
            throw new Error("Not implemented");
          }}
        />
      </main>
    </div>
  );
}
