We've sketched out the frontend for a basic chat app in @project using Next.js and Jotai and would like to fill out the backend.

- The chat app supports authentication
- There are multiple channels, and all users have access to all channels.
- Channels can have messages, and users can post messages into any channel.


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
test data in `lib/state/init.ts`, and reimplement it using Convex. Since
the Convex deployment is empty (other than auth), make sure the app handles
empty states gracefully.

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
