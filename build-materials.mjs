// Material page generator for the Priority Designer site.
//
// Emits fully-static HTML pages under materials/ (materials/<slug>.html, served
// at /materials/<slug>), opened from the partner cards and the copper medallion
// on the Materials page. Like the blog articles, the full page text, nav and
// footer are baked into the HTML so search engines and AI crawlers read the
// content without running JavaScript. Do NOT convert these to client-rendered.
//
// Nav/footer partials and the nav script are shared with build-blog.mjs.

import { writeFile, mkdir } from "node:fs/promises";
import { ARROW, esc, navMarkup, finalCtaMarkup, footerMarkup, NAV_JS } from "./build-blog.mjs";

const SITE = "https://prioritydesigner.com";
const BRAND = "Priority Designer · Slate & Tile";

// ---------------------------------------------------------------------------
// Slate data. Supplier figures as published by Be Natural / Slate Valley
// Supply (benatural.es), supplied by Jack in the Nov 2026 website brief.
// `roofs` = our own roofs in that stone (portfolio slugs), where we have them;
//   `blend: true` marks a roof where the stone is one color of several.
// `stone: "phyllite"` labels the two Galician phyllites (Jack, 2026-11-10).
// Vermont names follow Slate Valley Supply (slatevalleysupply.com/traditionalslate).
// ---------------------------------------------------------------------------
const STD3 = [
  ["1/4 in. (7 to 8 mm)", "About 1,000 lb per square"],
  ["3/8 to 1/2 in. (10 to 12 mm)", "About 1,500 lb per square"],
  ["1/2 to 5/8 in. (13 to 15 mm)", "About 2,000 lb per square"],
];
const VT2 = [
  ["1/4 in. (6 to 8 mm)", "About 1,000 lb per square"],
  ["3/8 in. (8 to 10 mm)", "About 1,500 lb per square"],
];
const tests = (mor, carb, wa, ncc) => [
  ["Dimensions and thickness variation", "Complies"],
  ["Characteristic modulus of rupture", mor],
  ["Carbonate content", carb],
  ["Water absorption", wa],
  ["Thermal cycling", "T1, complies"],
  ["Sulfur dioxide exposure", "S1, complies"],
  ["Non-carbonate carbon content", ncc],
  ["Reaction to fire", "Class A1"],
];

