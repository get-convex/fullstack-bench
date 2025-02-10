import { atom, getDefaultStore, useAtom } from "jotai";
import { Project, Task, Comment, User } from "../types";
import { initialUsers, initialProjects, initialTasks, initialComments, getTimestamp } from "./init";

const store = getDefaultStore();

export function useUsers(): User[] | undefined {
  const [currentUsers, _] = useAtom(users);
  return currentUsers;
}

export function useUserByEmail(email: string): User | null | undefined {
  const [currentUsers, _] = useAtom(users);
  return currentUsers.find((user) => user.email === email) ?? null;
}

export function useProjects(): Project[] | undefined {
  const [currentProjects, _] = useAtom(projects);
  currentProjects.sort((a, b) => b.createdAt - a.createdAt);
  return currentProjects;
}

export async function addProject(name: string, emoji: string, description: string, creatorId: string) {
  const currentProjects = store.get(projects);
  const id = crypto.randomUUID();
  const newProject: Project = { id, createdAt: Date.now(), name, emoji, description, creatorId };
  store.set(projects, [...currentProjects, newProject]);
  return id;
}

export function useTasks(projectId: string): Task[] | undefined {
  const [currentTasks, _] = useAtom(tasks);
  return currentTasks.filter((task) => task.projectId === projectId);
}

export function useTask(taskId: string): Task | null | undefined {
  const [currentTasks, _] = useAtom(tasks);
  const task = currentTasks.find((task) => task.id === taskId);
  if (!task) {
    return null;
  }
  return task;
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

export function useComments(taskId: string): (Comment & { authorEmail: string })[] | undefined {
  const [currentComments] = useAtom(comments);
  const [currentUsers] = useAtom(users);
  const results = currentComments
    .filter((comment) => comment.taskId === taskId)
    .map((comment) => {
      const user = currentUsers.find((user) => user.id === comment.authorId);
      if (!user) {
        throw new Error(`User with id ${comment.authorId} not found`);
      }
      return {
        ...comment,
        authorEmail: user.email,
      };
    });
  results.sort((a, b) => a.createdAt - b.createdAt);
  return results;
}

export async function addComment(taskId: string, content: string, authorId: string) {
  const currentComments = store.get(comments);
  const id = crypto.randomUUID();
  const newComment: Comment = { id, createdAt: getTimestamp(), taskId, authorId, content };
  store.set(comments, [...currentComments, newComment]);
  return id;
}

const users = atom<User[]>(initialUsers);
const projects = atom<Project[]>(initialProjects);
const tasks = atom<Task[]>(initialTasks);
const comments = atom<Comment[]>(initialComments);
