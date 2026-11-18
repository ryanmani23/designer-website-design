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
    // Lab data from Slate Valley's product data sheet (Jack forwarded, 2026-11-11):
    // ASTM-only values, so its own rows and note. Sizes and weights not on the sheet.
    id: "vermont-unfading-gray", group: "us", name: "Vermont Unfading Gray", origin: "Poultney, Vermont", swatch: "#5E6164",
    location: "Poultney, Vermont", color: "Unfading gray, from light, almost clear tones to darker grays with black markings",
    cert: "S1 grade, ASTM C406.",
    traits: ["Holds its gray for the life of the roof", "Laid on its own or as the base of a blend"],
    tests: [
      ["Grade (ASTM C406)", "S1"],
      ["Breaking load", "913 lb at 0.284 in. thick"],
      ["Water absorption", "0.207%"],
      ["Depth of softening", "0.0007 in."],
    ],
    labNote: "Results as published by Slate Valley Supply. S1 is the highest service-life grade in ASTM C406. Sizes and weights for this color are on their way; ask us and we will send them.",
    roofs: [
      { slug: "highland-park-unfading-grey-slate", caption: "100% Vermont Unfading Gray on one of our Highland Park roofs" },
      { slug: "fort-worth-unfading-grey-slate", caption: "100% Vermont Unfading Gray on one of our Fort Worth roofs" },
      { slug: "westover-hills-slate", caption: "43% of a four-color blend in Westover Hills", blend: true },
      { slug: "dallas-custom-slate-blend", caption: "20% of a five-color blend in Dallas", blend: true },
    ],
  },
  {
    id: "vermont-purple", group: "us", name: "Vermont Purple", origin: "Wells, Vermont", swatch: "#5A3E4A",
    location: "Wells, Vermont", color: "Unfading purple, at times nearly burgundy", sizes: "12 x 8 in. to 24 x 14 in.",
    traits: ["Close match for Welsh slate", "May show occasional green marks"],
    weights: VT2, tests: tests("34.7 N/mm² transverse, 46.0 N/mm² longitudinal", "0.10%", "W1, 0.21%", "0.0%"),
    cert: "Certified to EN 12326-1 and ASTM C406.",
    roofs: [
      { slug: "highland-park-full-range-purple-slate", caption: "Full-range Vermont Purple on one of our Highland Park roofs" },
      { slug: "dallas-custom-slate-blend", caption: "10% of a five-color blend in Dallas", blend: true },
    ],
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
    roofs: [
      { slug: "highland-park-lorraine-slate", caption: "New York Unfading Red in a seven-color blend on one of our Highland Park roofs", blend: true },
      { slug: "dallas-custom-slate-blend", caption: "15% of a five-color blend in Dallas", blend: true },
    ],
  },
];