const SLATES = [
  {
    id: "galcar", group: "spain", name: "Galcar®", origin: "La Baña, Spain", swatch: "#2A2D31",
    location: "La Baña, northwest Spain", color: "Unfading black", sizes: "12 x 8 in. to 24 x 12 in.",
    traits: ["Natural textured face", "Pyrite free", "Large sizes available"],
    weights: STD3, tests: tests("41.5 N/mm² transverse, 63.3 N/mm² longitudinal", "0.7%", "W1, 0.31%", "0.3%"),
    cert: "Certified to EN 12326-1 and ASTM C406.",
    roofs: [{ slug: "university-park-galcar-slate", caption: "Clipped Galcar on one of our University Park roofs" }],
  },
  {
    id: "franvisa", group: "spain", name: "Franvisa®", origin: "La Baña, Spain", swatch: "#1E2024",
    location: "La Baña, northwest Spain", color: "Unfading deep black", sizes: "12 x 8 in. to 24 x 12 in.",
    traits: ["Structured vertical lines", "Pyrite free", "Exported since 1995"],
    weights: STD3, tests: tests("27.9 N/mm² transverse, 70.6 N/mm² longitudinal", "0.3%", "W1, 0.32%", "0.7%"),
    cert: "Certified to EN 12326-1 and ASTM C406.",
    roofs: [{ slug: "madison-franvisa-slate", caption: "100% Franvisa on one of our Madison, Wisconsin roofs" }],
  },
  {
    id: "sierra", group: "spain", stone: "phyllite", name: "Sierra", origin: "Lugo, Spain", swatch: "#6C7178",
    location: "Lugo, northwest Spain", color: "Unfading gray (also called Lugo Gray)", sizes: "12 x 8 in. to 24 x 12 in.",
    traits: ["Very uniform color", "Smooth natural texture"],
    weights: [["1/5 in. (5 mm)", "About 655 lb per square"], ["1/4 in. (6 to 7 mm)", "About 875 lb per square"]],
    tests: tests("39.6 N/mm² transverse, 47.9 N/mm² longitudinal", "0.70%", "W1, 0.37%", "0.30%"),
    cert: "Certified to EN 12326-1 and ASTM C406.",
  },
  {
    id: "lugo-green", group: "spain", stone: "phyllite", name: "Lugo Green", origin: "Lugo, Spain", swatch: "#4E5D55",
    location: "Lugo, northwest Spain", color: "Unfading green", sizes: "12 x 8 in. to 24 x 12 in.",
    traits: ["Named an IUGS Heritage Stone in 2024", "The only green roofing stone from Spain", "Very uniform color", "Also known as Bretoña"],
    weights: [["1/4 in. (6 to 7 mm)", "About 875 lb per square"], ["3/8 in. (8 to 10 mm)", "About 1,275 lb per square"]],
    tests: tests("40.4 N/mm² transverse, 39.0 N/mm² longitudinal", "0.40%", "W1, 0.19%", "0.00%"),
    cert: "Certified to EN 12326-1 and ASTM C406.",
  },
  {
    id: "vermont-black", group: "us", name: "Vermont Black", origin: "Wells, Vermont", swatch: "#3E4246",
    location: "Wells, Vermont", color: "Medium to dark gray with darker linear markings", sizes: "12 x 8 in. to 24 x 14 in.",
    traits: ["Black with shades of gray", "Distinct linear markings"],
    weights: VT2, tests: tests("34.7 N/mm² transverse, 46.0 N/mm² longitudinal", "0.10%", "W1, 0.21%", "0.0%"),
    cert: "Certified to EN 12326-1 and ASTM C406.",
    roofs: [{ slug: "highland-park-vermont-black-slate", caption: "Vermont Black on one of our Highland Park roofs" }],
  },
  {
    // Studio photo + quarry town from Slate Valley Supply (Lucas Severance, 2026-11-11).
    // Sizes, weights and lab data still to come, so those blocks are omitted.
    id: "vermont-unfading-gray", group: "us", name: "Vermont Unfading Gray", origin: "Poultney, Vermont", swatch: "#5E6164",
    location: "Poultney, Vermont", color: "Unfading gray",
    traits: ["Holds its gray for the life of the roof", "Laid on its own or as the base of a blend"],
    roofs: [
      { slug: "highland-park-unfading-grey-slate", caption: "100% Vermont Unfading Gray on one of our Highland Park roofs" },
      { slug: "fort-worth-unfading-grey-slate", caption: "100% Vermont Unfading Gray on one of our Fort Worth roofs" },
      { slug: "westover-hills-slate", caption: "43% of a four-color blend in Westover Hills", blend: true },
    ],
  },
  {
    id: "vermont-purple", group: "us", name: "Vermont Purple", origin: "Wells, Vermont", swatch: "#5A3E4A",
    location: "Wells, Vermont", color: "Unfading purple, at times nearly burgundy", sizes: "12 x 8 in. to 24 x 14 in.",
    traits: ["Close match for Welsh slate", "May show occasional green marks"],
    weights: VT2, tests: tests("34.7 N/mm² transverse, 46.0 N/mm² longitudinal", "0.10%", "W1, 0.21%", "0.0%"),
    cert: "Certified to EN 12326-1 and ASTM C406.",
    roofs: [{ slug: "highland-park-full-range-purple-slate", caption: "Full-range Vermont Purple on one of our Highland Park roofs" }],
  },
  {
    id: "vermont-green", group: "us", name: "Vermont Unfading Green", origin: "Wells, Vermont", swatch: "#56645A",
    location: "Wells, Vermont", color: "Unfading green, from bright green to gray-green", sizes: "12 x 8 in. to 24 x 14 in.",
    traits: ["A range of green tones", "Often blended with purple and gray"],
    weights: VT2, tests: tests("46.9 N/mm² transverse, 65.0 N/mm² longitudinal", "0.6%", "W1, 0.23%", "0.0%"),
    cert: "Certified to EN 12326-1 and ASTM C406.",
    roofs: [{ slug: "dallas-vermont-green-slate", caption: "Vermont Unfading Green on one of our Dallas roofs" }],
  },
  {
    id: "new-york-red", group: "us", name: "New York Unfading Red", origin: "Slate Valley, NY and VT", swatch: "#8A4A3F",
    location: "The Slate Valley on the New York and Vermont border", color: "Unfading red", sizes: "12 x 8 in. to 24 x 14 in.",
    traits: ["A rare true red slate", "Limited production", "Often used for patterns and accents"],
    weights: VT2, tests: tests("34.2 N/mm² transverse, 46.0 N/mm² longitudinal", "0.1%", "W1, 0.19%", "0.0%"),
    cert: "Certified to ASTM C406.",
    roofs: [{ slug: "highland-park-lorraine-slate", caption: "New York Unfading Red in a seven-color blend on one of our Highland Park roofs", blend: true }],
  },
];

