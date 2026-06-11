/* global React, ReactDOM, MANUFACTURERS, PROJECTS, DISCONTINUED, ROOF_SYSTEMS, PARTNERS, PRESERVATION, TRADE_CIVIC, CERTIFICATIONS, TRUST, NAV_ITEMS */
const { useState, useEffect, useRef } = React;

const ArrowRight = ({ size = 16 }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>;

const Plus = ({ size = 16 }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 5v14M5 12h14" />
  </svg>;

const PhoneIcon = () =>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>;


function Nav({ onLight: forcedOnLight }) {
  const [scrolled, setScrolled] = useState(false);
  const [autoOnLight, setAutoOnLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock + Esc-to-close while the mobile menu is open. We restore
  // the prior overflow value to play nicely with ProjectDetail's own lock.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Self-detect light vs dark by walking the DOM for the first opaque
  // background of the currently-intersecting section. Skipped if a page
  // passes an explicit `onLight` prop (kept for back-compat / override).
  useEffect(() => {
    if (forcedOnLight !== undefined) return;
    const sections = Array.from(document.querySelectorAll("section"));
    if (!sections.length) return;
    const isLightBg = (el) => {
      // Explicit author override wins.
      const theme = el.getAttribute("data-nav-theme");
      if (theme === "light") return true;
      if (theme === "dark") return false;
      // Otherwise walk up looking for the first opaque background colour.
      let cur = el;
      while (cur && cur !== document.documentElement) {
        const bg = window.getComputedStyle(cur).backgroundColor;
        const m = bg && bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (m) {
          const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
          if (alpha > 0.15) {
            const r = parseInt(m[1], 10), g = parseInt(m[2], 10), b = parseInt(m[3], 10);
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return lum > 150;
          }
        }
        cur = cur.parentElement;
      }
      return true;
    };
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setAutoOnLight(isLightBg(e.target));
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [forcedOnLight]);

  const onLight = forcedOnLight !== undefined ? forcedOnLight : autoOnLight;
  const path = window.location.pathname;
  const activePage = NAV_ITEMS.find((n) => path.endsWith(n.href));
  const activeId = activePage ? activePage.id : null;

  // TEMP (2026-06-06): hero variant switcher on home page only. Remove once a
  // hero variant is picked. The buttons reload with ?hero=<variant>.
  // Detect home by trailing filename so it works under any base path
  // (e.g. GitHub Pages `/designer-website-design/`).
  const isHome = (() => {
    const file = path.split("/").pop();
    return file === "" || file === "index.html";
  })();
  const currentVariant = (() => {
    try { const v = new URLSearchParams(window.location.search).get("hero"); return v === "mosaic" || v === "slides" ? v : "reel"; } catch (e) { return "reel"; }
  })();
  const VARIANTS = [
    { key: "reel",   label: "Reel" },
    { key: "mosaic", label: "Mosaic" },
    { key: "slides", label: "Slides" },
  ];

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${onLight ? " on-light" : ""}`}>
      <a className="logo" href="index.html">
        <img src="assets/logo.png" alt="Priority Designer · Historic Exteriors" className="logo-img" />
      </a>
      <div className="nav-links">
        {NAV_ITEMS.map((n) =>
        <a key={n.id} href={n.href} className={activeId === n.id ? "active" : ""}>
            {n.label}
          </a>
        )}
      </div>
      {isHome &&
      <div className="nav-hero-switch" role="group" aria-label="Hero variant (preview)">
        <span className="nav-hero-switch-label">Hero</span>
        {VARIANTS.map((v) =>
          <a
            key={v.key}
            href={v.key === "reel" ? "index.html" : `index.html?hero=${v.key}`}
            className={`nav-hero-switch-btn${currentVariant === v.key ? " is-active" : ""}`}>
            {v.label}
          </a>
        )}
      </div>
      }
      <a className="cta-pill" href="contact.html">
        Schedule a Consultation
        <span className="icon"><ArrowRight size={14} /></span>
      </a>
      <button
        className={`nav-hamburger${menuOpen ? " is-open" : ""}`}
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="nav-overlay"
        onClick={() => setMenuOpen((o) => !o)}>
        <span /><span /><span />
      </button>
      <div
        id="nav-overlay"
        className={`nav-overlay${menuOpen ? " is-open" : ""}${onLight ? " on-light" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}>
        <div className="nav-overlay-inner">
          <div className="nav-overlay-links">
            {NAV_ITEMS.map((n) =>
              <a
                key={n.id}
                href={n.href}
                className={activeId === n.id ? "active" : ""}
                onClick={() => setMenuOpen(false)}>
                {n.label}
              </a>
            )}
          </div>
          <a className="cta-pill nav-overlay-cta" href="contact.html" onClick={() => setMenuOpen(false)}>
            Schedule a Consultation
            <span className="icon"><ArrowRight size={14} /></span>
          </a>
        </div>
      </div>
    </nav>);

}

function Hero({ revealed }) {
  const sectionRef = useRef(null);
  useEffect(() => {
    // Honor reduced motion: skip the scroll-driven hero expansion entirely.
    if (typeof window !== "undefined" && window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const root = document.documentElement;
      root.style.setProperty("--hero-inset", "0px");
      root.style.setProperty("--hero-radius", "0px");
      root.style.setProperty("--hero-progress", "1");
      return;
    }
    const root = document.documentElement;
    let target = 0;
    let current = 0;
    let raf = 0;
    const compute = () => {
      const el = sectionRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const pin = rect.height - window.innerHeight;
      const startHold = pin * 0.12;   // brief readable pause before expansion begins
      const expandDist = pin * 0.6;   // tighter: tracks scroll and completes sooner
      const p = Math.max(0, Math.min(1, (-rect.top - startHold) / expandDist));
      return p * p * (3 - 2 * p);
    };
    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0008) {
        current = target;
      } else {
        current += diff * 0.3;
      }
      root.style.setProperty("--hero-inset", `${(1 - current) * 28}px`);
      root.style.setProperty("--hero-radius", `${(1 - current) * 10}px`);
      root.style.setProperty("--hero-progress", current.toFixed(4));
      if (current !== target) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const onScroll = () => {
      target = compute();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    target = current = compute();
    root.style.setProperty("--hero-inset", `${(1 - current) * 28}px`);
    root.style.setProperty("--hero-radius", `${(1 - current) * 10}px`);
    root.style.setProperty("--hero-progress", current.toFixed(4));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <section ref={sectionRef} className={`hero hero-framed${revealed ? " revealed" : ""}`} id="top" data-screen-label="Hero" data-nav-theme="dark">
      <div className="hero-pin">
        <div className="hero-bg" />
        <div className="hero-img hero-video-wrap">
          <video
            className="hero-video"
            src="media/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto" />
          
        </div>
        <div className="hero-vignette" />
        <div className="hero-grain" />
        <div className="hero-inner">
          <h1 className="hero-title">Priority <em>Designer</em></h1>
          <div className="hero-sub">
            Slate <span className="dot">·</span> Clay Tile <span className="dot">·</span> Metal <span className="dot">·</span> Architectural Systems
          </div>
          <div className="hero-loc eyebrow">The Good, the True, and the Beautiful — Set in Stone · Est. 2016</div>
        </div>
        <div className="scroll-tag">
          <span className="line" />
          <span className="eyebrow">Scroll</span>
        </div>
      </div>
    </section>);

}

// ── Hero Variant B: tile mosaic ───────────────────────────────
// 4×3 grid of project photos that cross-fade-swap on a slow interval.
// Pinned title/subtitle sit center over a scrim. The page-down arrow lives
// below so the user knows to keep scrolling.
function HeroMosaic({ revealed }) {
  // Build a pool of images from PROJECTS + HERO_TOP_FIVE for tile fill.
  const pool = React.useMemo(() => {
    const all = [...HERO_TOP_FIVE.map((h) => h.image), ...PROJECTS.map((p) => p.image)];
    // dedupe but keep order
    const seenSet = new Set();
    return all.filter((u) => { if (seenSet.has(u)) return false; seenSet.add(u); return true; });
  }, []);

  const TILE_COUNT = 12;
  const [tiles, setTiles] = useState(() =>
    Array.from({ length: TILE_COUNT }, (_, i) => pool[i % pool.length])
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTiles((current) => {
        const next = current.slice();
        const slot = Math.floor(Math.random() * TILE_COUNT);
        // pick an image not currently in `next`
        let candidate = pool[Math.floor(Math.random() * pool.length)];
        let safety = 8;
        while (next.includes(candidate) && safety-- > 0) {
          candidate = pool[Math.floor(Math.random() * pool.length)];
        }
        next[slot] = candidate;
        return next;
      });
    }, 950);
    return () => clearInterval(id);
  }, [pool]);

  return (
    <section className={`hero hero-mosaic${revealed ? " revealed" : ""}`} id="top" data-screen-label="Hero" data-nav-theme="dark">
      <div className="hero-mosaic-grid" aria-hidden="true">
        {tiles.map((src, i) =>
          <div className="hero-mosaic-tile" key={i} style={{ backgroundImage: `url("${src}")`, "--i": i }} />
        )}
      </div>
      <div className="hero-mosaic-scrim" aria-hidden="true" />
      <div className="hero-inner hero-mosaic-inner">
        <h1 className="hero-title">Priority <em>Designer</em></h1>
        <div className="hero-sub">
          Slate <span className="dot">·</span> Clay Tile <span className="dot">·</span> Metal <span className="dot">·</span> Architectural Systems
        </div>
        <div className="hero-loc eyebrow">The Good, the True, and the Beautiful — Set in Stone · Est. 2016</div>
      </div>
      <div className="scroll-tag">
        <span className="line" />
        <span className="eyebrow">Scroll</span>
      </div>
    </section>);
}

// ── Hero Variant C: cross-fading slideshow ────────────────────
// Single full-bleed image cross-fades through HERO_TOP_FIVE on a slow timer
// with a soft Ken Burns scale on the active layer.
function HeroSlides({ revealed }) {
  const slides = HERO_TOP_FIVE;
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);
  return (
    <section className={`hero hero-slides${revealed ? " revealed" : ""}`} id="top" data-screen-label="Hero" data-nav-theme="dark">
      <div className="hero-slides-stage" aria-hidden="true">
        {slides.map((s, i) =>
          <div
            className={`hero-slides-layer${i === active ? " is-active" : ""}`}
            key={s.slug}
            style={{ backgroundImage: `url("${s.image}")` }} />
        )}
      </div>
      <div className="hero-slides-scrim" aria-hidden="true" />
      <div className="hero-inner hero-slides-inner">
        <h1 className="hero-title">Priority <em>Designer</em></h1>
        <div className="hero-sub">
          Slate <span className="dot">·</span> Clay Tile <span className="dot">·</span> Metal <span className="dot">·</span> Architectural Systems
        </div>
        <div className="hero-loc eyebrow">The Good, the True, and the Beautiful — Set in Stone · Est. 2016</div>
        <div className="hero-slides-caption" aria-live="polite">{slides[active].name}</div>
      </div>
      <div className="scroll-tag">
        <span className="line" />
        <span className="eyebrow">Scroll</span>
      </div>
    </section>);
}

