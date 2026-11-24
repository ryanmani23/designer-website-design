// Project + area page generator for the Priority Designer site.
//
// Emits fully-static HTML (text baked in, like the blog and material pages) so
// every job is its own indexable page:
//   projects/<slug>.html  served at /projects/<slug>  one page per PROJECTS entry
//   areas/<slug>.html     served at /areas/<slug>     location hubs (Highland Park, St. Louis)
//
// Sources:
//   data.jsx PROJECTS         every portfolio job (name, loc, tag, blend, photos, copy)
//   content/projects/*.md     optional showcase write-up for a job (Jack's handoff docs);
//                             `project:` = the PROJECTS slug it replaces, the file name = URL slug
//   content/areas/*.md        hub copy; {{projects}} and {{materials}} mark where the
//                             project grid and material cards go
//
// Public copy rule: no homeowner surnames and no house numbers (street names OK).

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import vm from "node:vm";
import { marked } from "marked";
import { esc, LIGHTBOX_JS } from "./build-blog.mjs";
import { shell } from "./build-materials.mjs";

const SITE = "https://prioritydesigner.com";
const ORG_ID = `${SITE}/#organization`;
const PORTFOLIO = { path: "projects", name: "Portfolio", href: "portfolio" };
const AREAS = { path: "areas", name: "Portfolio", href: "portfolio" };

// --- data -------------------------------------------------------------------

async function loadProjects() {
  const src = await readFile("data.jsx", "utf8");
  const ctx = { window: {} };
  vm.runInNewContext(src, ctx, { filename: "data.jsx" });
  return ctx.window.PROJECTS;
}

// Minimal front matter: `key: value` lines, plus `details:` followed by
// `- Label | Value` lines.
function parseDoc(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  let list = null;
  for (const line of m[1].split("\n")) {
    if (/^\s*-\s/.test(line) && list) {
      const [k, ...v] = line.replace(/^\s*-\s*/, "").split("|");
      data[list].push([k.trim(), v.join("|").trim()]);
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9]+):\s*(.*)$/);
    if (!kv) continue;
    if (kv[2] === "") { list = kv[1]; data[list] = []; } else { list = null; data[kv[1]] = kv[2]; }
  }
  return { data, body: m[2] };
}

async function loadDocs(dir) {
  let files = [];
  try { files = (await readdir(dir)).filter((f) => f.endsWith(".md")); } catch { return []; }
  return Promise.all(files.map(async (f) => ({ slug: f.replace(/\.md$/, ""), ...parseDoc(await readFile(`${dir}/${f}`, "utf8")) })));
}

// --- helpers ----------------------------------------------------------------

const MATERIALS = {
  "natural-slate": { kind: "Stone", name: "Natural Slate", line: "Spanish, Vermont and New York slate", image: "assets/materials/quarry/quarry-canyon.webp" },
  "lightweight-slate": { kind: "Stone", name: "Lightweight Slate", line: "Real S1 slate at a fraction of the weight", image: "assets/materials/lightweight/hero.webp" },
  ludowici: { kind: "Clay Tile", name: "Ludowici", line: "America's oldest clay roof tile", image: "assets/projects/holy-trinity-clay/01.webp" },
  "la-escandella": { kind: "Clay Tile", name: "La Escandella", line: "Mediterranean clay tile from Spain", image: "assets/projects/st-louis-central-west-end-clay/02.webp" },
  brava: { kind: "Composite", name: "Brava", line: "Composite slate and tile we stand behind", image: "assets/projects/nichols-hills-brava-slate/04.webp" },
  copper: { kind: "Metal", name: "Copper", line: "Flashing, gutters and architectural copper", image: "assets/projects/highland-park-variegated-slate-copper/02.webp" },
};

// Which material pages a job's roof belongs to.
function materialsFor(p) {
  const t = `${p.tag} ${p.blend || ""}`;
  const out = [];
  if (/Ludowici/i.test(t)) out.push("ludowici");
  if (/Escandella/i.test(t)) out.push("la-escandella");
  if (/Brava/i.test(t)) out.push("brava");
  if (/Slate/i.test(t) && !/DaVinci|Brava|Composite/i.test(t)) out.push("natural-slate");
  out.push("copper");
  return out;
}

