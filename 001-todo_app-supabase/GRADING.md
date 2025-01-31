# Attempt 1

Duration: 39:06

## Interventions

- 10:37: Seeing infinite recursion in project_members policy.
- 12:15: Proposed schema migration failed.
- 14:54: Still seeing infinite recursion error.
- 16:05: Creating a new project failed with an RLS error.
- 17:03: Still seeing RLS error on creation.
- 18:59: Hitting foreign key relationship error.
- 20:27: Still hitting foreign key relationship error.
- 22:32: Still hitting foreign key relationship error.
- 23:55: Comment rendering with Unknown author.
- 25:36: Trying to get new projects to show up without refresh.
- 26:58: Trying to enable realtime.
- 31:01: Project RLS rules incorrect, show all projects when creating a second user.
- 31:48: Infinite recursion regression
- 32:57: Failed to create project on second account.
- 33:34: Still broken.
- 34:57: Still broken.

# Attempt 2

Duration: 11:18

## Interventions

- Many: It kept on trying things with replication, asking if they
  worked, and me saying they didn't.

# Grading

- Did not get realtime working on first attempt. This seems to be a
  Supabase infrastructural issue?
- Realtime said it was working on the dashboard but Cursor couldn't
  figure it out.
- Things generally worked with a refresh but it felt jank.
- Couldn't get live updating or non-trivial state management working.
