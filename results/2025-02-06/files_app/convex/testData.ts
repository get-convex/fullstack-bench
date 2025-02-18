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
  parentId: string;
}

export interface Directory {
  id: string;
  name: string;
  type: "directory";
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

export function createProject(name: string, description: string, emoji: string) {
  console.log(`Unimplemented: Create project ${name} ${description} ${emoji}`);
}

export function deleteProject(projectId: string) {
  console.log(`Unimplemented: Delete project ${projectId}`);
}

export function useProject(projectId: string) {
  return initialProjects[projectId];
}

export function updateProjectMetadata(projectId: string, name?: string, description?: string, emoji?: string) {
  console.log(`Unimplemented: Update project metadata for ${projectId} to ${name} ${description} ${emoji}`);
}

const filesByProjectId: Record<string, Array<File | Directory>> = {
  "project-1": [
    {
      id: "dir-1",
      name: "src",
      type: "directory",
    },
    {
      id: "file-1",
      name: "README.md",
      type: "file",
      parentId: "dir-1",
      content: "# Marketing Website\n\nThis is the main website project.",
    },
    {
      id: "file-2",
      name: "index.html",
      type: "file",
      parentId: "dir-1",
      content: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Home</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n  </body>\n</html>",
    },
  ],
  "project-2": [
    {
      id: "dir-2",
      name: "app",
      type: "directory",
    },
    {
      id: "file-3",
      name: "README.md",
      type: "file",
      parentId: "dir-2",
      content: "# Mobile App\n\nCross-platform mobile application.",
    },
  ],
};

export function useFilePath(projectId: string, pathSegments: string[]) {
  const files = filesByProjectId[projectId] ?? [];
  // Start with the root.
  let current: { type: "directory", id?: string } | { type: "file", id: string }
    = { type: "directory" };

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
    return { type: "directory" as const, id: current.id, children };
  }
}

export function createFile(projectId: string, dirId: string | undefined, name: string, content: string) {
  console.log(`Unimplemented: Create file ${name} with content ${content} in project ${projectId}`);
}

export function createDirectory(projectId: string, dirId: string | undefined, name: string) {
  console.log(`Unimplemented: Create directory ${name} in project ${projectId}`);
}

export function renameFile(projectId: string, fileId: string, newName: string) {
  console.log(`Unimplemented: Rename file ${fileId} to ${newName} in project ${projectId}`);
}

export function deleteFile(projectId: string, fileId: string) {
  console.log(`Unimplemented: Delete file ${fileId} in project ${projectId}`);
}

export function editFile(projectId: string, fileId: string, content: string) {
  console.log(`Unimplemented: Edit file ${fileId} in project ${projectId}`);
}

const initialUsers: User[] = [
  {
    id: "user1",
    email: "test@test.com",
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

export function useUserByEmail(email: string) {
  return initialUsers.find(u => u.email === email);
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
    },
    {
      id: "2",
      subject: {
        type: "user",
        userId: "user2",
      },
    },
  ],
  "group2": [
    {
      id: "1",
      subject: {
        type: "user",
        userId: "user1",
      },
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
    },
  ],
  "project-2": [
    {
      id: "1",
      subject: {
        type: "user",
        userId: "user1",
      },
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