const AREA_OF = { "Highland Park, TX": "highland-park", "University Park, TX": "highland-park", "St. Louis, MO": "st-louis" };
const AREA_NAME = { "highland-park": "Highland Park & University Park", "st-louis": "St. Louis" };

const pageSlug = (p) => p.pageSlug || p.slug;
const gallery = (p) => (p.gallery && p.gallery.length ? p.gallery : [p.image]);

function materialCards(slugs) {
  return `
<section class="mp-explore pj-mats" aria-label="Materials">
  <div class="mp-explore-head">
    <div>
      <span class="mp-label">The Materials</span>
      <h2>What went into this work</h2>
    </div>
    <a class="mp-explore-all" href="materials">All materials →</a>
  </div>
  <div class="mp-explore-row">${slugs.filter((s) => MATERIALS[s]).map((s) => { const m = MATERIALS[s]; return `
    <a class="mp-explore-card" href="materials/${s}">
      <span class="mp-explore-img" style="background-image:url('/${m.image}')"></span>
      <span class="mp-explore-text">
        <span class="mp-explore-kind">${m.kind}</span>
        <span class="mp-explore-name">${m.name}</span>
        <span class="mp-explore-line">${m.line}</span>
      </span>
      <span class="mp-explore-arrow" aria-hidden="true">→</span>
    </a>`; }).join("")}
  </div>
</section>`;
}

function projectCards(list, heading, eyebrow = "Our Work") {
  if (!list.length) return "";
  return `
<section class="mp-section pj-more" aria-label="${esc(heading)}">
  <div class="section-head mp-head">
    <div class="left">
      <span class="eyebrow">${eyebrow}</span>
      <h2>${heading}</h2>
    </div>
    <div class="right"><a class="mp-explore-all" href="portfolio">Full portfolio →</a></div>
  </div>
  <div class="pj-cards">${list.map((p) => `
    <a class="pj-card" href="projects/${pageSlug(p)}">
      <span class="pj-card-img"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy" width="800" height="600"></span>
      <span class="pj-card-text">
        <span class="pj-card-tag">${esc(p.tag)}</span>
        <span class="pj-card-name">${esc(p.name)}</span>
        <span class="pj-card-loc">${esc(p.loc)}</span>
      </span>
    </a>`).join("")}
  </div>
</section>`;
}

// --- project page -------------------------------------------------------------

function projectPage(p, all, doc) {
  const slug = pageSlug(p);
  const d = doc ? doc.data : {};
  const list = (v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
  let photos = d.gallery ? list(d.gallery) : [...gallery(p), ...list(d.moreGallery)];
  if (d.hero) photos = [d.hero, ...photos.filter((s) => s !== d.hero)]; // lead photo override
  const area = d.area || AREA_OF[p.loc];
  const details = d.details || [
    ["Location", p.loc],
    ["System", p.tag],
    ...(p.blend ? [["Blend", p.blend]] : []),
    ["Category", p.type],
  ];
  const story = doc
    ? marked.parse(doc.body.trim())
    : `<p>${esc(p.longDesc || p.desc)}</p>`;
  const title = d.title || `${p.name} | Priority Designer`;
  const description = d.description || p.desc;
  const nearby = all.filter((q) => q !== p && area && AREA_OF[q.loc] === area);
  const similar = all.filter((q) => q !== p && !nearby.includes(q) && q.type === p.type);
  const more = [...nearby, ...similar].slice(0, 3);

  const body = `
<section class="mp-section pj-story">
  <div class="pj-grid">
    <div class="pj-copy">${story}</div>
    <aside class="pj-details" aria-label="Project details">
      <span class="mp-label">Project Details</span>
      <dl>${details.map(([k, v]) => `
        <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
      </dl>
      ${area ? `<a class="pj-area-link" href="areas/${area}">More of our roofs in ${AREA_NAME[area]} →</a>` : ""}
      <a class="btn-copper pj-cta" href="contact.html">Discuss a Similar Project</a>
    </aside>
  </div>
</section>
<section class="mp-section mp-section-cream pj-photos" aria-label="Photos">
  <div class="section-head mp-head">
    <div class="left">
      <span class="eyebrow">Photos</span>
      <h2>The finished roof</h2>
    </div>
    <div class="right">Click any photo to enlarge it.</div>
  </div>
  <div class="pj-gallery">${photos.map((src, i) => `
    <figure class="${i === 0 ? "pj-wide" : ""}"><img src="${src}" alt="${esc(`${p.name}, photo ${i + 1}`)}" loading="${i < 2 ? "eager" : "lazy"}"></figure>`).join("")}
  </div>
</section>
${materialCards(materialsFor(p))}
${projectCards(more, nearby.length ? `More roofs nearby` : `More projects like this`)}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: (d.h1 || p.name).replace(/<[^>]+>/g, ""),
    description,
    url: `${SITE}/projects/${slug}`,
    image: photos.slice(0, 3).map((s) => `${SITE}/${s}`),
    ...(d.completed ? { dateCreated: d.completed } : {}),
    about: { "@type": "Place", name: p.loc, address: { "@type": "PostalAddress", addressLocality: p.loc.split(",")[0], addressRegion: (p.loc.split(",")[1] || "").trim() } },
    publisher: { "@id": ORG_ID, "@type": "RoofingContractor", name: "Priority Designer", url: `${SITE}/` },
  };

  return shell({
    slug, title, description,
    heroImage: photos[0], heroPos: d.heroPos || "center",
    crumb: p.name,
    eyebrow: d.eyebrow || `Project · ${esc(p.loc)}`,
    h1: d.h1 || esc(p.name),
    sub: d.sub || esc(p.desc),
    body,
    section: PORTFOLIO, navActive: "portfolio.html",
    extraSchema: [article],
    extraJs: LIGHTBOX_JS,
  });
}

