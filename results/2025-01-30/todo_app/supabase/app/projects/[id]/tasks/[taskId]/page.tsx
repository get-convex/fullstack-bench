"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "../../../../../components/Sidebar";
import { TaskDetails } from "../../../../../components/TaskDetails";
import { CommentList } from "../../../../../components/CommentList";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/lib/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Todo = Database["public"]["Tables"]["todos"]["Row"] & {
  assignee: { id: string; email: string } | null;
};
type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  author: { id: string; email: string } | null;
};

export default function TaskPage() {
  const params = useParams();
  const projectId = params.id as string;
  const taskId = params.taskId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) {
        console.error("Error fetching project:", projectError);
        return;
      }

      setProject(projectData);

      // Fetch todo
      const { data: todoData, error: todoError } = await supabase
        .from("todos")
        .select("*")
        .eq("id", taskId)
        .single();

      if (todoError) {
        console.error("Error fetching todo:", todoError);
        return;
      }

      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      // Add assignee info structure
      setTodo({
        ...todoData,
        assignee: todoData.assignee_id
          ? {
              id: todoData.assignee_id,
              email:
                currentUser && todoData.assignee_id === currentUser.id
                  ? currentUser.email
                  : "Unknown User",
            }
          : null,
      });

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("todo_id", taskId)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
        return;
      }

      // Add author info structure to comments
      setComments(
        commentsData.map((comment) => ({
          ...comment,
          author: comment.author_id
            ? {
                id: comment.author_id,
                email:
                  currentUser && comment.author_id === currentUser.id
                    ? currentUser.email
                    : "Unknown User",
              }
            : null,
        }))
      );
      setLoading(false);
    };

    fetchData();

    // Subscribe to all relevant changes
    const supabase = createClient();
    const channel = supabase
      .channel(`task:${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
          filter: `id=eq.${taskId}`,
        },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `todo_id=eq.${taskId}`,
        },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `id=eq.${projectId}`,
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [projectId, taskId]);

  const updateTaskStatus = async (status: Todo["status"]) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("todos")
      .update({ status })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task status:", error);
    }
  };

  const updateTaskAssignee = async (assigneeId: string | null) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("todos")
      .update({ assignee_id: assigneeId })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task assignee:", error);
    }
  };

  const updateTaskDueDate = async (dueDate: string | null) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("todos")
      .update({ due_date: dueDate })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task due date:", error);
    }
  };

  const addComment = async (content: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("comments").insert({
      todo_id: parseInt(taskId),
      author_id: user.id,
      content,
    });

    if (error) {
      console.error("Error adding comment:", error);
      return;
    }

    // Optimistically add the comment to the UI
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(), // temporary ID
        todo_id: parseInt(taskId),
        author_id: user.id,
        content,
        created_at: new Date().toISOString(),
        author: {
          id: user.id,
          email: user.email || "Unknown User",
        },
      },
    ]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0C0C0D] text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!project || !todo) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0C0C0D] text-white">
        <div className="text-xl">Task not found</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0C0C0D]">
      <Sidebar currentProjectId={projectId} />
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
                {todo.title}
              </h1>
              <p className="text-[#8A8A8A] text-sm whitespace-pre-wrap">
                {todo.description}
              </p>
            </div>

            <CommentList
              taskId={taskId}
              comments={comments}
              onAddComment={addComment}
            />
          </div>
        </div>
        <TaskDetails
          task={todo}
          updateTaskStatus={updateTaskStatus}
          updateTaskAssignee={updateTaskAssignee}
          updateTaskDueDate={updateTaskDueDate}
        />
      </main>
    </div>
  );
}
