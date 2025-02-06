# Files Workspace App

We've created a files workspace app with the following functionality:

## Features

### Workspace Management

- Single workspace for the app
- Global set of users associated with the workspace
- Workspace admins can:
  - Add/remove users from the workspace
  - Set whether a user is a workspace admin
  - Manage groups at the workspace level

### Projects

- Workspaces have multiple projects
- Projects have:
  - Names
  - Descriptions
  - System-generated IDs
  - Emojis
- Workspace admins can add/remove projects

### File System

- Projects have a root directory
- Directories can contain:
  - Files
  - Other directories
- Files track:
  - Creator (user)
  - Creation time
  - Last modification time
- File system is a tree structure:
  - Connected
  - All nodes have single parent
  - No cycles

### Access Control

- Users can be members of groups
- Groups can be members of other groups
- Users/groups can be project members with roles:
  - Readers: Can view project, list files, open files
  - Writers: Can create/delete files and directories, edit files
  - Admins: Can edit project metadata and change project membership

## Implementation

The app is implemented with Next.js and uses in-memory state management. The main components are:

### Pages

- `/` - Home page showing all accessible projects
- `/projects/[projectId]` - Project view with file browser and viewer
- `/workspace-admin` - Workspace administration page

### Components

- Project list sidebar (shared across pages)
- File browser
- File viewer
- Project admin modal
- Workspace admin interface

### State Management

All state is managed in-memory using React's useState hook:

- Users and their roles
- Groups and their memberships
- Projects and their metadata
- Files and directories
- Project permissions

The app is ready to be connected to a backend service for persistent storage and real-time updates.