// Real blends from our portfolio (data.jsx PROJECTS[].blend), linked to the projects.
const BLENDS = [
  { slug: "highland-park-variegated-slate-copper", image: "assets/projects/highland-park-variegated-slate-copper/03.webp", place: "Highland Park", blend: ["55% Vermont Purple", "35% Unfading Gray", "10% Unfading Green"] },
  { slug: "westover-hills-slate", image: "assets/projects/westover-hills-slate/01.webp", place: "Westover Hills", blend: ["43% Unfading Vermont Gray", "42% Spanish Black", "10% Vermont Purple", "5% New York Red"] },
  { slug: "highland-park-lorraine-slate", image: "assets/projects/highland-park-lorraine-slate/01.webp", place: "Highland Park", blend: ["Seven colors: Vermont Purple, Fading and Unfading Gray, Fading and Unfading Green, Spanish Black, New York Red"] },
  { slug: "dallas-custom-slate-blend", image: "assets/projects/dallas-custom-slate-blend/01.webp", place: "Dallas", blend: ["30% Semi-Weathering Gray", "25% Unfading Gray/Green", "20% Unfading Gray", "15% New York Red", "10% Vermont Purple"] },
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

// "Keep exploring": photo cards for the other material pages (replaced the
// plain back/next link row, Ryan 2026-11-13).
const MATERIAL_PAGES = [
  { slug: "natural-slate", kind: "Stone", name: "Natural Slate", line: "Spanish, Vermont and New York slate", image: "assets/materials/quarry/quarry-canyon.webp", pos: "center 60%" },
  { slug: "lightweight-slate", kind: "Stone", name: "Lightweight Slate", line: "Real S1 slate at a fraction of the weight", image: "assets/materials/lightweight/hero.webp", pos: "center 40%" },
  { slug: "ludowici", kind: "Clay Tile", name: "Ludowici", line: "America's oldest clay roof tile", image: "assets/projects/holy-trinity-clay/01.webp", pos: "center 70%" },
  { slug: "la-escandella", kind: "Clay Tile", name: "La Escandella", line: "Mediterranean clay tile from Spain", image: "assets/projects/st-louis-central-west-end-clay/02.webp", pos: "center 45%" },
  { slug: "brava", kind: "Composite", name: "Brava", line: "The synthetic we install and stand behind", image: "assets/projects/nichols-hills-brava-slate/04.webp", pos: "center" },
  { slug: "copper", kind: "Metal", name: "Copper", line: "The thread through every roof", image: "assets/projects/highland-park-variegated-slate-copper/02.webp", pos: "center 40%" },
];
const moreMaterials = (current) => `
<section class="mp-explore" aria-label="More materials">
  <div class="mp-explore-head">
    <div>
      <span class="mp-label">Keep Exploring</span>
      <h2>More of the materials we install</h2>
    </div>
    <a class="mp-explore-all" href="materials">All materials →</a>
  </div>
  <div class="mp-explore-row">${MATERIAL_PAGES.filter((m) => m.slug !== current).map((m) => `
    <a class="mp-explore-card" href="materials/${m.slug}">
      <span class="mp-explore-img" style="background-image:url('/${m.image}');background-position:${m.pos}"></span>
      <span class="mp-explore-text">
        <span class="mp-explore-kind">${m.kind}</span>
        <span class="mp-explore-name">${m.name}</span>
        <span class="mp-explore-line">${m.line}</span>
      </span>
      <span class="mp-explore-arrow" aria-hidden="true">→</span>
    </a>`).join("")}
  </div>
</section>`;

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
            <p class="mp-note">${s.labNote || "Results as published by the supplier. W1, T1 and S1 are European EN 12326-1 categories for water absorption, thermal cycling and sulfur dioxide exposure. They are separate from the S1 service-life grade in ASTM C406."}</p>
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
  { title: "Heat resistant", text: "T1 thermal cycling: stable through repeated soaking and heating, the stress a DFW summer puts on a roof.",
    icon: icon('<circle cx="16" cy="16" r="6"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8"/>') },
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
    <details class="mp-lab mp-key">
      <summary>How to read these results</summary>
      <dl class="mp-key-list">
        <div><dt>W, water absorption</dt><dd>European slate is tested to EN 12326. W1 is the best class: the stone takes up less than 0.6% of its weight in water.</dd></div>
        <div><dt>T, thermal cycling</dt><dd>Repeated soaking and heating. T1 means a slight color change at most, T2 means rust spotting with no structural effect, and T3 means the metal minerals in the stone have broken down far enough to pierce it.</dd></div>
        <div><dt>S, sulfur dioxide exposure</dt><dd>A test against polluted, acidic air. S1 is the best of three classes. Slate with more than 20% carbonate goes through a stricter version of the test.</dd></div>
        <div><dt>ASTM C406 grade</dt><dd>American slate is graded on its own scale. S1 means an expected service life of more than 75 years, S2 40 to 75, and S3 20 to 40. It is a separate scale from the European S classes above.</dd></div>
      </dl>
    </details>
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
  <div class="mp-blend-note">
    <span class="mp-label">Unfading and weathering</span>
    <p>Slate color comes from the stone itself: chlorite for green, iron oxide for purple and red, carbon for gray and black. Unfading slates hold their color for the life of the roof. Weathering and semi-weathering slates soften toward buff and tan over the years. We plan a blend for how it will look in twenty years, not only on the day it goes on.</p>
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
${moreMaterials("natural-slate")}`;

  return shell({
    slug: "natural-slate",
    title: "Natural Slate Roofing · Spanish & Vermont Slate · Priority Designer",
    description: "The natural slate and phyllite we install in Dallas–Fort Worth: Spanish stone from Galicia and American slate from Vermont and New York, with sizes, weights and laboratory results for each.",
    heroImage: "assets/materials/quarry/quarry-canyon.webp",
    heroMobile: "assets/materials/quarry/quarry-canyon-mobile.webp",
    crumb: "Natural Slate",
    eyebrow: "Slate Valley Supply · Be Natural",
    h1: "Slate is a natural resource, <em>still cut and split by hand.</em>",
    sub: "Slate is one of the few roofing materials still taken straight from the ground, almost entirely untouched aside from being cut and split. Our partners live where the quarries are, and every order is picked out at the quarry before it ships.",
    body,
    extraJs: SLATE_JS,
  });
}

// ---------------------------------------------------------------------------
// Copper
// ---------------------------------------------------------------------------
const CU_SYSTEMS = [
  { name: "Standing seam", use: "Sloped roofs", text: "Pans joined by tall, double-locked seams. Copper cleats hidden in the seams hold each pan down and still let it move.",
    svg: '<line x1="4" y1="62" x2="156" y2="62" class="d"/><path d="M8 56 H72 V22 Q72 14 80 14 Q88 14 88 22 V30"/><path d="M152 56 H78 V24 Q78 20 80 20 Q82 20 82 24"/><path d="M70 56 l-6 6" class="t"/>' },
  { name: "Batten seam", use: "Sloped roofs, for the look", text: "Each seam wraps a wood batten under a copper cap, giving the roof strong vertical lines. The traditional choice on historic work.",
    svg: '<line x1="4" y1="62" x2="156" y2="62" class="d"/><rect x="68" y="32" width="24" height="26" class="w"/><path d="M8 56 H64 V30"/><path d="M152 56 H96 V30"/><path d="M60 26 H100 M60 26 V34 M100 26 V34"/>' },
  { name: "Flat seam", use: "Domes, vaults and low slopes", text: "Small sheets locked on all four sides, then soldered watertight. Used where the slope alone cannot be trusted to shed water.",
    svg: '<line x1="4" y1="62" x2="156" y2="62" class="d"/><path d="M8 54 H84 Q90 54 90 50 Q90 46 84 46 H76"/><path d="M152 58 H70 Q66 58 66 54 Q66 50 72 50 H80"/><circle cx="90" cy="54" r="3.2" class="s"/>' },
];
const CU_SPECS = [
  ["Purity", "99.9% copper"],
  ["Standard", "ASTM B370, sheet copper for building construction"],
  ["Temper", "Cold-rolled: stronger than soft copper, and better at resisting the fatigue of daily expansion and contraction"],
  ["Soft copper", "Kept for intricate, hand-formed ornament, where the metal has to bend tightly"],
  ["Tensile strength", "32,000 psi minimum, cold-rolled"],
  ["Thermal expansion", "0.0000098 in. per in. per °F"],
];
const CU_STAGES = [
  ["#c8834f", "Bright copper", "", "The day it goes on"],
  ["#94573a", "Cuprite", "Cu<sub>2</sub>O", "Months: a reddish-brown oxide forms"],
  ["#4f3a2f", "Deep cuprite", "Cu<sub>2</sub>O", "Years: the oxide darkens toward brown-black"],
  ["#5f8a78", "Brochantite", "Cu<sub>4</sub>SO<sub>4</sub>(OH)<sub>6</sub>", "Decades, faster in wetter climates: the green patina"],
];

function copperPage() {
  const where = [
    ["Valleys", "Open or closed, where the most water on the roof runs."],
    ["Step and counter flashing", "At walls, dormers and chimneys, in place of galvanized steel that rusts out first."],
    ["Chimney crickets", "Soldered saddles that move water around the chimney instead of relying on caulk."],
    ["Penetrations", "Copper jacks in place of plastic boots that crack over a hot deck."],
    ["Drip edge and eaves", "The edge that carries water off the roof and into the gutter."],
    ["Gutters and downspouts", "Half-round and box gutters, conductor heads and leaders."],
  ];
  const partners = [
    ["materials/natural-slate", "Natural slate", "Copper valleys, step flashing and nails beneath Spanish and Vermont slate."],
    ["materials/ludowici", "Ludowici", "Copper woven through historic clay tile, as on the roofs it was first made for."],
    ["materials/la-escandella", "La Escandella", "Hand-formed copper on Mediterranean clay tile in St. Louis."],
    ["materials/brava", "Brava", "A composite field with copper at the eaves and valleys."],
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

<section class="mp-section mp-move">
  <h2 class="mp-statement-h">Copper has to be built to move</h2>
  <p class="mp-move-intro">Copper grows and shrinks with every change in temperature. A ten-foot length moves about an eighth of an inch between a cold morning and a summer afternoon, and a Texas roof sees swings like that all year. Copper that cannot move cracks at its fasteners and seams, one of the most common reasons a copper roof fails early.</p>
  <ol class="mp-reasons">${[
    ["Held by cleats, not nailed through", "Copper clips folded into the seams hold each sheet down while letting it slide. A nail driven through the metal pins it in place, and the copper fatigues around it."],
    ["Room at the joints", "Long runs, gutters and flat-seam roofs get expansion joints, so the movement has somewhere to go instead of tearing a seam."],
    ["Seams that lock, then solder", "On flat-seam work, panels lock into each other before they are soldered, so the joint carries the load and the solder only seals it."],
  ].map(([h, p], i) => `
    <li><span class="mp-reason-num">0${i + 1}</span><h3>${h}</h3><p>${p}</p></li>`).join("")}
  </ol>
</section>

<section class="mp-section mp-section-cream mp-cu">
  <div class="mp-cu-top">
    <div class="mp-cu-text">
      <span class="eyebrow mp-eyebrow">Architectural Copper</span>
      <h2 class="mp-h2">Domes, turrets, finials <em>and flat-seam roofs</em></h2>
      <p>Beyond flashing, we build copper as a roof of its own: hand-laid domes and turrets, cupolas, finials, bay roofs and awnings in soldered flat-seam copper, and single and double-lock standing seam.</p>
    </div>
    <div class="mp-cu-photos">
      <figure class="mp-cu-ph is-main"><img src="assets/projects/westlake-designer-shingle/01.webp" alt="A hand-formed copper turret on a Westlake estate" loading="lazy" /><figcaption><a href="portfolio?p=westlake-designer-shingle">Copper turret, Westlake →</a></figcaption></figure>
      <figure class="mp-cu-ph is-inset"><img src="assets/projects/st-louis-central-west-end-clay/04.webp" alt="A copper dormer roof weathered to green, set into clay tile in St. Louis" loading="lazy" /><figcaption><a href="portfolio?p=st-louis-central-west-end-clay">Copper dormer, St. Louis →</a></figcaption></figure>
    </div>
  </div>

  <div class="mp-cu-block">
    <span class="mp-label">Three ways to build a copper roof</span>
    <div class="mp-cu-systems">${CU_SYSTEMS.map((c) => `
      <div class="mp-cu-sys">
        <svg viewBox="0 0 160 72" aria-hidden="true">${c.svg}</svg>
        <h3>${c.name}</h3>
        <span class="mp-cu-use">${c.use}</span>
        <p>${c.text}</p>
      </div>`).join("")}
    </div>
  </div>

  <div class="mp-cu-grid">
    <div class="mp-cu-metal">
      <span class="mp-label">The metal</span>
      <dl>${CU_SPECS.map(([k, v]) => `
        <div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
      </dl>
      <p class="mp-cu-src">Values from ASTM B370 and the Copper Development Association.</p>
    </div>
    <div class="mp-cu-patina">
      <span class="mp-label">How copper weathers</span>
      <ol class="mp-cu-stages">${CU_STAGES.map(([sw, name, chem, text]) => `
        <li><span class="mp-cu-chip" style="background:${sw}"></span><span class="mp-cu-stage"><strong>${name}</strong>${chem ? `<em>${chem}</em>` : ""}<span>${text}</span></span></li>`).join("")}
      </ol>
      <p class="mp-note">The green comes from brochantite, a copper sulfate that grows on the brown oxide layer and protects the metal under it. In the dry inland air of Dallas–Fort Worth that last step is slow: expect a brown roof for many years, and green that may come in only partly. Pre-patinated copper is available for owners who want the green from the start.</p>
    </div>
  </div>
</section>

<section class="mp-section">
  ${head("Copper With Every Partner", "The field changes. <em>The case for copper does not.</em>")}
  <div class="mp-partner-links">${partners.map(([href, h, p]) => `
    <a class="mp-plink" href="${href}"><span class="mp-plink-name">${h}</span><span class="mp-plink-text">${p}</span><span class="mp-plink-arrow">→</span></a>`).join("")}
  </div>
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
${moreMaterials("copper")}`;

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
// Partner pages (Phase 2 of Jack's Nov 2026 brief + decisions reply).
// Rules from Jack: we install every profile from each partner but stock none,
// so say "the full line", never "inventory"; no client names or addresses.
// Facts checked 2026-11-11: Ludowici dates follow our published history post;
// ESR-2727 (ICC-ES) covers La Escandella's Large S-Tile and 50 Mission; Brava's
// 1 in. profile, Class 4 and 50-year warranty are Brava's own published figures.
// ---------------------------------------------------------------------------
const showcase = (items) => `
  <div class="mp-blend-grid mp-show-${items.length}">${items.map((r) => `
    <a class="mp-blend" href="portfolio?p=${r.slug}">
      <span class="mp-blend-img" style="background-image:url('/${r.image || roofImg(r.slug)}')"></span>
      <span class="mp-blend-body">
        <span class="mp-label">${esc(r.place)}</span>
        <span class="mp-blend-list">${esc(r.title)}</span>
        <span class="mp-blend-link">See the project →</span>
      </span>
    </a>`).join("")}
  </div>`;

const profiles = (list, note) => `
  <ul class="mp-profiles">${list.map(([h, p]) => `
    <li><strong>${h}</strong><span>${p}</span></li>`).join("")}
  </ul>${note ? `
  <p class="mp-note">${note}</p>` : ""}`;

const band = (h, p, href = "contact.html", label = "Schedule a Consultation") => `
<section class="mp-band">
  <div class="mp-band-inner">
    <div>
      <h2>${h}</h2>
      <p>${p}</p>
    </div>
    <a class="btn-copper-solid" href="${href}">${label} ${ARROW}</a>
  </div>
</section>`;

function ludowiciPage() {
  // Archive figures sit opposite the dates they belong to; images come from
  // our published Ludowici history post (assets/blog/).
  const timeline = [
    ["Four centuries ago", "The Ludovisi family of Rome is known for its clay roof tile. The family later settles in Germany, where the name becomes Ludowici.",
      { src: "assets/blog/ludowici-terracotta-ornament.webp", alt: "Sculpted terra-cotta portrait medallions and ornamental tilework beneath a red tiled roof", cap: "Terra-cotta ornament of the kind the Ludowici firm was known for." }],
    ["1857", "Carl Ludowici buys a roof tile works in Ensheim, Germany. The firm later moves its main works to Jockgrim.",
      { src: "assets/blog/ludowici-jubilee-catalog.webp", alt: "The green cloth cover of Ludowici's 1907 jubilee catalog, with the dates 1857 to 1907", cap: "The 1907 jubilee catalog, marking fifty years of the firm." }],
    ["1888", "The Celadon Terra Cotta Company is formed in Alfred, New York, and soon turns to roof tile."],
    ["1905", "Celadon buys a three-year-old tile plant in New Lexington, Ohio.",
      { src: "assets/blog/ludowici-tiler-laying.webp", alt: "A black-and-white photograph of a roofer hand-laying interlocking clay tile on battens", cap: "Hand-laying interlocking clay tile, from the company's early decades." }],
    ["1906", "Celadon and the American Ludowici company merge to form Ludowici-Celadon.",
      { src: "assets/blog/ludowici-celadon-chicago-sign.webp", alt: "Five men seated atop a works sign reading Ludowici Celadon Co. of Chicago, Roofing Tile", cap: "A works sign for the newly merged Ludowici-Celadon Co. of Chicago.", small: true }],
    ["World War II", "With building at a standstill, the plants make pottery, including cookie jars, to keep the kilns running."],
    ["1956", "New Lexington becomes the company's only plant, as it remains today."],
    ["1989 to 1994", "CertainTeed buys the company and renames it Ludowici Roof Tile."],
    ["2019", "Ludowici opens a showroom in Dallas for architects and designers."],
    ["2021", "The historic core of the New Lexington works is listed on the National Register of Historic Places."],
  ];
  const why = [
    ["Matching the original roof", "Ludowici has made clay tile in Ohio for well over a century, and can remake its own historic molds. When a roof needs repair, the new tile can match the old."],
    ["Recreating lost profiles", "Heinz, Mound City, Cincinnati and Mineral Wells tile are no longer made. Ludowici can match profiles like these, so a historic roof keeps its character."],
    ["Built for a century", "Dense, kiln-fired clay that does not fade, burn or rot. Installed and flashed correctly, a Ludowici roof lasts a century or more."],
    ["Clay that fires hard and true", "New Lexington sits on Ohio underclay that is rich in kaolinite and low in iron. It fires harder than ordinary surface clay, and glazes come out cleaner and truer. Ludowici still digs its clay a few miles from the plant, and by 1910 Ohio made about a third of the roofing tile in the country."],
  ];
  const profileList = [
    ["Spanish", "The classic S-curve barrel."],
    ["Mission", "Two-piece pan and cover."],
    ["French", "Interlocking, with a strong vertical rib."],
    ["Classic", "An interlocking flat tile."],
    ["Williamsburg", "An interlocking flat shingle tile."],
    ["Flat shingle", "Flat tiles laid like slate."],
  ];
  const fig = (f) => f ? `<figure class="mp-arc-fig${f.small ? " is-small" : ""}"><img src="${f.src}" alt="${esc(f.alt)}" loading="lazy" /><figcaption>${f.cap}</figcaption></figure>` : "";
  const body = `
<section class="mp-section mp-source">
  <div class="mp-source-text">
    <span class="eyebrow mp-eyebrow">Why We Build With Ludowici</span>
    <h2 class="mp-h2">The tile that is <em>already on the roof.</em></h2>
    <p>Many of the historic clay roofs we restore were built with Ludowici, or with tile from makers that have since closed. Ludowici is still making tile in the same Ohio works, which means a damaged roof can be repaired to match instead of replaced.</p>
    <p>We install the full Ludowici line, and every order is made for the roof it goes on.</p>
  </div>
  <div class="mp-source-photos">
    <figure class="mp-ph mp-ph-wide"><img src="assets/projects/st-louis-ludowici-tile/03.webp" alt="Ludowici tile meeting hand-formed copper below a sunroom on one of our St. Louis roofs" loading="lazy" /></figure>
    <figure class="mp-ph"><img src="assets/projects/st-louis-ludowici-tile/01.webp" alt="Ludowici S-tile and a brick chimney on one of our St. Louis roofs" loading="lazy" /></figure>
    <figure class="mp-ph"><img src="assets/projects/dallas-parish-clay/04.webp" alt="Clay tile hips and valleys on Holy Trinity Catholic Church in Dallas" loading="lazy" /></figure>
  </div>
</section>

<section class="mp-section mp-section-cream">
  <h2 class="mp-statement-h">Four reasons we reach for Ludowici</h2>
  <ol class="mp-reasons">${why.map(([h, p], i) => `
    <li><span class="mp-reason-num">0${i + 1}</span><h3>${h}</h3><p>${p}</p></li>`).join("")}
  </ol>
  <p class="mp-readmore mp-center">Matching a tile that is no longer made? <a href="discontinued.html">See discontinued products</a>.</p>
</section>

<section class="mp-section mp-section-dark mp-archive">
  <div class="mp-archive-head">
    <span class="eyebrow">The History</span>
    <h2>From Rome to New Lexington, Ohio</h2>
    <p>America's oldest clay roof tile maker, in ten dates.</p>
  </div>
  <ol class="mp-arc">${timeline.map(([y, t, f], i) => `
    <li class="mp-arc-row ${i % 2 ? "is-right" : "is-left"}">
      <div class="mp-arc-entry"><span class="mp-arc-year">${y}</span><p>${t}</p></div>
      <span class="mp-arc-dot" aria-hidden="true"></span>
      <div class="mp-arc-side">${fig(f)}</div>
    </li>`).join("")}
  </ol>
  <p class="mp-readmore mp-center"><a href="blog/ludowici-roof-tile-history">Read the full history of Ludowici</a>, with sources.</p>
</section>

<section class="mp-section mp-statement">
  <p>A damaged clay roof rarely needs a new roof. <em>It needs the right tile.</em></p>
</section>

<section class="mp-section mp-section-cream mp-profile-split">
  <figure class="mp-profile-photo">
    <img src="assets/projects/st-louis-ludowici-tile/02.webp" alt="A St. Louis home roofed by us in Ludowici S-tile" loading="lazy" />
    <figcaption>Ludowici Spanish tile in Summer Rose and Clay Red, St. Louis.</figcaption>
  </figure>
  <div>
    <span class="eyebrow mp-eyebrow">Profiles We Install</span>
    <h2 class="mp-h2">Every profile Ludowici fires, <em>made to order.</em></h2>
    <p>Every Ludowici profile, in its standard colors, blends and custom matches.</p>
    <ul class="mp-profile-list">${profileList.map(([h, p]) => `
      <li><strong>${h}</strong><span>${p}</span></li>`).join("")}
    </ul>
  </div>
</section>

<section class="mp-section">
  <div class="mp-feature">
    <a class="mp-feature-img" href="portfolio?p=dallas-parish-clay" style="background-image:url('/assets/projects/dallas-parish-clay/03.webp')" aria-label="See the Holy Trinity Catholic Church project"></a>
    <div class="mp-feature-body">
      <span class="mp-label">On Our Roofs · Dallas</span>
      <h2>Holy Trinity Catholic Church</h2>
      <p>Clay tile taken up, salvaged and re-laid by hand over new underlayment, with every flashing rebuilt in copper, while the building stayed open.</p>
      <a class="mp-blend-link" href="portfolio?p=dallas-parish-clay">See the project →</a>
      <a class="mp-onroof" href="portfolio?p=st-louis-ludowici-tile">
        <img src="${roofImg("st-louis-ludowici-tile")}" alt="" loading="lazy" />
        <span><span class="mp-label">Also on our roofs · St. Louis</span>Ludowici S-tile in Summer Rose and Clay Red, with copper at every transition →</span>
      </a>
    </div>
  </div>
</section>
${band("Restoring a historic clay roof?", "We assess the tile on the roof, identify the maker and profile, and tell you what can be saved and what needs to be matched.")}
${moreMaterials("ludowici")}`;

  return shell({
    slug: "ludowici",
    title: "Ludowici Clay Roof Tile · Installed by Priority Designer · Dallas",
    description: "Ludowici clay roof tile, made in New Lexington, Ohio since 1906. Priority Designer installs the full Ludowici line in Dallas–Fort Worth and matches historic and discontinued tile.",
    heroImage: "assets/projects/holy-trinity-clay/01.webp",
    heroMobile: "assets/projects/holy-trinity-clay/01-mobile.webp",
    crumb: "Ludowici",
    eyebrow: "Ludowici · Clay Roof Tile",
    h1: "America's oldest clay roof tile, <em>still made in Ohio.</em>",
    sub: "Ludowici has fired clay roof tile in New Lexington, Ohio for more than a century. We install the full line, and use it to match historic roofs that no other tile can.",
    body,
  });
}

const STRIP_JS = `(function(){
  document.querySelectorAll(".mp-strip-section").forEach(function(sec){
    var strip = sec.querySelector(".mp-strip");
    sec.querySelectorAll(".mp-strip-nav button").forEach(function(b){
      b.addEventListener("click", function(){ strip.scrollBy({ left: Number(b.dataset.dir) * strip.clientWidth * 0.8, behavior: "smooth" }); });
    });
  });
})();`;

function laEscandellaPage() {
  // TODO(jack): founding details from the La Escandella rep go in the company section.
  const trust = [
    { title: "Certified in Europe", text: "Made to EN 1304, the European standard for clay roof tile, with the French NF mark across its range.",
      icon: icon('<circle cx="16" cy="13" r="8"/><path d="m12.5 13 2.5 2.5 4.5-5"/><path d="m11 20-2 9 7-3 7 3-2-9"/>') },
    { title: "Evaluated in the US", text: "ICC-ES evaluation report ESR-2727 covers its Large S-Tile and 50 Mission tile for use under US building codes.",
      icon: icon('<path d="M16 3 6 7v8c0 7 4.5 11.5 10 14 5.5-2.5 10-7 10-14V7z"/><path d="m11.5 16 3 3 6-6.5"/>') },
    { title: "Traceable", text: "Each tile is stamped with its plant and production date code.",
      icon: icon('<rect x="5" y="9" width="22" height="14" rx="2"/><path d="M9 14h8M9 18h5"/><circle cx="22" cy="16" r="2.5"/>') },
    { title: "Clay all the way through", text: "Fired clay color that does not fade, and a tile that is fully recyclable at the end of its life.",
      icon: icon('<path d="M4 22c4-8 20-8 24 0"/><path d="M4 22c0 3 5 5 12 5s12-2 12-5"/><path d="M10 17c1-6 11-6 12 0"/>') },
  ];
  const profileList = [
    ["Large S-Tile", "The Spanish S-curve barrel."],
    ["Mission and curved", "Two-piece pan and cover, and the traditional curved tile."],
    ["French", "Interlocking tile with a strong vertical rib."],
    ["Flat", "A clean, flat clay tile for modern and Norman roofs."],
    ["H-Selection", "La Escandella's premium finishes, such as Provence."],
  ];
  const strip = [
    ["st-louis-central-west-end-clay", "04", "A copper dormer roof set into French tile in Jaspee Red"],
    ["st-louis-la-escandella-tile", "01", "Spanish S-tile in H-Selection Provence, with a copper vent"],
    ["st-louis-central-west-end-clay", "06", "The whole French tile roof from above"],
    ["st-louis-central-west-end-clay", "01", "French tile in Jaspee Red across hips and dormers"],
    ["st-louis-la-escandella-tile", "04", "Spanish S-tile in H-Selection Provence"],
    ["st-louis-central-west-end-clay", "03", "Hips, valleys and dormers from above"],
    ["st-louis-la-escandella-tile", "03", "The S-tile field around the chimneys"],
  ];
  const body = `
<section class="mp-section mp-section-cream mp-origin">
  <div class="mp-origin-text">
    <span class="eyebrow mp-eyebrow">The Company</span>
    <h2 class="mp-h2">Clay from the hills <em>above Alicante.</em></h2>
    <p>La Escandella makes clay roof tile in Agost, in the province of Alicante, a short drive inland from the Mediterranean coast. It is one of the largest roof tile makers in Europe, with roofs on five continents.</p>
    <p>We install the full La Escandella line, from its Spanish S-tile to its flat and French tile, ordered for each roof.</p>
    <div class="mp-route" aria-label="From Agost, Spain to our roofs in St. Louis">
      <span><strong>Agost</strong>Alicante, Spain</span>
      <span class="mp-route-line" aria-hidden="true"></span>
      <span><strong>St. Louis</strong>Missouri</span>
    </div>
  </div>
  <figure class="mp-origin-photo"><img src="assets/projects/st-louis-central-west-end-clay/05.webp" alt="The round turret of a historic St. Louis home in La Escandella French clay tile, capped in copper" loading="lazy" /></figure>
</section>

<section class="mp-section">
  <h2 class="mp-statement-h">European standards, tested in the US</h2>
  <ul class="mp-proof-grid mp-trust-grid">${trust.map((t) => `
    <li>${t.icon}<strong>${t.title}</strong><span>${t.text}</span></li>`).join("")}
  </ul>
</section>

<section class="mp-section mp-section-dark mp-versus">
  <div class="mp-archive-head">
    <span class="eyebrow">Ludowici or La Escandella</span>
    <h2>Two clay tiles, two different jobs</h2>
  </div>
  <div class="mp-versus-grid">
    <a class="mp-versus-card" href="materials/ludowici">
      <span class="mp-versus-img" style="background-image:url('/assets/projects/st-louis-ludowici-tile/02.webp')"></span>
      <span class="mp-versus-body">
        <span class="mp-label">Choose Ludowici</span>
        <span class="mp-versus-h">When an American historic roof must be matched.</span>
        <span class="mp-versus-p">Ludowici can remake its own historic profiles and match tile that is no longer made.</span>
        <span class="mp-blend-link">The Ludowici page →</span>
      </span>
    </a>
    <div class="mp-versus-card is-current">
      <span class="mp-versus-img" style="background-image:url('/assets/projects/st-louis-la-escandella-tile/02.webp')"></span>
      <span class="mp-versus-body">
        <span class="mp-label">Choose La Escandella</span>
        <span class="mp-versus-h">For Spanish, Mediterranean and French Norman character.</span>
        <span class="mp-versus-p">Old-world color and texture on a new roof, or a new home designed in a European style.</span>
      </span>
    </div>
  </div>
</section>

<section class="mp-section">
  <div class="mp-banner-photo" style="background-image:url('/assets/projects/st-louis-la-escandella-tile/01.webp')">
    <div class="mp-banner-photo-text">
      <span class="eyebrow">Profiles We Install</span>
      <h2>The full La Escandella line</h2>
    </div>
  </div>
  <ul class="mp-profile-cols">${profileList.map(([h, p]) => `
    <li><strong>${h}</strong><span>${p}</span></li>`).join("")}
  </ul>
  <p class="mp-note">Every profile, in its standard and H-Selection finishes.</p>
</section>

<section class="mp-section mp-section-cream mp-strip-section">
  <div class="mp-strip-head">
    <span class="mp-label">On Our Roofs · St. Louis</span>
    <p>Two La Escandella roofs we installed: <a href="portfolio?p=st-louis-central-west-end-clay">French tile in Jaspee Red</a> on a historic home, and <a href="portfolio?p=st-louis-la-escandella-tile">Spanish S-tile in H-Selection Provence</a>.</p>
    <div class="mp-strip-nav"><button type="button" data-dir="-1" aria-label="Previous photos">←</button><button type="button" data-dir="1" aria-label="More photos">→</button></div>
  </div>
  <div class="mp-strip" tabindex="0" aria-label="Photos of La Escandella roofs we installed">${strip.map(([slug, n, cap]) => `
    <a class="mp-strip-item" href="portfolio?p=${slug}"><img src="assets/projects/${slug}/${n}.webp" alt="${esc(cap)}" width="1600" height="${slug === "st-louis-la-escandella-tile" ? 900 : 1199}" loading="lazy" /><span>${esc(cap)}</span></a>`).join("")}
  </div>
</section>
${band("Designing a Mediterranean roof?", "We bring samples to the house and lay the colors out against your stucco, stone and trim before anything is ordered.")}
${moreMaterials("la-escandella")}`;

  return shell({
    slug: "la-escandella",
    title: "La Escandella Clay Roof Tile · Installed by Priority Designer · Dallas",
    description: "La Escandella clay roof tile from Agost, Spain: Spanish S-tile, mission, French and flat profiles, certified to European standards. Installed by Priority Designer in Dallas–Fort Worth and St. Louis.",
    heroImage: "assets/projects/st-louis-central-west-end-clay/02.webp",
    heroPos: "center 45%",
    extraJs: STRIP_JS,
    crumb: "La Escandella",
    eyebrow: "La Escandella · Clay Roof Tile from Spain",
    h1: "Mediterranean clay, <em>fired to European standards.</em>",
    sub: "Spanish, Mediterranean and French Norman roofs in fired clay from the south of Spain. We install the full line.",
    body,
  });
}

function bravaPage() {
  const vs = [
    ["Thin pieces cracking at the corners through freeze and thaw", "A 1 in. profile, molded from real slate"],
    ["Rubber slates curling and exposing the nails", "Rigid, recycled polyethylene that holds its shape"],
    ["Surfaces thinning as UV stabilizers fail", "UV inhibitors, with the color mixed all the way through"],
    ["Hail damage", "A Class 4 impact rating"],
    ["Pieces breaking in shipping, on install or underfoot", "Built to resist breakage from the truck to the roof"],
  ];
  const stats = [
    ["1 in.", "Profile at the butt, molded from real slate"],
    ["Class 4", "Impact rating under UL 2218"],
    ["50 yr", "Limited, transferable warranty"],
    ["USA", "Made in the United States from recycled material"],
  ];
  const yes = [
    "When the framing cannot carry the weight of slate or clay",
    "Where hail is a real risk and a Class 4 rating matters",
    "For a slate or tile look on a new home or addition",
  ];
  const no = [
    "When the original slate or clay is sound and can be repaired",
    "On a historic roof that should be matched in its original material",
    "When natural slate or clay fits the house and the budget",
  ];
  const tile = (slug, n, profile, place, text, cls = "") => `
    <a class="mp-mosaic-tile ${cls}" href="portfolio?p=${slug}" style="background-image:url('/assets/projects/${slug}/${n}.webp')">
      <span class="mp-mosaic-cap"><span class="mp-label">${profile} · ${place}</span>${text} →</span>
    </a>`;
  const body = `
<section class="mp-section mp-section-cream">
  <figure class="ethos-quote mp-quote">
    <div class="ethos-quote-img"><img src="assets/projects/nichols-hills-brava-slate/04.webp" alt="Brava slate in Washington with a copper chimney cap, on one of our Oklahoma roofs" loading="lazy" /></div>
    <div class="ethos-quote-body">
      <blockquote>We are roofing snobs. Brava earned its place.</blockquote>
      <figcaption>Why we install Brava</figcaption>
      <p>We install what we believe in, and that is usually natural slate or authentic clay tile. When a roof calls for a synthetic, Brava is the one we install and stand behind.</p>
      <p>Brava has never discontinued a product, so a roof can be repaired with matching tile years from now. Its slate, tile and shake are lightweight and Class 4 rated, and we install the full line.</p>
    </div>
  </figure>
</section>

<section class="mp-section mp-section-dark mp-bignums">
  <h2 class="mp-statement-h">What the specs actually say</h2>
  <ul class="mp-bignum-row">${stats.map(([n, t]) => `
    <li><strong>${n}</strong><span>${t}</span></li>`).join("")}
  </ul>
  <p class="mp-note mp-note-dark mp-center">Ratings and warranty as published by Brava.</p>
</section>

<section class="mp-section mp-xv-section">
  <div class="mp-xv-intro">
    <span class="eyebrow mp-eyebrow">What Brava Solves</span>
    <h2 class="mp-h2">What we see fail <em>on other synthetics</em></h2>
  </div>
  <div class="mp-xv">
    <div class="mp-xv-row mp-xv-head"><span>On other synthetics</span><span>How Brava is built</span></div>${vs.map(([a, b]) => `
    <div class="mp-xv-row"><span class="mp-xv-x"><i aria-hidden="true">✕</i>${a}</span><span class="mp-xv-v"><i aria-hidden="true">✓</i>${b}</span></div>`).join("")}
  </div>
</section>

<section class="mp-advice" aria-label="Our honest advice">
  <div class="mp-advice-half is-yes">
    <span class="mp-label">Our Honest Advice</span>
    <h2>When we recommend it</h2>
    <ul>${yes.map((t) => `<li>${t}</li>`).join("")}</ul>
  </div>
  <div class="mp-advice-half is-no">
    <span class="mp-label">And the other side</span>
    <h2>When we will say no</h2>
    <ul>${no.map((t) => `<li>${t}</li>`).join("")}</ul>
  </div>
</section>

<section class="mp-section">
  ${head("Profiles We Install", "The full Brava line, <em>on our roofs</em>", "Old World Slate, including multi-width, in Brava's full range of colors; Spanish barrel tile, including custom colors; and cedar shake, with the look of hand-split shake and none of the upkeep.")}
  <div class="mp-mosaic">${tile("dallas-brava-slate", "01", "Old World Slate", "Dallas", "Multi-width slate in Light Arendale, with copper at the eaves and valleys", "is-big")}${tile("sherman-brava-tile", "06", "Spanish Barrel Tile", "Sherman", "Barrel tile in a custom brown")}${tile("nichols-hills-brava-slate", "05", "Old World Slate", "Nichols Hills, Oklahoma", "Slate in Washington, with copper chimney caps")}
  </div>
</section>
${band("Weighing slate against Brava?", "We will show you both on your house and give you an honest answer about which one it needs.")}
${moreMaterials("brava")}`;

  return shell({
    slug: "brava",
    title: "Brava Composite Slate & Tile · Installed by Priority Designer · Dallas",
    description: "Brava composite slate, tile and shake: a 1 in. profile molded from real slate, Class 4 impact rated, made in the USA. The synthetic Priority Designer installs and stands behind in Dallas–Fort Worth.",
    heroImage: "assets/projects/nichols-hills-brava-slate/01.webp",
    crumb: "Brava",
    eyebrow: "Brava · Composite Slate, Tile & Shake",
    h1: "The synthetic we install <em>and stand behind.</em>",
    sub: "Natural slate and clay come first. When a roof calls for a synthetic, Brava is the one we trust.",
    body,
  });
}


// ---------------------------------------------------------------------------
// Lightweight Slate (Jack, 2026-11-18: "can pretty much look like the attachment",
// his 4-page Lightweight Slate brochure). Copy, figures, diagrams and photos are
// from that brochure; diagrams/photos extracted to assets/materials/lightweight/.
// ---------------------------------------------------------------------------
const dots = (n) => `<span class="mp-dots" aria-label="${n} of 5">${[1,2,3,4,5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;

function lightweightSlatePage() {
  const fit = [
    ["Buildings not engineered for full-weight slate", "Homes never framed to carry a traditional slate roof can still have real stone, often with little or no added structure."],
    ["An upgrade from lesser roofs", "A step up from asphalt shingle, cedar shake or synthetic slate to a roof of natural stone."],
    ["A lighter load for long-standing slate roofs", "Buildings that have carried heavy slate for decades can move to a lighter load and protect the structure."],
  ];
  const specs = [
    ["Slate length", "12 in. or 14 in."],
    ["Exposure (12 in. slate)", "8 in."],
    ["Overlap", "4 in."],
    ["Fastening", "2 slating nails per slate"],
    ["Interlayment", "21 in. HDPE, every course"],
    ["1/4 to 3/8 in. slate", "under 6 lb / sq ft"],
    ["3/8 to 1/2 in. slate", "under 9 lb / sq ft"],
  ];
  const pieces = [["12 × 6", 300, "14 × 7", 206], ["12 × 7", 257, "14 × 8", 180], ["12 × 8", 225, "14 × 9", 160], ["12 × 9", 200, "14 × 10", 144], ["12 × 10", 180, "14 × 11", 131], ["12 × 11", 164, "14 × 12", 120], ["12 × 12", 150, "", ""]];
  const ratings = [
    ["Hail · FM 4473", "Class 3 to Class 4", "Class 3 for 1/4 to 3/8 in. slate; Class 4 for 3/8 to 1/2 in. Some insurers discount premiums at these ratings."],
    ["Wind-driven rain · TAS 100(A)", "Passed at 110 mph", "Tested to the Miami-Dade wind-driven rain protocol."],
    ["Fire · UL 790", "Class A", "The highest fire rating available, for 1/4 in. natural slate."],
  ];
  const rocks = [
    { name: "Metalutite", abs: 5, flex: 2, sheen: 1, cleave: "Irregular, weak", ex: '<span class="mp-rock-no">Most Brazilian “slate.”</span> Not installed by Priority.' },
    { name: "Slate", abs: 3, flex: 5, sheen: 2, cleave: "Thin, flat, even", ex: "Galcar®, Franvisa®, Vermont", on: true },
    { name: "Phyllite", abs: 2, flex: 4, sheen: 4, cleave: "Good, lustrous", ex: "Sierra and Lugo", on: true },
    { name: "Mica schist", abs: 1, flex: 2, sheen: 5, cleave: "Thick, flaky", ex: "Not a roofing stone" },
  ];
  const minerals = [["Muscovite mica", 35, "#1a2233"], ["Chlorite", 30, "#4f6b5c"], ["Quartz", 25, "#c9a660"], ["Feldspar", 8, "#8a5a2b"], ["Accessory", 2, "#a9adb5"]];
  const colors = [
    ["#3b3f47", "Black-gray", "Deposited where the sea floor had no oxygen; carbon and iron sulfides darken the stone."],
    ["#6d8a6d", "Green", "Chlorite-rich clay with little oxygen; iron stays in reduced form."],
    ["#7a3d4b", "Red-purple", "Oxygen-rich water oxidized the iron into hematite."],
  ];
  const roofs = [
    ["galcar-dallas", "Clipped Galcar® with copper, Dallas, TX"],
    ["vermont-black-nichols-hills", "Vermont Black, Nichols Hills, OK"],
    ["lightweight-dallas", "Lightweight slate, Dallas, TX"],
  ];
  const fibers = (aligned) => {
    let out = "";
    for (let i = 0; i < 26; i++) {
      const x = 22 + ((i * 37) % 76), y = 22 + ((i * 53) % 76);
      if (aligned) out += `<line x1="${18 + (i % 4) * 22}" y1="${24 + Math.floor(i / 4) * 11}" x2="${34 + (i % 4) * 22}" y2="${24 + Math.floor(i / 4) * 11}"/>`;
      else { const a = (i * 47) % 180 * Math.PI / 180; out += `<line x1="${x}" y1="${y}" x2="${(x + 9 * Math.cos(a)).toFixed(1)}" y2="${(y + 9 * Math.sin(a)).toFixed(1)}"/>`; }
    }
    return out;
  };
  const body = `
<section class="mp-section mp-lw-intro">
  <div class="mp-lw-intro-text">
    <span class="eyebrow mp-eyebrow">Still a Natural Slate Roof</span>
    <h2 class="mp-h2">Real stone, <em>on a lighter system.</em></h2>
    <p>A lightweight slate roof is still a natural slate roof. Every piece is quarried, split and trimmed stone of the highest ASTM grade, laid with a 4-inch overlap over an HDPE interlayment instead of the traditional 10½-inch overlap. From the street it reads as traditional slate. On the rafters it weighs roughly a third less.</p>
    <ul class="mp-lw-chips"><li>ASTM C406 S1</li><li>35–40% lighter</li><li>Spanish &amp; Vermont stone</li></ul>
  </div>
  <div class="mp-lw-fit">
    <span class="mp-label">Perfect for</span>${fit.map(([h, p]) => `
    <div class="mp-lw-fit-item"><h3>${h}</h3><p>${p}</p></div>`).join("")}
  </div>
</section>

<section class="mp-section mp-section-cream">
  <span class="eyebrow mp-eyebrow mp-center-eyebrow">The System</span>
  <h2 class="mp-statement-h">How lightweight slate works</h2>
  <p class="mp-move-intro">Traditional slate gives three layers of protection: each course is covered by the 7½ in. exposure of the second course and the 3 in. headlap of the third. Lightweight slate gives you the same coverage with an HDPE interlayment between courses that does the work of the traditional headlap.</p>
  <div class="mp-lw-compare">
    <figure class="mp-lw-panel">
      <span class="mp-label">Traditional slate</span>
      <img src="assets/materials/lightweight/traditional.webp" alt="Traditional slate: 18 in. slates at 7.5 in. exposure with a 10.5 in. overlap" width="1039" height="600" loading="lazy" />
      <strong>Over 9 lb per sq ft*</strong>
      <p>Three layers at every point: the course itself, the exposure of the course above, and the 3 in. headlap of the course above that.</p>
    </figure>
    <figure class="mp-lw-panel is-light">
      <span class="mp-label">Lightweight slate</span>
      <img src="assets/materials/lightweight/lightweight.webp" alt="Lightweight slate: 12 in. slates at 8 in. exposure with a 4 in. overlap over HDPE interlayment" width="1039" height="600" loading="lazy" />
      <strong>Under 6 lb per sq ft*</strong>
      <p>Shorter slates at a single overlap, with a 21 in. HDPE interlayment under every course in place of the headlap: a 35 to 40% lighter roof.</p>
    </figure>
  </div>
  <p class="mp-note mp-center">*Typical for 1/4 to 3/8 in. slate. Actual weight depends on slate thickness and size. Illustrations are simplified.</p>
</section>

<section class="mp-section mp-lw-specs">
  <div class="mp-lw-tables">
    <div>
      <h3 class="mp-lw-th">System specifications</h3>
      <table class="mp-lw-table"><tbody>${specs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</tbody></table>
    </div>
    <div>
      <h3 class="mp-lw-th">Pieces per square</h3>
      <table class="mp-lw-table mp-lw-pcs"><thead><tr><th>Size (in.)</th><th>Pcs</th><th>Size (in.)</th><th>Pcs</th></tr></thead><tbody>${pieces.map(([a, b, c, d]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td><td>${d}</td></tr>`).join("")}</tbody></table>
    </div>
  </div>
</section>

<section class="mp-section mp-section-dark mp-lw-ratings">
  <ul>${ratings.map(([k, h, p]) => `
    <li><span class="mp-label">${k}</span><strong>${h}</strong><span>${p}</span></li>`).join("")}
  </ul>
</section>

<section class="mp-section mp-section-cream mp-lw-stone">
  <span class="eyebrow mp-eyebrow mp-center-eyebrow">The Stone</span>
  <h2 class="mp-statement-h">What makes slate, slate</h2>
  <p class="mp-move-intro">Roofing slate starts as clay mud on an ancient sea floor. Buried and squeezed at low temperature and pressure, its clay minerals recrystallize and line up. That alignment, called slaty cleavage, is what lets the stone split into thin, flat, durable sheets.</p>
  <div class="mp-lw-meta" aria-label="Metamorphism: heat and pressure turn shale into slate">
    <div class="mp-lw-rock"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" class="c"/><g class="f">${fibers(false)}</g></svg><span><strong>Shale / lutite</strong>Loosely packed clay minerals, laid down as sea-floor mud</span></div>
    <div class="mp-lw-arrow"><svg viewBox="0 0 164 14" aria-hidden="true"><path d="M2 7 H158 M150 1 L160 7 L150 13"/></svg><span>Metamorphism: heat &amp; pressure</span></div>
    <div class="mp-lw-rock is-slate"><span><strong>Slate</strong>Tightly packed, aligned chlorite and mica: slaty cleavage</span><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" class="c"/><g class="f a">${fibers(true)}</g></svg></div>
  </div>

  <h3 class="mp-lw-sub">Not every “slate” is slate</h3>
  <p class="mp-lw-subp">The intensity of metamorphism decides what the rock becomes. Too little and the clay never fully aligns; too much and the crystals grow large and brittle. True slate sits at the optimum. Priority installs only the shaded stones.</p>
  <div class="mp-lw-rocks-scroll">
    <table class="mp-lw-rocks">
      <thead><tr><th></th>${rocks.map((r) => `<th class="${r.on ? "on" : ""}">${r.name}</th>`).join("")}</tr></thead>
      <tbody>
        <tr><td>Water absorption</td>${rocks.map((r) => `<td class="${r.on ? "on" : ""}">${dots(r.abs)}</td>`).join("")}</tr>
        <tr><td>Flexural strength</td>${rocks.map((r) => `<td class="${r.on ? "on" : ""}">${dots(r.flex)}</td>`).join("")}</tr>
        <tr><td>Sheen</td>${rocks.map((r) => `<td class="${r.on ? "on" : ""}">${dots(r.sheen)}</td>`).join("")}</tr>
        <tr><td>Cleavage / splitting</td>${rocks.map((r) => `<td class="${r.on ? "on" : ""}">${r.cleave}</td>`).join("")}</tr>
        <tr><td>Examples</td>${rocks.map((r) => `<td class="${r.on ? "on" : ""}">${r.ex}</td>`).join("")}</tr>
      </tbody>
    </table>
  </div>
  <p class="mp-note">Relative comparison along the metamorphic scale (more dots = more of the property; for water absorption, fewer is better). Not test values for any individual quarry.</p>

  <div class="mp-lw-two">
    <div>
      <h3 class="mp-lw-sub">Grain that works like rebar</h3>
      <p class="mp-lw-subp">Where the original bedding planes (S0) cross the cleavage planes (S1), good slate develops a grain the Spanish quarries call <em>hebra</em>. It acts like reinforcing bar in concrete and greatly raises bending strength.</p>
      <div class="mp-lw-hebra">
        <figure><svg viewBox="0 0 200 70" aria-hidden="true"><path d="M100 4 v14 m-5 -5 l5 5 l5 -5" class="ar"/><rect x="10" y="26" width="180" height="22" class="pl"/><path d="M100 26 l-4 6 l5 5 l-4 6 l3 5" class="cr"/></svg><figcaption>No grain: cracks through</figcaption></figure>
        <figure><svg viewBox="0 0 200 70" aria-hidden="true"><path d="M100 4 v14 m-5 -5 l5 5 l5 -5" class="ar"/><path d="M10 26 Q100 40 190 26 L190 48 Q100 62 10 48 Z" class="pl dk"/><path d="M18 33 Q100 46 182 33 M18 38 Q100 51 182 38 M18 43 Q100 56 182 43" class="gr"/></svg><figcaption>Hebra: grain carries the load</figcaption></figure>
      </div>
    </div>
    <div>
      <h3 class="mp-lw-sub">What it’s made of</h3>
      <p class="mp-lw-subp">Typical roofing slate composition. These minerals are stable in normal weather; the small accessory fraction is why quarry selection matters.</p>
      <div class="mp-lw-bar">${minerals.map(([n, v, c]) => `<span style="width:${v}%;background:${c}" title="${n} ${v}%"></span>`).join("")}</div>
      <ul class="mp-lw-legend">${minerals.map(([n, v, c]) => `<li><i style="background:${c}"></i>${n}<b>${v}%</b></li>`).join("")}</ul>
    </div>
  </div>

  <h3 class="mp-lw-sub">Color is set on the sea floor</h3>
  <div class="mp-lw-colors">${colors.map(([c, h, p]) => `
    <div><span class="mp-lw-swatch" style="background:${c}"></span><div><strong>${h}</strong><p>${p}</p></div></div>`).join("")}
  </div>
  <p class="mp-readmore">Read more: <a href="blog/what-makes-a-roofing-slate">What makes a roofing slate</a>.</p>
</section>

<section class="mp-section mp-lw-std">
  <span class="eyebrow mp-eyebrow mp-center-eyebrow">The Standard</span>
  <h2 class="mp-statement-h">S1 natural slate, nothing less</h2>
  <p class="mp-move-intro">ASTM C406 grades roofing slate by laboratory testing, not appearance. Priority Designer installs only S1, the highest grade, hand-selected from quarries in Spain and Vermont.</p>
  <div class="mp-lw-std-grid">
    <div>
      <h3 class="mp-lw-th">ASTM C406 grades</h3>
      <ul class="mp-lw-grades">
        <li class="on"><b>S1</b><span>Expected service life over 75 years</span><em>All we install</em></li>
        <li><b>S2</b><span>Expected service life 40 to 75 years</span></li>
        <li><b>S3</b><span>Expected service life 20 to 40 years</span></li>
      </ul>
      <span class="mp-label mp-lw-gb">Graded by</span>
      <table class="mp-lw-table"><tbody><tr><td>Water absorption</td><td>ASTM C121</td></tr><tr><td>Modulus of rupture</td><td>ASTM C120</td></tr><tr><td>Weathering resistance</td><td>ASTM C217</td></tr></tbody></table>
      <p class="mp-note">In a review of more than 200 EN 12326 technical sheets, Galcar® and Franvisa® slates ranked among the strongest tested for bending strength along the grain.</p>
    </div>
    <div class="mp-lw-dont">
      <span class="mp-label">What we don’t install</span>
      <h3>If it can’t prove S1, it doesn’t go on your roof.</h3>
      <ul>
        <li><strong>Chinese slate</strong></li>
        <li><strong>Brazilian metalutite</strong><span>Low-grade rock with weak fabric, sold as slate.</span></li>
        <li><strong>Undocumented stone</strong><span>Any slate without S1 test results and a known quarry.</span></li>
      </ul>
      <p>Stone is half the roof. The other half is the slater: even S1 slate fails when it is nailed, lapped or flashed poorly.</p>
    </div>
  </div>
</section>

<section class="mp-section mp-statement mp-lw-only">
  <p>The only company in Texas able to provide and install <em>Galcar®, Franvisa®, Sierra and Lugo phyllite slate.</em></p>
  <span class="mp-lw-tm">Galcar® and Franvisa® are registered trademarks of their respective owners.</span>
</section>

<section class="mp-section mp-section-cream">
  <span class="eyebrow mp-eyebrow mp-center-eyebrow">On Our Roofs</span>
  <h2 class="mp-statement-h">Recent lightweight slate roofs</h2>
  <div class="mp-lw-roofs">${roofs.map(([f, cap]) => `
    <figure><img src="assets/materials/lightweight/${f}.webp" alt="${esc(cap)}" width="900" height="683" loading="lazy" /><figcaption>${cap}</figcaption></figure>`).join("")}
  </div>
</section>
${band("Wondering whether your house can carry slate?", "We look at the framing and tell you whether it calls for lightweight slate, traditional slate, or a little added structure.")}
${moreMaterials("lightweight-slate")}`;

  return shell({
    slug: "lightweight-slate",
    title: "Lightweight Natural Slate Roofing · S1 Slate, 35–40% Lighter · Priority Designer",
    description: "Lightweight slate is real ASTM C406 S1 natural slate, Spanish and Vermont stone, laid with a 4 in. overlap over HDPE interlayment: a roof 35 to 40% lighter than traditional slate. Installed by Priority Designer in Dallas–Fort Worth.",
    heroImage: "assets/materials/lightweight/hero.webp",
    heroMobile: "assets/materials/lightweight/hero-mobile.webp",
    heroPos: "center 30%",
    crumb: "Lightweight Slate",
    eyebrow: "Lightweight Slate · Natural S1 Stone",
    h1: "Real S1 slate, <em>at a fraction of the weight.</em>",
    sub: "Quarried, split and hand-selected natural slate on a lighter system. From the street it reads as traditional slate. On the rafters it weighs roughly a third less.",
    body,
  });
}

// ---------------------------------------------------------------------------
export async function buildMaterials() {
  await mkdir("materials", { recursive: true });
  const pages = [
    { slug: "natural-slate", html: naturalSlatePage() },
    { slug: "lightweight-slate", html: lightweightSlatePage() },
    { slug: "copper", html: copperPage() },
    { slug: "ludowici", html: ludowiciPage() },
    { slug: "la-escandella", html: laEscandellaPage() },
    { slug: "brava", html: bravaPage() },
  ];
  for (const p of pages) await writeFile(`materials/${p.slug}.html`, p.html);
  return pages.map((p) => p.slug);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const slugs = await buildMaterials();
  slugs.forEach((s) => console.log(`  materials/${s}.html`));
}
