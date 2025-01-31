This is a (quite manual) eval for filling in the backend given a frontend app.

For each task, we have a Next.js app filled out that implements the given functionality
with all of its state in-memory within the browser. 

Then, for each backend (currently just Convex and Supabase), we have a template that
layers on top of the task that implements auth and sets up the connection to the backend.
The template is generic and doesn't include any task-specific logic, however.

We call this layering "tangling" (in homage to TeX), where we take a given task and given
backend and create a directory as a starting point for Cursor.

# Installation
```
pdm install
```

## Setup the templates
Before starting, you need to configure the `.env.local` files in each template.

## Convex

```
cd templates/convex
bun i
bunx convex dev
```

Check that the `.env.local` file is present.

## Supabase

```
cd templates/supabase
bun i
```

Set up a Supabase project and write out an `.env.local` file.

```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

# Running a test

First, tangle the desired task and backend into a directory within the repo root.
```
pdm run python -m tangle templates/supabase tasks/001-todo_app/project 001-todo_app-supabase
```

Then, start a Cursor Composer session, using the `TASK.md` in the task directory and including the
backend-specific guidelines copied into the test directory.

I usually record my screen during this session and intervene as little as possible. 

Then, after grading, I usually write a `GRADING.txt` file and commit the output directory and grading file
to a branch. This is all still very manual and takes ~30m per test.
