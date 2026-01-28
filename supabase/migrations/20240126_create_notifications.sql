create table public.notifications (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null references profiles(id) on delete cascade,
  actor_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('follow', 'comment', 'reply', 'like', 'upload')),
  entity_type text check (entity_type in ('recipe', 'post', 'comment', 'profile')),
  entity_id uuid not null,
  created_at timestamp with time zone default now(),
  is_read boolean default false,
  constraint notifications_pkey primary key (id)
);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_is_read on public.notifications(is_read);

-- RLS
alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Users can insert notifications" on public.notifications for insert with check (auth.uid() = actor_id);
