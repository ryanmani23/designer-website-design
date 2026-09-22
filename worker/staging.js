// Staging-only worker. Serves the built site (including draft posts, when the
// build ran with INCLUDE_DRAFTS=1) with a noindex header, so the review copy at
// designer-website-staging.workers.dev can never compete with prod in search.
// Production is unaffected: prod uses worker/index.js via wrangler.jsonc; this
// script is referenced only by wrangler.staging.jsonc.
export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    out.headers.set("X-Robots-Tag", "noindex, nofollow");
    return out;
  },
};
