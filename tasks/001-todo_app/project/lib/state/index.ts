import { atom, getDefaultStore, useAtom } from "jotai";
import { Project, Task, Comment, User } from "../types";
import { initialUsers, initialProjects, initialTasks, initialComments, getTimestamp } from "./init";

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

const users = atom<User[]>(initialUsers);
const projects = atom<Project[]>(initialProjects);
const tasks = atom<Task[]>(initialTasks);
const comments = atom<Comment[]>(initialComments);