// Per 2026-05-29 meeting: TrustBar should render actual affiliation logos when
// the asset is supplied. Until Jack drops logos at TRUST[i].logo, we fall back
// to the initials badge + text so nothing breaks.
function TrustBar() {
  // Each item renders the logo if the file loads, otherwise the initials badge.
  // We use a per-item state so a missing file silently downgrades that cell.
  const Item = ({ t }) => {
    const [hasLogo, setHasLogo] = useState(Boolean(t.logo));
    return (
      <div className={`trust-item${hasLogo ? " has-logo" : ""}`}>
        {hasLogo ?
          <img
            className="trust-logo"
            src={t.logo}
            alt={t.name}
            loading="lazy"
            onError={() => setHasLogo(false)} /> :
          <div className="trust-badge">{t.initials}</div>
        }
        <div className="trust-text">
          <div className="name">{t.name}</div>
          <div className="role">{t.role}</div>
        </div>
      </div>);
  };
  const renderGroup = (k) =>
  <div className="trust-group" key={k}>
      {TRUST.map((t, i) =>
    <React.Fragment key={`${k}-${t.name}`}>
          <Item t={t} />
          {i < TRUST.length - 1 && <div className="trust-divider" />}
        </React.Fragment>
    )}
      <div className="trust-divider" />
    </div>;

  return (
    <div className="trust" aria-label="Certifications">
      <div className="trust-track">
        {renderGroup("a")}
        {renderGroup("b")}
      </div>
    </div>);

}

