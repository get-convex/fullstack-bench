import { Project, Task, Comment } from './types';

// Default data for development
export const projects: Project[] = [
  {
    projectId: 'p1',
    name: 'Website Redesign',
    emoji: '🎨',
    description: 'Redesign and implement the new company website',
    creatorEmail: 'user123',
  },
  {
    projectId: 'p2',
    name: 'Mobile App',
    emoji: '📱',
    description: 'Develop the iOS and Android mobile applications',
    creatorEmail: 'user123',
  },
  {
    projectId: 'p3',
    name: 'Backend API',
    emoji: '⚡️',
    description: 'Design and implement the REST API',
    creatorEmail: 'user123',
  },
];

export const tasks: Task[] = [
  {
    taskId: 't1',
    projectId: 'p1',
    title: 'Design System',
    description: 'Create a comprehensive design system for the website',
    status: 'In Progress',
    dueDate: '2024-02-15',
    assigneeId: 'user123',
  },
  {
    taskId: 't2',
    projectId: 'p1',
    title: 'Homepage Layout',
    description: 'Design and implement the new homepage layout',
    status: 'Todo',
    dueDate: '2024-02-20',
    assigneeId: null,
  },
  {
    taskId: 't3',
    projectId: 'p1',
    title: 'Contact Form',
    description: 'Add contact form with validation and email notifications',
    status: 'Done',
    dueDate: '2024-02-10',
    assigneeId: 'user123',
  },
  {
    taskId: 't4',
    projectId: 'p2',
    title: 'User Authentication',
    description: 'Implement user authentication flow with social login',
    status: 'In Review',
    dueDate: '2024-02-18',
    assigneeId: 'user123',
  },
  {
    taskId: 't5',
    projectId: 'p2',
    title: 'Push Notifications',
    description: 'Add support for push notifications',
    status: 'Todo',
    dueDate: '2024-02-25',
    assigneeId: null,
  },
  {
    taskId: 't6',
    projectId: 'p2',
    title: 'Offline Mode',
    description: 'Implement offline support with local data sync',
    status: 'In Progress',
    dueDate: '2024-03-01',
    assigneeId: 'user123',
  },
  {
    taskId: 't7',
    projectId: 'p3',
    title: 'Database Schema',
    description: 'Design the database schema and create migrations',
    status: 'Done',
    dueDate: '2024-02-05',
    assigneeId: 'user123',
  },
  {
    taskId: 't8',
    projectId: 'p3',
    title: 'Authentication API',
    description: 'Create endpoints for user authentication',
    status: 'In Progress',
    dueDate: '2024-02-12',
    assigneeId: 'user123',
  },
  {
    taskId: 't9',
    projectId: 'p3',
    title: 'API Documentation',
    description: 'Write comprehensive API documentation',
    status: 'Todo',
    dueDate: '2024-02-28',
    assigneeId: null,
  },
  {
    taskId: 't10',
    projectId: 'p3',
    title: 'Rate Limiting',
    description: 'Implement rate limiting for API endpoints',
    status: 'Canceled',
    dueDate: '2024-02-14',
    assigneeId: 'user123',
  },
];

export const comments: Comment[] = [
  {
    commentId: 'c1',
    taskId: 't1',
    authorEmail: 'user123',
    content: 'Great work on the design system!',
    createdAt: '2024-02-10',
  },
  {
    commentId: 'c2',
    taskId: 't2',
    authorEmail: 'user123',
    content: 'Great work on the design system!',
    createdAt: '2024-02-10',
  },
];

export function addProject(project: Omit<Project, "projectId">) {
  projects.push({ ...project, projectId: `p${projects.length + 1}` });
}

export function addTask(task: Omit<Task, "taskId">) {
  tasks.push({ ...task, taskId: `t${tasks.length + 1}` });
}

export function addComment(comment: Omit<Comment, "commentId">) {
  comments.push({ ...comment, commentId: `c${comments.length + 1}` });
}

export function updateTaskStatus(taskId: string, status: Task["status"]) {
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  task.status = status;
}

export function updateTaskAssignee(taskId: string, assigneeId: string | null) {
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  task.assigneeId = assigneeId;
}

export function updateTaskDueDate(taskId: string, dueDate: string | null) {
  const task = tasks.find((t) => t.taskId === taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  task.dueDate = dueDate;
}
