import { notFound } from "next/navigation";

export interface Project {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export interface File {
  id: string;
  name: string;
  type: "file";
  content?: string;
  createdBy: string;
  createdAt: Date;
  modifiedAt: Date;
  parentId: string;
}

export interface Directory {
  id: string;
  name: string;
  type: "directory";
  createdBy: string;
  createdAt: Date;
  modifiedAt: Date;
  parentId?: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface Group {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  subject:
  | { type: "user"; userId: string }
  | { type: "group"; groupId: string };
  role: "owner" | "admin" | "member";
}

const initialProjects: Record<string, Project> = {
  "project-1": {
    id: "project-1",
    name: "Marketing Website",
    description: "Company marketing website redesign project",
    emoji: "🌐",
  },
  "project-2": {
    id: "project-2",
    name: "Mobile App",
    description: "Cross-platform mobile application development",
    emoji: "📱",
  },
};

export function useProjects() {
  return Object.values(initialProjects);
}

export function useProject(projectId: string) {
  return initialProjects[projectId];
}

const filesByProjectId: Record<string, Array<File | Directory>> = {
  "project-1": [
    {
      id: "dir-1",
      name: "src",
      type: "directory",
      createdBy: "user1",
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
    {
      id: "file-1",
      name: "README.md",
      type: "file",
      parentId: "dir-1",
      createdBy: "user1",
      createdAt: new Date(),
      modifiedAt: new Date(),
      content: "# Marketing Website\n\nThis is the main website project.",
    },
    {
      id: "file-2",
      name: "index.html",
      type: "file",
      parentId: "dir-1",
      createdBy: "user1",
      createdAt: new Date(),
      modifiedAt: new Date(),
      content: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Home</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n  </body>\n</html>",
    },
  ],
  "project-2": [
    {
      id: "dir-2",
      name: "app",
      type: "directory",
      createdBy: "user1",
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
    {
      id: "file-3",
      name: "README.md",
      type: "file",
      parentId: "dir-2",
      createdBy: "user1",
      createdAt: new Date(),
      modifiedAt: new Date(),
      content: "# Mobile App\n\nCross-platform mobile application.",
    },
  ],
};

export function useFilePath(projectId: string, pathSegments: string[]) {
  const files = filesByProjectId[projectId] ?? [];
  // Start with the root.
  let current: { type: "directory", id?: string } | { type: "file", id: string }
    = { type: "directory" };

  console.log(files, pathSegments);

  for (const segment of pathSegments) {
    if (current.type !== "directory") {
      console.error(`${pathSegments.join("/")} navigates within a file`);
      return null;
    }
    const entry = files.find((f) => f.parentId === current.id && f.name === segment);
    if (!entry) {
      return null;
    }
    current = { type: entry.type, id: entry.id };
  }
  if (current.type === "file") {
    const file = files.find((f) => f.id === current.id);
    if (!file || file.type !== "file") {
      return null;
    }
    return file;
  } else {
    const children = files.filter((f) => f.parentId === current.id);
    return { type: "directory" as const, children };
  }
}

const initialUsers: User[] = [
  {
    id: "user1",
    email: "john@example.com",
    isAdmin: true,
  },
  {
    id: "user2",
    email: "jane@example.com",
    isAdmin: false,
  },
];

export function useUsers() {
  return initialUsers;
}

export function useUser(userId: string) {
  return initialUsers.find(u => u.id === userId);
}

export function updateUserRole(userId: string, isAdmin: boolean) {
  console.log(`Unimplemented: Update user role for ${userId} to ${isAdmin}`);
}

export function inviteUser(email: string) {
  console.log(`Unimplemented: Invite user ${email}`);
}

export function removeUser(userId: string) {
  console.log(`Unimplemented: Remove user ${userId}`);
}

const initialGroups: Group[] = [
  {
    id: "group1",
    name: "Engineering",
  },
  {
    id: "group2",
    name: "Marketing",
  },
];

export function useGroups() {
  return initialGroups;
}

export function createGroup(name: string) {
  console.log(`Unimplemented: Create group ${name}`);
}

export function useGroup(groupId: string) {
  return initialGroups.find(g => g.id === groupId);
}

export function updateGroupName(groupId: string, name: string) {
  console.log(`Unimplemented: Update group name ${groupId} to ${name}`);
}

export function removeGroup(groupId: string) {
  console.log(`Unimplemented: Remove group ${groupId}`);
}

const initialGroupMembers: Record<string, Member[]> = {
  "group1": [
    {
      id: "1",
      subject: {
        type: "user",
        userId: "user1",
      },
      role: "owner"
    },
    {
      id: "2",
      subject: {
        type: "user",
        userId: "user2",
      },
      role: "admin"
    },
  ],
  "group2": [
    {
      id: "1",
      subject: {
        type: "user",
        userId: "user1",
      },
      role: "owner"
    },
  ]
}

export function addMemberToGroup(groupId: string, member: Member) {
  console.log(`Unimplemented: Add member ${JSON.stringify(member.subject)} to group ${groupId}`);
}

export function removeMemberFromGroup(groupId: string, memberId: string) {
  console.log(`Unimplemented: Remove member ${memberId} from group ${groupId}`);
}

export function useGroupMembers(groupId: string) {
  return initialGroupMembers[groupId] ?? [];
}

export const initialProjectMembers: Record<string, Member[]> = {
  "project-1": [
    {
      id: "1",
      subject: {
        type: "user",
        userId: "user1",
      },
      role: "owner",
    },
  ],
  "project-2": [
    {
      id: "1",
      subject: {
        type: "user",
        userId: "user1",
      },
      role: "owner",
    },
  ],
};

export function useProjectMembers(projectId: string) {
  return initialProjectMembers[projectId] ?? [];
}

export function addMemberToProject(projectId: string, member: Member) {
  console.log(`Unimplemented: Add member ${JSON.stringify(member.subject)} to project ${projectId}`);
}

export function removeMemberFromProject(projectId: string, memberId: string) {
  console.log(`Unimplemented: Remove member ${memberId} from project ${projectId}`);
}

export function updateProjectMemberRole(projectId: string, memberId: string, role: Member["role"]) {
  console.log(`Unimplemented: Update member ${memberId} role to ${role} in project ${projectId}`);
}