# Files Workspace App

We've sketched out the frontend for a files workspace app using Next.js and Jotai and would like to fill out the backend. Here is the app's data model:

- There is a single top-level workspace.
- The workspace has some number of users.
- Users can either be members or admins of a workspace.
- The workspace has some number of groups.
- Groups can be members of other groups, but groups MUST always form a tree. If the user attempts
  to modify a group to form a cycle or otherwise violate the tree invariant, fail the operation
  and notify the user.
- Users can be members of groups.
- The workspace has some number of projects. Projects have a name, description, and emoji. The name
  MUST be globally unique within the workspace. If a user attempts to create a project with a name
  that is already taken, fail the operation and notify the user.
- Users or groups can be members of projects.
- Projects have a root directory.
- Directories have named children, where every child has a unique name. Children
  can either be files or other directories, but the directory structure MUST form a tree. If
  an modification to the filesystem violates the tree invariant, fail the operation and notify
  the user. Note that this can be either introducing a cycle, having a duplicate name under
  a directory, or deleting a nonempty directory.
- Files have textual content.

## Access control

This application supports a flexible access control model where users and groups can be
members of projects and directories.

### Workspace access

- Workspace admins can add or remove users from the workspace and change their admin status.
- Workspace admins can create, delete, and modify groups.
- Workspace admins can create, delete, and modify projects.

### Project access

- If a user is a member of a project, they have access to the project.
- If a group is a member of a project, all of the group's members have access to the
  project. Note that this applies recursively: if a subgroup is a member of a group, all
  of the subgroup's members will also have access to the project.
- Anyone with access to a project can modify the project's metadata: name, description, and emoji.
- Anyone with access to a project can add or remove members from the project.
- Anyone with access to a project can create, read, rename, modify, and delete files and directories.

## Implementation

The app is implemented with Next.js and uses in-memory state management. The main components are:

### Pages

- `/` - Home page showing all accessible projects in the sidebar.
- `/workspace-admin` - Workspace administration page, only accessible to admins
- `/workspace-admin/users` - User administration page for listing all users, adding them, and removing them.
- `/workspace-admin/groups` - Group administration page for listing all groups and adding them.
- `/workspace-admin/groups/[groupId]` - Group administration page for listing a group's members, adding
  members, removing members, modifying the group's name, and deleting the group.
- `/workspace-admin/projects` - Project administration page for listing all projects, adding them,
  and deleting them.
- `/projects/[projectId]` - Project view linking to the project's files and settings. Clicking on the
  settings button opens a project settings modal.
- `/projects/[projectId]/files/[path]` - File view for a given file path. If the path points to a directory
  this shows a directory listing with actions to create a new file or directory, rename a child, delete
  or child, or click into a child. If the path points to a file, this shows the file viewer, which shows
  the file's content and has an action to edit the file.
- `/groups/[groupId]` - Group view listing the group's members.

You MUST implement all authorization rules, and it is UNACCEPTABLE for users to be able to
read or write state that they don't have access to.


# Backend implementation

Use Convex for implementing the backend.

Read the guidelines for writing apps on Convex in the cursor rules.

Please set up the relevant schema in Convex for the application state
and then write the appropriate queries and mutations for accessing and
modifying that state.

Then, connect the queries and mutations to the existing app's UI. Do NOT
refactor or modify the existing UI code in `components/` unless absolutely
necessary.

Make sure all changes are reflected immediately in the UI without a refresh,
even if they've happened in another browser.

The existing app is currently set up using in-memory state with Jotai
in the `lib/state` directory. Remove ALL of this code, along with the
test data in `lib/state/init.ts`, and reimplement it using Convex.

User authentication with Convex auth is already fully set up in `convex/auth.ts` and the corresponding `authTables` in `convex/schema.ts`. Convex auth provides the following `users` table:

```ts
import { defineTable } from "convex/server";
import { v } from "convex/values";

const users = defineTable({
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),
})
  .index("email", ["email"])
  .index("phone", ["phone"]);

const authTables = {
  users,
  // Other auth tables that are irrelevant for this task.
  ...
};
```

Only use the `_id` and `email` fields within the app. Do NOT modify the auth setup or schema, and ALWAYS use the existing
`users` table.

Within the app, use the `lib/BackendContext:useLoggedInUser` hook to get the current user. Do NOT modify this code.

The Convex client is already set up in `lib/BackendContext.tsx` and wired into `app/layout.tsx`. You can use `useQuery` and `useMutation` directly from `convex/react` along with the generated `api` object from `@/convex/_generated/api`. Do NOT modify this code.

Use Next client components for the UI: do not bother with server rendering.