function RoofReel() {
  const N = 46;
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [loaded, setLoaded] = useState(0);
  const [progress, setProgress] = useState(0);
  // On phones (≤768px) and for users who request reduced motion, skip the
  // scroll-scrubbed canvas entirely and render a single static frame.
  // Avoids the 46-image preload, the per-scroll canvas redraw, and the
  // iOS scroll-momentum jank the animation causes on low-end devices.
  const [useStatic, setUseStatic] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mqSmall = window.matchMedia("(max-width: 768px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setUseStatic(mqSmall.matches || mqMotion.matches);
    const sub = (mq) => mq.addEventListener ? mq.addEventListener("change", apply) : mq.addListener(apply);
    const unsub = (mq) => mq.removeEventListener ? mq.removeEventListener("change", apply) : mq.removeListener(apply);
    sub(mqSmall); sub(mqMotion);
    return () => { unsub(mqSmall); unsub(mqMotion); };
  }, []);

  // preload all frames (skipped on phones / reduced motion)
  useEffect(() => {
    if (useStatic) return;
    let cancelled = false;
    let count = 0;
    imagesRef.current = Array.from({ length: N }, (_, i) => {
      const img = new Image();
      const num = String(i + 1).padStart(3, "0");
      img.src = `assets/frames/f${num}.jpg`;
      img.onload = () => {if (!cancelled) {count++;setLoaded(count);}};
      img.onerror = () => {if (!cancelled) {count++;setLoaded(count);}};
      return img;
    });
    return () => {cancelled = true;};
  }, [useStatic]);

  // scroll-driven frame painter
  useEffect(() => {
    if (useStatic) return;
    const draw = (p) => {
      const idx = Math.max(0, Math.min(N - 1, Math.floor(p * (N - 0.0001))));
      const img = imagesRef.current[idx];
      const canvas = canvasRef.current;
      if (!canvas || !img || !img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth,h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const ctx = canvas.getContext("2d");
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = w / h;
      let dw, dh;
      if (ir > cr) {dh = h;dw = h * ir;} else {dw = w;dh = w / ir;}
      const dx = (w - dw) / 2,dy = (h - dh) / 2;
      ctx.drawImage(img, Math.round(dx * dpr), Math.round(dy * dpr), Math.round(dw * dpr), Math.round(dh * dpr));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
        setProgress(p);
        draw(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [loaded, useStatic]);

  const ready = loaded >= 6;

  // text fades in early and stays visible through the entire reel
  const titleVis = useStatic ? 1 : Math.max(0, Math.min(1, (progress - 0.05) / 0.10));
  const subVis = useStatic ? 1 : Math.max(0, Math.min(1, (progress - 0.12) / 0.10));

  return (
    <section
      className={`reel${useStatic ? " reel-static" : ""}`}
      id="reel"
      ref={sectionRef}
      data-screen-label="Reel"
      aria-label="Field reel">
      <div className="reel-stage">
        {useStatic ?
          <img
            className="reel-static-img"
            src="assets/frames/f023.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy" /> :
          <canvas className={`reel-canvas${ready ? " ready" : ""}`} ref={canvasRef} aria-hidden="true" />
        }
        <div className="reel-veil" />
        <div className="reel-overlay">
          <div className="reel-center">
            <h2
              className="reel-title"
              style={{
                opacity: titleVis,
                transform: `translateY(${(1 - titleVis) * 24}px)`
              }}>

              <span className="line">A century of weather,</span>
              <span className="line">met by hand.</span>
            </h2>
            <p
              className="reel-sub"
              style={{
                opacity: subVis,
                transform: `translateY(${(1 - subVis) * 18}px)`
              }}>

              The great mistake is thinking that things being interesting
              and things being useful are mutually exclusive. We refuse the
              tradeoff — and build every roof to prove it.
            </p>
          </div>
        </div>
      </div>
    </section>);

}

// Per 2026-05-29: manufacturer cells should show the actual brand logo when
// supplied. Falls back to the "01 / 04" numeric stamp if the image fails to load.
function ManufacturerCell({ m, index }) {
  const [hasLogo, setHasLogo] = useState(Boolean(m.logo));
  const stamp = `${String(index + 1).padStart(2, "0")} / 04`;
  return (
    <article className={`mat-cell${hasLogo ? " has-logo" : ""}`}>
      <div
        className="mat-cell-grain"
        style={{ backgroundImage: `url("${m.image}")` }}
        aria-hidden="true" />
      <div className="mat-cell-scrim" aria-hidden="true" />
      <div className="mat-cell-grit" aria-hidden="true" />
      <div className="mat-cell-rest">
        {hasLogo ?
          <img
            className="mat-cell-logo"
            src={m.logo}
            alt={`${m.name} logo`}
            loading="lazy"
            onError={() => setHasLogo(false)} /> :
          <span className="mat-cell-num">{stamp}</span>
        }
        <h3 className="mat-cell-name">{m.name}</h3>
        <span className="mat-cell-role">{m.role}</span>
      </div>
      <div className="mat-cell-hover">
        <span className="mat-cell-num is-light">{stamp}</span>
        <h3 className="mat-cell-name is-light">{m.name}</h3>
        <span className="mat-cell-role is-light">{m.role}</span>
        <p className="mat-cell-desc">{m.body}</p>
      </div>
    </article>);
}

function Manufacturers({ banner = "partners" }) {
  return (
    <section className="section section-light materials" id="manufacturers" data-screen-label="Manufacturer Partnerships">
      <div className="section-head">
        <div className="left">
          <span className="eyebrow">Manufacturer Partnerships</span>
          <h2>Materials That Can <em>Recreate the Irreplaceable</em></h2>
        </div>
        <div className="right">
          Estate and Historic restoration requires manufacturers willing to do what no mass-market supplier will: recreate discontinued molds, manufacture bespoke profiles, and guarantee results that hold up to preservation review for the next generation. These are the partners we trust with that work.
        </div>
      </div>

      {banner === "partners" &&
      <div className="mat-banner mat-banner--head">
        <h3>Four Partners. <em>Craftsmanship Over Compromise.</em></h3>
        <p>
          We add a manufacturer only when a product raises our standard — not when it expands our<br />
          catalog. These four represent the entirety of what we're willing to put our name behind.
        </p>
      </div>
      }

      <div className="mat-grid">
        {MANUFACTURERS.map((m, i) =>
          <ManufacturerCell m={m} index={i} key={m.name} />
        )}
      </div>

      <div className="mat-foot">
        <p>
          Four manufacturers. Each one selected because we would install<br />
          their products on our own homes and have.
        </p>
        <button className="mat-foot-link">
          See These Materials in Our Work <ArrowRight size={14} />
        </button>
      </div>
    </section>);

}

function JobsMap() {
  const [active, setActive] = useState(null); // clicked pin → popup
  const [hover, setHover] = useState(null); // hovered pin → tooltip
  const [viewMode, setViewMode] = useState("map"); // 'map' | 'list'
  const cardRef = useRef(null);
  const markup = (typeof window !== "undefined" && window.US_STATES_MARKUP) || "";
  const shown = active !== null ? active : hover;
  const toggle = (i) => setActive((a) => a === i ? null : i);

  // Auto-pick list view on small screens. Listens to viewport changes so
  // rotation / resize re-applies the right default.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setViewMode(mq.matches ? "list" : "map");
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    if (active === null) return;
    const handlePointerDown = (e) => {
      if (cardRef.current && cardRef.current.contains(e.target)) return;
      if (e.target.closest && e.target.closest(".jobsmap-pin")) return;
      if (e.target.closest && e.target.closest(".jobsmap-list-item")) return;
      setActive(null);
    };
    const handleKey = (e) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [active]);

  return (
    <section className="jobsmap" id="projects" data-screen-label="Jobs of Distinction">
      <div className="jobsmap-head">
        <div>
          <span className="eyebrow" style={{ color: "var(--copper-300)", display: "block", marginBottom: 18 }}>Selected Work</span>
          <h2>Jobs of <em>Distinction</em></h2>
        </div>
        <div className="jobsmap-intro">
          Licensed across the lower 48 — a selection of projects we're proud of, from local estates to landmarks across the country.
        </div>
      </div>

      <div className="jobsmap-view-toggle" role="tablist" aria-label="Map or list view">
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === "map"}
          className={`jobsmap-view-btn${viewMode === "map" ? " is-active" : ""}`}
          onClick={() => setViewMode("map")}>
          Map
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === "list"}
          className={`jobsmap-view-btn${viewMode === "list" ? " is-active" : ""}`}
          onClick={() => setViewMode("list")}>
          List
        </button>
      </div>

      {viewMode === "map" &&
      <div className="jobsmap-stage">
        <svg
          className="jobsmap-base"
          viewBox="0 0 960 600"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: markup }} />

        <svg className="jobsmap-pins" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Project locations">
          {MAP_PROJECTS.map((p, i) =>
          <g
            key={p.name}
            className={`jobsmap-pin${active === i ? " is-active" : ""}${p.coming ? " is-coming" : ""}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onClick={() => toggle(i)}
            tabIndex={0}
            role="button"
            aria-label={`${p.coming ? "Project coming — " : ""}${p.city}, ${p.state}`}
            onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();toggle(i);}}}>

              {/* Transparent hit target — keeps the pin visually small while
                  giving touch users a 44px-equivalent tap area at typical
                  stage widths (≈22 SVG units ≈ 36–48 device pixels). */}
              <circle className="jobsmap-pin-hit" cx={p.x} cy={p.y} r="22" fill="transparent" />
              <circle className="jobsmap-pin-halo" cx={p.x} cy={p.y} r="13" />
              <circle className="jobsmap-pin-dot" cx={p.x} cy={p.y} r="5" />
            </g>
          )}
        </svg>

        {shown !== null && (() => {
          const p = MAP_PROJECTS[shown];
          const isPopup = active === shown;
          const xPct = p.x / 960 * 100;
          const yPct = p.y / 600 * 100;
          // Keep popup card within the stage horizontally. Anchor by edge
          // when near a side so the card doesn't bleed off-screen.
          let xAnchor = "-50%";
          if (isPopup) {
            if (xPct < 28) xAnchor = "0%";
            else if (xPct > 72) xAnchor = "-100%";
          }
          const yAnchor = isPopup && yPct < 32 ? "24px" : "calc(-100% - 18px)";
          return (
            <div
              ref={isPopup ? cardRef : null}
              className={`jobsmap-card${isPopup ? " is-popup" : ""}`}
              style={{
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: `translate(${xAnchor}, ${yAnchor})`,
              }}>

              {isPopup &&
              <button className="jobsmap-card-close" onClick={() => setActive(null)} aria-label="Close">×</button>
              }
              <div className="jobsmap-card-img" style={{ backgroundImage: `url("${p.image}")` }}>
                {p.coming && <span className="jobsmap-card-coming">Project Coming</span>}
              </div>
              <div className="jobsmap-card-body">
                <div className="jobsmap-card-loc">{p.city}, {p.state}</div>
                <div className="jobsmap-card-name">{p.name}</div>
                {isPopup &&
                <React.Fragment>
                  <p className="jobsmap-card-blurb">{p.blurb}</p>
                  <dl className="jobsmap-card-specs">
                    <div><dt>System</dt><dd>{p.system}</dd></div>
                    <div><dt>Scope</dt><dd>{p.scope}</dd></div>
                  </dl>
                  <a className="jobsmap-card-link" href={p.slug ? `portfolio.html?p=${p.slug}` : "portfolio.html"}>{p.coming ? "Read more" : "View project"} <ArrowRight size={12} /></a>
                </React.Fragment>
                }
              </div>
            </div>);

        })()}
      </div>
      }

      {viewMode === "list" &&
      <ul className="jobsmap-list" aria-label="Project locations list">
        {MAP_PROJECTS.map((p, i) =>
          <li
            key={p.name}
            className={`jobsmap-list-item${active === i ? " is-active" : ""}${p.coming ? " is-coming" : ""}`}>
            <button
              type="button"
              className="jobsmap-list-button"
              aria-expanded={active === i}
              onClick={() => toggle(i)}>
              <span
                className="jobsmap-list-thumb"
                style={{ backgroundImage: `url("${p.image}")` }}
                aria-hidden="true" />
              <span className="jobsmap-list-text">
                <span className="jobsmap-list-loc">{p.city}, {p.state}{p.coming ? " · Project Coming" : ""}</span>
                <span className="jobsmap-list-name">{p.name}</span>
              </span>
            </button>
            {active === i &&
            <div className="jobsmap-list-detail">
              <p className="jobsmap-card-blurb">{p.blurb}</p>
              <dl className="jobsmap-card-specs">
                <div><dt>System</dt><dd>{p.system}</dd></div>
                <div><dt>Scope</dt><dd>{p.scope}</dd></div>
              </dl>
              <a className="jobsmap-card-link" href={p.slug ? `portfolio.html?p=${p.slug}` : "portfolio.html"}>{p.coming ? "Read more" : "View project"} <ArrowRight size={12} /></a>
            </div>
            }
          </li>
        )}
      </ul>
      }

      <div className="jobsmap-foot">
        <span className="jobsmap-note">Licensed in all 48 contiguous states · selected projects shown</span>
        <a className="btn-ghost-light jobsmap-viewall" href="portfolio.html">View Full Portfolio <span className="arrow"><ArrowRight size={16} /></span></a>
      </div>
    </section>);

}

// ── Discontinued product image lightbox ───────────────────────
// Opened from a product thumbnail. Scrollable gallery overlay with
// arrows / swipe / keyboard nav and an iOS-safe scroll lock (mirrors
// the ProjectDetail modal pattern).
function DiscLightbox({ images, title, start = 0, onClose }) {
  const [i, setI] = useState(start);
  const touch = useRef(null);
  const n = images.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
      else if (e.key === "ArrowRight") setI((p) => (p + 1) % n);
      else if (e.key === "ArrowLeft") setI((p) => (p - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      // Restore scroll instantly. The global `html { scroll-behavior: smooth }`
      // would otherwise animate this jump (page flashes to top, then glides
      // back down) when the position:fixed lock releases.
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = prevBehavior;
    };
  }, [n, onClose]);
  // Portal to <body>: the Discontinued section lives inside a .scroll-reveal
  // wrapper whose transform/opacity would otherwise become the containing
  // block (breaking position:fixed) and hide the overlay.
  return ReactDOM.createPortal(
    <div className="disc-lightbox" onClick={(e) => { if (e.target.classList.contains("disc-lightbox")) onClose && onClose(); }}>
      <button className="disc-lb-close" onClick={onClose} aria-label="Close">×</button>
      {n > 1 && <button className="disc-lb-nav disc-lb-prev" onClick={() => go(-1)} aria-label="Previous image">‹</button>}
      <figure
        className="disc-lb-stage"
        onTouchStart={(e) => { touch.current = e.changedTouches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}>
        <img src={images[i]} alt={`${title} — image ${i + 1} of ${n}`} />
        <figcaption className="disc-lb-cap">
          <span>{title}</span>
          {n > 1 && <span className="disc-lb-count">{i + 1} / {n}</span>}
        </figcaption>
      </figure>
      {n > 1 && <button className="disc-lb-nav disc-lb-next" onClick={() => go(1)} aria-label="Next image">›</button>}
    </div>,
    document.body);

}

function Discontinued({ onJump }) {
  const tabs = Object.keys(DISCONTINUED);
  const [tab, setTab] = useState(tabs[0]);
  const [lb, setLb] = useState(null);
  const data = DISCONTINUED[tab];
  return (
    <section className="discontinued" id="discontinued" data-screen-label="Discontinued Products">
      <div className="disc-head">
        <span className="eyebrow">Industry Knowledge · Trade Standards</span>
        <h2>Discontinued Products We <em>Know in the Field</em></h2>
        <p>Some of these products failed; others were simply discontinued and are no longer made. We keep documented history on each — how it performs, why it left the market, and whether your roof can be matched, repaired, or saved rather than torn off.</p>
      </div>
      <div className="disc-tabs">
        {tabs.map((t) =>
        <button key={t} className={t === tab ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
        )}
      </div>
      <div className="disc-content">
        <div className="label">{data.label.split(" ").slice(0, -1).join(" ")} <em>{data.label.split(" ").slice(-1)}</em></div>
        <div className="disc-products">
          {data.items.map((p, i) => {
            const imgs = p.images && p.images.length ? p.images : null;
            return (
              <div className={`disc-prod${imgs ? " has-thumb" : ""}`} key={p.title}>
                <div className="ix">
                  {imgs ?
                  <button
                    type="button"
                    className="disc-prod-thumb"
                    style={{ backgroundImage: `url("${imgs[0]}")` }}
                    onClick={() => setLb({ images: imgs, title: p.title })}
                    aria-label={`View ${imgs.length} photo${imgs.length > 1 ? "s" : ""} of ${p.title}`}>
                    {imgs.length > 1 && <span className="disc-prod-thumb-count">{imgs.length}</span>}
                  </button> :
                  String(i + 1).padStart(2, "0")}
                </div>
                <div className="title">{p.title}<small>{p.sub}</small></div>
                <div className="desc">{p.desc}</div>
              </div>);
          })}
        </div>
      </div>
      {lb && <DiscLightbox images={lb.images} title={lb.title} onClose={() => setLb(null)} />}
      <div className="disc-cta">
        <div className="disc-cta-text">
          <div className="label">Before you accept a full replacement</div>
          <div className="small">Contact us first. In many cases — particularly with historic clay tile — the roof itself is salvageable. The product failed; the installation may not have. We'll help you understand the difference.</div>
        </div>
        <button className="btn-copper" onClick={() => onJump("contact")}>Request a System Assessment <ArrowRight size={14} /></button>
      </div>
    </section>);

}

function SystemsNote() {
  return (
    <section className="systems-note systems-segue" id="systems" data-screen-label="How Roofs Actually Work">
      <div className="systems-segue-lead">
        <span className="eyebrow">A Note on How Roofs Actually Work</span>
        <h2>Roofs leak for three reasons: <em>fasteners, flashings, and flawed installation.</em></h2>
        <p>What goes on top matters — but a roof is a system. The decking, underlayment, fasteners, flashings, and installation method are what decide whether it holds.</p>
      </div>
      <div className="systems-segue-row">
        {ROOF_SYSTEMS.map((s) =>
        <div className="systems-segue-item" key={s.title}>
            <span className="systems-segue-num">{s.num}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        )}
      </div>
    </section>);

}

function Crest() {
  return (
    <svg className="crest" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
      <path d="M10 80 L50 30 L90 80 Z" stroke="rgba(232,196,154,0.6)" />
      <path d="M20 80 L50 42 L80 80" stroke="rgba(232,196,154,0.4)" />
      <path d="M30 80 L50 55 L70 80" stroke="rgba(232,196,154,0.3)" />
    </svg>);

}

function PartnerMark({ kind }) {
  switch (kind) {
    case "ptx":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="0" y="0" width="120" height="80" fill="#0d1c30" />
          <rect x="6" y="6" width="108" height="68" fill="none" stroke="#c8862f" strokeWidth="1.5" />
          <text x="60" y="34" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontWeight="700" fontSize="13" fill="#f0e1c4" letterSpacing="1.4">PRESERVATION</text>
          <line x1="22" y1="42" x2="98" y2="42" stroke="#c8862f" strokeWidth="0.8" />
          <text x="60" y="60" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontWeight="700" fontSize="16" fill="#f0e1c4" letterSpacing="3">TEXAS</text>
        </svg>);

    case "pdallas":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="14" y="8" width="56" height="64" fill="#4d6f5a" />
          <text x="42" y="26" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fill="#f4ead2" letterSpacing="0.5">PRES</text>
          <text x="42" y="38" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fill="#f4ead2" letterSpacing="0.5">ERVA</text>
          <text x="42" y="50" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fill="#f4ead2" letterSpacing="0.5">TION</text>
          <line x1="20" y1="55" x2="64" y2="55" stroke="#f4ead2" strokeWidth="0.6" />
          <text x="42" y="66" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fill="#f4ead2" letterSpacing="1">DALLAS</text>
        </svg>);

    case "ppc":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22 60 L22 40 Q22 28 34 28 Q46 28 46 40 L46 60 Z" fill="#a7c0d5" />
          <path d="M48 60 L48 40 Q48 28 60 28 Q72 28 72 40 L72 60 Z" fill="#a7c0d5" />
          <path d="M74 60 L74 40 Q74 28 86 28 Q98 28 98 40 L98 60 Z" fill="#a7c0d5" />
        </svg>);

    case "hfw":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="12" y="14" width="96" height="52" fill="#f7f3ec" stroke="#1a1814" strokeWidth="1.5" />
          <polygon points="22,32 32,22 42,32 42,42 22,42" fill="#1a1814" />
          <rect x="26" y="30" width="3" height="6" fill="#f7f3ec" />
          <rect x="35" y="30" width="3" height="6" fill="#f7f3ec" />
          <text x="50" y="40" fontFamily="Georgia, serif" fontWeight="800" fontSize="20" fill="#1a1814" letterSpacing="0.5">FW</text>
          <text x="60" y="55" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="6" fill="#1a1814" letterSpacing="1.5">HISTORIC FORT WORTH</text>
        </svg>);

    case "rcat":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="40" cy="40" r="32" fill="#f7f3ec" stroke="#1a1814" strokeWidth="2" />
          <circle cx="40" cy="40" r="26" fill="none" stroke="#1a1814" strokeWidth="0.6" />
          <text x="40" y="20" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="5" fill="#1a1814">ROOFING CONTRACTORS</text>
          <text x="40" y="65" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="5" fill="#1a1814">ASSOCIATION OF TEXAS</text>
          <path d="M30 32 L34 30 L40 30 L46 34 L50 36 L48 42 L46 48 L40 50 L34 48 L30 44 Z" fill="#b9342a" />
        </svg>);

    case "ntrca":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="14" y="14" width="92" height="52" fill="#1d4a8a" />
          <polygon points="14,14 70,14 14,52" fill="#b9342a" />
          <text x="60" y="46" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="800" fontSize="18" fill="#f7f3ec" letterSpacing="1">NTRCA</text>
        </svg>);

    case "fortified":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="10" y="22" width="100" height="36" fill="#1d4a8a" />
          <text x="60" y="42" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#f7f3ec" letterSpacing="1.5">FORTIFIED</text>
          <text x="60" y="53" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="5" fill="#f7f3ec" letterSpacing="1.5">A PROGRAM OF IBHS</text>
        </svg>);

    case "tri":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="60" cy="40" r="30" fill="#f7f3ec" stroke="#1a1814" strokeWidth="1.5" />
          <circle cx="60" cy="40" r="24" fill="none" stroke="#1a1814" strokeWidth="0.5" />
          <text x="60" y="24" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4.5" fill="#1a1814" letterSpacing="1">THE ROOFING</text>
          <text x="60" y="30" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4.5" fill="#1a1814" letterSpacing="1">INSTITUTE</text>
          <path d="M52 36 L60 32 L68 36 L68 50 L52 50 Z" fill="none" stroke="#1a1814" strokeWidth="1.2" />
          <path d="M52 40 L68 40 M60 32 L60 50" stroke="#1a1814" strokeWidth="0.5" />
          <text x="60" y="59" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4" fill="#1a1814" letterSpacing="1">CERTIFIED INSTALLER</text>
        </svg>);

    case "srca":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="60" cy="40" r="30" fill="#3d3a35" />
          <circle cx="60" cy="40" r="24" fill="none" stroke="#f7f3ec" strokeWidth="0.6" />
          <text x="60" y="26" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4.5" fill="#f7f3ec" letterSpacing="1">SLATE ROOFING</text>
          <path d="M52 34 L60 30 L68 34 L68 42 L52 42 Z" fill="#f7f3ec" />
          <path d="M48 44 L72 44" stroke="#f7f3ec" strokeWidth="0.6" />
          <text x="60" y="52" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="9" fill="#f7f3ec" letterSpacing="2">SRCA</text>
        </svg>);

    case "nsa":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="60" cy="40" r="30" fill="#2c2c2a" />
          <circle cx="60" cy="40" r="24" fill="none" stroke="#f7f3ec" strokeWidth="0.5" />
          <text x="60" y="24" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4" fill="#f7f3ec" letterSpacing="1.2">NATIONAL SLATE</text>
          <text x="60" y="29" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4" fill="#f7f3ec" letterSpacing="1.2">ASSOCIATION</text>
          <rect x="46" y="34" width="28" height="18" fill="#f7f3ec" />
          <text x="60" y="48" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="13" fill="#2c2c2a" letterSpacing="1">NSA</text>
          <text x="60" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4" fill="#f7f3ec" letterSpacing="1">CERTIFIED</text>
        </svg>);

    case "usmrc":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="10" y="18" width="36" height="44" fill="#2c2c2a" />
          <path d="M14 56 L22 30 L28 50 L34 30 L42 56" fill="none" stroke="#f7f3ec" strokeWidth="3" strokeLinecap="square" />
          <text x="78" y="33" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7" fill="#2c2c2a" letterSpacing="0.4">U.S. METAL</text>
          <text x="78" y="42" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7" fill="#2c2c2a" letterSpacing="0.4">ROOFING</text>
          <text x="78" y="51" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7" fill="#2c2c2a" letterSpacing="0.4">CONSORTIUM</text>
        </svg>);

    case "chubb":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <text x="14" y="46" fontFamily="Georgia, serif" fontWeight="800" fontSize="26" fill="#1a1814" letterSpacing="-0.5">Chubb</text>
          <line x1="14" y1="52" x2="106" y2="52" stroke="#1a1814" strokeWidth="0.7" />
          <text x="14" y="62" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="5" fill="#1a1814" letterSpacing="1.2">POWERED BY APi GROUP</text>
        </svg>);

    default:
      return null;
  }
}

function PartnersMarquee({ items, showCategory }) {
  const loop = [...items, ...items];
  return (
    <div className="pmarquee" aria-label="Partner and certification logos">
      <div className="pmarquee-track">
        {loop.map((p, i) =>
        <div className="pmarquee-card" key={`${p.name}-${i}`}>
            <div className="pmarquee-mark"><PartnerMark kind={p.mark} /></div>
            <div className="pmarquee-text">
              {showCategory && <span className="pmarquee-chip">{p.category}</span>}
              <h4>{p.name}</h4>
              <span className="role">{p.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>);

}

function Partners() {
  const all = [
  ...PRESERVATION.map((p) => ({ ...p, category: "Preservation" })),
  ...TRADE_CIVIC.map((p) => ({ ...p, category: "Trade & Civic" })),
  ...CERTIFICATIONS.map((p) => ({ ...p, category: "Certification" }))];

  return (
    <section className="partners" id="partners" data-screen-label="Preservation Partners">
      <div className="partners-hero">
        <div className="partners-hero-text">
          <h2>Rooted in the Communities Whose History We Protect</h2>
          <p className="lead">Historic restoration work is inseparable from the communities it serves. Our affiliations connect us to the preservation organizations, trade bodies, and civic networks that set the standard for how this work should be done and who it should benefit.</p>
        </div>
      </div>

      <div className="partners-marquee-head">Our Affiliations</div>
      <PartnersMarquee items={all} showCategory={true} />
    </section>);

}

function Journal() {
  const visible = 3;
  const total = JOURNAL.length;
  const max = Math.max(0, total - visible);
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(max, i + 1));
  return (
    <section className="journal" id="journal" data-screen-label="Journal">
      <div className="journal-head">
        <h2 className="journal-title">Roofing<br />Field Journal</h2>
        <div className="journal-meta" style={{ textAlign: "right", justifyContent: "center", alignItems: "flex-end" }}>
          <p className="journal-sub" style={{ textAlign: "right" }}>Expert notes on materials, restoration, and historic craft.</p>
          <button className="journal-viewall" style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
            <ArrowRight size={14} /> View all
          </button>
        </div>
      </div>
      <div className="journal-divider" />
      <div className="journal-track-wrap">
        <div
          className="journal-track"
          style={{ transform: `translateX(calc(${idx * -100 / visible}% - ${idx} * var(--carousel-gap, 16px)))` }}>
          
          {JOURNAL.map((a) =>
          <article className="journal-card" key={a.title}>
              <div className="journal-card-img" style={{ backgroundImage: `url("${a.image}")` }} />
              <div className="journal-card-tag">{a.tag} · {a.date}</div>
              <h3 className="journal-card-title">{a.title}</h3>
              <div className="journal-card-foot">
                <ArrowRight size={14} /> Read article
              </div>
            </article>
          )}
        </div>
      </div>
      <div className="journal-controls">
        <button
          className="journal-btn"
          onClick={prev}
          disabled={idx === 0}
          aria-label="Previous">
          
          <span className="journal-arrow journal-arrow--left">
            <ArrowRight size={16} />
          </span>
        </button>
        <button
          className="journal-btn is-dark"
          onClick={next}
          disabled={idx >= max}
          aria-label="Next">
          
          <span className="journal-arrow">
            <ArrowRight size={16} />
          </span>
        </button>
      </div>
    </section>);

}

function FinalCTA({ variant }) {
  const isContact = variant === "contact";
  return (
    <section className="final-cta" id="contact" data-screen-label="Contact CTA">
      <div className="final-cta-brand">
        <span className="brand-rule" />
        <div className="brand-mark">
          <img src="assets/logo.png" alt="Priority Designer · Historic Exteriors" className="brand-logo-img" />
        </div>
        <span className="brand-rule" />
      </div>

      <div className="final-cta-card">
        <div className="final-cta-img" />
        <div className="final-cta-scrim" />
        <div className="final-cta-inner">
          {isContact
          ? <React.Fragment>
                <span className="final-cta-eyebrow">While You Wait to Hear From Us</span>
                <h2>
                  Spend a few minutes with the work itself.
                  <br />
                  <em>Slate, copper, clay <span className="amp">&</span> the houses they cover.</em>
                </h2>
                <div className="final-cta-actions">
                  <a className="btn-copper-solid" href="portfolio.html">View Our Portfolio</a>
                  <a className="btn-navy-solid" href="materials.html">Explore Materials</a>
                </div>
              </React.Fragment>
          : <React.Fragment>
                <span className="final-cta-eyebrow">A Note on How Roofs Actually Work</span>
                <h2>
                  Roofs often leak for three reasons:
                  <br />
                  <em>Fasteners, Flashings, <span className="amp">and</span> Flawed installation.</em>
                </h2>
                <div className="final-cta-actions">
                  <a className="btn-copper-solid" href="contact.html">Request a System Assessment</a>
                  <a className="btn-navy-solid" href="portfolio.html">See Our Portfolio</a>
                </div>
              </React.Fragment>
          }
        </div>
      </div>
    </section>);

}

function Footer() {
  const affiliations = (typeof TRUST !== "undefined" ? TRUST : []).slice(0, 6);
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <span className="footer-head">Contact</span>
          <a className="footer-link" href="tel:+12145550100">(214) 555-0100</a>
          <a className="footer-link" href="mailto:hello@prioritydesigner.com">hello@prioritydesigner.com</a>
          <a className="footer-link footer-cta" href="contact.html">Schedule a Consultation →</a>
        </div>
        <div className="footer-col">
          <span className="footer-head">Visit</span>
          <span className="footer-line-soft">Dallas–Fort Worth Metroplex</span>
          <span className="footer-line-soft">Showroom by appointment</span>
        </div>
        <div className="footer-col">
          <span className="footer-head">Explore</span>
          <a className="footer-link" href="about.html">About</a>
          <a className="footer-link" href="portfolio.html">Portfolio</a>
          <a className="footer-link" href="materials.html">Materials</a>
          <a className="footer-link" href="discontinued.html">Discontinued Products</a>
          <a className="footer-link" href="blog.html">Blog</a>
        </div>
        <div className="footer-col">
          <span className="footer-head">Affiliations</span>
          {affiliations.map((a) =>
          <span key={a.initials} className="footer-line-soft" title={a.role}>{a.name}</span>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-line">
          © 2026 PRIORITY DESIGNER · HISTORIC EXTERIORS · LICENSED · BONDED · INSURED
        </div>
        <a className="footer-privacy" href="privacy.html">Privacy</a>
      </div>
    </footer>);

}

function PageHero({ title, eyebrow, sub, image }) {
  // Subpages never mount the home Hero, but :root sets --hero-inset to 28px
  // (used by Hero's framed-edge animation). On subpages we need it at 0 so
  // the nav doesn't render with a 28px gap above it.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.getPropertyValue("--hero-inset");
    root.style.setProperty("--hero-inset", "0px");
    return () => {
      if (prev) root.style.setProperty("--hero-inset", prev);
      else root.style.removeProperty("--hero-inset");
    };
  }, []);
  return (
    <section className="page-hero" data-nav-theme="dark" style={image ? { backgroundImage: `url("${image}")` } : {}}>
      {image && <div className="page-hero-img-scrim" />}
      <div className="page-hero-inner">
        {eyebrow && <span className="page-hero-eyebrow eyebrow">{eyebrow}</span>}
        <h1 className="page-hero-title">{title}</h1>
        {sub && <p className="page-hero-sub">{sub}</p>}
      </div>
    </section>);
}

function DiscontinuedTeaser() {
  return (
    <section className="disc-teaser" id="disc-teaser">
      <div className="disc-teaser-inner">
        <div className="disc-teaser-text">
          <span className="eyebrow">Industry Knowledge</span>
          <h2>Discontinued Products We <em>Know in the Field</em></h2>
          <p>Some products on our discontinued list failed in the field; others were simply phased out and are no longer manufactured. We carry documented history on each — and know how to match, repair, or replace them.</p>
        </div>
        <a className="btn-copper disc-teaser-link" href="discontinued.html">
          See Discontinued Products <ArrowRight size={14} />
        </a>
      </div>
    </section>);
}

function TeamSection() {
  const groupPhoto = ""; // single group photo — to be supplied by Jack
  return (
    <section className="team" id="team" data-screen-label="Team">
      <div className="section-head">
        <div className="left">
          <span className="eyebrow">The People Behind the Work</span>
          <h2>Meet the <em>Team</em></h2>
        </div>
        <div className="right">
          Every estimate, every installation, every call-back is handled by the same people. No subcontractor carousel — just tradesmen who have been doing this for years and know the difference between a roof that holds and one that doesn't.
        </div>
      </div>
      <figure className="team-photo">
        {groupPhoto ?
        <img src={groupPhoto} alt="The Priority Designer team" /> :
        <div className="team-photo-placeholder"><span>Team photo coming soon</span></div>
        }
        <figcaption>The Priority Designer crew — Dallas–Fort Worth.</figcaption>
      </figure>
    </section>);
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    fetch("https://formspree.io/f/placeholder", { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(() => setSent(true))
      .catch(() => setSent(true));
  };
  return (
    <section className="contact-section" id="contact" data-screen-label="Contact">
      <div className="contact-inner">
        <div className="contact-text">
          <span className="eyebrow">Get in Touch</span>
          <h2>Schedule a <em>Consultation</em></h2>
          <p>We review every inquiry personally. Expect a response within one business day. For urgent matters call us directly.</p>
          <div className="contact-details">
            <div className="contact-detail"><PhoneIcon /><span>(214) 555-0100</span></div>
            <div className="contact-detail"><span className="contact-label">Email</span><span>hello@prioritydesigner.com</span></div>
            <div className="contact-detail"><span className="contact-label">Location</span><span>Dallas–Fort Worth Metroplex</span></div>
          </div>
        </div>
        <div className="contact-form-wrap">
          {sent
          ? <div className="contact-sent">
                <h3>Message received.</h3>
                <p>We'll be in touch within one business day.</p>
              </div>
          : <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>
                    <span>Name</span>
                    <input type="text" name="name" required placeholder="Full name" />
                  </label>
                  <label>
                    <span>Email</span>
                    <input type="email" name="email" required placeholder="your@email.com" />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    <span>Phone</span>
                    <input type="tel" name="phone" placeholder="(214) 555-0000" />
                  </label>
                  <label>
                    <span>Roof Type</span>
                    <select name="roof_type">
                      <option value="">Select a type</option>
                      <option>Natural Slate</option>
                      <option>Clay Tile</option>
                      <option>Metal / Copper</option>
                      <option>Synthetic</option>
                      <option>Discontinued / Unknown Profile</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>
                <label className="form-full">
                  <span>Property Address</span>
                  <input type="text" name="address" placeholder="123 Estate Dr, Dallas, TX" />
                </label>
                <label className="form-full">
                  <span>Message</span>
                  <textarea name="message" rows="5" placeholder="Describe your project or concern…" />
                </label>
                <button type="submit" className="btn-copper-solid form-submit">
                  Request Assessment <ArrowRight size={14} />
                </button>
              </form>
          }
        </div>
      </div>
    </section>);
}

// ─── Portfolio page ───────────────────────────────────────────

const FILTER_TYPES = ["All", "Slate", "Clay Tile", "Metal", "Designer Shingles", "Commercial"];

function ProjectGrid({ onOpen }) {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === filter);
  // 2026-05-29: client names no longer surface on the public-facing card. We
  // show the tag, location, and a one-line descriptor. The internal `name`
  // field is preserved for slug routing into the detail modal.
  return (
    <section className="proj-grid-section section-light" id="proj-grid">
      <div className="proj-filter">
        {FILTER_TYPES.map((f) =>
        <button key={f} className={`proj-filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        )}
      </div>
      <div className="proj-grid">
        {visible.map((p) =>
        <article
          className="proj-card"
          key={p.slug || p.name}
          onClick={() => onOpen && onOpen(p.slug)}
          onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && onOpen) { e.preventDefault(); onOpen(p.slug); } }}
          tabIndex={onOpen ? 0 : -1}
          role={onOpen ? "button" : undefined}
          aria-label={onOpen ? `View ${p.tag} project in ${p.loc}` : undefined}>

            <div className="proj-card-img" style={{ backgroundImage: `url(${p.image})` }} />
            <div className="proj-card-scrim" />
            <div className="proj-card-body">
              <span className="proj-card-tag">{p.tag}</span>
              <div className="proj-card-loc">{p.loc}</div>
              <p className="proj-card-desc">{p.desc}</p>
              {onOpen && <span className="proj-card-cta">View project <ArrowRight size={12} /></span>}
            </div>
          </article>
        )}
      </div>
    </section>);
}