// --- area hub -----------------------------------------------------------------

function areaPage(doc, all) {
  const d = doc.data;
  const locs = (d.locs || "").split(";").map((s) => s.trim());
  const list = all.filter((p) => locs.includes(p.loc));
  const mats = (d.materials || "").split(",").map((s) => s.trim()).filter(Boolean);
  const parts = doc.body.split(/\{\{(projects|materials)\}\}/);
  let body = "";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === "projects") body += projectCards(list, `Roofs we've built in ${esc(AREA_NAME[doc.slug] || d.place)}`);
    else if (part === "materials") body += materialCards(mats).replace("What went into this work", "The materials we use here");
    else if (part.trim()) body += `\n<section class="mp-section pj-area-copy"><div class="pj-prose">${marked.parse(part.trim())}</div></section>`;
  }
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: d.title.split("|")[0].trim(),
    description: d.description,
    url: `${SITE}/areas/${doc.slug}`,
    areaServed: { "@type": "Place", name: d.place },
    provider: { "@id": ORG_ID, "@type": "RoofingContractor", name: "Priority Designer", url: `${SITE}/` },
  };
  return shell({
    slug: doc.slug, title: d.title, description: d.description,
    heroImage: d.hero, heroPos: d.heroPos || "center",
    crumb: AREA_NAME[doc.slug] || d.eyebrow,
    eyebrow: d.eyebrow, h1: d.h1, sub: d.sub,
    body, section: AREAS, navActive: "portfolio.html",
    extraSchema: [service],
  });
}

// --- build --------------------------------------------------------------------

export async function buildProjects() {
  const projects = await loadProjects();
  const showcases = await loadDocs("content/projects");
  const areas = await loadDocs("content/areas");
  // A showcase doc takes over its job's page and URL.
  for (const doc of showcases) {
    const p = projects.find((q) => q.slug === doc.data.project);
    if (!p) throw new Error(`content/projects/${doc.slug}.md: unknown project "${doc.data.project}"`);
    if (pageSlug(p) !== doc.slug) throw new Error(`data.jsx: set pageSlug: "${doc.slug}" on ${p.slug}`);
  }
  await mkdir("projects", { recursive: true });
  await mkdir("areas", { recursive: true });
  const out = { projects: [], areas: [] };
  for (const p of projects) {
    const doc = showcases.find((s) => s.data.project === p.slug);
    await writeFile(`projects/${pageSlug(p)}.html`, projectPage(p, projects, doc));
    out.projects.push(pageSlug(p));
  }
  for (const a of areas) {
    await writeFile(`areas/${a.slug}.html`, areaPage(a, projects));
    out.areas.push(a.slug);
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await buildProjects();
  console.log(`  ${r.projects.length} project pages, areas: ${r.areas.join(", ")}`);
}
