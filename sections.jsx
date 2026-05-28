/* global React, MANUFACTURERS, PROJECTS, DISCONTINUED, ROOF_SYSTEMS, PARTNERS, PRESERVATION, TRADE_CIVIC, CERTIFICATIONS, TRUST, NAV_ITEMS */
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <a className="cta-pill" href="contact.html">
        Schedule a Consultation
        <span className="icon"><ArrowRight size={14} /></span>
      </a>
    </nav>);

}

function Hero({ revealed }) {
  const sectionRef = useRef(null);
  useEffect(() => {
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
          <div className="hero-loc eyebrow">Historic Estate Restoration · Est. 2016</div>
        </div>
        <div className="scroll-tag">
          <span className="line" />
          <span className="eyebrow">Scroll</span>
        </div>
      </div>
    </section>);

}

function TrustBar() {
  const renderGroup = (k) =>
  <div className="trust-group" key={k}>
      {TRUST.map((t, i) =>
    <React.Fragment key={`${k}-${t.name}`}>
          <div className="trust-item">
            <div className="trust-badge">{t.initials}</div>
            <div className="trust-text">
              <div className="name">{t.name}</div>
              <div className="role">{t.role}</div>
            </div>
          </div>
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

  // preload all frames
  useEffect(() => {
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
  }, []);

  // scroll-driven frame painter
  useEffect(() => {
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
  }, [loaded]);

  const ready = loaded >= 6;

  // text fades in early and stays visible through the entire reel
  const titleVis = Math.max(0, Math.min(1, (progress - 0.05) / 0.10));
  const subVis = Math.max(0, Math.min(1, (progress - 0.12) / 0.10));

  return (
    <section className="reel" id="reel" ref={sectionRef} data-screen-label="Reel" aria-label="Field reel">
      <div className="reel-stage">
        <canvas className={`reel-canvas${ready ? " ready" : ""}`} ref={canvasRef} aria-hidden="true" />
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
              
              Forty-six frames from a single re-roof — underlayment to ridge,
              copper bent on site, every fastener placed by a tradesman who
              knows what failed before.
            </p>
          </div>
        </div>
      </div>
    </section>);

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
        <h3>Four Partners. No Compromises.</h3>
        <p>
          We add a manufacturer only when a product raises our standard not when it expands our<br />
          catalog. These four represent the entirety of what we're willing to put our name behind.
        </p>
      </div>
      }

      <div className="mat-grid">
        {MANUFACTURERS.map((m, i) =>
        <article className="mat-cell" key={m.name}>
            <div
            className="mat-cell-grain"
            style={{ backgroundImage: `url("${m.image}")` }}
            aria-hidden="true" />
          
            <div className="mat-cell-scrim" aria-hidden="true" />
            <div className="mat-cell-grit" aria-hidden="true" />
            <div className="mat-cell-rest">
              <span className="mat-cell-num">{String(i + 1).padStart(2, "0")} / 04</span>
              <h3 className="mat-cell-name">{m.name}</h3>
              <span className="mat-cell-role">{m.role}</span>
            </div>
            <div className="mat-cell-hover">
              <span className="mat-cell-num is-light">{String(i + 1).padStart(2, "0")} / 04</span>
              <h3 className="mat-cell-name is-light">{m.name}</h3>
              <span className="mat-cell-role is-light">{m.role}</span>
              <p className="mat-cell-desc">{m.body}</p>
            </div>
          </article>
        )}
      </div>

      <div className="mat-foot">
        <p>
          Four manufacturers. Each one selected because we would install<br />
          their products on our own homes and have.
        </p>
        <button className="mat-foot-link">
          See these Material in Our Work <ArrowRight size={14} />
        </button>
      </div>
    </section>);

}

function JobsMap() {
  const [active, setActive] = useState(null); // clicked pin → popup
  const [hover, setHover] = useState(null); // hovered pin → tooltip
  const markup = (typeof window !== "undefined" && window.US_STATES_MARKUP) || "";
  const shown = active !== null ? active : hover;
  const toggle = (i) => setActive((a) => a === i ? null : i);

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
            className={`jobsmap-pin${active === i ? " is-active" : ""}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onClick={() => toggle(i)}
            tabIndex={0}
            role="button"
            aria-label={`${p.name} — ${p.city}, ${p.state}`}
            onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();toggle(i);}}}>

              <circle className="jobsmap-pin-halo" cx={p.x} cy={p.y} r="13" />
              <circle className="jobsmap-pin-dot" cx={p.x} cy={p.y} r="5" />
            </g>
          )}
        </svg>

        {shown !== null && (() => {
          const p = MAP_PROJECTS[shown];
          const isPopup = active === shown;
          return (
            <div
              className={`jobsmap-card${isPopup ? " is-popup" : ""}`}
              style={{ left: `${p.x / 960 * 100}%`, top: `${p.y / 600 * 100}%` }}>

              {isPopup &&
              <button className="jobsmap-card-close" onClick={() => setActive(null)} aria-label="Close">×</button>
              }
              <div className="jobsmap-card-img" style={{ backgroundImage: `url("${p.image}")` }} />
              <div className="jobsmap-card-body">
                <div className="jobsmap-card-loc">{p.city}, {p.state}</div>
                <div className="jobsmap-card-name">{p.name}</div>
                {isPopup &&
                <a className="jobsmap-card-link" href={p.href}>View project <ArrowRight size={12} /></a>
                }
              </div>
            </div>);

        })()}
      </div>

      <div className="jobsmap-foot">
        <span className="jobsmap-note">Licensed in all 48 contiguous states · selected projects shown</span>
        <a className="btn-ghost-light jobsmap-viewall" href="portfolio.html">View Full Portfolio <span className="arrow"><ArrowRight size={16} /></span></a>
      </div>
    </section>);

}

function Discontinued({ onJump }) {
  const tabs = Object.keys(DISCONTINUED);
  const [tab, setTab] = useState(tabs[0]);
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
          {data.items.map((p, i) =>
          <div className={`disc-prod${p.image ? " has-thumb" : ""}`} key={p.title}>
              <div className="ix">
                {p.image ?
                <span className="disc-prod-thumb" style={{ backgroundImage: `url("${p.image}")` }} aria-hidden="true" /> :
                String(i + 1).padStart(2, "0")}
              </div>
              <div className="title">{p.title}<small>{p.sub}</small></div>
              <div className="desc">{p.desc}</div>
            </div>
          )}
        </div>
      </div>
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
          style={{ transform: `translateX(calc(${idx * -100 / visible}% - ${idx * 16}px))` }}>
          
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

function FinalCTA() {
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
          <span className="final-cta-eyebrow">A Note on How Roofs Actually Work</span>
          <h2>
            Roofs often leak for three reasons:
            <br />
            <em>Fasteners, Flashings, <span className="amp">and</span> Flawed installation.</em>
          </h2>
          <div className="final-cta-actions">
            <button className="btn-copper-solid">Request a System Assessment</button>
            <button className="btn-navy-solid">See Our Portfolio</button>
          </div>
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-line">
        © 2026 PRIORITY DESIGNER · HISTORIC EXTERIORS · LICENSED · BONDED · INSURED
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

const FILTER_TYPES = ["All", "Slate", "Clay Tile", "Metal", "Synthetic", "Designer Shingles", "Commercial"];

function ProjectGrid() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === filter);
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
        <article className="proj-card" key={p.name}>
            <div className="proj-card-img" style={{ backgroundImage: `url(${p.image})` }} />
            <div className="proj-card-scrim" />
            <div className="proj-card-body">
              <span className="proj-card-tag">{p.tag}</span>
              <div className="proj-card-loc">{p.loc}</div>
              <h3 className="proj-card-name">{p.name}</h3>
              <p className="proj-card-desc">{p.desc}</p>
            </div>
          </article>
        )}
      </div>
    </section>);
}

const PROCESS_STEPS = [
  { num: "01", title: "Assessment", body: "We spend time on the roof — not the driveway. Every estimate begins with a documented inspection: substrate condition, flashing integrity, fastener type, and an honest evaluation of what's salvageable." },
  { num: "02", title: "Material Sourcing", body: "We identify the right material for the structure, the climate, and the preservation standard. For discontinued profiles, we coordinate reproduction with our manufacturer partners before committing to a scope." },
  { num: "03", title: "Installation", body: "Our crews are not subcontracted. The same tradesmen who assessed the roof install it. Copper flashings are hand-formed on site. Fasteners are stainless or copper only. Every course is checked before the next begins." },
  { num: "04", title: "Final Review", body: "We walk the roof with the owner before we close out any project. Every penetration is tested, every valley inspected from the attic. You receive a written summary of what was done and any conditions to monitor." },
];

const PORTFOLIO_STEP_PHOTOS = [
  "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&auto=format&fit=crop&q=80",
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
  // 150 yr timeline. Asphalt = 4 installs (initial + 3 replacements) of ~37.5 yr each.
  const asphaltSegments = [
    { years: 38, label: "Initial install" },
    { years: 37, label: "Replacement 1" },
    { years: 38, label: "Replacement 2" },
    { years: 37, label: "Replacement 3" },
  ];
  return (
    <section className="lifecycle-roi" ref={ref}>
      <div className="lifecycle-head">
        <span className="eyebrow" style={{ color: "var(--copper-300)" }}>The Math on Premium Materials</span>
        <h2>A slate roof installed today <em>outlasts three asphalt replacements.</em></h2>
      </div>

      <div className={`lifecycle-compare${seen ? " is-in" : ""}`}>
        <div className="lifecycle-col">
          <div className="lifecycle-col-head">
            <span className="lifecycle-col-tag">If you choose slate today</span>
            <span className="lifecycle-col-sub">Vermont slate · one installation</span>
          </div>
          <div className="lifecycle-bar lifecycle-bar--slate">
            <div className="lifecycle-bar-fill" />
            <span className="lifecycle-bar-text">150 years · one install</span>
          </div>
          <div className="lifecycle-axis">
            <span>0</span><span>50</span><span>100</span><span>150 yrs</span>
          </div>
        </div>

        <div className="lifecycle-col">
          <div className="lifecycle-col-head">
            <span className="lifecycle-col-tag">If you choose asphalt today</span>
            <span className="lifecycle-col-sub">Architectural shingle · 3 full replacements</span>
          </div>
          <div className="lifecycle-bar lifecycle-bar--asphalt">
            {asphaltSegments.map((s, i) =>
              <React.Fragment key={i}>
                <div className="lifecycle-seg" style={{ flex: s.years, "--i": i }}>
                  <span className="lifecycle-seg-label">{s.label}</span>
                </div>
                {i < asphaltSegments.length - 1 &&
                  <div className="lifecycle-tear" aria-hidden="true" style={{ "--i": i }}>
                    <span className="lifecycle-tear-mark">TEAR-OFF</span>
                  </div>
                }
              </React.Fragment>
            )}
          </div>
          <div className="lifecycle-axis">
            <span>0</span><span>38</span><span>75</span><span>113</span><span>150 yrs</span>
          </div>
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
      const start = vh * 0.75;
      const total = start - vh * 0.25 + r.height;
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
      <div className="steps-rail-track" />
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

const HISTORICAL_ERAS = [
  {
    period: "1950s – 1970s",
    primaryYear: 1965,
    title: "The Asbestos Transition",
    body: "Asbestos-containing roofing products were standard through the early 1970s. When the material was regulated out of residential use, the industry rushed replacements to market without adequate long-term testing. Fiber cement, early organic-mat asphalt, and transitional synthetics from this era all carry documented failure profiles.",
    image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=2200&auto=format&fit=crop&q=85",
  },
  {
    period: "1978 – 1998",
    primaryYear: 1988,
    title: "The Cost-Cutting Era",
    body: "Deregulation and import competition drove manufacturers to reduce material weights, lower felting standards, and substitute lower-grade mineral granules. Products that passed the test standards of the era routinely underperformed their rated lifespans by 30–40%. Many are still on roofs across the DFW Metroplex today.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=2200&auto=format&fit=crop&q=85",
  },
  {
    period: "1995 – 2010",
    primaryYear: 2002,
    title: "The Fast-Growth Suburb Surge",
    body: "Volume home building across North Texas drove demand for products that could be installed at scale, quickly. Underlayment standards were relaxed. Proprietary clip systems and snap-lock products entered the market without the installation tradecraft to back them up. The failure data on products from this era is substantial — and ongoing.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=2200&auto=format&fit=crop&q=85",
  },
];

function EraFrame({ era, index }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const [display, setDisplay] = useState(era.primaryYear - 90);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) {setSeen(true);io.disconnect();}},
      { threshold: 0.35 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  useEffect(() => {
    if (!seen) return;
    const start = era.primaryYear - 90;
    const end = era.primaryYear;
    const duration = 1100;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, era.primaryYear]);
  return (
    <article
      className={`era-frame${seen ? " is-in" : ""}${index % 2 ? " is-right" : ""}`}
      ref={ref}
      style={{ backgroundImage: `url("${era.image}")` }}>
      <div className="era-frame-scrim" />
      <div className="era-frame-inner">
        <div className="era-frame-year" aria-hidden="true">{display}</div>
        <div className="era-frame-body">
          <span className="era-frame-period">{era.period}</span>
          <h3>{era.title}</h3>
          <p>{era.body}</p>
        </div>
      </div>
    </article>);
}

function HistoricalContext() {
  return (
    <section className="historical-context">
      <div className="hist-head">
        <span className="eyebrow">Why This Happened</span>
        <h2>Three Eras That Produced <em>Bad Roofs</em></h2>
        <p className="hist-sub">Understanding the industry conditions behind these products helps explain why so many appear on our list — and why the failure patterns are so consistent.</p>
      </div>
      <div className="era-frames">
        {HISTORICAL_ERAS.map((e, i) =>
          <EraFrame era={e} index={i} key={e.title} />
        )}
      </div>
    </section>);
}

const WTD_STEPS = [
  { num: "01", title: "Don't panic — and don't replace immediately.", body: "A product being on this list doesn't mean your roof is failing today. Many of these products have documented failure modes that are gradual and detectable early. An inspection will tell you where you stand." },
  { num: "02", title: "Get a documented inspection from someone who knows the product.", body: "The failure modes for organic-mat asphalt are different from those for a proprietary slate clip system. Make sure your inspector understands what they're looking at — and can document what they find in writing." },
  { num: "03", title: "Know your options before accepting a full replacement.", body: "In many cases — particularly with historic clay tile and natural slate — the roof material is salvageable even when the product has \"failed.\" The system around it failed. The tile or slate itself may have decades of life left. We'll tell you the difference." },
  { num: "04", title: "Contact us before you sign anything.", body: "We review discontinued product situations at no charge. If your home has a product on this list, we'll give you an honest assessment — including whether another contractor is the better choice for your project." },
];

const WTD_ICONS = [
  // 01 Don't panic — pause / time
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" key="i1">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>,
  // 02 Get inspection — magnifier
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" key="i2">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
  </svg>,
  // 03 Know your options — compare columns
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" key="i3">
    <rect x="3.5" y="5" width="6.5" height="14" rx="1" /><rect x="14" y="5" width="6.5" height="14" rx="1" /><path d="M3.5 11h6.5M14 11h6.5" />
  </svg>,
  // 04 Contact us — speech / arrow
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" key="i4">
    <path d="M21 12a8 8 0 1 1-3.2-6.4" /><path d="M16 4h5v5" /><path d="M21 4l-9 9" />
  </svg>,
];
const WTD_TAGS = ["Hold off", "Inspect", "Evaluate", "Reach out"];

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
  ProjectGrid, ProcessSection,
  MaterialsPhilosophy, MaterialComparison, LifecycleROI, RequestSample,
  CompanyStory, PhilosophySection, ProcessOverview, ServiceArea,
  DiscontinuedIntro, HistoricalContext, WhatToDo, DiscontinuedFAQ,
  FeaturedArticle, ArticleGrid,
  WhatToExpect, Testimonials,
});