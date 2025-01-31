-- Create enum for todo status
create type public.todo_status as enum (
  'todo',
  'in_progress',
  'in_review',
  'done',
  'canceled'
);

-- Create projects table
create table public.projects (
  id bigint generated always as identity primary key,
  name text not null,
  emoji text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.projects is 'Projects that contain todo items';

-- Enable RLS on projects
alter table public.projects enable row level security;

-- Create project_members table to track project membership
create table public.project_members (
  project_id bigint references public.projects (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);
comment on table public.project_members is 'Tracks which users are members of which projects';

-- Enable RLS on project_members
alter table public.project_members enable row level security;

-- Create todos table
create table public.todos (
  id bigint generated always as identity primary key,
  project_id bigint references public.projects (id) on delete cascade not null,
  title text not null,
  description text,
  status public.todo_status not null default 'todo',
  assignee_id uuid references auth.users (id) on delete set null,
  due_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.todos is 'Todo items that belong to projects';

-- Enable RLS on todos
alter table public.todos enable row level security;

-- Create comments table
create table public.comments (
  id bigint generated always as identity primary key,
  todo_id bigint references public.todos (id) on delete cascade not null,
  author_id uuid references auth.users (id) on delete set null not null,
  content text not null,
  created_at timestamptz not null default now()
);
comment on table public.comments is 'Comments on todo items';

-- Enable RLS on comments
alter table public.comments enable row level security;

-- Create RLS policies

-- Projects policies
create policy "Users can view projects they are members of"
on public.projects
for select
to authenticated
using (
  exists (
    select 1
    from public.project_members
    where
      project_members.project_id = projects.id
      and project_members.user_id = (select auth.uid())
  )
);

create policy "Users can create projects"
on public.projects
for insert
to authenticated
with check (true);

create policy "Users can update projects they are members of"
on public.projects
for update
to authenticated
using (
  exists (
    select 1
    from public.project_members
    where
      project_members.project_id = projects.id
      and project_members.user_id = (select auth.uid())
  )
)
with check (true);

create policy "Users can delete projects they are members of"
on public.projects
for delete
to authenticated
using (
  exists (
    select 1
    from public.project_members
    where
      project_members.project_id = projects.id
      and project_members.user_id = (select auth.uid())
  )
);

-- Project members policies
create policy "Users can view project members for their projects"
on public.project_members
for select
to authenticated
using (
  exists (
    select 1
    from public.project_members as pm
    where
      pm.project_id = project_members.project_id
      and pm.user_id = (select auth.uid())
  )
);

create policy "Users can add members to their projects"
on public.project_members
for insert
to authenticated
with check (
  exists (
    select 1
    from public.project_members
    where
      project_members.project_id = project_id
      and project_members.user_id = (select auth.uid())
  )
  or
  -- Allow users to add themselves as the first member when creating a project
  not exists (
    select 1
    from public.project_members
    where project_members.project_id = project_id
  )
);

create policy "Users can remove members from their projects"
on public.project_members
for delete
to authenticated
using (
  exists (
    select 1
    from public.project_members
    where
      project_members.project_id = project_members.project_id
      and project_members.user_id = (select auth.uid())
  )
);

-- Todos policies
create policy "Users can view todos in their projects"
on public.todos
for select
to authenticated
using (
  exists (
    select 1
    from public.project_members
    where
      project_members.project_id = todos.project_id
      and project_members.user_id = (select auth.uid())
  )
);

create policy "Users can create todos in their projects"
on public.todos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.project_members
    where
      project_members.project_id = project_id
      and project_members.user_id = (select auth.uid())
  )
);

create policy "Users can update todos in their projects"
on public.todos
for update
to authenticated
using (
  exists (
    select 1
    from public.project_members
    where
      project_members.project_id = todos.project_id
      and project_members.user_id = (select auth.uid())
  )
)
with check (true);

create policy "Users can delete todos in their projects"
on public.todos
for delete
to authenticated
using (
  exists (
    select 1
    from public.project_members
    where
      project_members.project_id = todos.project_id
      and project_members.user_id = (select auth.uid())
  )
);

-- Comments policies
create policy "Users can view comments on todos in their projects"
on public.comments
for select
to authenticated
using (
  exists (
    select 1
    from public.todos
    join public.project_members on project_members.project_id = todos.project_id
    where
      todos.id = comments.todo_id
      and project_members.user_id = (select auth.uid())
  )
);

create policy "Users can create comments on todos in their projects"
on public.comments
for insert
to authenticated
with check (
  exists (
    select 1
    from public.todos
    join public.project_members on project_members.project_id = todos.project_id
    where
      todos.id = todo_id
      and project_members.user_id = (select auth.uid())
  )
  and author_id = (select auth.uid())
);

-- Create updated_at triggers
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger handle_projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();

create trigger handle_todos_updated_at
  before update on public.todos
  for each row
  execute function public.handle_updated_at();