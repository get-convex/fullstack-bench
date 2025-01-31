export interface Project {
  projectId: string;
  name: string;
  emoji: string;
  description: string;
  creatorEmail: string;
}

export interface Task {
  taskId: string;
  projectId: string;
  title: string;
  description: string;
  status: "Todo" | "In Progress" | "In Review" | "Done" | "Canceled";
  dueDate: string | null;
  assigneeId: string | null;
}

export interface Comment {
  commentId: string;
  taskId: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}