import { atom, getDefaultStore, useAtom } from "jotai";
import { Project, Task, Comment, User } from "./types";

const store = getDefaultStore();

export function useUsers() {
  const [currentUsers, _] = useAtom(users);
  return currentUsers;
}

export function useUserByEmail(email: string) {
  const [currentUsers, _] = useAtom(users);
  return currentUsers.find((user) => user.email === email);
}

export function useUsersById(ids: string[]) {
  const [currentUsers, _] = useAtom(users);
  return Object.fromEntries(
    currentUsers.filter((user) => ids.includes(user.id)).map((user) => [user.id, user])
  ) as Record<string, User>;
}

export function useProjects() {
  const [currentProjects, _] = useAtom(projects);
  return currentProjects;
}

export function useProject(id: string) {
  const [currentProjects, _] = useAtom(projects);
  return currentProjects.find((project) => project.id === id);
}

export async function addProject(name: string, emoji: string, description: string, creatorId: string) {
  const currentProjects = store.get(projects);
  const id = crypto.randomUUID();
  const newProject: Project = { id, createdAt: Date.now(), name, emoji, description, creatorId };
  store.set(projects, [...currentProjects, newProject]);
  return id;
}

export function useTasks(projectId: string) {
  const [currentTasks, _] = useAtom(tasks);
  return currentTasks.filter((task) => task.projectId === projectId);
}

export function useTask(taskId: string) {
  const [currentTasks, _] = useAtom(tasks);
  return currentTasks.find((task) => task.id === taskId);
}

export async function addTask(projectId: string, title: string, description: string, status: Task["status"], dueDate: number | null, assigneeId: string | null) {
  const currentTasks = store.get(tasks);
  const id = crypto.randomUUID();
  const newTask: Task = { id, createdAt: getTimestamp(), projectId, title, description, status, dueDate, assigneeId };
  store.set(tasks, [...currentTasks, newTask]);
  return id;
}

export async function updateTaskStatus(taskId: string, status: Task["status"]) {
  const currentTasks = store.get(tasks);
  const updatedTasks = currentTasks.map((task) =>
    task.id === taskId ? { ...task, status } : task
  );
  store.set(tasks, updatedTasks);
}

export async function updateTaskAssignee(taskId: string, assigneeId: string | null) {
  const currentTasks = store.get(tasks);
  const updatedTasks = currentTasks.map((task) =>
    task.id === taskId ? { ...task, assigneeId } : task
  );
  store.set(tasks, updatedTasks);
}

export async function updateTaskDueDate(taskId: string, dueDate: number | null) {
  const currentTasks = store.get(tasks);
  const updatedTasks = currentTasks.map((task) =>
    task.id === taskId ? { ...task, dueDate } : task
  );
  store.set(tasks, updatedTasks);
}

export function useComments(taskId: string) {
  const [currentComments, _] = useAtom(comments);
  return currentComments.filter((comment) => comment.taskId === taskId);
}

export async function addComment(taskId: string, content: string, authorId: string) {
  const currentComments = store.get(comments);
  const id = crypto.randomUUID();
  const newComment: Comment = { id, createdAt: getTimestamp(), taskId, authorId, content };
  console.log("newComment", newComment);
  store.set(comments, [...currentComments, newComment]);
  return id;
}

let base = (new Date("2025-02-04 12:00:00")).getTime();
function getTimestamp() {
  base += 1000 * 60;
  return base;
}

const userId1 = 'c54555b3-5df1-4862-9aea-664ad2e66b05';
const userId2 = '7496e663-3efc-48fc-92d2-8196979bb400';
const userId3 = '00a325f0-8b02-4cb4-9dab-31716deb06ec';
const users = atom<User[]>([
  {
    id: userId1,
    email: 'joe@example.com',
  },
  {
    id: userId2,
    email: 'bob@example.com',
  },
  {
    id: userId3,
    email: 'alice@example.com',
  },
]);

const projectId1 = 'ddeb0391-c738-455a-82bc-514d1ad929fa';
const projectId2 = '89292f94-7c16-45ea-a82d-44e6116311c4a';
const projectId3 = '939f5093-a0a1-44b4-ac70-002119506933';

