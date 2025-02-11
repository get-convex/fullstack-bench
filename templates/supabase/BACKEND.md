# Backend implementation

Use Supabase for implementing the backend.

Read the guidelines for using Supabase in the cursor rules.

Please set up the relevant tables for application state. Pause and
ask me to set up schema in the Supabase dashboard if needed, and I
will do it for you.

Then, connect these tables to the existing app's UI. Do NOT refactor or
modify the existing UI code in `components/` unless absolutely necessary.
You MUST keep all visual styling the same.

Make sure all changes are reflected immediately in the UI without a refresh,
even if they've happened in another browser.

The existing app is currently set up using in-memory state with Jotai
in the `lib/state` directory. Remove this directory ENTIRELY and reimplement it
using Supabase. Since the Supabase deployment is empty (other than auth),
make sure the app handles empty states gracefully. Keep the types in `lib/types.ts`
the same.

User authentication with Supabase is already fully set up in `middleware.ts`
and with the `app/login` and `app/auth` routes. Do NOT modify this code. Supabase auth provides the following `users` table:

```
id: uuid
email: text
raw_user_metadata: jsonb
```

Do NOT modify the auth setup or schema, and ALWAYS use the existing `users` table.

Within the app, use the `lib/BackendContext:useLoggedInUser` hook to get the current user. Do NOT modify this code.

The Supabase client is already set up in `lib/browserClient.ts`. Do NOT modify this code.

Use Next client components for the UI: do not bother with server rendering.

Run `bunx tsc -noEmit` to check for type errors across all files. Be sure to run
this command and fix all errors before considering yourself done.
