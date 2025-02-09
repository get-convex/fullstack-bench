export interface User {
  id: string;
  email: string;
}

export interface Project {
  id: string;
  createdAt: number;
  name: string;
  emoji: string;
  description: string;
  creatorId: string;
}

export interface Task {
  id: string;
  createdAt: number;
  projectId: string;
  title: string;
  description: string;
  status: "Todo" | "In Progress" | "In Review" | "Done" | "Canceled";
  dueDate: number | null;
  assigneeId: string | null;
}

export interface Comment {
  id: string;
  createdAt: number;
  taskId: string;
  authorId: string;
  content: string;
}
