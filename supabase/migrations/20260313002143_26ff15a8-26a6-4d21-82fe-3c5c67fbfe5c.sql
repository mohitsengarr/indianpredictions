
-- Enable pg_cron extension
create extension if not exists pg_cron with schema extensions;

-- Schedule the fetch-polymarket edge function every 5 minutes
select cron.schedule(
  'fetch-polymarket-every-5min',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://hivvemtveyjexrwgruhs.supabase.co/functions/v1/fetch-polymarket',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdnZlbXR2ZXlqZXhyd2dydWhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM0MTQ3NCwiZXhwIjoyMDg4OTE3NDc0fQ.P7MvIzW6aY5I5dMUTKDy7Y2ZmPG_Ei506WCukH8kFkc"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);
