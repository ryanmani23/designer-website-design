// Blog generator for the Priority Designer site.
//
// Reads content/blog/*.md and emits one fully-static HTML page per article
// under the blog/ directory (blog/<slug>.html, served at /blog/<slug>). Unlike
// the rest of the site (client-rendered
// React into an empty #root), article pages bake the full article text, nav,
// and footer into the HTML so search engines index the content directly. This
// is the SEO point of the blog, so do NOT convert these to client-rendered.
//
// The nav/footer markup here mirrors the <Nav>/<Footer> React components in
// sections.jsx (same class names, so dist/styles.css styles them). If those
// components change structurally, update the partials below to match.

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { marked } from "marked";

const SITE = "https://prioritydesigner.com";
const BRAND = "Priority Designer · Slate & Tile";
const CONTENT_DIR = "content/blog";

// Real NAP, mirrored from the Footer component in sections.jsx.
const PHONE_DISPLAY = "(214) 214-4909";
const PHONE_HREF = "+12142144909";
const EMAIL = "designer@priorityroofs.com";
const INSTAGRAM_HANDLE = "prioritydesignerroofs"; // keep in sync with sections.jsx
// Google Business Profile (keep in sync with GBP_URL / GBP_REVIEW_URL in sections.jsx).
const GBP_URL = "https://maps.google.com/?cid=2506983265811138772";
const GBP_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJnxj4nl2dToYR1IiFaP-XyiI";
const IG_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>';
const G_SVG = (n) => `<svg width="${n}" height="${n}" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

const NAV_ITEMS = [
  { label: "About", href: "about.html" },
  { label: "Portfolio", href: "portfolio.html" },
  { label: "Materials", href: "materials.html" },
  { label: "Discontinued Products", href: "discontinued.html" },
  { label: "Blog", href: "blog.html" },
];

const AFFILIATIONS = [
  "Tile Roofing Institute", "Slate Roofing Contractors", "National Slate Association",
  "Metal Roofing Consortium", "AIG & Chubb Preferred", "FORTIFIED",
];

const ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Minimal frontmatter parser: a leading `---` block of `key: value` lines.
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  }
  return { data, body: m[2] };
}

// "2026-07-01" -> "July 2026" for display.
function displayDate(iso) {
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function navMarkup(activeHref) {
  const links = NAV_ITEMS.map((n) =>
    `<a href="${n.href}"${n.href === activeHref ? ' class="active"' : ""}>${esc(n.label)}</a>`).join("");
  const overlayLinks = NAV_ITEMS.map((n) =>
    `<a href="${n.href}"${n.href === activeHref ? ' class="active"' : ""}>${esc(n.label)}</a>`).join("");
  return `
<nav class="nav">
  <a class="logo" href="index.html"><img src="assets/logo.png" alt="${esc(BRAND)}" class="logo-img" /></a>
  <div class="nav-links">${links}</div>
  <a class="cta-pill" href="contact.html">Schedule a Consultation <span class="icon">${ARROW}</span></a>
  <button class="nav-hamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-overlay"><span></span><span></span><span></span></button>
</nav>
<div id="nav-overlay" class="nav-overlay" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="nav-overlay-inner">
    <div class="nav-overlay-links">${overlayLinks}</div>
    <a class="cta-pill nav-overlay-cta" href="contact.html">Schedule a Consultation <span class="icon">${ARROW}</span></a>
  </div>
</div>`;
}

function footerMarkup() {
  const affs = AFFILIATIONS.map((a) => `<span class="footer-line-soft">${esc(a)}</span>`).join("");
  return `
