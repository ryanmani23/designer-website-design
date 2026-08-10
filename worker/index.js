// Cloudflare Worker for prioritydesigner.com
//
// The site is otherwise static assets (served via the ASSETS binding). This
// Worker adds a live Instagram feed for the About page:
//   • GET /api/instagram          → cached manifest JSON (read by <InstagramFeed>)
//   • GET /ig-media/<key>         → cached post image, streamed from R2
//   • POST /api/instagram/refresh → manual feed pull (seed-key gated)
//   • scheduled (cron)            → refresh feed + rotate the 60-day token
//
// Everything else falls through to the static assets. If the token is missing
// or the API errors, the manifest simply isn't updated and the page falls back
// to its curated grid — the section can never render empty.

const IG_FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const IG_LIMIT = 12;

const KV_MANIFEST = "ig_manifest";      // JSON array of posts
const KV_TOKEN = "ig_token";            // long-lived access token (mutable)
const KV_TOKEN_TS = "ig_token_refreshed_at";
const KV_SEED_KEY = "ig_refresh_key";   // optional shared secret for manual refresh

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/instagram" && request.method === "GET") {
      const manifest = (await env.IG_KV.get(KV_MANIFEST)) || "[]";
      return json(manifest, 300);
    }

    if (url.pathname === "/api/instagram/refresh" && request.method === "POST") {
      const seed = await env.IG_KV.get(KV_SEED_KEY);
      if (seed && url.searchParams.get("key") !== seed) {
        return new Response("Forbidden", { status: 403 });
      }
      ctx.waitUntil(refreshFeed(env));
      return json(JSON.stringify({ ok: true, queued: true }), 0);
    }

    if (url.pathname.startsWith("/ig-media/")) {
      const key = decodeURIComponent(url.pathname.slice("/ig-media/".length));
      const obj = await env.IG_BUCKET.get(key);
      if (!obj) return new Response("Not found", { status: 404 });
      const headers = new Headers();
      obj.writeHttpMetadata(headers);
      headers.set("cache-control", "public, max-age=86400");
      headers.set("etag", obj.httpEtag);
      return new Response(obj.body, { headers });
    }

    // Not an API route — serve the static site.
    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(refreshFeed(env));
  },
};

function json(body, maxAge) {
  const headers = { "content-type": "application/json; charset=utf-8" };
  headers["cache-control"] = maxAge ? `public, max-age=${maxAge}` : "no-store";
  return new Response(body, { headers });
}

// First non-empty caption line with trailing hashtags removed.
function cleanCaption(caption) {
  if (!caption) return "";
  const firstLine = caption.split("\n").find((l) => l.trim().length) || "";
  return firstLine.split(" #")[0].replace(/#\S+\s*$/g, "").trim().slice(0, 140);
}

async function refreshFeed(env) {
  const token = await env.IG_KV.get(KV_TOKEN);
  if (!token) return; // not seeded yet — leave the manifest alone (curated fallback stays)

  const api = `https://graph.instagram.com/me/media?fields=${IG_FIELDS}&limit=${IG_LIMIT}&access_token=${token}`;
  let data;
  try {
    const res = await fetch(api);
    if (!res.ok) return;
    data = await res.json();
  } catch {
    return;
  }

  const items = Array.isArray(data.data) ? data.data : [];
  const manifest = [];
  for (const m of items) {
    const imgUrl = m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url;
    if (!imgUrl) continue;

    const key = `${m.id}-800.jpg`; // -800 = resized variant; bump to bust cache
    try {
      const existing = await env.IG_BUCKET.head(key);
      if (!existing) {
        // Instagram returns full-resolution images (~1–2MB). Downscale via
        // Cloudflare Image Resizing before caching so the tiles stay light
        // (tiles render ~400px; 800px covers retina). If Image Resizing isn't
        // enabled on the zone, cf.image is ignored and the original is stored —
        // the feed still works, just heavier, so this degrades gracefully.
        const imgRes = await fetch(imgUrl, {
          cf: { image: { width: 800, quality: 78, fit: "scale-down" } },
        });
        if (imgRes.ok) {
          await env.IG_BUCKET.put(key, imgRes.body, {
            httpMetadata: { contentType: imgRes.headers.get("content-type") || "image/jpeg" },
          });
        } else {
          continue; // couldn't fetch the image — skip this post rather than link a broken tile
        }
      }
    } catch {
      continue;
    }

    manifest.push({
      id: m.id,
      permalink: m.permalink,
      caption: cleanCaption(m.caption),
      media_type: m.media_type,
      image: `/ig-media/${key}`,
      timestamp: m.timestamp,
    });
  }

  if (manifest.length) {
    await env.IG_KV.put(KV_MANIFEST, JSON.stringify(manifest));
  }

  await maybeRefreshToken(env, token);
}

// Long-lived Instagram tokens last 60 days and can be refreshed once they're
// >24h old; we refresh weekly so the token never lapses once seeded.
async function maybeRefreshToken(env, token) {
  const last = parseInt((await env.IG_KV.get(KV_TOKEN_TS)) || "0", 10);
  if (Date.now() - last < 7 * 864e5) return;
  try {
    const r = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
    );
    if (r.ok) {
      const j = await r.json();
      if (j.access_token) {
        await env.IG_KV.put(KV_TOKEN, j.access_token);
        await env.IG_KV.put(KV_TOKEN_TS, String(Date.now()));
      }
    }
  } catch {
    // non-fatal; try again next cycle
  }
}
