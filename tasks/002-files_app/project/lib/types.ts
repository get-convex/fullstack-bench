export interface User {
  id: string;
  email: string;
}

export interface UserPermissions {
  id: string;
  createdAt: number;
  userId: string;
  isAdmin: boolean;
}

export interface Project {
  id: string;
  createdAt: number;
  name: string;
  description: string;
  emoji: string;
  rootDirectoryId: string;
}

export interface ParentEdge {
  directoryId: string;
  name: string;
}

export interface Directory {
  id: string;
  createdAt: number;
  parentEdge?: ParentEdge;
}

export interface File {
  id: string;
  createdAt: number;
  parentEdge: ParentEdge;
  content: string;
}

export interface Group {
  id: string;
  createdAt: number;
  name: string;
}

export interface Member {
  id: string;
  createdAt: number;

  subject:
  | { type: "user"; userId: string }
  | { type: "group"; groupId: string };

  object:
  | { type: "project"; projectId: string }
  | { type: "group"; groupId: string }
}

export type Node =
  | ({ type: "file" } & File)
  | ({ type: "directory"; children: Node[] } & Directory);
