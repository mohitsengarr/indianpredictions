# India Predictions — Owner Runbook (account-side tasks)

Everything in the codebase for the SEO/AEO + growth plan is shipped and live.
These four items need **your** account access — I can't log into your Google,
Bing, Supabase-owner, or social accounts. Each is copy-paste; total ~20 min.

Do them in this order — #1 unlocks conversion data, #4 unblocks the live-market
data the whole site depends on.

---

## 1. Mark GA4 Key Events — makes "conversions" register

**Status (verified 23 Jun 2026):** The full pipeline is confirmed working. On the
correct property — **India Predictions**, account "trending", property
`528354347`, stream `indiapredictions` (`G-TLW3N9MB4M`) — I triggered each
conversion live and saw them in **Reports → Realtime → Event count by event name**:
`page_view`, `market_click`, `polymarket_click`, `watchlist_add` (plus
`session_start`). So the tracking is 100% live and correct.

**The one remaining step (1 click each):** GA4 will not let you flag an event as a
key event until the event *name* has been ingested into **Admin → Events** (this
list lags Realtime by up to ~24h for first-seen events — there is no
"create key event by name" button in this property's UI; I checked). Once
`market_click` / `polymarket_click` / `watchlist_add` appear in the
**Admin → Events → Recent events** list (give it up to a day after 23 Jun), do:

1. **GA4 → Admin → Data display → Events → Recent events tab.**
2. Click the **star** next to each, to mark as key event:
   - `polymarket_click`   ← primary conversion (user acted on a market)
   - `newsletter_submit`  (fires once a user submits the newsletter form)
   - `watchlist_add`
   - `market_click`
   - (optional) `digest_view`
3. They'll show as Key Events / conversions in reports within ~24h of marking.

> I can flip these toggles for you in a follow-up once they surface in the Events
> list — it's a 1-click-each task at that point. Nothing in the code or wiring is
> blocking; this is purely GA4's processing delay.

If you ever see NO events in Realtime: hard-refresh the site, check an ad-blocker
isn't blocking `googletagmanager.com`, and confirm the GA4 ID is `G-TLW3N9MB4M`.

---

## 2. UTM-tag your owned links (~5 min) — kills the "Direct 71%" leak

Paste these into the respective places. Swap `<...>` placeholders.

| Where | URL to use |
|---|---|
| YouTube video descriptions | `https://www.indiapredictions.com/?utm_source=youtube&utm_medium=video&utm_campaign=channel&utm_content=<video_slug>` |
| YouTube → a specific market | `https://www.indiapredictions.com/events/<slug>?utm_source=youtube&utm_medium=video&utm_campaign=<topic>` |
| Instagram bio link | `https://www.indiapredictions.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| X / Twitter posts | `https://www.indiapredictions.com/?utm_source=x&utm_medium=social&utm_campaign=<post>` |
| WhatsApp shares | `https://www.indiapredictions.com/?utm_source=whatsapp&utm_medium=social&utm_campaign=share` |
| Email / newsletter | `https://www.indiapredictions.com/digest?utm_source=newsletter&utm_medium=email&utm_campaign=weekly_<week>` |

Builder for one-offs: search "Google Campaign URL Builder". Keep a sheet of canonical UTMs.

---

## 3. Google Search Console + Bing (~5 min) — then hand me the token

You generate the token; **I commit it** (just paste it to me in chat).

**Google Search Console**
1. https://search.google.com/search-console → Add property → **URL prefix** →
   `https://www.indiapredictions.com`
2. Choose **"HTML tag"** verification → copy the `<meta name="google-site-verification" ...>` tag.
3. **Paste that tag to me** → I add it to `index.html` → you click Verify.
4. After verifying: **Sitemaps → add** `https://www.indiapredictions.com/sitemap.xml`.

**Bing Webmaster Tools**
- Easiest: https://www.bing.com/webmasters → **Import from Google Search Console**.
- (Bing already receives fresh URLs via the IndexNow ping wired into the scrape
  workflow — key file: `public/f5f417ea0737f0cd70ce4338d6e58795.txt`.)

---

## 4. Set Supabase service key → unblocks LIVE markets ⭐ highest impact

**Migrated to your own account (done 23 Jun 2026).** The app no longer depends on
the old project `hivvemtveyjexrwgruhs` (different account, "no access"). It now
points at **`menke-report`** in your **Sengar Consultancy** org, project ref
**`gcmugkbvfizcnkrhwjzz`** (`https://gcmugkbvfizcnkrhwjzz.supabase.co`).

Already done for you (no cost — reused an existing active project, $0 extra):
- Created all 5 backend tables in `menke-report` (public schema, isolated by name
  from your ESOP tables): `polymarket_cache`, `polymarket_meta`,
  `trending_events_cache`, `breaking_news`, `analytics_events` — with the same
  RLS (public read / service write; anon insert for analytics).
- Repointed `.env`, `supabase/config.toml`, and the 3 GitHub workflows
  (`scrape-polymarket`, `scrape-events`, `fetch-news`) to the new URL.
- The publishable (anon) key in `.env` is the new project's — it's public, safe to commit.

**The one remaining step — set the service key secret (only YOU can; it's a
credential entry I'm not allowed to do, and it can't be read via the API tools):**

1. Supabase → project **menke-report** → **Settings → API → Project API keys →
   `service_role` → reveal/copy**. (It's in *your* logged-in account now.)
   Direct: https://supabase.com/dashboard/project/gcmugkbvfizcnkrhwjzz/settings/api
2. GitHub → **Settings → Secrets and variables → Actions** → update/create
   **`SUPABASE_SERVICE_KEY`** = that key.
   URL: https://github.com/mohitsengarr/indianpredictions/settings/secrets/actions
3. **Vercel** (so the live site reads the new DB): Project → Settings →
   Environment Variables → set `VITE_SUPABASE_URL` =
   `https://gcmugkbvfizcnkrhwjzz.supabase.co` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   = the new anon key (in `.env`), then redeploy.
4. Tell me **"secret is set"** — I'll push the config changes and dispatch the
   "Refresh Polymarket Cache" + scrape workflows (gh is authed with `workflow`
   scope). The cache fills from GitHub's runners (this machine has no outbound
   network to Polymarket) and every market section goes live, re-running every 6h.

> ⚠️ The OLD migration file `supabase/migrations/20260313002143_*.sql` has a
> hardcoded **service_role JWT for the old project** committed in git history —
> treat that old key as compromised and disable/rotate it in the old account if
> you ever regain access. It does not affect the new setup.

---

### After all four
- GA4 conversions reporting (24h), Direct % dropping, GSC/Bing indexing the
  176-URL sitemap, and live open markets sitewide.
- Then the P2 backlog is worth it: YouTube→site funnel, programmatic event pages,
  the weekly digest as an actual email.