// ── ProjectDetail modal ───────────────────────────────────────
// Opened from ProjectGrid card click or from a deep link (?p=<slug>) sent by
// the homepage JobsMap. Renders a gallery + the longDesc, with no client name.
function ProjectDetail({ slug, onClose }) {
  const project = React.useMemo(() => PROJECTS.find((p) => p.slug === slug) || null, [slug]);
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => { if (e.key === "Escape") onClose && onClose(); };
    document.addEventListener("keydown", onKey);
    // iOS-safe scroll lock: pin <body> in place and restore the scroll
    // position on close. Plain overflow:hidden can shift the page on iOS.
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      // Restore scroll instantly — the global `html { scroll-behavior: smooth }`
      // would otherwise animate the jump when the position:fixed lock releases.
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = prevBehavior;
    };
  }, [project, onClose]);
  if (!project) return null;
  const gallery = project.gallery && project.gallery.length ? project.gallery : [project.image];
  // Derive a public-facing title that does not expose the client name.
  const displayTitle = `${project.tag} · ${project.loc}`;
  return (
    <div className="project-detail-overlay" onClick={(e) => { if (e.target.classList.contains("project-detail-overlay")) onClose && onClose(); }}>
      <article className="project-detail" role="dialog" aria-modal="true" aria-label={displayTitle}>
        <button className="project-detail-close" onClick={onClose} aria-label="Close">×</button>
        <div className="project-detail-gallery">
          {gallery.map((src, i) =>
            <div className="project-detail-img" key={i} style={{ backgroundImage: `url("${src}")` }} />
          )}
        </div>
        <div className="project-detail-body">
          <span className="eyebrow" style={{ color: "var(--copper-300)" }}>{project.tag}</span>
          <h2 className="project-detail-title">{displayTitle}</h2>
          <dl className="project-detail-specs">
            <div><dt>Location</dt><dd>{project.loc}</dd></div>
            <div><dt>System</dt><dd>{project.tag}</dd></div>
            <div><dt>Category</dt><dd>{project.type}</dd></div>
            {project.coming && <div><dt>Status</dt><dd className="is-coming">Project coming</dd></div>}
          </dl>
          <p className="project-detail-long">{project.longDesc || project.desc}</p>
          <a className="btn-copper project-detail-cta" href="contact.html">Discuss a Similar Project <ArrowRight size={14} /></a>
        </div>
      </article>
    </div>);
}

