/* global React, ReactDOM, Nav, Hero, TrustBar, RoofReel, Manufacturers, JobsMap, Discontinued, SystemsNote, Partners, Journal, FinalCTA, Footer */
const { useState, useEffect, useRef } = React;

function Intro({ leaving }) {
  return (
    <div className={`intro${leaving ? " leaving" : ""}`} aria-hidden="true">
      <div className="intro-bg" />
      <div className="intro-veil" />
      <div className="intro-content">
        <span className="intro-eyebrow">DALLAS · TEXAS · EST. 2016</span>
        <div className="intro-mark">
          <span className="word one">Priority</span>
          <span className="word two">Designer</span>
        </div>
        <div className="intro-rule" />
        <div className="intro-meta">HISTORIC EXTERIORS · SLATE · CLAY · METAL</div>
      </div>
    </div>
  );
}

function CustomCursor() {
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const label = document.createElement("div");
    label.className = "cursor-label";
    label.innerHTML = "<span>View<br/>Project</span>";
    document.body.append(ring, dot, label);
    document.body.classList.add("has-custom-cursor", "cursor-visible");

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let lastTx = tx, lastTy = ty;
    let rx = tx, ry = ty;
    let velocity = 0;
    let raf;
    let lastMove = performance.now();

    const tick = () => {
      const now = performance.now();
      // ease ring toward target
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;

      // decay velocity over time
      velocity *= 0.88;
      if (now - lastMove > 80) velocity *= 0.7;

      // scale ring slightly based on velocity (motion stretch), max ~1.18
      const scale = 1 + Math.min(0.18, velocity * 0.012);
      // squash along motion vector by computing angle
      const dx = tx - rx, dy = ty - ry;
      const angle = Math.atan2(dy, dx);

      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      ring.style.transform =
        `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) ` +
        `rotate(${angle}rad) scale(${scale}, ${1 - (scale - 1) * 0.6}) rotate(${-angle}rad)`;
      label.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const dx = e.clientX - lastTx;
      const dy = e.clientY - lastTy;
      velocity = Math.sqrt(dx * dx + dy * dy);
      lastTx = e.clientX; lastTy = e.clientY;
      tx = e.clientX; ty = e.clientY;
      lastMove = performance.now();
      if (!document.body.classList.contains("cursor-visible")) {
        document.body.classList.add("cursor-visible");
      }
    };
    const onLeave = () => document.body.classList.remove("cursor-visible");
    const onEnter = () => document.body.classList.add("cursor-visible");
    const onDown = () => document.body.classList.add("cursor-down");
    const onUp = () => document.body.classList.remove("cursor-down");

    const hoverables = "a, button, [role='button'], input, select, textarea, label, .mat-cell, .pitem, .project-slide, .journal-card";
    const onOver = (e) => {
      if (!e.target.closest) return;
      if (e.target.closest(".project-slide, .carousel-arrow")) {
        document.body.classList.add("cursor-project");
      } else if (e.target.closest(hoverables)) {
        document.body.classList.add("cursor-hover");
      }
    };
    const onOut = (e) => {
      if (!e.target.closest) return;
      if (e.target.closest(".project-slide, .carousel-arrow")) {
        document.body.classList.remove("cursor-project");
      }
      if (e.target.closest(hoverables)) {
        document.body.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      ring.remove(); dot.remove(); label.remove();
      document.body.classList.remove("has-custom-cursor", "cursor-hover", "cursor-down", "cursor-visible", "cursor-project");
    };
  }, []);
  return null;
}

function App() {
  const [introVisible, setIntroVisible] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);

  useEffect(() => {
    document.body.classList.add("intro-active");
    const t1 = setTimeout(() => { setIntroLeaving(true); setHeroRevealed(true); }, 3900);
    const t2 = setTimeout(() => { setIntroVisible(false); document.body.classList.remove("intro-active"); }, 5100);
    return () => { clearTimeout(t1); clearTimeout(t2); document.body.classList.remove("intro-active"); };
  }, []);

  // global subtle reveal-on-scroll for content sections
  useEffect(() => {
    const targets = ["manufacturers", "projects", "discontinued", "systems", "partners", "journal"];
    const els = targets.map((id) => document.getElementById(id)).filter(Boolean);
    els.forEach((el) => el.classList.add("scroll-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <React.Fragment>
      <CustomCursor />
      {introVisible && <Intro leaving={introLeaving} />}
      <Nav />
      <Hero revealed={heroRevealed} />
      <TrustBar />
      <RoofReel />
      <Manufacturers />
      <JobsMap />
      <Discontinued onJump={(id) => window.location.href = `contact.html`} />
      <SystemsNote />
      <Partners />
      <Journal />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
