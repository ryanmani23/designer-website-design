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


function Nav({ active, onLight, onJump }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${onLight ? " on-light" : ""}`}>
      <a className="logo" href="#top" onClick={(e) => {e.preventDefault();onJump("top");}}>
        <img src="assets/logo.png" alt="Priority Designer · Historic Exteriors" className="logo-img" />
      </a>
      <div className="nav-links">
        {NAV_ITEMS.map((n) =>
        <button key={n.id} className={active === n.id ? "active" : ""} onClick={() => onJump(n.id)}>
            {n.label}
          </button>
        )}
      </div>
      <button className="cta-pill" onClick={() => onJump("contact")}>
        Schedule a Consultation
        <span className="icon"><ArrowRight size={14} /></span>
      </button>
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
      const expandDist = pin * 0.85;
      const p = Math.max(0, Math.min(1, -rect.top / expandDist));
      return p * p * (3 - 2 * p);
    };
    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0008) {
        current = target;
      } else {
        current += diff * 0.18;
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
    <section ref={sectionRef} className={`hero hero-framed${revealed ? " revealed" : ""}`} id="top" data-screen-label="Hero">
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
          <div className="hero-loc eyebrow">Historic Estate Restoration · Est. 1986</div>
        </div>
        <div className="scroll-tag">
          <span className="line" />
          <span className="eyebrow">Scroll</span>
        </div>
        <div className="hero-meta">
          <div><span className="label">Service</span><span className="value">Estate & Historic</span></div>
          <div><span className="label">Region</span><span className="value">DFW Metroplex</span></div>
          <div><span className="label">Lead Time</span><span className="value">2 – 8 weeks</span></div>
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

function Manufacturers() {
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

      <div className="mat-banner">
        <h3>Four Partners. No Compromises.</h3>
        <p>
          We add a manufacturer only when a product raises our standard not when it expands our<br />
          catalog. These four represent the entirety of what we're willing to put our name behind.
        </p>
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

function Projects() {
  const [idx, setIdx] = useState(0);
  const total = PROJECTS.length;
  const go = (d) => setIdx((i) => (i + d + total) % total);
  const cur = PROJECTS[idx];
  return (
    <section className="projects-band" id="projects" data-screen-label="Projects of Distinction">
      <div className="projects-head">
        <div>
          <span className="eyebrow" style={{ color: "var(--copper-300)", display: "block", marginBottom: 18 }}>Selected Work</span>
          <h2>Projects of <em>Distinction</em></h2>
        </div>
        <div className="projects-actions">
          <button className="btn-ghost-light">View Portfolio <span className="arrow"><ArrowRight size={16} /></span></button>
        </div>
      </div>

      <div className="project-stage">
        {PROJECTS.map((p, i) =>
        <div key={p.name} className={`project-slide${i === idx ? " active" : ""}`}>
            <div className="img" style={{ backgroundImage: `url(${p.image})` }} />
            <div className="scrim" />
            <div className="tag">{p.tag}</div>
            <div className="meta">
              <div>
                <span className="loc">{p.loc}</span>
                <div className="name">{p.name}</div>
                <div className="desc">{p.desc}</div>
              </div>
            </div>
          </div>
        )}
        <button className="carousel-arrow prev" onClick={() => go(-1)} aria-label="Previous project">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        </button>
        <button className="carousel-arrow next" onClick={() => go(1)} aria-label="Next project">
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="project-pager">
        <div>{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {cur.name}</div>
        <div className="progress"><span style={{ width: `${(idx + 1) / total * 100}%` }} /></div>
        <div className="pager-arrows">
          <button onClick={() => go(-1)} aria-label="Previous" style={{ opacity: "0" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => go(1)} aria-label="Next" style={{ opacity: "0" }}>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>);

}

function Discontinued({ onJump }) {
  const tabs = Object.keys(DISCONTINUED);
  const [tab, setTab] = useState(tabs[0]);
  const data = DISCONTINUED[tab];
  return (
    <section className="discontinued" id="discontinued" data-screen-label="Discontinued Systems">
      <div className="disc-head">
        <span className="eyebrow">Industry Knowledge · Trade Standards</span>
        <h2>We've Seen These <em>Fail in the Field</em></h2>
        <p>Nearly every product on this list was discontinued because it failed — not because something better replaced it. We have documented failure data on when, why, and how each system breaks down. If your home has one of these roofs, you need a contractor who understands exactly what went wrong.</p>
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
          <div className="disc-prod" key={p.title}>
              <div className="ix">{String(i + 1).padStart(2, "0")}</div>
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
    <section className="systems-note" id="systems" data-screen-label="How Roofs Actually Work">
      <div className="systems-head">
        <div>
          <span className="eyebrow" style={{ color: "var(--copper-600)", display: "block", marginBottom: 16 }}>A Note On How Roofs Actually Work</span>
          <h2>Roofs often leak for three reasons: <em>fasteners, flashings, and flawed installation.</em></h2>
        </div>
        <div className="lead">What goes on the roof is important — but roofs are systems. The decking, underlayment, fasteners, flashings, ventilation, and installation method are all paramount. Not just what you decide to put on top.</div>
      </div>
      <div className="systems-grid">
        {ROOF_SYSTEMS.map((s) =>
        <div className="system-card" key={s.title}>
            <div className="img" style={{ backgroundImage: `url(${s.image})` }} />
            <div className="scrim" />
            <div className="body">
              <span className="num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
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

function PartnersGroup({ label, items, columns }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) {setSeen(true);io.disconnect();}},
      { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  return (
    <div className={`pgroup${seen ? " is-in" : ""}`} ref={ref}>
      <div className="pgroup-label"><span className="caret">▸</span> {label}</div>
      <div className={`pgroup-grid cols-${columns}`}>
        {items.map((p, i) =>
        <div className="pitem" key={p.name} style={{ "--i": i }}>
            <div className="pitem-mark"><PartnerMark kind={p.mark} /></div>
            <div className="pitem-text">
              <h4>{p.name}</h4>
              <span className="role">{p.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>);

}

function Partners() {
  return (
    <section className="partners" id="partners" data-screen-label="Preservation Partners">
      <div className="partners-hero">
        <div className="partners-hero-text">
          <h2>Rooted in the Communities Whose History We Protect</h2>
          <p className="lead">Historic restoration work is inseparable from the communities it serves. Our affiliations connect us to the preservation organizations, trade bodies, and civic networks that set the standard for how this work should be done and who it should benefit.</p>
        </div>
        <div className="partners-hero-img" aria-hidden="true">
          <img src="assets/partners-hero.jpg" alt="Historic Texas estate restoration" />
        </div>
      </div>

      <PartnersGroup label="Preservation Partners" items={PRESERVATION} columns={4} />
      <PartnersGroup label="Trade & Civic Memberships" items={TRADE_CIVIC} columns={4} />
      <PartnersGroup label="Certifications" items={CERTIFICATIONS} columns={5} />
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

Object.assign(window, { Nav, Hero, TrustBar, Manufacturers, Projects, Discontinued, SystemsNote, Partners, FinalCTA, Footer });