// Portfolio = A-to-Z customer process (Jack, 2026-05-29). Replaces the old
// inspection→sourcing→install→review framing with the actual customer journey.
const PROCESS_STEPS = [
  { num: "01", title: "First Call", body: "We talk through the project before scheduling anything. Address, structure, what you're seeing, and what your timeline looks like. If we're not the right fit, we'll tell you and point you toward someone who is." },
  { num: "02", title: "Site Assessment", body: "We come to the property and spend time on the roof — not the driveway. Substrate condition, flashing integrity, fastener type, and a documented evaluation of what's salvageable. You receive a written assessment before any number is discussed." },
  { num: "03", title: "File the Claim", body: "If insurance is involved, we document the damage on your behalf, compile the photo package, and submit the claim through your carrier. We coordinate the adjuster visit and walk the roof with them." },
  { num: "04", title: "Work With Your Insurance", body: "Adjuster negotiation, scope alignment, supplement requests where the original estimate falls short. You don't manage the back-and-forth with your carrier — we do." },
  { num: "05", title: "Schedule & Walkthrough", body: "Install scheduled around your calendar. Our crew, our quality control, our final walkthrough with you on the completed roof. Written documentation of all work performed and any conditions to monitor going forward." },
];

const PORTFOLIO_STEP_PHOTOS = [
  "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&auto=format&fit=crop&q=80",
];

