-- Cache table for scraped trending events (populated daily by Firecrawl cron)
create table if not exists public.trending_events_cache (
  id text primary key,
  slug text not null,
  title text not null,
  category text not null,
  status text not null default 'active',
  summary text not null,
  image_url text,
  data jsonb not null,           -- full TrendingEvent object
  source_url text,               -- where the event was scraped from
  scraped_at timestamptz not null default now()
);

create index if not exists trending_events_cache_category_idx on public.trending_events_cache (category);
create index if not exists trending_events_cache_scraped_idx on public.trending_events_cache (scraped_at desc);

alter table public.trending_events_cache enable row level security;
create policy "Public read trending_events_cache"
  on public.trending_events_cache for select
  to anon, authenticated
  using (true);

-- Allow service role to insert/update (for the scraper)
create policy "Service insert trending_events_cache"
  on public.trending_events_cache for insert
  to service_role
  with check (true);

create policy "Service update trending_events_cache"
  on public.trending_events_cache for update
  to service_role
  using (true);

-- Metadata entry for tracking scrape runs
insert into public.polymarket_meta (key, value, updated_at)
values ('last_events_scrape', 'never', now())
on conflict (key) do nothing;
