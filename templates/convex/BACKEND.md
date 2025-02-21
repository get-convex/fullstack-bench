# Backend implementation

Use Convex for implementing the backend.

Read the guidelines for writing apps on Convex in the cursor rules.

Please set up the relevant schema in Convex for the application state
and then write the appropriate queries and mutations for accessing and
modifying that state.

Then, connect the queries and mutations to the existing app's UI. Do NOT
refactor or modify the existing UI code in `components/` unless absolutely
necessary. You MUST keep all visual styling the same.

Make sure all changes are reflected immediately in the UI without a refresh,
even if they've happened in another browser.

The existing app is currently set up using in-memory state with example data in
`lib/exampleData.ts`. Start by DELETING this file and then reimplementing its
behavior using Convex.

Since the Convex deployment is empty (other than auth), make sure the
app handles empty states gracefully. Keep the types in `lib/types.ts` the same except
for ID types, which you should change from `id: string` to `_id: Id<"example">`
for the appropriate table, and creation times, which you should change from
`createdAt: number` to `_creationTime: number`.

User authentication with Convex auth is already fully set up in `convex/auth.ts` and the corresponding `authTables` in `convex/schema.ts`. Convex auth provides the following `users` table:

```ts
import { defineTable } from "convex/server";
import { v } from "convex/values";

const users = defineTable({
  email: v.optional(v.string()),
  // Other auth fields that are irrelevant for this task. Only use the `email` field.
  ...
})
  .index("email", ["email"])
  .index("phone", ["phone"]);

const authTables = {
  users,
  // Other auth tables that are irrelevant for this task. Only use the `users` table.
  ...
};
```

Within the server, ALWAYS use the `getAuthUserId` function from `@convex-dev/auth/server` to get the current user.

```ts
import { getAuthUserId } from "@convex-dev/auth/server";

const userId = await getAuthUserId(ctx);
if (!userId) {
  throw new Error("Not authenticated");
}
const user = await ctx.db.get(userId);
if (!user) {
  throw new Error(`User ${userId} not found`);
}
```

Do NOT modify the setup in `convex/auth.ts` or the `authTables` in `convex/schema.ts`.

Within the app, use the `lib/BackendContext:useLoggedInUser` hook to get the current user. Do NOT modify this code.

The Convex client is already set up in `lib/BackendContext.tsx` and wired into `app/layout.tsx`. You can use `useQuery` and `useMutation` directly from `convex/react` along with the generated `api` object from `@/convex/_generated/api`. Do NOT modify this code.

Use Next client components for the UI: do not bother with server rendering.

# Typechecking and deployment

Run `bun typecheck` from the app's root directory to check for type errors
across all files. Be sure to run this command and fix all errors before considering
yourself done.

Run `bun push-convex` after making changes to the `convex/` folder to
push code to the backend. This will also regenerate the `convex/_generated`
folder, so if you're seeing type errors related to the `api` object, you may
need to re-run this command.
