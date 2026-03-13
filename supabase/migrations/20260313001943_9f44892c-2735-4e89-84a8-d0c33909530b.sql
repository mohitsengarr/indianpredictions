
-- Cache table for Polymarket data fetched by the cron edge function
create table if not exists public.polymarket_cache (
  id text primary key,
  data jsonb not null,
  is_india boolean not null default false,
  volume numeric not null default 0,
  fetched_at timestamptz not null default now()
);

create index if not exists polymarket_cache_india_idx on public.polymarket_cache (is_india, volume desc);
create index if not exists polymarket_cache_fetched_idx on public.polymarket_cache (fetched_at desc);

alter table public.polymarket_cache enable row level security;
create policy "Public read polymarket_cache"
  on public.polymarket_cache for select
  to anon, authenticated
  using (true);

-- Metadata table for last-fetch timestamps
create table if not exists public.polymarket_meta (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.polymarket_meta enable row level security;
create policy "Public read polymarket_meta"
  on public.polymarket_meta for select
  to anon, authenticated
  using (true);
