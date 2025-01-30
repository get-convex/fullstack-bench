# Fullstack bench

We have a few templates for Next apps with different backend stacks (Convex, Supabase).
These templates set up connections from the frontend to the backend and auth but don't
implement anything other than a basic "Hello World" homepage.

Then, we have a few tasks that are just Next apps that specify an app with only in-memory
state management.

Finally, a "tangling" process links the two together, making a task for filling out the
backend from a given task and backend.

# Setup

## Convex template

```
cd templates/convex
bun i
bunx convex dev
```

Check that the `.env.local` file is present.

## Supabase template

```
cd templates/supabase
bun i
```

Set up a Supabase project and write out an `.env.local` file.

```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
