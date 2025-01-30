"use client";

import { useParams } from "next/navigation";
import { Sidebar } from "../../../../../components/Sidebar";
import { TaskDetails } from "../../../../../components/TaskDetails";
import { CommentList } from "../../../../../components/CommentList";
import {
  addProject,
  addComment,
  projects,
  tasks,
  comments,
  updateTaskStatus,
  updateTaskAssignee,
  updateTaskDueDate,
} from "../../../../../lib/testData";

export default function TaskPage() {
  const params = useParams();
  const projectId = params.id as string;
  const taskId = params.taskId as string;

  const currentProject = projects.find((p) => p.projectId === projectId);
  const currentTask = tasks.find((t) => t.taskId === taskId);
  const taskComments = comments.filter((c) => c.taskId === taskId);

  if (!currentProject || !currentTask) {
    return <div>Task not found</div>;
  }

  return (
    <div className="flex h-screen bg-[#0C0C0D]">
      <Sidebar
        email="user@example.com"
        currentProjectId={projectId}
        projects={projects}
        onCreateProject={addProject}
      />
      <main className="flex-1 overflow-auto flex">
        <div className="flex-1 p-6">
          <div className="max-w-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-[#8A8A8A] text-xs mb-2">
                <span>{currentProject.emoji}</span>
                <span>{currentProject.name}</span>
                <span className="mx-1">•</span>
                <span>Task-{taskId}</span>
              </div>
              <h1 className="text-xl font-medium text-white mb-4">
                {currentTask.title}
              </h1>
              <p className="text-[#8A8A8A] text-sm whitespace-pre-wrap">
                {currentTask.description}
              </p>
            </div>

            <CommentList
              taskId={taskId}
              comments={taskComments}
              onAddComment={addComment}
            />
          </div>
        </div>
        <TaskDetails
          task={currentTask}
          updateTaskStatus={updateTaskStatus}
          updateTaskAssignee={updateTaskAssignee}
          updateTaskDueDate={updateTaskDueDate}
        />
      </main>
    </div>
  );
}