// Real blends from our portfolio (data.jsx PROJECTS[].blend), linked to the projects.
const BLENDS = [
  { slug: "highland-park-variegated-slate-copper", image: "assets/projects/highland-park-variegated-slate-copper/03.webp", place: "Highland Park", blend: ["55% Vermont Purple", "35% Unfading Gray", "10% Unfading Green"] },
  { slug: "westover-hills-slate", image: "assets/projects/westover-hills-slate/01.webp", place: "Westover Hills", blend: ["43% Unfading Vermont Gray", "42% Spanish Black", "10% Vermont Purple", "5% New York Red"] },
  { slug: "highland-park-lorraine-slate", image: "assets/projects/highland-park-lorraine-slate/01.webp", place: "Highland Park", blend: ["Seven colors: Vermont Purple, Fading and Unfading Gray, Fading and Unfading Green, Spanish Black, New York Red"] },
];

// ---------------------------------------------------------------------------
// Shared page shell
// ---------------------------------------------------------------------------
function shell({ slug, title, description, heroImage, heroMobile, heroPos = "center", crumb, eyebrow, h1, sub, body, extraJs = "" }) {
  const url = `${SITE}/materials/${slug}`;
  const ogImage = `${SITE}/${heroImage}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Materials", item: `${SITE}/materials` },
      { "@type": "ListItem", position: 3, name: crumb, item: url },
    ],
  };
  return `<!doctype html>
<html lang="en">
<head>
<!-- Google tag (GTM-P6S9JRZZ) -->
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-P6S9JRZZ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!-- Served from /materials/<slug>; resolve relative nav/asset paths against the site root. -->
<base href="/" />
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16.png" />
<link rel="icon" href="assets/favicon/favicon-32.png" sizes="any" />
<link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon.png" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(BRAND)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${ogImage}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${ogImage}" />
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+SC:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+SC:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap"></noscript>
${heroMobile
    ? `<link rel="preload" as="image" href="${heroImage}" media="(min-width: 721px)" fetchpriority="high">
<link rel="preload" as="image" href="${heroMobile}" media="(max-width: 720px)" fetchpriority="high">`
    : `<link rel="preload" as="image" href="${heroImage}" fetchpriority="high">`}
<link rel="stylesheet" href="dist/styles.css" />
<style>:root{--hero-inset:0px}
.mp-hero{background-image:url('/${heroImage}');background-position:${heroPos}}
${heroMobile ? `@media (max-width:720px){.mp-hero{background-image:url('/${heroMobile}')}}` : ""}</style>
</head>
<body class="mp-page">
${navMarkup("materials.html")}
<header class="mp-hero">
  <div class="mp-hero-scrim"></div>
  <div class="mp-hero-inner">
    <nav class="article-breadcrumb" aria-label="Breadcrumb">
      <a href="materials">Materials</a> <span>/</span> <span>${esc(crumb)}</span>
    </nav>
    <span class="eyebrow mp-hero-eyebrow">${eyebrow}</span>
    <h1 class="mp-hero-title">${h1}</h1>
    <p class="mp-hero-sub">${sub}</p>
  </div>
</header>
<main>
${body}
</main>
${finalCtaMarkup()}
${footerMarkup()}
<script>${NAV_JS}</script>
${extraJs ? `<script>${extraJs}</script>` : ""}
</body>
</html>`;
}

const head = (eyebrow, h2, right = "") => `
    <div class="section-head mp-head">
      <div class="left">
        <span class="eyebrow">${eyebrow}</span>
        <h2>${h2}</h2>
      </div>${right ? `
      <div class="right">${right}</div>` : ""}
    </div>`;

const nextLinks = (back, fwd) => `
<nav class="mp-next" aria-label="More materials">
  <a href="${back.href}">← ${back.label}</a>
  ${fwd ? `<a href="${fwd.href}">${fwd.label} →</a>` : ""}
</nav>`;

// ---------------------------------------------------------------------------
// Natural Slate
// ---------------------------------------------------------------------------
const roofImg = (slug) => `assets/projects/${slug}/01.webp`;

function slateSwatch(s, i) {
  return `<button type="button" class="mp-swatch" data-slate="${s.id}" data-group="${s.group}" aria-pressed="${i === 0}" aria-controls="slate-${s.id}">
          ${s.noStudio
            ? `<img class="mp-swatch-img is-roof" src="${roofImg(s.roofs[0].slug)}" width="480" height="480" alt="" loading="lazy" style="background-color:${s.swatch}" />`
            : `<img class="mp-swatch-img" src="assets/materials/slate/${s.id}-tile.webp" width="480" height="480" alt="" loading="lazy" style="background-color:${s.swatch}" />`}
          <span class="mp-swatch-name">${esc(s.name)}</span>
          <span class="mp-swatch-origin">${s.stone === "phyllite" ? "Phyllite · " : ""}${esc(s.origin)}</span>
        </button>`;
}

function slatePanel(s, i) {
  // Left column: the supplier's studio photo of a single slate (Be Natural), and
  // our own roofs in that stone, linked to the portfolio. Stones without a studio
  // photo yet (Vermont Unfading Gray) lead with our first roof instead.
  const roofs = s.roofs || [];
  const onRoof = roofs.map((r) => `<a class="mp-onroof" href="portfolio?p=${r.slug}">
            <img src="${roofImg(r.slug)}" alt="" loading="lazy" />
            <span><span class="mp-label">${r.blend ? "In a blend on our roofs" : "On our roofs"}</span>${esc(r.caption)} →</span>
          </a>`).join("\n          ");
  const kind = s.stone === "phyllite" ? "phyllite" : "slate";
  const figure = s.noStudio
    ? `<figure class="mp-spec-slate is-roof"><img src="${roofImg(roofs[0].slug)}" alt="${esc(roofs[0].caption)}" loading="${i === 0 ? "eager" : "lazy"}" /></figure>`
    : `<figure class="mp-spec-slate">
            <img src="assets/materials/slate/${s.id}.webp" width="900" height="1200" alt="A single ${esc(s.name.replace("®", ""))} roofing ${kind}, ${esc(s.color.split(",")[0].split(" (")[0].toLowerCase())}" loading="${i === 0 ? "eager" : "lazy"}" />
          </figure>`;
  const visual = `<div class="mp-spec-visual">
          ${figure}
          ${onRoof}
        </div>`;
  const facts = [
    ["Location", s.location], ["Color", s.color], ["Sizes", s.sizes], ["Standards", s.cert],
  ].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("\n            ");
  const weights = s.weights ? `
          <div class="mp-spec-block">
            <span class="mp-label">Thickness and weight</span>
            <ul class="mp-spec-weights">${s.weights.map(([t, w]) => `<li><span>${t}</span><span>${w}</span></li>`).join("")}</ul>
          </div>` : "";
  const lab = s.tests ? `
          <details class="mp-lab">
            <summary>Laboratory results</summary>
            <div class="mp-lab-scroll">
              <table><thead><tr><th>Test</th><th>Result</th></tr></thead><tbody>${s.tests.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</tbody></table>
            </div>
            <p class="mp-note">Results as published by the supplier. W1, T1 and S1 are European EN 12326-1 categories for water absorption, thermal cycling and sulfur dioxide exposure. They are separate from the S1 service-life grade in ASTM C406.</p>
          </details>` : `
          <p class="mp-note">Sizes, weights and laboratory results for this color are on their way from Slate Valley Supply. Ask us and we will send them as soon as we have them.</p>`;
  return `
      <article class="mp-spec${i === 0 ? " is-active" : ""}" id="slate-${s.id}" data-panel="${s.id}">
        ${visual}
        <div class="mp-spec-body">
          <span class="mp-spec-kind">${s.stone === "phyllite" ? "Phyllite" : "Natural slate"}</span>
          <h3 class="mp-spec-name">${esc(s.name)}</h3>
          <dl class="mp-spec-facts">
            ${facts}
          </dl>
          <div class="mp-spec-block">
            <span class="mp-label">Characteristics</span>
            <ul class="mp-spec-traits">${s.traits.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          </div>${weights}${lab}
        </div>
      </article>`;
}

// What every slate above has in common, each tied to a line in its lab results.
const icon = (d) => `<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const PROOF = [
  { title: "Fireproof", text: "Class A1 reaction to fire. Stone does not burn.",
    icon: icon('<path d="M16 4c1 5 7 8 7 15a7 7 0 0 1-14 0c0-4 2-6 3-8 .5 3 2 4 3 4-1-4 0-8 1-11z"/>') },
  { title: "Waterproof", text: "W1 water absorption, under half a percent.",
    icon: icon('<path d="M16 4c4 6 8 10.5 8 15a8 8 0 0 1-16 0c0-4.5 4-9 8-15z"/><path d="M12 20a4 4 0 0 0 4 4"/>') },
  { title: "Frost resistant", text: "T1 thermal cycling, through repeated freeze and thaw.",
    icon: icon('<path d="M16 3v26M4.7 9.5l22.6 13M4.7 22.5l22.6-13"/><path d="M12.5 5.5 16 8l3.5-2.5M12.5 26.5 16 24l3.5 2.5"/>') },
  { title: "Pollution resistant", text: "S1 sulfur dioxide exposure, the strictest category.",
    icon: icon('<path d="M6 22c0-6 4-12 14-14 2 0 5-1 6-3 0 12-6 19-14 19-3 0-6-1-6-2z"/><path d="M6 26c4-6 8-10 13-12"/>') },
  { title: "Hand selected", text: "Graded at the quarry for color, thickness and size before it ships.",
    icon: icon('<circle cx="14" cy="14" r="8"/><path d="m20 20 7 7"/><path d="m10.5 14 2.5 2.5 4.5-5"/>') },
  { title: "Built to last", text: "<a href=\"blog/do-slate-roofs-really-last-100-years\">A century or more</a> when it is installed and flashed correctly.",
    icon: icon('<path d="M9 4h14M9 28h14M10 4c0 7 6 8 6 12s-6 5-6 12M22 4c0 7-6 8-6 12s6 5 6 12"/><path d="M13 25h6"/>') },
];

const SLATE_JS = `
(function(){
  var root=document.querySelector('.mp-slates'); if(!root) return;
  root.classList.add('js');
  var sw=root.querySelectorAll('.mp-swatch'), panels=root.querySelectorAll('.mp-spec'), tabs=root.querySelectorAll('.mp-tab');
  function pick(id){
    Array.prototype.forEach.call(sw,function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-slate')===id));});
    Array.prototype.forEach.call(panels,function(p){p.classList.toggle('is-active',p.getAttribute('data-panel')===id);});
  }
  // Deep links: /materials/natural-slate#slate-franvisa opens that slate.
  var h=location.hash.replace('#slate-','').replace('#','');
  if(h&&root.querySelector('[data-panel="'+h+'"]')){pick(h);setTimeout(function(){root.scrollIntoView({block:'start'});},0);}
  Array.prototype.forEach.call(sw,function(b){b.addEventListener('click',function(){
    pick(b.getAttribute('data-slate'));
    if(history.replaceState) history.replaceState(null,'',location.pathname+'#slate-'+b.getAttribute('data-slate'));
    if(window.innerWidth<900){var p=root.querySelector('.mp-spec.is-active'); if(p) p.scrollIntoView({behavior:'smooth',block:'start'});}
  });});
  Array.prototype.forEach.call(tabs,function(t){t.addEventListener('click',function(){
    var f=t.getAttribute('data-filter'), first=null, keep=false;
    Array.prototype.forEach.call(tabs,function(x){x.setAttribute('aria-pressed',String(x===t));});
    Array.prototype.forEach.call(sw,function(b){
      var show=f==='all'||b.getAttribute('data-group')===f; b.hidden=!show;
      if(show&&!first) first=b; if(show&&b.getAttribute('aria-pressed')==='true') keep=true;
    });
    if(!keep&&first) pick(first.getAttribute('data-slate'));
  });});
})();`;

function naturalSlatePage() {
  const body = `
<section class="mp-section mp-source">
  <div class="mp-source-text">
    <span class="eyebrow mp-eyebrow">We Went to the Source</span>
    <h2 class="mp-h2">We have stood in the <em>quarries we buy from.</em></h2>
    <p>Our team traveled to the slate quarries of Galicia, in northwest Spain, to watch the stone come out of the mountain, split by hand and graded in the shed. We spent that time with geologist Dr. Víctor Cárdenes, learning what separates a roofing slate that lasts a century from one that fails in twenty years.</p>
    <p>One of the stones we install comes from that same corner of Spain. Lugo Green Phyllite, quarried in Galicia since at least 1626, was named an <a href="https://iugs-geoheritage.org/geoheritage_stones/lugo-green-phyllite/" target="_blank" rel="noopener">IUGS Heritage Stone</a> in 2024, and the main study behind that designation is Dr. Cárdenes’s own.</p>
    <p>That trip is why every slate we install has published test results behind it: ASTM C406 for the American market and EN 12326 for European slate. Slate with no standards behind it, like the Chinese slate we tear off across DFW, Colorado, St. Louis and Wisconsin, is not something we will put on a roof.</p>
    <p class="mp-readmore">Read more: <a href="blog/what-makes-a-roofing-slate">What makes a roofing slate</a> · <a href="blog/do-slate-roofs-really-last-100-years">Do slate roofs really last 100 years?</a></p>
  </div>
  <div class="mp-source-photos">
    <figure class="mp-ph mp-ph-wide"><img src="assets/materials/quarry/quarry-face-team.webp" alt="Three members of our team walking to the quarry face in Galicia" loading="lazy" /></figure>
    <figure class="mp-ph"><img src="assets/materials/quarry/grading-slate.webp" alt="Grading roofing slate by hand in the splitting shed" loading="lazy" /></figure>
    <figure class="mp-ph"><img src="assets/materials/quarry/raw-blocks.webp" alt="Raw slate blocks before splitting" loading="lazy" /></figure>
    <figure class="mp-ph"><img src="assets/materials/quarry/shed-blocks.webp" alt="Slate blocks arriving at the splitting shed" loading="lazy" /></figure>
    <figure class="mp-ph"><img src="assets/materials/quarry/excavator.webp" alt="An excavator working the slate quarry face" loading="lazy" /></figure>
  </div>
</section>

<section class="mp-section mp-section-cream mp-slates" id="our-slate">
  ${head("The Stone We Install", "Nine stones, <em>from quarries we know</em>", "Spanish slate and phyllite from Galicia through Be Natural, and American slate from Vermont and New York through Slate Valley Supply. Phyllite is slate taken further: the same rock under more heat and pressure, with a fine sheen. Choose a stone to see where it comes from, its sizes and weights, and its laboratory results.")}
  <div class="mp-tabs" role="group" aria-label="Filter by origin">
    <button type="button" class="mp-tab" data-filter="all" aria-pressed="true">All</button>
    <button type="button" class="mp-tab" data-filter="spain" aria-pressed="false">Spanish</button>
    <button type="button" class="mp-tab" data-filter="us" aria-pressed="false">Vermont &amp; New York</button>
  </div>
  <div class="mp-swatches">
        ${SLATES.map(slateSwatch).join("\n        ")}
  </div>
  <div class="mp-specs">${SLATES.map(slatePanel).join("")}
  </div>
  <p class="mp-credit">Slate photography courtesy of Be Natural and Slate Valley Supply.</p>
  <div class="mp-proof">
    <span class="mp-label">What the laboratory results show</span>
    <ul class="mp-proof-grid">${PROOF.map((p) => `
      <li>${p.icon}<strong>${p.title}</strong><span>${p.text}</span></li>`).join("")}
    </ul>
  </div>
</section>

<section class="mp-section mp-blends">
  ${head("Blended on the Roof", "Most of our slate roofs are <em>more than one color</em>", "We lay out blends by percentage, so the color reads evenly from every side of the house. A few from our portfolio:")}
  <div class="mp-blend-grid">${BLENDS.map((b) => `
    <a class="mp-blend" href="portfolio?p=${b.slug}">
      <span class="mp-blend-img" style="background-image:url('/${b.image}')"></span>
      <span class="mp-blend-body">
        <span class="mp-label">${esc(b.place)}</span>
        <span class="mp-blend-list">${b.blend.map(esc).join("<br />")}</span>
        <span class="mp-blend-link">See the project →</span>
      </span>
    </a>`).join("")}
  </div>
</section>

<section class="mp-band">
  <div class="mp-band-inner">
    <div>
      <h2>See the stone in your hands.</h2>
      <p>We coordinate samples directly, and we can lay a blend out against your brick and trim before anything is ordered.</p>
    </div>
    <a class="btn-copper-solid" href="materials#request-sample">Request a Sample ${ARROW}</a>
  </div>
</section>
${nextLinks({ href: "materials", label: "All materials" }, { href: "materials/copper", label: "Every slate roof deserves copper" })}`;

  return shell({
    slug: "natural-slate",
    title: "Natural Slate Roofing · Spanish & Vermont Slate · Priority Designer",
    description: "The natural slate and phyllite we install in Dallas–Fort Worth: Spanish stone from Galicia and American slate from Vermont and New York, with sizes, weights and laboratory results for each.",
    heroImage: "assets/materials/quarry/quarry-canyon.webp",
    heroMobile: "assets/materials/quarry/quarry-canyon-mobile.webp",
    crumb: "Natural Slate",
    eyebrow: "Slate Valley Supply · Be Natural",
    h1: "Slate isn’t manufactured. <em>It’s farmed.</em>",
    sub: "Choosing the slate matters almost as much as its rating. Our partners live where the quarries are, and every order is selected at the quarry before it ships.",
    body,
    extraJs: SLATE_JS,
  });
}

// ---------------------------------------------------------------------------
// Copper
// ---------------------------------------------------------------------------
function copperPage() {
  const where = [
    ["Valleys", "Open or closed, where the most water on the roof runs."],
    ["Step and counter flashing", "At walls, dormers and chimneys, in place of galvanized steel that rusts out first."],
    ["Chimney crickets", "Soldered saddles that move water around the chimney instead of relying on caulk."],
    ["Penetrations", "Copper jacks in place of plastic boots that crack over a hot deck."],
    ["Drip edge and eaves", "The edge that carries water off the roof and into the gutter."],
    ["Gutters and downspouts", "Half-round and box gutters, conductor heads and leaders."],
  ];
  const standard = [
    ["16 oz copper", "Sheet copper is specified by weight per square foot. Sixteen-ounce copper to ASTM B370 is stiff enough to hold its shape and heavy enough to outlast the roof."],
    ["Formed for the condition", "Every piece is shaped for the detail it serves, and matched to the original where the house is historic, not pulled from stock shapes."],
    ["Soldered, not sealed", "Joints are soldered, so the seal is metal to metal rather than a sealant that dries out."],
    ["Lead-coated copper", "Where a soft gray finish suits the house better than a copper patina."],
  ];
  const partners = [
    ["materials/natural-slate", "Natural slate", "Copper valleys, step flashing and nails beneath Spanish and Vermont slate."],
    ["blog/ludowici-roof-tile-history", "Ludowici", "Copper woven through historic clay tile, as on the roofs it was first made for."],
    ["portfolio?p=st-louis-la-escandella-tile", "La Escandella", "Hand-formed copper on Mediterranean clay tile in St. Louis."],
    ["portfolio?p=dallas-brava-slate", "Brava", "A composite field with copper at the eaves and valleys."],
  ];
  const body = `
<section class="mp-section mp-why">
  <div>
    <span class="eyebrow mp-eyebrow">Why Copper</span>
    <h2 class="mp-h2">The field can be flawless <em>and still leak.</em></h2>
  </div>
  <div class="mp-why-text">
    <p>On a slate or tile roof, the flashing usually fails long before the field does. Galvanized steel rusts through while the slate or clay above it still has decades left, and replacing it means taking a sound roof apart to reach it.</p>
    <p>Copper lasts as long as the material above it. That is why we recommend it at every wall, chimney, valley and penetration, whichever roof you choose, and hand-form it on site when we install it.</p>
  </div>
</section>

<section class="mp-section mp-section-cream">
  ${head("Where It Goes", "Where copper <em>belongs on a roof</em>")}
  <div class="mp-cards">${where.map(([h, p]) => `
    <div class="mp-card"><h3>${h}</h3><p>${p}</p></div>`).join("")}
  </div>
  <div class="mp-fasteners">
    <img src="assets/materials/copper-nails.webp" alt="Copper roofing nails" loading="lazy" />
    <p>Fasteners are matched to the material above them: copper or stainless on slate and clay, never a metal that will corrode before the roof does.</p>
  </div>
</section>

<section class="mp-section mp-section-dark">
  ${head("Our Standard", "Sixteen-ounce, <em>custom fabricated, soldered</em>", "When we install copper, this is how we build it.")}
  <div class="mp-standard">${standard.map(([h, p]) => `
    <div class="mp-std"><h3>${h}</h3><p>${p}</p></div>`).join("")}
  </div>
</section>

<section class="mp-section">
  ${head("Copper With Every Partner", "The field changes. <em>The case for copper does not.</em>")}
  <div class="mp-partner-links">${partners.map(([href, h, p]) => `
    <a class="mp-plink" href="${href}"><span class="mp-plink-name">${h}</span><span class="mp-plink-text">${p}</span><span class="mp-plink-arrow">→</span></a>`).join("")}
  </div>
</section>

<section class="mp-section mp-section-cream mp-arch">
  <div class="mp-arch-text">
    <span class="eyebrow mp-eyebrow">Architectural Copper</span>
    <h2 class="mp-h2">Domes, turrets, finials <em>and flat-seam roofs</em></h2>
    <p>Beyond flashing, we build copper as a roof of its own: hand-laid domes and turrets, cupolas, finials, bay roofs and awnings in soldered flat-seam copper, and single and double-lock standing seam.</p>
    <div class="mp-patina" aria-label="How copper weathers over time">
      <div class="mp-patina-row"><span style="background:#c8834f"></span><span style="background:#94573a"></span><span style="background:#5b4235"></span><span style="background:#5f8a78"></span></div>
      <div class="mp-patina-labels"><span>New</span><span>Months</span><span>Years</span><span>Decades</span></div>
      <p class="mp-note">Copper weathers from bright metal through brown to the green patina of historic roofs, a protective layer that forms on its own.</p>
    </div>
  </div>
  <figure class="mp-arch-photo">
    <img src="assets/projects/westlake-designer-shingle/01.webp" alt="A hand-formed copper turret on a Westlake estate" loading="lazy" />
    <figcaption><a href="portfolio?p=westlake-designer-shingle">Copper turret, Westlake →</a></figcaption>
  </figure>
</section>

<section class="mp-band">
  <div class="mp-band-inner">
    <div>
      <h2>Planning copper gutters, a dome or a finial?</h2>
      <p>Every inquiry is read by an expert, not a call center.</p>
    </div>
    <a class="btn-copper-solid" href="contact.html">Schedule a Consultation ${ARROW}</a>
  </div>
</section>
${nextLinks({ href: "materials", label: "All materials" }, { href: "materials/natural-slate", label: "The natural slate we install" })}`;

  return shell({
    slug: "copper",
    title: "Copper Roofing & Flashing · 16 oz Copper · Priority Designer",
    description: "Why copper belongs on every slate and tile roof: 16 oz copper valleys, flashing, crickets, gutters, domes and turrets, soldered and formed for each condition, from Priority Designer in Dallas–Fort Worth.",
    heroImage: "assets/projects/highland-park-variegated-slate-copper/02.webp",
    heroPos: "center 40%",
    crumb: "Copper",
    eyebrow: "Copper · The Thread Through Every Roof",
    h1: "The thread through <em>every roof.</em>",
    sub: "Slate, Ludowici, La Escandella or Brava: the field material changes, but the case for copper does not. A roof meant to last a century should not depend on flashing that lasts twenty years.",
    body,
  });
}

// ---------------------------------------------------------------------------
export async function buildMaterials() {
  await mkdir("materials", { recursive: true });
  const pages = [
    { slug: "natural-slate", html: naturalSlatePage() },
    { slug: "copper", html: copperPage() },
  ];
  for (const p of pages) await writeFile(`materials/${p.slug}.html`, p.html);
  return pages.map((p) => p.slug);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const slugs = await buildMaterials();
  slugs.forEach((s) => console.log(`  materials/${s}.html`));
}
