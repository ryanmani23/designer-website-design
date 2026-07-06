# Priority Designer — SEO Assessment & Roadmap
**Date:** July 2, 2026 · **Prepared for:** Ryan & Jack · **Scope:** prioritydesigner.com (organic + Google map pack)

All numbers in this document are real data pulled today from Semrush (US database), live Google SERPs, Google Maps (Dallas viewport), and direct inspection of the live site and codebase. Google Search Console does not yet exist for this domain (see Finding #1) — that is itself the first action item.

---

## 1. Executive summary

**The good news: this niche is wide open.** The #1 organic competitor for "slate roof repair dallas" (Southern Slate Roofing) has an Authority Score of 7, twenty-three ranked keywords, and ~111 visits/month. The map pack for slate/tile queries is held by generic storm-chaser roofers with zero specialty credibility — no true slate/tile/copper specialist owns local. Keyword difficulty on our whole target list runs 0–30 (trivially low; 60+ is what "roofing dallas" looks like). And we have a weapon nobody else has: **priorityroofs.com (Priority Roofing, the sister company) has Authority Score 25, 7K organic visits/month, 1,100 referring domains, and a 5.0★/958-review GBP in the same building.** That is more SEO authority than every niche competitor combined.

**The bad news: the site is currently invisible.** Google has indexed **exactly one page** — the homepage. Zero organic keywords, zero organic traffic, Authority Score 2. Three compounding causes: (1) no Search Console property exists, so no sitemap has ever been submitted to Google; (2) every subpage canonical points to a `.html` URL that 307-redirects back to the clean URL — a signal conflict that gives Google permission to drop the page; (3) the body content is client-rendered React into an empty `#root`, which slows and de-prioritizes indexing for a brand-new, zero-authority domain.

**The strategy is unchanged and validated by the data:** win the luxury/restoration niche. The plan below fixes indexing in week 1, ships the blog + landing pages in month 1–2, runs a review engine to fix the map pack, and uses priorityroofs.com plus manufacturer locators for authority. Every must-win keyword has a checkpoint date.

---

## 2. Where we stand today (measured, not guessed)

| Metric | prioritydesigner.com | Source |
|---|---|---|
| Pages indexed by Google | **1 of 7** (homepage only) | `site:` query, live Google |
| Semrush Authority Score | 2 | Semrush Domain Overview |
| Organic keywords / traffic | 0 / 0 | Semrush |
| Referring domains / backlinks | 43 / 68 (mostly legacy from the old Vermont site history) | Semrush |
| GSC property | **Does not exist** (checked both Google accounts) | GSC |
| GBP | Exists & verified: "Priority Designer Roofing - Historic Exteriors", 1420 W Mockingbird Ln #460, (609) 668-1419, ~1–2 reviews | Google Maps |
| GBP brand search | Searching "Priority Designer" in Maps **auto-redirects to Priority Roofing's profile** — our entity is too weak to win its own name | Google Maps |
| PSI | Mobile 84 / Desktop 96 — not a ranking blocker, park it | prior work |
| Site schema NAP | Placeholder phone `+1-214-555-0100` / `hello@prioritydesigner.com` in homepage JSON-LD; GBP says (609) 668-1419 — **mismatch** | live HTML |

---

## 3. Technical SEO audit — ranked by ranking impact

### 3.1 CRITICAL — ~~No Google Search Console property~~ → DONE 7/2; here's what it shows
**Update 7/2:** Ryan added the domain property (data since 6/21; sitemap was submitted 6/22 and read successfully — 7 URLs discovered). What GSC proves, checked page by page:
- `https://prioritydesigner.com/about` (clean URL) → **"URL is unknown to Google"** — never discovered at all. No sitemap lists the clean URLs and the nav links that point to them are client-rendered, so Google has literally never heard of them.
- `https://prioritydesigner.com/about.html` (sitemap URL) → **"Discovered — currently not indexed", last crawl N/A** — Google has had it 10 days and hasn't spent the crawl budget. Typical rationing for a brand-new AS-2 domain, made worse by the fact that when it does crawl, it'll hit a 307 redirect.
- Performance (6/21–6/30): 2 clicks, 30 impressions, avg position 51, three queries only — "roofing contractor in dallas 75212/75220" and "priority roofing". Zero niche-term visibility.

**Remaining fix, in strict order:** (1) fix the 6 canonicals + merge so the live sitemap lists clean URLs; (2) **then** URL-Inspect → Request Indexing each of the 7 clean URLs + each blog article (do NOT request indexing before the canonical fix is live — you'd be asking Google to crawl pages whose canonical points at a redirect); (3) add the site to Bing Webmaster Tools.

### 3.2 CRITICAL — Canonical → redirect conflict on all 6 subpages (fix: day 1, one line each)
Live site serves `/about` but its canonical says `.../about.html`, which 307-redirects back to `/about`. Google treats a canonical that redirects as a broken signal and may simply not index the page — which matches exactly what we observe (only the homepage, whose canonical is clean, is indexed). The prod sitemap also still lists the `.html` URLs. The `seo-blog-content` branch fixes the sitemap and the blog articles but **not** the 6 hand-authored page canonicals — they still say `.html` in about/portfolio/materials/discontinued/blog/contact.html.
**Fix:** change the 6 canonicals (+ their `og:url`) to extensionless before merging. This plus GSC submission is very likely enough to get all 7 pages indexed within 1–3 weeks.

### 3.3 HIGH — Client-rendered SPA body (honest read: real liability, but not the emergency it looks like)
The main pages render into an empty `#root` via `dist/*.js`. My honest assessment:
- **What's fine:** title, meta description, canonical, OG, and JSON-LD are all static in the HTML head (verified live). Google *can* render client-side React and has for years. CWV is good.
- **What's not fine:** for a brand-new domain with zero authority, rendering-queue delays mean slower, flakier indexing and content updates that take weeks to be re-seen. Body text and internal links (nav is also JS-rendered) are invisible on first-pass crawl, so link discovery depends on the sitemap and the render queue. On a competitive SERP, a fully-static competitor page wins the tie.
- **Verdict:** the blog build system is the right architecture and already proves the fix. **Do not do an emergency React SSR migration.** Sequence it: (a) fix 3.1/3.2 first and measure — indexing of the 7 SPA pages will likely resolve; (b) build ALL new pages (geo/material landers) with the static `build-blog.mjs`-style generator, never as SPA pages; (c) as a Phase-2 item, pre-render the 6 main pages' *content* into the HTML at build time (the components already render deterministic markup; `react-dom/server` at build time in `build.mjs`, hydrate on load). That last step also likely fixes the LCP-behind-the-intro issue and could push mobile PSI into the 90s as a side effect.

### 3.4 HIGH — Schema/NAP placeholder + entity confusion with Priority Roofing
The homepage RoofingContractor JSON-LD still has the placeholder phone/email; GBP uses (609) 668-1419 and suite #460. Google builds the local entity by cross-matching site NAP ↔ GBP ↔ citations; right now they disagree, and our entity is being absorbed by/losing to "Priority Roofing" next door (same building, similar name, same website family).
**Fix (needs 2 answers from Jack):** the *permanent* phone and email for Priority Designer. Then: (1) put real NAP + `streetAddress` + `geo` into the JSON-LD; (2) add `sameAs: [Instagram URL]`; (3) make the footer, contact page, schema, and GBP character-identical; (4) consider whether (609) — a New Jersey number — should be replaced with a Dallas 214/469 number that forwards; local area code is a soft trust/relevance signal for both users and local ranking. Also add `LocalBusiness`-level schema to the contact page and `BreadcrumbList` sitewide (cheap wins).

### 3.5 MEDIUM — Sitemap hygiene on the branch
The new generated sitemap has **future `lastmod` dates** (2026-07-08 → 2026-08-05) for blog posts. If those are staggered *planned* publish dates: don't ship URLs before they're live, and never ship future lastmod (Google ignores or distrusts it). Emit lastmod = actual publish date, and only include published articles. Also: `priority`/`changefreq` are ignored by Google — harmless, but lastmod is the one field that matters and it must be truthful.

### 3.6 LOW — Fine as-is
- robots.txt: Google fully allowed (the Cloudflare-managed block only affects AI-training bots — that's a business choice, not an SEO problem; note it does block some AI-answer engines from citing us, which you may want to revisit later given AI search growth).
- CWV/PSI 84/96: above the bar; not a differentiator in this niche either way.
- Blog article pages (staging): verified excellent — ~1,000 words fully in HTML, clean canonical, BlogPosting schema, correct OG. This is the template for everything new.
- Internal linking: once blog pages are live, their static nav/footer links give Google crawlable paths to the main pages (another reason to merge soon). Add 2–3 in-body contextual links per article to /materials, /discontinued, /contact and future landers.

---

## 4. Competitive landscape

### 4.1 Organic (blue links) — measured
| Competitor | Authority | Org. keywords | Org. traffic/mo | Ref. domains | Notes |
|---|---|---|---|---|---|
| **Southern Slate Roofing** (southernslateroof.com) | **7** | 23 | 111 | 21 | The direct rival: slate-only specialist, HP/UP references, single-page-ish site. Currently wins "slate roof repair dallas". |
| **Ramon Roofing** (ramonroofing.com) | **13** | 810 | 1.1K | 214 | Fort Worth clay-tile specialist, decades old, real content depth. The realistic 12-month benchmark. |
| KPost, Eclat, Wortham Bros, Peak, T Rock | ~10–25 | — | — | — | Volume/commercial roofers with one slate/tile service page each; rank on domain age, not specialization. |
| **priorityroofs.com (ours, sister co.)** | **25** | 6,400 | 7K | 1,100 | Already ranks for DFW tile-roofing terms. Biggest single asset available to us. |
| prioritydesigner.com (us) | 2 | 0 | 0 | 43 | Starting line. |
| National discontinued-tile players: tileroofs.com, rooftilesolutions.com, northernrooftiles.com, RWC boneyard | — | — | — | — | Own the "discontinued roof tiles" SERP nationally; none has DFW presence or restoration-contractor angle. |

**Organic gap analysis — what page-1 holders have that we don't:** (1) they're indexed; (2) a dedicated URL per service ("/slate-roofing/", "/clay-tile-roofing/") with the keyword in title/H1; (3) domain age. That's genuinely it — content depth is mostly thin (Southern Slate is a brochure site), schema is rare, backlink profiles are small (21–214 ref domains). **What we'll have that they don't:** 21 real luxury projects with photos, the discontinued-tile matching story (nobody in DFW tells it), manufacturer relationships, and priorityroofs.com's authority.

### 4.2 Map pack — measured (Dallas/Park Cities viewport, "slate roof repair")
Pack + adjacent results: T Rock 4.9★(762) [also buying ads], Blue Hammer 4.9★(1,289), Built To Last 4.9★(270), Roofing Ranger 5.0★(390), Superior One 5.0★(261), Artisan 5.0★(118), Eclat 4.8★(25), and The Roof Tile & Slate Co (a supply store, 4.6★/30). **All generic "Roofing contractor" category; none is a restoration specialist.** They win purely on review mass + proximity + engagement.

**Our GBP:** exists and verified ("Priority Designer Roofing - Historic Exteriors"), but ~1–2 reviews, and so weak that Maps redirects even a branded "Priority Designer" search to Priority Roofing's profile.

**Map-pack gap analysis:** review count and velocity (they add 10–40/month; we add ~0), photo volume, posting activity, and service/category completeness. Proximity we can't change; relevance we can dominate (Google increasingly rewards category/services match for niche queries — a profile whose services literally say "slate roof repair, clay tile restoration, copper roofing, discontinued tile matching" competes for those queries against generic profiles with more reviews). Realistic expectation, stated honestly: **we will not out-review Blue Hammer's 1,289.** We don't need to. For niche queries ("slate roof repair", "tile roof repair" in the Park Cities viewport), 40–75 keyword-rich reviews + exact-match services + weekly photo/post activity is competitive within 6–9 months. For generic "roofer near me" we will never be in the pack — and per strategy, we don't care.

---

## 5. Keyword strategy — the must-win list

Semrush US data pulled 2026-07-02. Volumes on geo terms look tiny (10–50/mo) — that's normal for hyper-local luxury services and understates reality (searches fragment across "near me", neighborhood names, and Maps searches that keyword tools can't see). The buyer value per click is enormous: one slate restoration ≈ six figures.

### Tier 1 — MUST-WIN, local commercial intent (target: page 1 organic + map pack by month 6)
These are the money terms. We commit to page 1.

| Keyword | Vol/mo (US) | KD | Target page | Page-1 ETA |
|---|---|---|---|---|
| slate roof repair dallas | 50 | **2** | /slate-roofing-dallas lander | Mo. 3–5 |
| slate roofing dallas | 20 | ~low | same lander | Mo. 3–5 |
| clay tile roof repair dallas | ~10 | ~low | /clay-tile-roofing-dallas lander | Mo. 3–5 |
| tile roof repair dallas / fort worth | ~10 | ~low | clay-tile lander (+FW variant) | Mo. 4–6 |
| copper roofing dallas | 10 | ~low | /copper-roofing-dallas lander | Mo. 4–6 |
| roof restoration dallas | 30 | ~low | homepage + /about | Mo. 4–6 |
| historic roofing contractors (+ dallas variants) | 70 | **4** | homepage/about | Mo. 4–6 |
| highland park / university park / westlake / southlake roofing-material combos | 0–320* | 9–21 | geo landers built from real portfolio jobs | Mo. 5–8 |

*"westlake roofing" (320/mo) and "southlake roofing" (90/mo) are partly navigational (other firms named Westlake/Southlake Roofing) — target the material-qualified versions ("slate roof repair westlake", etc.) on the geo landers rather than the bare city term.

### Tier 2 — MUST-WIN, national informational (blog; target: page 1 by month 4–8)
Low KD + we already wrote most of these articles. These build topical authority that powers Tier 1.

| Keyword | Vol/mo | KD | Asset | Page-1 ETA |
|---|---|---|---|---|
| how long does a slate roof last | 720 | **9** | article LIVE on staging | Mo. 2–4 |
| tile roof restoration | 720 | **10** | needs article or materials-page section | Mo. 3–6 |
| clay tile roof repair | 320 | **2** | matching-discontinued article + clay lander | Mo. 2–4 |
| standing seam copper roof | 480 | **0** | copper article LIVE on staging | Mo. 2–4 |
| copper roof cost | 480 | 14 | copper article (add cost section) | Mo. 3–6 |
| slate roof maintenance | 320 | 16 | estate-roof-care article LIVE on staging | Mo. 3–6 |
| discontinued roof tiles (+ variants) | 30+ | **0** | discontinued article + /discontinued page | Mo. 2–4 |
| synthetic slate roofing | 1,300 | 23 | slate-vs-synthetic article LIVE on staging | Mo. 4–8 |
| slate roof cost | 1,300 | 27 | cost article LIVE on staging (needs Jack's real ranges) | Mo. 5–9 |

### Tier 3 — Stretch (12-month plays; pursue, don't promise)
- **slate roof repair** (3,600/mo, KD 11) — national head term; KD is low but the SERP localizes heavily. Top-10 plausible by month 9–12 once authority builds; treat as upside.
- **ludowici roof tile** (590/mo, KD 30) — navigational to the manufacturer; win the long-tail instead ("discontinued ludowici tile", "ludowici tile repair") via the discontinued library.
- **slate roofing contractors** (390/mo, KD 37) — directory-heavy SERP; revisit at month 9.

### Explicitly NOT targeting (per locked strategy)
"roofing dallas", "roof repair dallas", "roofing companies dallas", storm/hail terms — storm-chaser budgets, KD 50+, wrong customer.

---

## 6. Roadmap

### Phase 0 — "Turn the lights on" (Week 1–2) — *Effort: ~1 day of work total*
1. Fix the 6 subpage canonicals + og:url → extensionless. Strip the "note to Jack" from the cost article (or hold that one article back). Fix sitemap future-lastmod. **Merge `seo-blog-content` → main.**
2. ~~Create GSC domain property + submit sitemap~~ **DONE (7/2 / 6/22)**. After the merge deploys: URL-Inspect → Request Indexing on all 7 clean URLs + each live blog article. Add the site to Bing Webmaster Tools (free, 2 min, feeds DuckDuckGo/Copilot — can import straight from GSC).
3. Get from Jack: permanent phone + email → fix homepage JSON-LD NAP; align footer/contact/GBP exactly. Decide on a 214/469 tracking number (recommended) vs keeping (609).
4. GBP quick pass (2 hrs): primary category "Roofing contractor"; add secondary "Roof repair service"; fill **Services** with exact-match items (slate roof repair, clay tile roof repair/restoration, copper roofing, discontinued tile matching, historic roof restoration); business description with materials + neighborhoods; upload 30+ project photos (geo-relevant, from the 21 portfolio jobs); turn on messaging; weekly Posts cadence.
- **Checkpoint (end of week 3):** GSC shows ≥7 pages indexed; `site:prioritydesigner.com` returns all core pages; blog articles indexed. *If SPA pages are still not indexed by week 4 → escalate build-time pre-render (Phase 2, item 3) to immediate.*

### Phase 1 — Review engine + measurement rails (Weeks 2–6, parallel) — *the single biggest map-pack lever*
1. **Review system (owner: Jack + office):** past-client sweep first — personally ask the ~21 portfolio clients + recent repairs (aim: 15–25 reviews in 60 days; even 10 transforms a 1-review profile). Then systematize: every completed job → same-week ask, text + email with the direct review link (`g.page/r/...` short link), owner sends it personally (luxury clients respond to Jack, not to automation). Ask happy clients to *mention the material and city* ("slate roof in Highland Park") — review text is a local ranking input. Target velocity: 4–6/month sustained. Never incentivize (policy violation).
2. **Position tracking (Semrush):** create a Position Tracking campaign, device=mobile, location=**Dallas, TX (city level)**, tracking the Tier 1+2 list above; enable the **map-pack/local tracking** toggle so we see 3-pack presence separately. Add a second location for Fort Worth. Weekly email report to Ryan.
3. **Citations/NAP:** after NAP is final, run Semrush Listing Management (or manually: Yelp, Angi, Houzz, BBB, Nextdoor, Apple Maps, Bing Places, Facebook) with the identical NAP. Houzz especially — it's where estate homeowners actually look.
- **Checkpoint (month 2):** GBP ≥15 reviews; position tracking baseline captured; NAP identical everywhere.

### Phase 2 — Content build-out (Months 2–4) — *Effort: the main ongoing workstream*
1. **Geo + material landing pages** (static generator, NOT SPA): start with 4 material pages (slate/clay-tile/copper/discontinued-matching, each "…Dallas–Fort Worth"), then 4–6 geo pages (Highland Park, University Park, Preston Hollow, Westlake/Southlake, Fort Worth). Formula per page: real portfolio photos + project write-up from that area/material, blend specs, process, FAQ block with FAQPage schema, testimonial, CTA. 800+ words of genuinely specific content each — never templated city-swap spam (Google's spam systems specifically target doorway pages; ours are backed by real jobs, which is the moat).
2. **Blog cadence:** 2/month sustained (better than 6-at-once-then-silence). Next topics from the data: "tile roof restoration" (720/KD10 — no good article exists anywhere), "copper roof cost", Ludowici-focused discontinued deep-dive, "slate roof hail damage Texas" (insurance-adjacent, careful legal wording per Jack's rules).
3. **Pre-render the 6 main pages** at build time (`react-dom/server` in build.mjs + hydrate). Do it here at the latest; sooner if the week-4 checkpoint failed.
4. Internal linking pass: every article links to its material lander + /contact; landers link to portfolio projects and 2–3 articles.
- **Checkpoint (month 4):** 8–10 new URLs live and indexed; Tier 2 terms "how long does a slate roof last", "clay tile roof repair", "discontinued roof tiles", "standing seam copper roof" in top 20 (striking distance); at least 2 in top 10. GBP ≥25 reviews. *If Tier 2 terms aren't top-20 by month 4: diagnose per-page (indexed? title match? content depth vs. page 1?) before writing anything new.*

### Phase 3 — Authority (Months 3–6, parallel with Phase 2)
Ordered by effort-to-impact:
1. **priorityroofs.com → prioritydesigner.com**: a "Specialty & Historic Restoration division" section/page on priorityroofs.com linking contextually to prioritydesigner.com (homepage + slate lander). One link from an AS-25 local-relevant domain outweighs everything else on this list. Also cross-link the two GBPs' websites correctly (each profile → its own site only; never share a website URL between profiles — that's what's causing entity absorption).
2. **Manufacturer contractor locators** (free, high-relevance links + referral traffic): Ludowici "Find a Contractor", DaVinci contractor program, Brava installer list, CertainTeed credentialed program, Westlake Royal. Jack likely already qualifies for all five.
3. **Preservation orgs:** Preservation Dallas (join, sponsor an event), Preservation Park Cities, Historic Fort Worth Inc., Texas Historical Foundation. Membership/sponsor pages link to members. National Slate Association + Tile Roofing Industry Alliance directories.
4. **Press/features:** pitch one finished flagship (the Highland Park variegated slate job photographs spectacularly) to D Magazine/D Home, CandysDirt (Park Cities real-estate blog — very linky), PaperCity, Dallas Architecture Forum. One local feature/quarter is the realistic pace.
- **Checkpoint (month 6):** referring domains 43 → 70+ with ≥8 *relevant* new ones (manufacturer/preservation/press); Authority Score ≥10; **Tier 1: "slate roof repair dallas" and "clay tile roof repair dallas" on page 1**; map-pack appearance for ≥2 niche queries in Park Cities grid; GBP ≥40 reviews; first organic lead recorded (ask every inquiry "how did you find us" + GSC click data).

### Phase 4 — Consolidate & expand (Months 6–12)
- Push Tier 3: "slate roof repair" national top-10, "synthetic slate roofing"/"slate roof cost" page 1.
- Expand geo pages (Plano, Frisco estates, Colleyville, Flower Mound — all have portfolio jobs); St. Louis lander if national work matters.
- Quarterly: refresh top articles (Google rewards updated lastmod + real edits), re-run Backlink Gap vs. Ramon Roofing, prune/merge anything not indexed after 6 months.
- Revisit: paid ads on Tier 1 terms (cheap at this volume), AI-search visibility (currently robots.txt blocks several AI crawlers — by 2026 a real referral channel in luxury; make an explicit call).
- **Checkpoint (month 12):** 300–600 organic visits/mo (Ramon-tier trajectory), 8–12 Tier 1+2 terms on page 1, map-pack presence across Park Cities for slate/tile queries, 60+ GBP reviews, 3–5 organic-attributed consultations/quarter.

---

## 7. KPI dashboard (track monthly, 30 min)
| KPI | Source | M1 | M3 | M6 | M12 |
|---|---|---|---|---|---|
| Pages indexed | GSC Coverage | 13+ | 20+ | 28+ | 35+ |
| GSC impressions/mo | GSC Performance | baseline | 2K | 8K | 25K |
| GSC clicks/mo | GSC | — | 40 | 150 | 400+ |
| Tier 1 terms on page 1 | Semrush PT (Dallas, mobile) | 0 | 1–2 | 4+ | 7+ |
| Map-pack appearances (niche queries) | Semrush local PT | 0 | 1 | 3+ | consistent |
| GBP reviews (total / velocity) | GBP | 10 / +5 | 25 / +5 | 40 / +5 | 60+ |
| Referring domains (relevant) | Semrush Backlinks | 45 | 55 | 70 | 90+ |
| Organic-attributed leads | ask + GHL source field | 0 | 1 | 3 | 3–5/qtr |

**Course-correction rule:** any KPI missing two consecutive checkpoints triggers a diagnosis session (indexing? content? authority? tracking config?) before adding new workstreams. Honest caveat: nobody can guarantee rankings — but every target above is set against measured competitor weakness (AS 7–13, KD 0–27), which is as close to high-confidence as SEO gets. The plan's structure (tracked terms, dated checkpoints, defined fallbacks) means we'll know by month 3 — not month 12 — whether we're on pace.

---

## 8. Open items needing Jack / Ryan
1. **Jack:** permanent phone + email for Priority Designer (unblocks NAP/schema fix — currently placeholder in live schema). Decide: Dallas-area number?
2. **Jack:** fact-check + price ranges for the cost article; review the 6 staging articles (already pending).
3. **Jack:** review-ask sweep of past clients (Phase 1 — biggest single local lever, only he can do it).
4. **Jack:** confirm manufacturer program status (Ludowici/DaVinci/Brava/CertainTeed/Westlake) for locator listings.
5. **Ryan:** GSC property + sitemap + Bing (day 1 after merge); Semrush Position Tracking campaign per Phase 1 spec.
6. **Ryan:** canonical fixes + sitemap lastmod fix → merge branch to main.
7. **Both:** decide whether both GBPs should coexist with clearly distinct names/sites (recommended) and have Priority Roofing's profile *mention* the Designer division (description, not website field).