<footer class="footer">
  <div class="footer-grid">
    <div class="footer-col">
      <span class="footer-head">Contact</span>
      <a class="footer-link" href="tel:${PHONE_HREF}">${PHONE_DISPLAY}</a>
      <a class="footer-link" href="sms:${PHONE_HREF}">Text Us</a>
      <a class="footer-link" href="mailto:${EMAIL}">${EMAIL}</a>
      <a class="footer-link footer-cta" href="contact.html">Schedule a Consultation →</a>
      <div class="footer-social">
        <a class="footer-social-btn is-ig" href="https://www.instagram.com/${INSTAGRAM_HANDLE}/" target="_blank" rel="noopener noreferrer" aria-label="Instagram @${INSTAGRAM_HANDLE}" title="@${INSTAGRAM_HANDLE}">${IG_SVG}</a>
        <a class="footer-social-btn is-google" href="${GBP_URL}" target="_blank" rel="noopener noreferrer" aria-label="Priority Designer on Google" title="Google Business Profile">${G_SVG(20)}</a>
      </div>
    </div>
    <div class="footer-col">
      <span class="footer-head">Visit</span>
      <span class="footer-line-soft">Dallas–Fort Worth Metroplex</span>
      <span class="footer-line-soft">Showroom by appointment</span>
      <a class="footer-review" href="${GBP_REVIEW_URL}" target="_blank" rel="noopener noreferrer">
        <span class="footer-review-g">${G_SVG(22)}</span>
        <span class="footer-review-text"><span class="footer-review-title">Review us on Google</span><span class="footer-review-sub">Priority Designer · Dallas</span></span>
      </a>
    </div>
    <div class="footer-col">
      <span class="footer-head">Explore</span>
      <a class="footer-link" href="about.html">About</a>
      <a class="footer-link" href="portfolio.html">Portfolio</a>
      <a class="footer-link" href="materials.html">Materials</a>
      <a class="footer-link" href="discontinued.html">Discontinued Products</a>
      <a class="footer-link" href="blog.html">Blog</a>
    </div>
    <div class="footer-col">
      <span class="footer-head">Affiliations</span>${affs}
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-line">© 2026 PRIORITY DESIGNER · SLATE &amp; TILE · LICENSED · BONDED · INSURED</div>
    <a class="footer-privacy" href="privacy.html">Privacy</a>
  </div>
