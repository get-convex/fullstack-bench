# Backend implementation

Use Tanstack Query, FastAPI, and Redis for implementing the backend.

Read the guidelines for writing apps with these tools in the cursor rules.

Please design how you'd like to store the application's data in Redis and
then the API endpoints for how to read, write, and subscribe to this data.

Then, connect the API endpoints to the existing app's UI. Do NOT
refactor or modify the existing UI code in `components/` unless absolutely
necessary. You MUST keep all visual styling the same.

Make sure all changes are reflected immediately in the UI without a refresh,
even if they've happened in another browser.

The existing app is currently set up using in-memory state with example data in
`lib/exampleData.ts`. Start by DELETING this file and then reimplementing its
behavior using the backend.

Since the Redis database is empty (other than auth), make sure the
app handles empty states gracefully. Keep the types in `lib/types.ts` the same.

On the server, ALWAYS use the Redis client already instantiated at `server/db.py`.

User authentication is already fully set up in `server/auth.py`, `server/main.py`,
and `lib/BackendContext.tsx`. Within the app use the `lib/BackendContext:useLoggedInUser`
hook to get the current user. Do NOT modify any of this code.

Use the `backendFetch` function in `lib/BackendContext.tsx` to talk to the server. Use
Tanstack Query's `useQuery` hook for state management, and its context is already
set up within `lib/BackendContext.tsx`. Do NOT modify this code.

Use Next client components for the UI: do not bother with server rendering.

Run `bun typecheck` from the app's root directory to check for type errors
across all files. Be sure to run this command and fix all errors before considering
yourself done.