const projects = atom<Project[]>([
  {
    id: projectId1,
    createdAt: getTimestamp(),
    name: 'Website Redesign',
    emoji: '🎨',
    description: 'Redesign and implement the new company website',
    creatorId: userId1,
  },
  {
    id: projectId2,
    createdAt: getTimestamp(),
    name: 'Mobile App',
    emoji: '📱',
    description: 'Develop the iOS and Android mobile applications',
    creatorId: userId1,
  },
  {
    id: projectId3,
    createdAt: getTimestamp(),
    name: 'Backend API',
    emoji: '⚡️',
    description: 'Design and implement the REST API',
    creatorId: userId2,
  }
]);

const taskId1 = '620a23c8-4439-4552-8c34-644ebad4cb62';
const taskId2 = 'b98720bb-d782-4bad-b19e-2d9f66c88de1';
const taskId3 = 'cfbba8bd-0ba2-47ad-9b5d-82e43536d911';
const taskId4 = 'fc02d096-9eb5-4570-a28e-5b3d3b947b3d';
const taskId5 = '58ac449b-00bb-4ed2-b4ad-98f457db0960';
const taskId6 = '5219af31-e95a-489f-b56b-00042429ae74';
const taskId7 = '6a8b8857-7ecc-403c-b33e-a8ee842d9abe';
const taskId8 = 'cbd1d9a8-5164-4009-b75b-3fce275d00f2';
const taskId9 = 'ba11f7b8-1d75-4f55-8ed4-7ce723cb5c6c';
const taskId10 = '4508a926-dd81-44c4-9463-7b11e85beff2';

const tasks = atom<Task[]>([
  {
    id: taskId1,
    createdAt: getTimestamp(),
    projectId: projectId1,
    title: 'Design System',
    description: 'Create a comprehensive design system for the website',
    status: 'In Progress',
    dueDate: getTimestamp(),
    assigneeId: userId1,
  },
  {
    id: taskId2,
    createdAt: getTimestamp(),
    projectId: projectId1,
    title: 'Homepage Layout',
    description: 'Design and implement the new homepage layout',
    status: 'Todo',
    dueDate: getTimestamp(),
    assigneeId: null,
  },
  {
    id: taskId3,
    createdAt: getTimestamp(),
    projectId: projectId1,
    title: 'Contact Form',
    description: 'Add contact form with validation and email notifications',
    status: 'Done',
    dueDate: getTimestamp(),
    assigneeId: userId2,
  },
  {
    id: taskId4,
    createdAt: getTimestamp(),
    projectId: projectId2,
    title: 'User Authentication',
    description: 'Implement user authentication flow with social login',
    status: 'In Review',
    dueDate: getTimestamp(),
    assigneeId: userId2,
  },
  {
    id: taskId5,
    createdAt: getTimestamp(),
    projectId: projectId2,
    title: 'Push Notifications',
    description: 'Add support for push notifications',
    status: 'Todo',
    dueDate: getTimestamp(),
    assigneeId: null,
  },
  {
    id: taskId6,
    createdAt: getTimestamp(),
    projectId: projectId2,
    title: 'Offline Mode',
    description: 'Implement offline support with local data sync',
    status: 'In Progress',
    dueDate: getTimestamp(),
    assigneeId: userId3,
  },
  {
    id: taskId7,
    createdAt: getTimestamp(),
    projectId: projectId3,
    title: 'Database Schema',
    description: 'Design the database schema and create migrations',
    status: 'Done',
    dueDate: getTimestamp(),
    assigneeId: userId2,
  },
  {
    id: taskId8,
    createdAt: getTimestamp(),
    projectId: projectId3,
    title: 'Authentication API',
    description: 'Create endpoints for user authentication',
    status: 'In Progress',
    dueDate: getTimestamp(),
    assigneeId: userId2,
  },
  {
    id: taskId9,
    createdAt: getTimestamp(),
    projectId: projectId3,
    title: 'API Documentation',
    description: 'Write comprehensive API documentation',
    status: 'Todo',
    dueDate: getTimestamp(),
    assigneeId: null,
  },
  {
    id: taskId10,
    createdAt: getTimestamp(),
    projectId: projectId3,
    title: 'Rate Limiting',
    description: 'Implement rate limiting for API endpoints',
    status: 'Canceled',
    dueDate: getTimestamp(),
    assigneeId: userId2,
  },
]);

const commentId1 = 'c1';
const commentId2 = 'c2';

const comments = atom<Comment[]>([
  {
    id: commentId1,
    createdAt: getTimestamp(),
    taskId: taskId1,
    authorId: userId1,
    content: 'Great work on the design system!',
  },
  {
    id: commentId2,
    createdAt: getTimestamp(),
    taskId: taskId2,
    authorId: userId1,
    content: 'Great work on the design system!',
  },
]);