</footer>`;
}

const NAV_JS = `
(function(){
  var nav=document.querySelector('.nav');
  var hero=document.querySelector('.article-hero');
  function onScroll(){
    var y=window.scrollY||window.pageYOffset;
    nav.classList.toggle('scrolled', y>80);
    var t=hero?hero.offsetHeight-72:140;
    nav.classList.toggle('on-light', y>t);
  }
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
  var ham=document.querySelector('.nav-hamburger');
  var ov=document.getElementById('nav-overlay');
  function setMenu(open){
    ham.classList.toggle('is-open',open);
    ham.setAttribute('aria-expanded',String(open));
    ham.setAttribute('aria-label',open?'Close menu':'Open menu');
    nav.classList.toggle('menu-open',open);
    ov.classList.toggle('is-open',open);
    ov.setAttribute('aria-hidden',String(!open));
    document.body.style.overflow=open?'hidden':'';
  }
  ham.addEventListener('click',function(){setMenu(!ov.classList.contains('is-open'));});
  ov.addEventListener('click',function(e){if(e.target===ov)setMenu(false);});
  Array.prototype.forEach.call(ov.querySelectorAll('a'),function(a){a.addEventListener('click',function(){setMenu(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});
})();`;

// Click-to-enlarge lightbox for article images. This is STANDARD for every post
// automatically: it's injected into every article page below and the styles are
// global, so any future post gets it with no extra work. Preferred authoring is
// the <figure class="article-figure"> block (frame + caption + credit); a bare
// markdown image (![alt](src), emitted as <p><img>) also gets sized and enlarged
// via the fallback selector here + the .article-body p>img rule in styles.css.
// Builds one overlay per page, opens on click/Enter/Space (images made
// keyboard-focusable), closes on Escape, backdrop click, or the close button.
// The enlarged view reuses the image's own src (natives are up to ~1400px,
// plenty of detail) so no separate hi-res asset is needed.
const LIGHTBOX_JS = `
(function(){
  var figs=document.querySelectorAll('.article-figure img, .article-body p > img');
  if(!figs.length) return;
  var box=document.createElement('div');
  box.className='lightbox';
  box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true'); box.setAttribute('aria-hidden','true');
  box.innerHTML='<button class="lightbox-close" type="button" aria-label="Close image">\\u00d7</button><img alt=""><figcaption></figcaption>';
  document.body.appendChild(box);
  var bimg=box.querySelector('img'), bcap=box.querySelector('figcaption'), bclose=box.querySelector('.lightbox-close');
  var lastFocus=null;
  function open(src,alt,cap){
    lastFocus=document.activeElement;
    bimg.src=src; bimg.alt=alt||'';
    if(cap){bcap.textContent=cap; bcap.style.display='';} else {bcap.style.display='none';}
    box.classList.add('is-open'); box.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden'; bclose.focus();
  }
  function close(){
    box.classList.remove('is-open'); box.setAttribute('aria-hidden','true');
    document.body.style.overflow=''; bimg.src='';
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  Array.prototype.forEach.call(figs,function(img){
    img.setAttribute('role','button'); img.setAttribute('tabindex','0'); img.setAttribute('aria-label','Enlarge image');
    function trigger(){
      var fig=img.closest('.article-figure');
      var capEl=fig?fig.querySelector('figcaption'):null;
      open(img.currentSrc||img.src, img.alt, capEl?capEl.textContent.trim():'');
    }
    img.addEventListener('click',trigger);
    img.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();trigger();}});
  });
  box.addEventListener('click',function(e){if(e.target!==bimg)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('is-open'))close();});
})();`;

function pageHtml(article, others) {
  // Article pages live under /blog/ (output to blog/<slug>.html; Cloudflare
  // serves that at the clean /blog/<slug> and 307-redirects the .html form to
  // it), so canonical/OG/sitemap must point at the clean /blog/ URL (a canonical
  // that itself redirects can be ignored by Google). Because the page now sits a
  // directory deep, the head declares <base href="/"> so the relative nav/asset
  // paths below (about.html, dist/styles.css, assets/…) resolve against the site
  // root exactly as they did when these pages lived at the root.
  const url = `${SITE}/blog/${article.slug}`;
  const imgAbs = `${SITE}/${article.image}`;
  const related = others.slice(0, 3).map((a) => `
    <a class="rel-card" href="blog/${a.slug}">
      <div class="rel-img" style="background-image:url('/${a.image}')"></div>
      <div class="rel-body">
        <span class="rel-tag">${esc(a.tag)}</span>
        <h3 class="rel-title">${esc(a.title)}</h3>
      </div>
    </a>`).join("");

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    image: imgAbs,
    datePublished: article.date,
    dateModified: article.date,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: BRAND, url: SITE + "/" },
    publisher: {
      "@type": "Organization",
      name: BRAND,
      logo: { "@type": "ImageObject", url: `${SITE}/assets/logo-mark-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
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
<!-- Article pages are served from /blog/<slug>; resolve all relative nav/asset
     paths against the site root so they behave as they did at the root. -->
<base href="/" />
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16.png" />
<link rel="icon" href="assets/favicon/favicon-32.png" sizes="any" />
<link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon.png" />
<title>${esc(article.title)} · ${esc(BRAND)}</title>
<meta name="description" content="${esc(article.metaDescription)}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="${esc(BRAND)}" />
<meta property="og:title" content="${esc(article.title)}" />
<meta property="og:description" content="${esc(article.metaDescription)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${imgAbs}" />
<meta property="article:published_time" content="${article.date}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(article.title)}" />
<meta name="twitter:description" content="${esc(article.metaDescription)}" />
<meta name="twitter:image" content="${imgAbs}" />
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+SC:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+SC:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap"></noscript>
<link rel="stylesheet" href="dist/styles.css" />
<!-- Static pages don't run PageHero's effect, which resets --hero-inset (28px on
     :root, for the home hero) to 0 on subpages. Without this the fixed nav sits
     28px down and shows a gap at the top on scroll. Declared after styles.css so
     it wins the cascade, before paint (no flash). -->
