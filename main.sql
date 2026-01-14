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