function ProcessSection() {
  return (
    <section className="process-section">
      <div className="process-head">
        <span className="eyebrow" style={{ color: "var(--copper-300)" }}>How We Work</span>
        <h2>Every Project, <em>The Same Standard</em></h2>
      </div>
      <StepsRail
        steps={PROCESS_STEPS}
        dark={true}
        accentKind="thumb"
        accent={(s, i) =>
          <img src={PORTFOLIO_STEP_PHOTOS[i]} alt="" loading="lazy" />
        } />
    </section>);
}

// ─── Materials page ───────────────────────────────────────────

function MaterialsPhilosophy() {
  return (
    <section className="mat-philosophy section-light">
      <div className="mat-philosophy-inner">
        <div className="mat-philosophy-left">
          <span className="eyebrow">The Standard</span>
          <h2>We add a manufacturer only when a product <em>raises our standard.</em></h2>
        </div>
        <div className="mat-philosophy-right">
          <p>Most roofing contractors carry whatever their distributor stocks. We don't work that way. Before a manufacturer earns a place on our approved list, we install their product on a real project, inspect it after two full weather cycles, and evaluate it against the alternatives we already trust.</p>
          <p>That process has taken us the better part of a decade to complete. It's why we have four manufacturers and not forty. It's also why we can stand behind every material we install — not because we read a spec sheet, but because we've seen what happens when these products encounter the Texas climate, a century of thermal movement, and a contractor who cuts corners on the underlayment.</p>
          <p>If a product can't survive that evaluation, we don't install it. If a manufacturer discontinues a product we believe in, we find out why before we recommend the replacement.</p>
        </div>
      </div>
    </section>);
}

const COMPARISON_ROWS = [
  { label: "Lifespan",            slate: "75–150 yrs",  clay: "50–100 yrs", metal: "40–70 yrs",  synth: "30–50 yrs" },
  { label: "Cost Tier",           slate: "Premium",     clay: "Premium",    metal: "High",        synth: "Mid" },
  { label: "Weight",              slate: "Heavy",       clay: "Heavy",      metal: "Light",       synth: "Light" },
  { label: "Fire Rating",         slate: "Class A",     clay: "Class A",    metal: "Class A",     synth: "Class 4" },
  { label: "Historic Authenticity", slate: "Highest",   clay: "Highest",    metal: "High",        synth: "Moderate" },
  { label: "Landmark Compatible", slate: "Yes",         clay: "Yes",        metal: "Often",       synth: "Rarely" },
  { label: "Best For",            slate: "Tudor, Colonial, Châteauesque",  clay: "Spanish, Mediterranean, French Norman", metal: "Modern, Craftsman, transitions", synth: "Budget-conscious historic, high-wind zones" },
];

function MaterialComparison() {
  return (
    <section className="mat-comparison">
      <div className="mat-comp-head">
        <span className="eyebrow" style={{ color: "var(--copper-300)" }}>Side by Side</span>
        <h2>Choosing the <em>Right Material</em></h2>
        <p className="mat-comp-sub">Every material has a right application. These are the facts that guide our recommendations — not distributor margins.</p>
      </div>
      <div className="mat-comp-table-wrap">
        <table className="mat-comp-table">
          <thead>
            <tr>
              <th />
              <th className="is-featured">Natural Slate</th>
              <th>Clay Tile</th>
              <th>Metal / Copper</th>
              <th>Synthetic</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) =>
            <tr key={row.label}>
                <td className="mat-comp-label">{row.label}</td>
                <td className="is-featured">{row.slate}</td>
                <td>{row.clay}</td>
                <td>{row.metal}</td>
                <td>{row.synth}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>);
}

function InstallProcess() {
  return (
    <section className="install-process">
      <div className="install-head">
        <span className="eyebrow" style={{ color: "var(--copper-300)" }}>From Truck to Ridge</span>
        <h2>How <em>The Install Runs</em></h2>
        <p className="install-sub">Same crew, same sequence, every project. The order matters as much as the material.</p>
      </div>
      <StepsRail
        steps={INSTALL_STEPS}
        dark={true}
        accentKind="thumb"
        accent={(s, i) =>
          <img src={INSTALL_STEP_PHOTOS[i]} alt="" loading="lazy" />
        } />
    </section>);
}

function LifecycleROI() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) {setSeen(true);io.disconnect();}},
      { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  // 150 yr shared axis. Each material renders as a single horizontal bar; ones
  // that don't reach 150 yrs show tear-off markers at each replacement boundary.
  const HORIZON = 150;
  return (
    <section className="lifecycle-roi" ref={ref}>
      <div className="lifecycle-head">
        <span className="eyebrow" style={{ color: "var(--copper-300)" }}>The Math on Premium Materials</span>
        <h2>One slate installation <em>outlasts five asphalt roofs.</em></h2>
        <p className="lifecycle-sub">A 150-year window, set against the rated lifespan of every material we install. The story isn't subtle — and it isn't about cost per square. It's about how many times the same house gets re-roofed in your lifetime.</p>
      </div>

      <div className={`lifecycle-rows${seen ? " is-in" : ""}`}>
        {LIFECYCLE_MATERIALS.map((m, idx) => {
          const segments = Array.from({ length: m.segments }, (_, i) => ({
            years: m.years,
            isLast: i === m.segments - 1,
          }));
          // The last segment may extend past 150 — clamp by reducing flex on overflow.
          const totalRaw = m.segments * m.years;
          const overflow = Math.max(0, totalRaw - HORIZON);
          return (
            <div className={`lifecycle-row lifecycle-row--${m.tone}`} key={m.key} style={{ "--row-i": idx }}>
              <div className="lifecycle-row-label">
                <span className="lifecycle-row-name">{m.name}</span>
                <span className="lifecycle-row-meta">{m.years} yr rated · {m.note}</span>
              </div>
              <div className="lifecycle-row-bar">
                {segments.map((s, i) => {
                  const isFinal = i === segments.length - 1;
                  const yrs = isFinal && overflow > 0 ? Math.max(1, s.years - overflow) : s.years;
                  return (
                    <React.Fragment key={i}>
                      <div className="lifecycle-seg" style={{ flex: yrs, "--i": i }}>
                        <span className="lifecycle-seg-label">{i === 0 ? "Install" : `Replace ${i}`}</span>
                      </div>
                      {!isFinal &&
                        <div className="lifecycle-tear" aria-hidden="true">
                          <span className="lifecycle-tear-mark">TEAR-OFF</span>
                        </div>
                      }
                    </React.Fragment>);
                })}
              </div>
            </div>);
        })}
        <div className="lifecycle-axis lifecycle-axis--shared">
          <span>0</span><span>30</span><span>50</span><span>75</span><span>100</span><span>150 yrs</span>
        </div>
      </div>

      <div className={`lifecycle-callout${seen ? " is-in" : ""}`}>
        <div className="lifecycle-callout-num">40%</div>
        <div className="lifecycle-callout-text">
          <span className="lifecycle-callout-eyebrow">Insurance premium reduction</span>
          <p>Typical reduction available to FORTIFIED-certified roof installations — applicable to slate, clay, and qualifying metal systems.</p>
        </div>
      </div>

      <p className="lifecycle-note">Figures based on manufacturer ratings, industry actuarial data, and IBHS FORTIFIED program documentation. Individual results vary by climate, installation quality, and maintenance schedule.</p>
    </section>);
}

function RequestSample() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    fetch("https://formspree.io/f/placeholder", { method: "POST", body: data, headers: { Accept: "application/json" } }).
    then(() => setSent(true)).
    catch(() => setSent(true));
  };
  return (
    <section className="req-sample" id="request-sample" data-screen-label="Request a Sample">
      <div className="req-sample-card">
        {sent ?
        <div className="req-sample-sent">
            <h3>Request received.</h3>
            <p>We'll reach out to confirm the product and get a sample on its way.</p>
          </div> :

        <React.Fragment>
            {/* TODO(jack): supply a real showroom photo — replace the placeholder
                background-image when the photo arrives. Per 2026-05-29. */}
            <div
              className="req-sample-showroom"
              role="img"
              aria-label="Priority Designer showroom — photo coming soon"
              style={{ backgroundImage: "url(\"https://images.unsplash.com/photo-1556909114-44e3e9399a2f?w=1600&auto=format&fit=crop&q=85\")" }}>
              <span className="req-sample-showroom-tag">See It In Person — Visit the Showroom</span>
            </div>
            <div className="req-sample-head">
              <span className="eyebrow">See It in Person</span>
              <h3>Request a <em>Sample</em></h3>
              <p>Tell us what you're considering and we'll get a sample into your hands — or invite you to the showroom to see the full range in person.</p>
            </div>
            <form className="req-sample-form" onSubmit={handleSubmit}>
              <div className="req-row">
                <label>
                  <span>Material</span>
                  <select name="material" required defaultValue="">
                    <option value="" disabled>Select a material</option>
                    <option>Natural Slate</option>
                    <option>Clay Tile</option>
                    <option>Synthetic (Brava)</option>
                    <option>Metal / Copper</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <label>
                  <span>Product / Color</span>
                  <input type="text" name="product" placeholder="e.g. Brava Slate · Vermont black" />
                </label>
              </div>
              <div className="req-row">
                <label>
                  <span>Name</span>
                  <input type="text" name="name" required placeholder="Full name" />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" name="email" required placeholder="your@email.com" />
                </label>
              </div>
              <div className="req-row">
                <label>
                  <span>Phone</span>
                  <input type="tel" name="phone" placeholder="(214) 555-0000" />
                </label>
                <label>
                  <span>Property Address</span>
                  <input type="text" name="address" placeholder="City or ZIP" />
                </label>
              </div>
              <button type="submit" className="btn-copper-solid req-sample-submit">
                Request a Sample <ArrowRight size={14} />
              </button>
              <p className="req-sample-note">Brava and Slate Valley samples are coordinated directly through us. For Ludowici and La Escandella profiles, we'll confirm availability and follow up with options.</p>
            </form>
          </React.Fragment>
        }
      </div>
    </section>);

}

// ─── About page ──────────────────────────────────────────────

function CompanyStory() {
  return (
    <section className="company-story section-light">
      <div className="company-story-inner">
        <div className="company-story-left">
          <span className="eyebrow">Est. 2016</span>
          <h2>Built on the Belief That <em>Some Roofs Are Worth Saving</em></h2>
        </div>
        <div className="company-story-right">
          <p>Priority Designer was founded in Dallas in 2016 with a straightforward premise: the historic homes of the DFW Metroplex deserved a contractor who understood them. Not a generalist who could put on an asphalt shingle and walk away, but a tradesman who knew the difference between a Vermont slate and a Pennsylvania blue-grey, who could source a discontinued clay tile profile, and who understood that a flashing installed incorrectly on a 1928 Tudor would cost the homeowner ten times more in twenty years than doing it right the first time.</p>
          <p>A decade later, the company is still built around that idea. We haven't grown into a franchise. We haven't diversified into gutters and siding to chase volume. Every project we take is a historic or estate-class exterior — the kind of work that requires a contractor who has seen the same roof fail twice and knows exactly why. That's the only kind of contractor we've ever tried to be.</p>
        </div>
      </div>
    </section>);
}

