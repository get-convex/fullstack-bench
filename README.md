# fullstack-bench

This is a (quite manual) eval for filling in the backend given a frontend app.

For each task, we have a Next.js app filled out that implements the given functionality
with all of its state in-memory within the browser.

Then, for each backend (currently just Convex and Supabase), we have a template that
layers on top of the task that implements auth and sets up the connection to the backend.
The template is generic and doesn't include any task-specific logic, however.

We call this layering "tangling" (in homage to TeX), where we take a given task and given
backend and create a directory as a starting point for Cursor.

## Installation

```
pdm install
```

## Setup the templates

Before starting, you need to configure the `.env.local` files in each template.

We have a few templates for Next apps with different backend stacks (Convex, Supabase).
These templates set up connections from the frontend to the backend and auth but don't
implement anything other than a basic "Hello World" homepage.

Then, we have a few tasks that are just Next apps that specify an app with only in-memory
state management.

Finally, a "tangling" process links the two together, making a task for filling out the
backend from a given task and backend.

### Convex template

```
cd templates/convex
bun i
bunx convex dev
```

Check that the `.env.local` file is present.

- [ ] TODO: We need to set up Convex auth on the deployment.

### Supabase template

```
cd templates/supabase
bun i
```

Set up a Supabase project and write out an `.env.local` file.

```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Running a test

First, tangle the desired task and backend into a directory within the `results` directory.

```
mkdir -p results/2025-01-31/todo_app
pdm run python -m tangle templates/supabase tasks/001-todo_app/project results/2025-01-31/todo_app/supabase
```

Then:

1. Open a new Cursor window to your results directory (e.g. `results/2025-01-31/todo_app/supabase`). 
2. Open Composer make sure you have it running in in agent mode. 
3. Copy the contents of `TASK.md` from this window for the task you are doing (e.g. `tasks/001-todo_app/TASK.md`) and paste that into composer in the other window.
4. Make sure to inclide the `BACKEND.md` in the context
5. Record my screen during this session and intervene as little as possible.
6. As composer is going keep a record of what you are doing in a `GRADING.txt` file in your results directory (e.g. `results/2025-01-31/todo_app/supabase/GRADING.txt`) see other results for examples on how this should look

This is all still very manual and takes ~30m per test.