<style>:root{--hero-inset:0px}</style>
</head>
<body class="article-page">
${navMarkup("blog.html")}
<header class="article-hero" style="background-image:url('/${article.image}');background-position:${article.imagePosition || "center"}">
  <div class="article-hero-scrim"></div>
  <div class="article-hero-inner">
    <nav class="article-breadcrumb" aria-label="Breadcrumb">
      <a href="blog.html">Resource Library</a> <span>/</span> <span>${esc(article.tag)}</span>
    </nav>
    <h1 class="article-title">${esc(article.title)}</h1>
    <div class="article-meta">
      ${article.author ? `<span class="article-author">By ${esc(article.author)}</span>` : ""}
      <span class="article-tag">${esc(article.tag)}</span>
      <span class="article-date">${esc(displayDate(article.date))}</span>
    </div>
  </div>
</header>
<main class="article-main">
  <article class="article-body">
${article.html}
  </article>
  <section class="article-cta">
    <span class="eyebrow">Speak With an Expert</span>
    <h2>Have a Historic or Estate Roof in the <em>DFW Area?</em></h2>
    <p>Every inquiry is read by an expert, not a call center. If the project is a fit, we will get on the roof and give you an honest assessment in writing.</p>
    <a class="btn-copper-solid" href="contact.html">Schedule a Consultation ${ARROW}</a>
  </section>
</main>
<section class="article-related section-light">
  <div class="article-related-head"><span class="eyebrow">Keep Reading</span><h2>From the <em>Resource Library</em></h2></div>
  <div class="article-related-grid">${related}</div>
</section>
${footerMarkup()}
<script>${NAV_JS}</script>
<script>${LIGHTBOX_JS}</script>
</body>
</html>`;
}

// HTML/markdown -> lowercased plaintext, for the in-content search index.
const toPlainText = (html) =>
  html.replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#3[49];/g, "'")
    .replace(/\s+/g, " ").trim().toLowerCase();

export async function buildBlog() {
  // Articles with `draft: true` are held back from production. The staging
  // deploy sets INCLUDE_DRAFTS=1 so reviewers see them; the Cloudflare prod
  // build runs `npm run build` with no flag, so only finished posts ship.
  const includeDrafts = !!process.env.INCLUDE_DRAFTS;
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md"));
  const articles = [];
  for (const f of files) {
    const raw = await readFile(`${CONTENT_DIR}/${f}`, "utf8");
    const { data, body } = parseFrontmatter(raw);
    if (data.draft === "true" && !includeDrafts) continue;
    articles.push({ ...data, html: marked.parse(body.trim()) });
  }
  // Newest first by date.
  articles.sort((a, b) => (a.date < b.date ? 1 : -1));

  await mkdir("blog", { recursive: true });
  for (const a of articles) {
    const others = articles.filter((x) => x.slug !== a.slug);
    await writeFile(`blog/${a.slug}.html`, pageHtml(a, others));
  }

  // Search index consumed by the blog index page (window.BLOG_ARTICLES).
  // searchText folds in body text so users can search within content/phrases.
  const index = articles.map((a) => ({
    url: `/blog/${a.slug}`,
    title: a.title,
    tag: a.tag,
    date: displayDate(a.date),
    image: a.image,
    excerpt: a.excerpt,
    searchText: toPlainText(`${a.title} ${a.tag} ${a.excerpt || ""} ${a.html}`),
  }));
  await writeFile("dist/blog-articles.js", `window.BLOG_ARTICLES=${JSON.stringify(index)};\n`);

  return articles;
}

// Allow running standalone: `node build-blog.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  const arts = await buildBlog();
  arts.forEach((a) => console.log(`  blog/${a.slug}.html`));
  console.log(`blog: ${arts.length} article pages.`);
}