const PRINCIPLES = [
  { title: "We don't subcontract installation.", body: "The crew that assessed your roof installs it. There are no day-laborers, no staffing agencies, no handoffs. We know who is on your roof at every stage because we've worked with them for years." },
  { title: "We don't install less-than-quality materials.", body: "Natural slate, authentic clay, and the one synthetic we trust — that's the list. We won't put a cheaper material on your roof to win a bid, because we're the ones who have to stand behind it." },
  { title: "We don't call a roof sound just because it has no hail damage.", body: "A roof can pass a hail inspection and still be failing — at the flashings, the underlayment, the fasteners. We assess the whole system, not just the surface an adjuster photographs." },
  { title: "We don't file insurance claims without legitimate cause.", body: "We pursue a claim only when there is genuine, documented cause an insurer owes. We won't manufacture damage or file a claim that wastes your time and raises your premium." },
  { title: "We don't chase volume.", body: "We take fewer projects than we could. That's a deliberate choice. It means the principals are involved in every estimate, every installation decision, and every final walkthrough — not managing from a distance." },
  { title: "We don't cut corners on what you can't see.", body: "Underlayment, fasteners, deck preparation — these are the components no inspector photographs and no homeowner sees. They are also the components that determine whether your roof holds for fifty years or fifteen." },
];

function PhilosophyCard({ title, body, index }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) {setSeen(true);io.disconnect();}},
      { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  // Strip leading "We don't " so the sticky anchor isn't repeated
  const stripped = title.replace(/^we don['']?t\s+/i, "");
  return (
    <article className={`philosophy-card${seen ? " is-in" : ""}`} ref={ref} style={{ "--i": index }}>
      <span className="philosophy-card-num">{String(index + 1).padStart(2, "0")}</span>
      <h3>{stripped}</h3>
      <p>{body}</p>
    </article>);
}

function PhilosophySection() {
  return (
    <section className="philosophy-section">
      <div className="philosophy-inner">
        <aside className="philosophy-anchor">
          <span className="eyebrow" style={{ color: "var(--copper-300)" }}>How We Operate</span>
          <h2 className="philosophy-anchor-h">
            <span>We</span>
            <span className="don">Don't.</span>
          </h2>
          <p className="philosophy-anchor-sub">Six lines we won't cross, regardless of the project.</p>
        </aside>
        <div className="philosophy-list">
          {PRINCIPLES.map((p, i) =>
            <PhilosophyCard title={p.title} body={p.body} index={i} key={p.title} />
          )}
        </div>
      </div>
    </section>);
}

// ── The Good, the True, and the Beautiful ──────────────────────
// Develops the hero tagline into a real values triad on the About page,
// with a condensed echo (EthosEcho) on the Home page. Inspired by the
// Cultural Tutor / William Morris idea Jack shared: the "useful vs.
// beautiful" tradeoff is a false one. Three-column layout (Ryan picked
// it over the editorial variant on 2026-06-07).
const MORRIS_QUOTE = {
  text: "To give people pleasure in the things they must perforce use, that is one great office of decoration; to give people pleasure in the things they must perforce make, that is the other use of it.",
  cite: "William Morris",
};
// A real copper detail from our own work carries the quote — proof that the
// working parts of a roof are worth looking at. Easily swappable.
// (Ryan picked the three-column layout 2026-06-07; the editorial variant was dropped.)
// Hand-formed copper gutter, downspout, and valley work — the literal "beautiful
// drainpipe" idea (Ryan supplied this photo 2026-06-07).
const ETHOS_IMAGE = "assets/ethos-copper.webp";
const TRIAD = [
  {
    word: "Good",
    sub: "Built honestly, built to last.",
    body: "The good means that we treat our work with diligence and dignity. We believe in building roofs that last for centuries as an act of civic virtue — providing sanctuary for families and the generations to come.",
  },
  {
    word: "True",
    sub: "True to the building, the material, the period.",
    body: "Honesty is everything. The roofing industry has a less than honest reputation, to say the least. We want to cultivate honesty in the industry by communicating clearly, never installing subpar materials, and never masking installation flaws. The roof stands as a shield, built with the conviction that integrity must exist even where the human eye cannot see.",
  },
  {
    word: "Beautiful",
    sub: "The useful and the beautiful were never enemies.",
    body: "Somewhere we taught ourselves that a thing can be useful or beautiful but not both. Much of modern work has traded beauty for cost, efficiency, or ease. Our roofs are an attempt to return to beautifying the world around us. Historically, architecture and roofs served as a visual theology — inspiring a sense of awe embedded in the grain, shadow lines, textures, and colors of slate, clay, and copper.",
  },
];

function EthosPillar({ t, index }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  return (
    <article className={`ethos-pillar${seen ? " is-in" : ""}`} ref={ref} style={{ "--i": index }}>
      <div className="ethos-pillar-head">
        <span className="ethos-pillar-num">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="ethos-pillar-word">{t.word}</h3>
      </div>
      <div className="ethos-pillar-text">
        <p className="ethos-pillar-sub">{t.sub}</p>
        <p className="ethos-pillar-body">{t.body}</p>
      </div>
    </article>);
}

function Ethos() {
  return (
    <section className="ethos section-light ethos-columns" id="ethos">
      <div className="ethos-inner">
        <header className="ethos-head">
          <span className="eyebrow">What We Build For</span>
          <h2>The Good, the True,<br />and the <em>Beautiful</em></h2>
          <p className="ethos-lede">Three words, borrowed from a very old idea about what makes a thing worth building. They're the closest thing we have to a creed — and the test every roof we touch has to pass.</p>
        </header>
        <div className="ethos-grid">
          {TRIAD.map((t, i) => <EthosPillar key={t.word} t={t} index={i} />)}
        </div>
        <figure className="ethos-quote">
          <div className="ethos-quote-img">
            <img src={ETHOS_IMAGE} alt="Hand-formed copper gutters, downspout, and valley flashing on one of our restorations" loading="lazy" />
          </div>
          <div className="ethos-quote-body">
            <blockquote>{MORRIS_QUOTE.text}</blockquote>
            <figcaption>— {MORRIS_QUOTE.cite}</figcaption>
          </div>
        </figure>
      </div>
    </section>);
}

// Condensed Home-page echo — the three words large, linking to the full
// section on the About page.
function EthosEcho() {
  return (
    <section className="ethos-echo" id="ethos-echo">
      <div className="ethos-echo-inner">
        <span className="eyebrow">Our Ethos</span>
        <h2 className="ethos-echo-words">
          <span>Good.</span>
          <span>True.</span>
          <span><em>Beautiful.</em></span>
        </h2>
        <p className="ethos-echo-sub">Three words that we believe underpin our lives, including the roofs we sell and install.</p>
        <a className="ethos-echo-link" href="about.html#ethos">Read our ethos <ArrowRight /></a>
      </div>
    </section>);
}

const OVERVIEW_STEPS = [
  { num: "01", title: "First Call", body: "We talk through the project before scheduling anything. If it's not the right fit for us, we'll tell you — and we'll tell you who might be a better match." },
  { num: "02", title: "Site Assessment", body: "We spend time on the roof. Condition of the deck, flashing integrity, substrate compatibility, salvageability. You receive a written assessment before any number is discussed." },
  { num: "03", title: "Material Proposal", body: "We present a specific material recommendation with sourcing timeline, installation method, and warranty terms. We explain why, not just what." },
  { num: "04", title: "Installation", body: "Our own crew, our own schedule, our own quality control at every stage. No surprises, no change orders for work that should have been in the scope from the start." },
  { num: "05", title: "Final Walkthrough", body: "We walk the completed roof with you. Every penetration verified, every valley signed off, written documentation of all work performed and any future conditions to monitor." },
];

// ── Shared step pattern: horizontal rail with active focus on scroll ──
function StepsRail({ steps, dark, accent, accentKind }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.7;
      const total = vh * 0.15 + r.height * 0.45;
      const p = Math.max(0, Math.min(1, (start - r.top) / total));
      setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps.length]);
  const railCls = ["steps-rail",
    dark && "is-dark",
    accentKind && `accent-${accentKind}`].
    filter(Boolean).join(" ");
  return (
    <div className={railCls} ref={ref} style={{ "--col-count": steps.length }}>
      <ol className="steps-rail-list">
        {steps.map((s, i) => {
          const cls = i === active ? "is-active" : i < active ? "is-past" : "";
          return (
            <li className={`steps-rail-item ${cls}`} key={s.num}>
              {accent && <div className="steps-rail-accent">{accent(s, i)}</div>}
              <div className="steps-rail-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>);
        })}
      </ol>
    </div>);
}

const ABOUT_STEP_PHOTOS = [
  "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80",
];

function ProcessOverview() {
  return (
    <section className="process-overview section-light">
      <div className="process-ov-head">
        <span className="eyebrow">How a Project Runs</span>
        <h2>No Surprises. <em>No Handoffs.</em></h2>
      </div>
      <StepsRail
        steps={OVERVIEW_STEPS}
        accentKind="photo"
        accent={(s, i) =>
          <img src={ABOUT_STEP_PHOTOS[i]} alt="" loading="lazy" />
        } />
    </section>);
}

const SERVICE_AREAS = [
  "Highland Park", "University Park", "Preston Hollow", "Park Cities",
  "Southlake", "Westover Hills", "Aledo", "Fort Worth Historic Districts",
  "Oak Cliff", "Lake Highlands", "Irving Estate Properties",
];

function ServiceArea() {
  const renderGroup = (k) =>
  <div className="svc-group" key={k}>
      {SERVICE_AREAS.map((a, i) =>
    <React.Fragment key={`${k}-${a}`}>
          <span className="svc-area">{a}</span>
          {i < SERVICE_AREAS.length - 1 && <span className="svc-dot">·</span>}
        </React.Fragment>
    )}
      <span className="svc-dot">·</span>
    </div>;

  return (
    <div className="service-area">
      <div className="svc-label eyebrow">Dallas–Fort Worth Metroplex Coverage</div>
      <div className="svc-track">
        {renderGroup("a")}
        {renderGroup("b")}
      </div>
    </div>);
}

// ─── Discontinued page ────────────────────────────────────────

function DiscontinuedIntro() {
  return (
    <section className="disc-intro">
      <div className="disc-intro-inner">
        <span className="eyebrow" style={{ color: "var(--copper-300)" }}>A Note From the Field</span>
        <blockquote className="disc-intro-quote">
          <p>"We keep this list so you don't get caught the way too many homeowners do — holding the bill for a product that's no longer made, with the contractor long gone and the warranty worthless. Some of these aged out. Some failed. We know the difference — and what to do about it."</p>
        </blockquote>
        <div className="disc-intro-sig">— Jack, Founder · Priority Designer · Est. 2016</div>
      </div>
    </section>);
}

// 2026-05-29: HistoricalContext + EraFrame + HISTORICAL_ERAS removed.
// Jack asked us to drop the era framing and replace it with "three reasons we
// see roofs fail" — see ThreeReasonsSection below, which uses THREE_REASONS
// from data.jsx.

