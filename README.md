# Setup the templates

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
