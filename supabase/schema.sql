-- Extensions
create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('novelist','narrator')),
  handle text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  social_links jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Novels
create table if not exists public.novels (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body_text text not null,
  summary text not null,
  genre text not null,
  created_at timestamptz default now()
);

-- Audios
create table if not exists public.audios (
  id uuid primary key default gen_random_uuid(),
  novel_id uuid not null references public.novels(id) on delete cascade,
  narrator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  audio_url text not null,
  transcript_text text not null,
  genre text not null,
  created_at timestamptz default now()
);

-- Daily picks
create table if not exists public.daily_picks (
  pick_date date primary key,
  novel_ids uuid[] not null default '{}',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.novels enable row level security;
alter table public.audios enable row level security;
alter table public.daily_picks enable row level security;

-- profiles policies
create policy "profiles are viewable by everyone"
on public.profiles for select using (true);

create policy "users can insert own profile"
on public.profiles for insert with check (auth.uid() = id);

create policy "users can update own profile"
on public.profiles for update using (auth.uid() = id);

-- novels policies
create policy "novels are viewable by everyone"
on public.novels for select using (true);

create policy "novelist can insert own novels"
on public.novels for insert
with check (
  auth.uid() = author_id
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'novelist'
  )
);

create policy "author can update own novels"
on public.novels for update
using (auth.uid() = author_id);

-- audios policies
create policy "audios are viewable by everyone"
on public.audios for select using (true);

create policy "narrator can insert own audios"
on public.audios for insert
with check (
  auth.uid() = narrator_id
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'narrator'
  )
);

create policy "narrator can update own audios"
on public.audios for update
using (auth.uid() = narrator_id);

-- daily picks (read all / server role writes)
create policy "daily picks readable"
on public.daily_picks for select using (true);

-- Storage policy (run in SQL editor)
insert into storage.buckets (id, name, public)
values ('audios', 'audios', true)
on conflict (id) do nothing;

create policy "audio files public read"
on storage.objects for select
using (bucket_id = 'audios');

create policy "narrator uploads own files"
on storage.objects for insert
with check (
  bucket_id = 'audios' and auth.role() = 'authenticated'
);
