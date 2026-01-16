create extension if not exists "pgcrypto";

-- Games table: one row per game
create table public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  short_description text,
  description text,
  release_year integer,
  cover_image_url text,
  map_image_url text,
  created_at timestamptz not null default now()
);

-- Guides table: guides / sections for each game
create table public.guides (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  title text not null,
  summary text,
  content text,
  category text,
  order_index integer default 0,
  created_at timestamptz not null default now()
);

create index guides_game_id_idx on public.guides (game_id);
create index guides_game_id_order_idx on public.guides (game_id, order_index);

-- Map markers: interactive points on each game's map
create table public.map_markers (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  label text not null,
  description text,
  category text,
  -- position on map as percentage (0-100)
  x_percent numeric(5,2) not null check (x_percent >= 0 and x_percent <= 100),
  y_percent numeric(5,2) not null check (y_percent >= 0 and y_percent <= 100),
  order_index integer default 0,
  created_at timestamptz not null default now()
);

create index map_markers_game_id_idx on public.map_markers (game_id);
create index map_markers_game_id_order_idx on public.map_markers (game_id, order_index);

-- (Optional) basic RLS policies, adjust as needed
alter table public.games enable row level security;
alter table public.guides enable row level security;
alter table public.map_markers enable row level security;

-- Allow read-only access for anonymous clients (for a public guide site)
create policy "Public read games"
  on public.games
  for select
  using (true);

create policy "Public read guides"
  on public.guides
  for select
  using (true);

create policy "Public read map_markers"
  on public.map_markers
  for select
  using (true);

-- =========================================================
-- Simple app auth (SHA-256 hashed password) via RPC
-- NOTE: This is NOT Supabase Auth; it's a minimal custom login.
-- Client hashes password with SHA-256 and calls the RPC functions.
-- =========================================================

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.app_users enable row level security;

-- Do not allow direct reads/writes from anon; use RPC instead.
revoke all on table public.app_users from anon, authenticated;

-- Create a user (sign up). Returns the new user id.
create or replace function public.create_user(
  p_username text,
  p_password_hash text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.app_users (username, password_hash)
  values (p_username, p_password_hash)
  returning id into v_id;

  return v_id;
exception
  when unique_violation then
    raise exception 'username_taken';
end;
$$;

-- Verify login. Returns user id if match, otherwise NULL.
create or replace function public.verify_login(
  p_username text,
  p_password_hash text
)
returns uuid
language sql
security definer
set search_path = public
as $$
  select id
  from public.app_users
  where username = p_username
    and password_hash = p_password_hash
  limit 1;
$$;

grant execute on function public.create_user(text, text) to anon, authenticated;
grant execute on function public.verify_login(text, text) to anon, authenticated;