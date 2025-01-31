-- Create channels table
create table public.channels (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.channels is 'Chat channels that users can join and message in';

-- Create messages table
create table public.messages (
  id bigint generated always as identity primary key,
  channel_id bigint not null references public.channels(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.messages is 'Messages sent by users in chat channels';

-- Enable RLS
alter table public.channels enable row level security;
alter table public.messages enable row level security;

-- Create RLS policies for channels
create policy "Channels are viewable by all authenticated users"
on public.channels
for select
to authenticated
using (true);

create policy "Channels can be created by authenticated users"
on public.channels
for insert
to authenticated
with check (true);

-- Create RLS policies for messages
create policy "Messages are viewable by all authenticated users"
on public.messages
for select
to authenticated
using (true);

create policy "Messages can be created by authenticated users"
on public.messages
for insert
to authenticated
with check (auth.uid() = user_id);

-- Create realtime publication for messages with explicit configuration
drop publication if exists chat_pub;
create publication chat_pub for table messages, channels;
alter publication chat_pub owner to postgres;

-- Enable realtime for messages table
alter table messages replica identity full;