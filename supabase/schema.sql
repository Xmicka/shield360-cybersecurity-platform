-- Shield360 — Supabase schema
-- Run this in the Supabase SQL editor (or via the CLI) to provision the
-- backend tables the app expects.

-- ─── profiles ───
create table if not exists profiles (
    id uuid references auth.users on delete cascade primary key,
    email text,
    display_name text,
    organization text,
    plan text default 'free',
    role text default 'admin',
    enabled_modules text[] default array[
        'endpoint-scanner','shadow-it','compliance-assistant','spear-phishing'
    ],
    created_at timestamptz default now(),
    last_login timestamptz default now()
);

-- ─── module_launches ───
create table if not exists module_launches (
    id bigint generated always as identity primary key,
    user_id uuid references profiles(id) on delete cascade,
    user_email text,
    module_slug text not null,
    module_name text,
    created_at timestamptz default now()
);
create index if not exists module_launches_slug_idx on module_launches(module_slug);
create index if not exists module_launches_created_idx on module_launches(created_at desc);

-- ─── activity_logs ───
create table if not exists activity_logs (
    id bigint generated always as identity primary key,
    user_id uuid references profiles(id) on delete cascade,
    user_email text,
    event text not null,
    module text,
    severity text check (severity in ('info','medium','high','critical')) default 'info',
    created_at timestamptz default now()
);
create index if not exists activity_logs_created_idx on activity_logs(created_at desc);

-- ─── module_usage ───
create table if not exists module_usage (
    id bigint generated always as identity primary key,
    user_id uuid references profiles(id) on delete cascade,
    module_slug text not null,
    month text not null, -- 'YYYY-MM'
    count integer default 0,
    unique (user_id, module_slug, month)
);

-- ─── Row-Level Security ───
alter table profiles enable row level security;
alter table module_launches enable row level security;
alter table activity_logs enable row level security;
alter table module_usage enable row level security;

-- profiles: users can read/update their own row; admins can read all.
create policy "profiles self read" on profiles for select using (auth.uid() = id);
create policy "profiles self update" on profiles for update using (auth.uid() = id);
create policy "profiles self insert" on profiles for insert with check (auth.uid() = id);

-- module_launches: users see their own launches; insert for self only.
create policy "launches self read" on module_launches for select using (auth.uid() = user_id);
create policy "launches self insert" on module_launches for insert with check (auth.uid() = user_id);

-- activity_logs: same pattern.
create policy "activity self read" on activity_logs for select using (auth.uid() = user_id);
create policy "activity self insert" on activity_logs for insert with check (auth.uid() = user_id);

-- module_usage: read/upsert own only.
create policy "usage self read" on module_usage for select using (auth.uid() = user_id);
create policy "usage self insert" on module_usage for insert with check (auth.uid() = user_id);
create policy "usage self update" on module_usage for update using (auth.uid() = user_id);

-- ─── Bootstrap profile on signup ───
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, display_name, organization)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.raw_user_meta_data->>'organization', '')
    )
    on conflict (id) do nothing;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
