# Backlink & Outreach Kit — indiapredictions.com

Everything drafted and ready to use. Primary link to submit everywhere:
**https://www.indiapredictions.com/data** (the API docs page — lists accept it
where a marketing homepage gets rejected). API endpoint:
`https://www.indiapredictions.com/api/markets`.

**The strategic hook (fresh as of May 2026):** India blocked Polymarket and
Kalshi (MeitY orders; domestic opinion-trading apps shut down too). A
watch-only, no-money tracker is the compliant way to still *see* those odds —
lead with this angle in every pitch.

---

## 1. GitHub list PRs — ✅ OPENED (28 Jun 2026, under @mohitsengarr)

| Repo | PR | Notes |
|---|---|---|
| aarora4/Awesome-Prediction-Market-Tools (553★) | https://github.com/aarora4/Awesome-Prediction-Market-Tools/pull/128 | Best topical fit, merges fast |
| public-apis/public-apis (446k★) | https://github.com/public-apis/public-apis/pull/6471 | Huge reach; strict, may sit for weeks |
| spfunctions/awesome-prediction-markets | https://github.com/spfunctions/awesome-prediction-markets/pull/14 | Under APIs & SDKs → Polymarket |
| marcelscruz/public-apis (9.2k★) | https://github.com/marcelscruz/public-apis/pull/983 | Actively merging |

A daily scheduled check monitors these and reports merges/feedback.
If a maintainer requests changes, ask Claude to amend the PR.

Skipped intentionally: 0xperp/awesome-prediction-markets (stale since 2023),
two single-digit-star lists (negligible value; can add later for volume).

---

## 2. Product Hunt — 🟡 draft ready, needs images + launch

- Account: @mohit_sengar (created via Google OAuth).
- Draft at https://www.producthunt.com/posts/new/submission with name, tagline,
  description, tags (Data & Analytics, Sports, Investing), URL, thumbnail, and
  the maker first-comment already filled.
- **Remaining (owner):** upload 2–3 gallery images (homepage, /markets, and
  https://www.indiapredictions.com/api/og?id=666818 saved as PNG), then pick the
  launch moment — Tue–Thu, early-morning US time performs best.

**Tagline:** Live prediction market odds for India – free, no betting

**Long description (reusable for any directory):**
> India Predictions is a free, watch-only tracker that aggregates live
> Polymarket odds for the events Indians actually care about — IPL and cricket,
> state and national elections, RBI rate decisions and Nifty, crypto, and
> Bollywood. There's no real money, no account, and no betting: you just see
> the crowd's probability in real time. It ships with a free, CORS-enabled
> public JSON API (no key required), embeddable per-market odds widgets,
> per-market social images, and a weekly digest — so developers, data desks,
> and writers can pull or embed the odds anywhere. With offshore prediction
> markets now blocked in India, it's the compliant way to follow the same odds
> without placing a bet.

---

## 3. Journalist-source platforms — 🔴 password-gated (owner signs up, ~5 min)

- Connectively (ex-Featured/HARO): https://www.connectively.us/sign-up
- Qwoted: https://app.qwoted.com/users/sign_up ("I'm Looking to Earn Media")

Both require creating a password (no Google login), so these are owner-only.
Once registered, Claude drafts every query response.

---

## 4. Data-PR pitch template (swap the hook per beat)

**Subject:** What the market thinks the RBI will do — free odds you can cite

> Hi [First name],
>
> Ahead of the [DATE] MPC, I run a free tracker that aggregates live
> crowd-probability odds on the decision — right now it's showing **[X]% for a
> hold vs. [Y]% for a cut**, which is [in line with / ahead of / behind] the
> economist consensus. Thought it might be useful for [outlet / column].
>
> Since Polymarket and Kalshi were blocked in India, there's no legal way for
> readers to see these odds — indiapredictions.com is watch-only (no money, no
> account), so it's safe to reference.
>
> To make it zero-friction:
> - Live market page with the current %: [specific URL]
> - Free CORS-enabled JSON API for your data desk:
>   https://www.indiapredictions.com/api/markets
>   (docs: https://www.indiapredictions.com/data)
> - Embeddable per-market widget for your CMS, plus a ready social image
>
> Happy to send a quick snapshot or a short "what the odds say" note for
> [event]. No attribution required, though a link back is appreciated.
>
> Best,
> Mohit Sengar — Founder, indiapredictions.com

**Targets & timing:**
- **RBI MPC** (send ~48h before each decision): Mint "Plain Facts", Andy
  Mukherjee (@andymukherjee70), Vivek Kaul.
- **Ban angle** (send now — freshest): writers of the CoinDesk and entrackr
  pieces on the Polymarket/Kalshi India block.
- **Elections**: ThePrint, Scroll, IndiaSpend, Sanjay Kumar (@_sanjaykumar) —
  "beyond exit polls: an independent probability signal."
- **Listicles**: predscope.com/guide/polymarket-alternatives,
  bleap.finance "best prediction market platforms", Finextra "Polymarket
  alternatives" — pitch adding an India/regional row.

---

## 5. Reddit / Quora answer (post as yourself, genuinely helpful)

For questions like *"With Polymarket/Kalshi blocked in India, is there any way
to still see prediction-market odds on Indian events?"* (r/IndiaInvestments,
r/CryptoIndia, Quora):

> Short version: you can still **watch** the odds, you just can't legally place
> a bet from India anymore.
>
> After the May 2026 blocking orders, the real-money platforms (Polymarket,
> Kalshi) went dark here, and domestic opinion-trading apps shut down. But the
> underlying odds are still public data. A few things worth knowing:
>
> - **The distinction that matters:** taking bets / holding money is what got
>   banned. Displaying aggregated probabilities is just data, like a poll
>   average.
> - If you want to follow India-specific events (elections, IPL/cricket, RBI
>   decisions, crypto, Bollywood), there's a free watch-only tracker that
>   aggregates the Polymarket odds for exactly these markets:
>   indiapredictions.com. No account, no money. There's also a free public
>   JSON API if you want the numbers in a spreadsheet or bot.
> - **Sanity-check whatever you read:** these are thin markets — a single large
>   order can swing a number. Treat the odds as one signal, not gospel;
>   compare against polls or model-based win probabilities before reading too
>   much into a move.

---

## 6. Remaining targets & sequencing

1. **Now (owner):** AlternativeTo (Cloudflare human-check, then social login),
   Connectively + Qwoted signups, ban-angle pitches.
2. **Rolling:** RBI pitch 48h before each MPC; election pitches in season;
   listicle outreach.
3. **After first press mention lands:** add India Predictions to Wikipedia's
   "Prediction market" article (needs a reliable secondary source or it gets
   reverted — do this LAST).
