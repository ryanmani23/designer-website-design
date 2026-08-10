# Instagram Live Feed — Go-Live Runbook

This turns the About-page Instagram section from the hand-curated grid into a
**live, auto-updating feed** (latest posts of any type — photos, reels, videos,
carousels), cached on our own Cloudflare Workers infrastructure.

**Design does not change.** Only the *source* of the tiles changes. If the API
or token ever fails, the page automatically falls back to the curated grid, so
the section can never render empty.

---

## How it works (architecture)

```
Cron (every 6h)  ─►  Worker `scheduled` handler
                      1. GET https://graph.instagram.com/me/media  (latest 12)
                      2. download each image / video thumbnail
                      3. store images in R2, write a manifest (JSON) to KV
                      4. weekly: refresh the 60-day token, re-store in KV

/about visitor  ─►  <InstagramFeed> fetches  /api/instagram
                      └─ Worker returns the KV manifest (fast, edge-cached)
                      └─ on empty/error → curated fallback grid
```

- **Token stays server-side** (in KV, never in the page or the git repo).
- **Images are re-hosted on our domain** (Instagram's CDN URLs expire — that's
  why a live feed must cache them, not hot-link).
- **Zero third-party JavaScript** — protects the PageSpeed scores.

---

## PART A — Meta / Instagram setup (Ryan does this; needs your login)

I can't do this part — it's under your Instagram/Meta account and involves
credentials. Meta occasionally renames these screens; the flow below is current
as of setup. Ping me if a screen doesn't match and I'll re-check.

### A1. Make the account a Professional account
- Instagram app → **Settings and privacy** → **Account type and tools** →
  **Switch to professional account** → choose **Business** (or Creator).
- Free. This is the prerequisite for any API access.

### A2. Create a Meta Developer app — BUSINESS type
1. Go to **developers.facebook.com** → log in → **My Apps** → **Create App**.
2. Name it something like `Priority Designer Website Feed`.
3. When asked, **select the "Business" app type.** (This is what exposes the
   Instagram API. Do NOT pick the "Embed Facebook, Instagram and Threads content
   in other websites" use case — that is **oEmbed**, which only embeds specific
   known posts using Instagram's own styled card + JS, needs App Review +
   Business Verification, and cannot list your latest posts. Wrong tool for us.)

### A3. Open Instagram → API setup with Instagram business login
1. In the app dashboard **left sidebar**, click **Instagram**. (If it's not
   there yet, add the **Instagram** product.)
2. Click **"API setup with Instagram business login."**
3. Scope in play is `instagram_business_basic` (read profile + media) — nothing
   more. This is the modern replacement for the retired Basic Display API and
   does NOT require a linked Facebook Page.

### A4. Generate the access token
1. On that same **API setup with Instagram business login** panel, click
   **"Generate token"** next to **@prioritydesignerroofs**.
2. Log into Instagram and authorize → **copy the access token** (long string).
3. **No App Review and no Business Verification are required** — you're only ever
   reading your OWN account. (App Review is only for "Advanced Access" to other
   people's accounts, which this integration never touches.)
4. **Do not paste the token into chat** — it goes into a secret in Part B. If the
   generated token is short-lived, we'll exchange it for a 60-day long-lived one
   during setup (needs the App Secret); our cron then auto-refreshes it weekly so
   it never lapses.

### A5. Send Ryan → me
- ✅ the **App ID** (public, fine to share)
- ✅ the **App Secret** — copy it but keep it **private** (may be needed to mint
  the 60-day token; it goes into a secret, not chat)
- ✅ confirmation the account is Professional (Business/Creator)
- The **token** goes straight into a secret in Part B — I never need to see it.

---

## PART B — Provision Cloudflare + go live (we do together)

These are the exact commands. They create the storage, seed the token, and
deploy. Run them from the repo root. (I'll walk you through each when you're
ready — `npx wrangler login` first if you're not authed.)

### B1. Create the KV namespace (stores the manifest + token)
```bash
npx wrangler kv namespace create IG_KV
```
Paste the returned `id` into `wrangler.jsonc` (replace `REPLACE_WITH_KV_ID`).

### B2. Create the R2 bucket (stores the cached images)
```bash
npx wrangler r2 bucket create designer-ig-media
```

### B3. Seed the access token into KV (the one secret input)
```bash
npx wrangler kv key put --binding=IG_KV ig_token "PASTE_LONG_LIVED_TOKEN_HERE"
```
This is the only place the token lives — server-side, never in the repo.

### B4. Deploy
```bash
npm run build && npx wrangler deploy
```

### B5. Trigger the first feed pull (cron would otherwise wait up to 6h)
```bash
curl -X POST "https://prioritydesigner.com/api/instagram/refresh?key=SEED_KEY"
```
(Or I can trigger the scheduled handler manually via `wrangler` — we'll confirm
the first pull populated KV, then load /about to see live tiles.)

---

## Verification checklist (I run this once B is done)
- [ ] `/api/instagram` returns a non-empty JSON array of latest posts
- [ ] Each `image` path (`/ig-media/…`) loads from R2 on our domain
- [ ] /about shows the latest posts, newest first, incl. any reels/videos
      (video tiles show a play badge; thumbnail used as the still)
- [ ] Kill/rename the token → page falls back to the curated grid (no empty hole)
- [ ] Token auto-refresh writes a fresh token to KV after ~7 days

---

## Notes / options for later
- **Post count:** currently shows the latest **6** (keeps the 3×2 grid). Easy to
  bump to 8/9/12.
- **Image size:** we store Instagram's original JPG. If tiles ever feel heavy we
  can add Cloudflare Image Resizing on the `/ig-media/` route (webp + width cap).
- **Captions:** live tiles show the first line of the IG caption (hashtags
  stripped), falling back to "View on Instagram" when a post has no caption.
- **Staging:** `wrangler.staging.jsonc` needs its own KV/R2 namespaces if you
  want the live feed on staging too — otherwise staging keeps the curated grid.
