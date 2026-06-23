# India Predictions — Owner Runbook (account-side tasks)

Everything in the codebase for the SEO/AEO + growth plan is shipped and live.
These four items need **your** account access — I can't log into your Google,
Bing, Supabase-owner, or social accounts. Each is copy-paste; total ~20 min.

Do them in this order — #1 unlocks conversion data, #4 unblocks the live-market
data the whole site depends on.

---

## 1. Mark GA4 Key Events (~2 min) — makes "conversions" register

The events are already firing to GA4 (`G-TLW3N9MB4M`). You just flag which ones count.

1. Open **GA4 → Admin → Events** (property: India Predictions).
2. First confirm data is flowing: **Reports → Realtime**, open the site in another
   tab, click a market / "View on Polymarket" / star a market — you should see
   `market_click`, `polymarket_click`, `watchlist_add` appear within ~30s.
3. Back in **Admin → Events**, toggle **"Mark as key event"** on:
   - `polymarket_click`   ← primary conversion (user acted on a market)
   - `newsletter_submit`
   - `watchlist_add`
   - `market_click`
   - (optional) `digest_view`
4. They'll show as Key Events / conversions within ~24h in reports (instantly in Realtime).

If you see NO events in Realtime after 5 min: hard-refresh the site, check an
ad-blocker isn't blocking `googletagmanager.com`, and confirm the GA4 ID is
`G-TLW3N9MB4M`.

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

## 4. Rotate Supabase service key (~5 min) — unblocks LIVE markets ⭐ highest impact

This is why `/markets`, the category hubs, "Races to Watch" and "Biggest Movers"
currently show only stale/closed markets: the Polymarket cache can't refresh
without a working `SUPABASE_SERVICE_KEY`, and the project `hivvemtveyjexrwgruhs`
is owned by a **different Supabase account** than the others you're logged into.

1. Log into the Supabase account that **owns** project `hivvemtveyjexrwgruhs`
   (NOT the Lovable / Sengar Consultancy / Prediction Markets US account — those
   returned "no access"). It's likely the original email used when the app's
   Supabase was first created.
2. **Settings → API → Project API keys → `service_role` → Reset/Roll.** Copy the new key.
3. GitHub → repo **Settings → Secrets and variables → Actions** →
   `New repository secret` (or Update) named **`SUPABASE_SERVICE_KEY`** → paste → Save.
   URL: https://github.com/mohitsengarr/indianpredictions/settings/secrets/actions
4. While you're in that Supabase project's **SQL Editor**, also run the
   `analytics_events` migration (so analytics persists server-side too):
   paste the contents of `supabase/migrations/20260402_create_analytics_events.sql`
   and Run.
5. Tell me **"secret is set"** — I'll trigger the "Refresh Polymarket Cache"
   workflow and verify the cache fills with ~11 open India markets + 600 global,
   after which every market section across the site goes live automatically
   (and re-runs every 6h).

> Note: if you can't locate the owning account, the alternative is to point the
> app at a NEW Supabase project in an account you control — I'd update `.env` and
> run all migrations. Say the word and I'll set that up instead.

---

### After all four
- GA4 conversions reporting (24h), Direct % dropping, GSC/Bing indexing the
  176-URL sitemap, and live open markets sitewide.
- Then the P2 backlog is worth it: YouTube→site funnel, programmatic event pages,
  the weekly digest as an actual email.
