"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "../../../components/Sidebar";
import { CreateTask } from "../../../components/CreateTask";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/lib/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Todo = Database["public"]["Tables"]["todos"]["Row"];
type User = { id: string; email: string | null };

const statusColors = {
  todo: "bg-gray-400",
  in_progress: "bg-blue-400",
  in_review: "bg-purple-400",
  done: "bg-green-400",
  canceled: "bg-red-400",
};

const statusLabels = {
  todo: "Todo",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
  canceled: "Canceled",
};

export default function ProjectPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [todos, setTodos] = useState<(Todo & { assignee: User | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const params = useParams();
  const projectId = params.id as string;
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const fetchData = async () => {
    const supabase = createClient();

    // Fetch project details
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

    // Fetch todos
    const { data: todosData, error: todosError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (todosError) {
      console.error("Error fetching todos:", todosError);
      return;
    }

    // For now, we'll just store the assignee_id and handle display separately
    setTodos(
      todosData.map((todo) => ({
        ...todo,
        assignee: todo.assignee_id
          ? { id: todo.assignee_id, email: null }
          : null,
      }))
    );

    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Subscribe to changes
    const supabase = createClient();
    console.log("Setting up subscription for project:", projectId);

    const channel = supabase
      .channel(`todos:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "todos",
        },
        (payload) => {
          console.log("Todo inserted:", payload);
          const todo = payload.new as Todo;
          if (todo.project_id === parseInt(projectId)) {
            console.log("New todo belongs to this project, fetching data");
            fetchData();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "todos",
        },
        (payload) => {
          console.log("Todo updated:", payload);
          const todo = payload.new as Todo;
          if (todo.project_id === parseInt(projectId)) {
            console.log("Updated todo belongs to this project, fetching data");
            fetchData();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "todos",
        },
        (payload) => {
          console.log("Todo deleted:", payload);
          const todo = payload.old as Todo;
          if (todo.project_id === parseInt(projectId)) {
            console.log("Deleted todo belonged to this project, fetching data");
            fetchData();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          console.log("Project changed:", payload);
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_members",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log("Project members changed:", payload);
          fetchData();
        }
      );

    // Subscribe and handle connection status
    channel.subscribe(async (status) => {
      console.log(`Subscription status for project ${projectId}:`, status);
      if (status === "SUBSCRIBED") {
        console.log("Successfully subscribed to project changes");
      } else if (status === "CHANNEL_ERROR") {
        console.error(
          "Channel error - please check if realtime is enabled in Supabase dashboard"
        );
      }
    });

    return () => {
      console.log("Cleaning up subscription for project:", projectId);
      channel.unsubscribe();
    };
  }, [projectId]);

  const createTodo = async (
    title: string,
    description: string | null,
    dueDate: string | null,
    assigneeId: string | null
  ) => {
    const supabase = createClient();
    console.log("Creating todo for project:", projectId);

    const todo = {
      project_id: parseInt(projectId),
      title,
      description,
      due_date: dueDate,
      assignee_id: assigneeId,
      status: "todo",
    };
    console.log("Todo data:", todo);

    const { data, error } = await supabase
      .from("todos")
      .insert(todo)
      .select()
      .single();

    if (error) {
      console.error("Error creating todo:", error);
      return;
    }

    console.log("Created todo successfully:", data);
    setIsCreatingTask(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0C0C0D] text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0C0C0D] text-white">
        <div className="text-xl">Project not found</div>
      </div>
    );
  }

  const todosByStatus = {
    todo: todos.filter((t) => t.status === "todo"),
    in_progress: todos.filter((t) => t.status === "in_progress"),
    in_review: todos.filter((t) => t.status === "in_review"),
    done: todos.filter((t) => t.status === "done"),
    canceled: todos.filter((t) => t.status === "canceled"),
  };

  return (
    <div className="flex h-screen bg-[#0C0C0D]">
      <Sidebar currentProjectId={projectId} />
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
              createTask={createTodo}
              setIsCreatingTask={setIsCreatingTask}
            />
          )}

          <div className="space-y-6">
            {Object.entries(todosByStatus).map(
              ([status, todos]) =>
                todos.length > 0 && (
                  <div key={status}>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          statusColors[status as keyof typeof statusColors]
                        }`}
                      />
                      <h2 className="text-xs font-medium text-[#8A8A8A] tracking-wide uppercase">
                        {statusLabels[status as keyof typeof statusLabels]} (
                        {todos.length})
                      </h2>
                    </div>
                    <div className="space-y-px">
                      {todos.map((todo) => (
                        <a
                          key={todo.id}
                          href={`/projects/${projectId}/tasks/${todo.id}`}
                          className="block px-3 py-2 -mx-3 hover:bg-[#1A1A1A] transition-colors group rounded"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-[#E1E1E1] text-sm group-hover:text-white transition-colors truncate">
                                {todo.title}
                              </h3>
                              {todo.description && (
                                <p className="text-[#8A8A8A] text-xs line-clamp-1 mt-0.5">
                                  {todo.description}
                                </p>
                              )}
                            </div>
                            {todo.due_date && (
                              <p className="text-[#8A8A8A] text-xs shrink-0">
                                Due{" "}
                                {new Date(todo.due_date).toLocaleDateString()}
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
