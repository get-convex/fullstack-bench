import { Directory, File, Group, Member, Project, User, UserPermissions } from "../types";

let base = (new Date("2025-02-04 12:00:00")).getTime();

function getTimestamp() {
  base += 1000 * 60;
  return base;
}

// User IDs
export const userId1 = 'c54555b3-5df1-4862-9aea-664ad2e66b05';
export const userId2 = '7496e663-3efc-48fc-92d2-8196979bb400';
export const userId3 = '00a325f0-8b02-4cb4-9dab-31716deb06ec';

// User Permissions IDs
export const userPermissionsId1 = '4bb7fc1a-26e5-4257-ab73-c078978dd3ea';

// Group IDs
export const groupId1 = 'eb14e9af-550b-450a-a013-3150af981d73';
export const groupId2 = '68bc9408-31e9-4d05-a48e-6b01d9d861ab';

// Project IDs
export const projectId1 = '612f5792-803f-4f7c-a212-d589cabef963';
export const projectId2 = '7c63d483-9fcc-4ad8-bf39-713a7cae6d0c';

// Directory IDs
export const dirId1 = '71d40a46-98b7-48f9-9af3-cd4f086346ac';
export const dirId2 = '770a1d3c-9aae-4a0c-89c8-f3beb713c596';
export const dirId3 = '58d1b6f4-115b-44b3-9d09-97108833ad46';
export const dirId4 = '77b6d70f-c4ab-43eb-b90a-a87d7c4353d5';

// File IDs
export const fileId1 = '1479ac76-53c2-49a2-907c-3cd90ee9bb59';
export const fileId2 = 'c935cd89-f356-4430-8516-81ccf288d27a';

// Membership IDs
export const membershipId1 = '25b1c169-60ea-433f-bbcf-4b7046ecf865';
export const membershipId2 = '24071117-2e0f-4b9c-a3bf-c8cd4572af60';
export const membershipId3 = '0ec00959-d4cf-49a7-bf4c-46df6d2c393b';
export const membershipId4 = 'be5624c6-e9c3-4d9a-9fe9-db0b897e3221';
export const membershipId5 = '239201e7-e2b5-49ce-adda-5512efb533cc';
export const membershipId6 = 'ef905329-5daf-4ef1-a86d-55ac91648480';

// Initial States
export const initialUsers: User[] = [
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
];

export const initialUserPermissions: UserPermissions[] = [
  {
    id: userPermissionsId1,
    userId: userId1,
    isAdmin: true,
    createdAt: getTimestamp(),
  },
];

export const initialGroups: Group[] = [
  {
    id: groupId1,
    name: 'Engineering',
    createdAt: getTimestamp(),
  },
  {
    id: groupId2,
    name: 'Marketing',
    createdAt: getTimestamp(),
  },
];

export const initialProjects: Project[] = [
  {
    id: projectId1,
    name: 'Marketing Website',
    description: 'Company marketing website redesign project',
    emoji: '🌐',
    createdAt: getTimestamp(),
    rootDirectoryId: dirId1,
  },
  {
    id: projectId2,
    name: 'Mobile App',
    description: 'Cross-platform mobile application development',
    emoji: '📱',
    createdAt: getTimestamp(),
    rootDirectoryId: dirId2,
  },
];

export const initialDirectories: Directory[] = [
  {
    id: dirId1,
    createdAt: getTimestamp(),
  },
  {
    id: dirId2,
    createdAt: getTimestamp(),
  },
  {
    id: dirId3,
    createdAt: getTimestamp(),
    parentEdge: { directoryId: dirId1, name: 'src' },
  },
  {
    id: dirId4,
    createdAt: getTimestamp(),
    parentEdge: { directoryId: dirId2, name: 'app' },
  },
];

export const initialFiles: File[] = [
  {
    id: fileId1,
    createdAt: getTimestamp(),
    parentEdge: { directoryId: dirId3, name: 'index.html' },
    content: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Home</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n  </body>\n</html>",
  },
  {
    id: fileId2,
    createdAt: getTimestamp(),
    parentEdge: { directoryId: dirId4, name: 'README.md' },
    content: "# Mobile App\n\nCross-platform mobile application.",
  },
];

export const initialMembers: Member[] = [
  {
    id: membershipId1,
    createdAt: getTimestamp(),
    subject: {
      type: 'user',
      userId: userId1,
    },
    object: {
      type: 'project',
      projectId: projectId1,
    },
  },
  {
    id: membershipId2,
    createdAt: getTimestamp(),
    subject: {
      type: 'user',
      userId: userId2,
    },
    object: {
      type: 'project',
      projectId: projectId1,
    },
  },
  {
    id: membershipId3,
    createdAt: getTimestamp(),
    subject: {
      type: 'user',
      userId: userId1,
    },
    object: {
      type: 'group',
      groupId: groupId1,
    },
  },
  {
    id: membershipId4,
    createdAt: getTimestamp(),
    subject: {
      type: 'user',
      userId: userId1,
    },
    object: {
      type: 'group',
      groupId: groupId2,
    },
  },
  {
    id: membershipId5,
    createdAt: getTimestamp(),
    subject: {
      type: 'user',
      userId: userId2,
    },
    object: {
      type: 'group',
      groupId: groupId2,
    },
  },
  {
    id: membershipId6,
    createdAt: getTimestamp(),
    subject: {
      type: 'group',
      groupId: groupId1,
    },
    object: {
      type: 'group',
      groupId: groupId2,
    },
  },
];

