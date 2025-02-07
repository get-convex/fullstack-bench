# Supabase

We've sketched out the frontend for a basic TODO app in @project and would like to fill out the backend using Supabase.
The app currently only uses in-memory state for its state management.

- The TODO app supports authentication
- There are multiple projects, and users can create projects.
- Only the project creator can invite other users to the project and remove them.
- Users can only see projects they are a member of.
- Projects can have a name, emoji, and description.
- TODO items belong to a single project.
- Users can only see TODO items in projects they are a member of.
- TODO items can be assigned to a user.
- TODO items can be marked as Todo, In Progress, In Review, Done, or Canceled.
- TODO items can have a title, description, and due date.
- Users can see all other users when reassigning a TODO item.
- Comments can be added to a TODO item.
- Comments have an author, content (markdown stored as plain text), and a creation time.
- Comments cannot be edited or deleted.

Read the guidelines for using Supabase in the cursor rules.

Please...

1. Set up the tables for storing projects and TODO items. Pause and ask me to set up schema in the Supabase dashboard if needed, and I will do it for you.
2. Query and modify these tables from the UI.
3. Make sure that all changes are reflected immediately in the UI without a refresh, even if they've happened in another browser.

# Convex

We've sketched out the frontend for a basic TODO app in @project and would like to fill out the backend using Convex.
The app currently only uses in-memory state for its state management.

- The TODO app supports authentication
- There are multiple projects, and users can create projects.
- Only the project creator can invite other users to the project and remove them.
- Users can only see projects they are a member of.
- Projects can have a name, emoji, and description.
- TODO items belong to a single project.
- Users can only see TODO items in projects they are a member of.
- TODO items can be assigned to a user.
- TODO items can be marked as Todo, In Progress, In Review, Done, or Canceled.
- TODO items can have a title, description, and due date.
- Users can see all other users when reassigning a TODO item.
- Comments can be added to a TODO item.
- Comments have an author, content (markdown stored as plain text), and a creation time.
- Comments cannot be edited or deleted.

Read the guidelines for writing apps on Convex in the cursor rules.

Please...

1. Set up the tables for storing projects, TODO items, and comments in Convex.
2. Write queries and mutations for reading and writing the appropriate data.
3. Wire in these endpoints into the app's UI.
