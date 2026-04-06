-- Analytics Events table for tracking user interactions
-- Apply manually in SQL Editor (no CLI/MCP required):
-- https://supabase.com/dashboard/project/hivvemtveyjexrwgruhs/sql/new

CREATE TABLE IF NOT EXISTS analytics_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  visitor_id text NOT NULL,
  session_id text NOT NULL,
  event_type text NOT NULL,
  page_url text,
  market_id text,
  category text,
  extra jsonb,
  geo_country text,
  geo_region text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for querying by time range
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events (timestamp DESC);

-- Index for querying by visitor
CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON analytics_events (visitor_id, timestamp DESC);

-- Index for querying by event type
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events (event_type, timestamp DESC);

-- Index for market-level aggregation
CREATE INDEX IF NOT EXISTS idx_analytics_market ON analytics_events (market_id, event_type) WHERE market_id IS NOT NULL;

-- Enable RLS (allow inserts from anon, reads from service role only)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from client SDK)
CREATE POLICY "Allow anonymous inserts" ON analytics_events
  FOR INSERT TO anon WITH CHECK (true);

-- Only service role can read (for analytics dashboards)
CREATE POLICY "Service role reads all" ON analytics_events
  FOR SELECT TO service_role USING (true);

-- Auto-delete events older than 90 days (optional — run as pg_cron)
-- SELECT cron.schedule('cleanup-analytics', '0 3 * * 0', $$DELETE FROM analytics_events WHERE timestamp < now() - interval '90 days'$$);
