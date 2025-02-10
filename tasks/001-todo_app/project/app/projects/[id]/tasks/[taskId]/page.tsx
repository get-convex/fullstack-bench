"use client";

import { notFound, useParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TaskDetails } from "@/components/TaskDetails";
import { CommentList } from "@/components/CommentList";
import {
  addProject,
  addComment,
  updateTaskStatus,
  updateTaskAssignee,
  updateTaskDueDate,
  useTask,
  useComments,
  useUserByEmail,
  useProjects,
  useUsers,
} from "@/lib/state";
import { useLoggedInUser } from "@/lib/BackendContext";
import { Spinner } from "@/components/Spinner";

export default function TaskPage() {
  const params = useParams();
  const projectId = params.id as string;
  const taskId = params.taskId as string;

  const user = useLoggedInUser();

  const currentTask = useTask(taskId);
  const taskComments = useComments(taskId);
  const projects = useProjects();
  const users = useUsers();

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

  const postComment = async (content: string) => {
    if (!user) {
      throw new Error("User not found");
    }
    return addComment(taskId, content, user.id);
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar
        user={user}
        currentProjectId={projectId}
        projects={projects}
        onCreateProject={addProject}
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

            <CommentList comments={taskComments} onAddComment={postComment} />
          </div>
        </div>
        <TaskDetails
          task={currentTask}
          users={users}
          updateTaskStatus={(status) => updateTaskStatus(taskId, status)}
          updateTaskAssignee={(assigneeId) =>
            updateTaskAssignee(taskId, assigneeId)
          }
          updateTaskDueDate={(dueDate) => updateTaskDueDate(taskId, dueDate)}
        />
      </main>
    </div>
  );
}