function ReasonFrame({ r, index }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) {setSeen(true);io.disconnect();}},
      { threshold: 0.35 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  return (
    <article
      className={`reason-frame${seen ? " is-in" : ""}${index % 2 ? " is-right" : ""}`}
      ref={ref}
      style={{ backgroundImage: `url("${r.image}")` }}>
      <div className="reason-frame-scrim" />
      <div className="reason-frame-inner">
        <div className="reason-frame-num" aria-hidden="true">{r.num}</div>
        <div className="reason-frame-body">
          <span className="reason-frame-eyebrow">{r.subtitle}</span>
          <h3>{r.title}</h3>
          <p>{r.body}</p>
          <ul className="reason-frame-examples">
            {r.examples.map((ex) => <li key={ex}>{ex}</li>)}
          </ul>
        </div>
      </div>
    </article>);
}

function ThreeReasonsSection() {
  return (
    <section className="three-reasons">
      <div className="three-reasons-head">
        <span className="eyebrow">Why Roofs Fail</span>
        <h2>The Three Reasons We <em>See Roofs Fail</em></h2>
        <p className="three-reasons-sub">It is rarely the visible field material. It is almost always one of three things below it — decking, flashings, or fasteners — done quickly the first time and discovered slowly twenty years later.</p>
      </div>
      <div className="reason-frames">
        {THREE_REASONS.map((r, i) =>
          <ReasonFrame r={r} index={i} key={r.num} />
        )}
      </div>
    </section>);
}

// Discontinued = manufacturer-warranty process (Jack, 2026-05-29). Reframes
// the previous "what to do" advice as the warranty workflow homeowners actually
// run when their roof has a Da Vinci / Tamko / etc. discontinued product on it.
const WTD_STEPS = [
  { num: "01", title: "Identify the product on your roof.", body: "Most homeowners don't know exactly what is on their roof. We document the tile profile, manufacturer marks, lot numbers where they exist, and the installation generation. That documentation is what every warranty claim and insurance file starts from." },
  { num: "02", title: "Document the failure.", body: "Photographs, attic moisture readings, fastener pulls, and a written condition report. We compile the failure documentation the manufacturer and your insurer will require — not generic adjuster notes." },
  { num: "03", title: "File the manufacturer warranty claim.", body: "We coordinate the claim with Da Vinci, Tamko, Ludowici, or whichever successor company holds the warranty record. Many products discontinued 15–20 years ago still carry actionable warranty paths and class-action settlements." },
  { num: "04", title: "Replace with the correct system.", body: "Once the warranty path is closed, we install the replacement — matching profile and color where the home requires it, or upgrading to a current system where the original product is no longer defensible. Either way, we install it once." },
];

const WTD_ICONS = [
  // 01 Identify — magnifier / tag
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" key="i1">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
  </svg>,
  // 02 Document — clipboard / paper
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" key="i2">
    <rect x="5" y="4" width="14" height="17" rx="1.5" /><path d="M9 4h6v3H9z" /><path d="M9 12h6M9 16h4" />
  </svg>,
  // 03 File claim — shield / check
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" key="i3">
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2.2 2.2L15 10.5" />
  </svg>,
  // 04 Replace — arrows / refresh
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" key="i4">
    <path d="M4 12a8 8 0 0 1 14-5.3" /><path d="M18 3v4h-4" /><path d="M20 12a8 8 0 0 1-14 5.3" /><path d="M6 21v-4h4" />
  </svg>,
];
const WTD_TAGS = ["Identify", "Document", "Warranty", "Replace"];

function WhatToDo() {
  return (
    <section className="what-to-do">
      <div className="wtd-head">
        <span className="eyebrow" style={{ color: "var(--copper-300)" }}>Your Next Steps</span>
        <h2>If Your Home Has <em>One of These Products</em></h2>
      </div>
      <StepsRail
        steps={WTD_STEPS}
        dark={true}
        accentKind="badge"
        accent={(s, i) =>
          <div className="step-badge">
            <span className="step-badge-icon">{WTD_ICONS[i]}</span>
            <span className="step-badge-label">{WTD_TAGS[i]}</span>
          </div>
        } />
      <div className="wtd-cta">
        <a className="btn-copper" href="contact.html">Request a System Assessment <ArrowRight size={14} /></a>
      </div>
    </section>);
}

const DISC_FAQS = [
  {
    q: "Does my homeowner's insurance cover a discontinued product failure?",
    a: "It depends on the policy and the failure mode. Sudden, accidental damage is generally covered. Gradual deterioration from a known product defect often is not — unless you can document that the product was defective at installation. We help clients compile this documentation for insurance and legal purposes.",
  },
  {
    q: "Should I replace the roof now, or wait until it's actively leaking?",
    a: "In most cases, proactive replacement on a documented failing product is significantly less expensive than reactive replacement after water damage. The cost of a failed roof is rarely the roof itself — it's the decking, insulation, plaster, and millwork below it. Address the roof before you're addressing all of those.",
  },
  {
    q: "How do I get a second opinion if my contractor says I need a full replacement?",
    a: "Call us. We frequently provide second opinions on roofs that contractors have recommended replacing in full. In our experience, 20–30% of those calls result in a significantly smaller scope than originally quoted. We charge nothing for the assessment.",
  },
  {
    q: "My home is in a historic district. Can I replace a discontinued product with a modern one?",
    a: "Landmark review requirements vary by district and by product. In most Highland Park, University Park, and Fort Worth historic districts, the replacement material must match the original in profile, color, and material class. We handle the documentation and review submission for all landmark-sensitive projects.",
  },
  {
    q: "Who do I call if the manufacturer is out of business?",
    a: "Start with us. We maintain relationships with the successor companies, legal successors, and industry archives for most major manufacturers who operated in the DFW market. In many cases, warranty claims and class-action settlements are still accessible even for products discontinued 15–20 years ago.",
  },
];

function DiscontinuedFAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="disc-faq section-light">
      <div className="disc-faq-head">
        <span className="eyebrow">Common Questions</span>
        <h2>What Homeowners <em>Ask Us Most</em></h2>
      </div>
      <div className="disc-faq-list">
        {DISC_FAQS.map((item, i) =>
        <div className={`disc-faq-item${open === i ? " is-open" : ""}`} key={i}>
            <button className="disc-faq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span>{item.q}</span>
              <span className="disc-faq-icon">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <div className="disc-faq-a"><p>{item.a}</p></div>}
          </div>
        )}
      </div>
    </section>);
}

// ─── Blog page ────────────────────────────────────────────────

function FeaturedArticle() {
  const a = JOURNAL[0];
  return (
    <section className="featured-article">
      <div className="feat-img" style={{ backgroundImage: `url("${a.image}")` }} />
      <div className="feat-scrim" />
      <div className="feat-body">
        <div className="feat-meta">
          <span className="feat-tag">{a.tag}</span>
          <span className="feat-date">{a.date}</span>
        </div>
        <h2 className="feat-title">{a.title}</h2>
        <a className="feat-link" href="#">Read Article <ArrowRight size={14} /></a>
      </div>
    </section>);
}

function ArticleGrid() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(JOURNAL.map((a) => a.tag)))];
  const ql = q.trim().toLowerCase();
  const items = JOURNAL.filter((a) => {
    const okCat = cat === "All" || a.tag === cat;
    const okQ = !ql || a.title.toLowerCase().includes(ql) || a.tag.toLowerCase().includes(ql);
    return okCat && okQ;
  });
  return (
    <section className="article-grid-section section-light" id="resource-library">
      <div className="article-grid-head">
        <span className="eyebrow">Resource Library</span>
        <h2>Find What You <em>Need to Know</em></h2>
        <p className="reslib-sub">Search the full library — material guides, warranty and insurance notes, and field research on how historic roofs actually perform.</p>
      </div>
      <div className="reslib-controls">
        <label className="reslib-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles, materials, topics…"
            aria-label="Search the resource library" />

        </label>
        <div className="reslib-chips">
          {cats.map((c) =>
          <button key={c} className={`reslib-chip${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>{c}</button>
          )}
        </div>
      </div>
      {items.length === 0 ?
      <p className="reslib-empty">No resources match your search yet. Try a different term or category.</p> :

      <div className="article-grid">
          {items.map((a) =>
        <article className="article-card" key={a.title}>
              <div className="article-card-img" style={{ backgroundImage: `url("${a.image}")` }} />
              <div className="article-card-body">
                <div className="article-card-meta">
                  <span className="article-card-tag">{a.tag}</span>
                  <span className="article-card-date">{a.date}</span>
                </div>
                <h3 className="article-card-title">{a.title}</h3>
                <a className="article-card-link" href="#">Read <ArrowRight size={12} /></a>
              </div>
            </article>
        )}
        </div>
      }
    </section>);
}

// ─── Contact page ─────────────────────────────────────────────

const WTE_STEPS = [
  { num: "01", title: "We review your inquiry the same day.", body: "Every submission is read by a principal — not a call center. If the project is a fit, you'll hear from us within one business day." },
  { num: "02", title: "We schedule a site visit at your convenience.", body: "We come to the property and spend time on the roof — not the driveway. The site visit is at no charge and carries no obligation." },
  { num: "03", title: "You receive a written proposal.", body: "A specific scope, a specific material recommendation with sourcing timeline, and a fixed price. No allowances, no change order surprises." },
];

const WTE_TIMINGS = ["Same day", "≤ 1 business day", "Written proposal"];

function WhatToExpect() {
  return (
    <section className="what-to-expect section-light">
      <div className="wte-head">
        <span className="eyebrow">After You Submit</span>
        <h2>What Happens <em>Next</em></h2>
      </div>
      <StepsRail
        steps={WTE_STEPS}
        accentKind="timing"
        accent={(s, i) =>
          <span className="step-timing">{WTE_TIMINGS[i]}</span>
        } />
    </section>);
}

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-head">
        <span className="eyebrow" style={{ color: "var(--copper-300)" }}>From Our Clients</span>
        <h2>What They <em>Noticed</em></h2>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t) =>
        <div className="testimonial-card" key={t.name}>
            <div className="testimonial-mark">"</div>
            <p className="testimonial-quote">{t.quote}</p>
            <div className="testimonial-foot">
              <span className="testimonial-name">{t.name}</span>
              <span className="testimonial-prop">{t.property} · {t.material}</span>
            </div>
          </div>
        )}
      </div>
    </section>);
}

Object.assign(window, {
  Nav, Hero, TrustBar, Manufacturers, JobsMap, Discontinued, SystemsNote, Partners, FinalCTA, Footer,
  PageHero, DiscontinuedTeaser, TeamSection, ContactForm,
  ProjectGrid, ProcessSection, ProjectDetail,
  MaterialsPhilosophy, MaterialComparison, InstallProcess, LifecycleROI, RequestSample,
  CompanyStory, PhilosophySection, ProcessOverview, ServiceArea,
  DiscontinuedIntro, ThreeReasonsSection, WhatToDo, DiscontinuedFAQ,
  FeaturedArticle, ArticleGrid,
  WhatToExpect, Testimonials,
  HeroMosaic, HeroSlides,
});