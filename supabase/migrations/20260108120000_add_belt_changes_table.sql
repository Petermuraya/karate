-- Create belt_changes audit table to record instructor-assigned belt changes
create table if not exists public.belt_changes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  changed_by uuid not null,
  old_belt text,
  new_belt text not null,
  created_at timestamptz default now()
);

create index if not exists idx_belt_changes_user_id on public.belt_changes (user_id);
create index if not exists idx_belt_changes_changed_by on public.belt_changes (changed_by);
create index if not exists idx_belt_changes_created_at on public.belt_changes (created_at);
