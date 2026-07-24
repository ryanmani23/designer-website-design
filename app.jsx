/* global React, ReactDOM, Nav, Hero, HeroMosaic, HeroSlides, TrustBar, RoofReel, Manufacturers, JobsMap, Discontinued, SystemsNote, EthosEcho, Partners, Journal, FinalCTA, Footer */
const { useState, useEffect, useRef } = React;

function Intro({ leaving, ready }) {
  return (
    <div className={`intro${leaving ? " leaving" : ""}${ready ? " is-ready" : ""}`} aria-hidden="true">
      <div className="intro-bg" />
      <div className="intro-veil" />
      <div className="intro-content">
        <span className="intro-eyebrow">DALLAS · TEXAS · EST. 2016</span>
        <div className="intro-mark">
          <span className="word one">Priority</span>
          <span className="word two">Designer</span>
        </div>
        <div className="intro-rule" />
        <div className="intro-meta">SLATE · CLAY TILE · COPPER</div>
      </div>
    </div>
  );
}

function App() {
  const [introVisible, setIntroVisible] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  // Hero variant: Jack picked "slides" on the 2026-06-11 call ("Hands down my
  // favorite"), so slides is now the default. The other two stay reachable via
  // query string for local comparison only:
  //   ?hero=reel   → original refined hero + RoofReel canvas
  //   ?hero=mosaic → tile mosaic that shuffles on scroll
  const heroVariant = (() => {
    try {
      const v = new URLSearchParams(window.location.search).get("hero");
      return v === "mosaic" || v === "reel" ? v : "slides";
    } catch (e) {
      return "slides";
    }
  })();

  // Lock scroll for the intro and eagerly load the two display faces the
  // "Priority Designer" wordmark uses (Cormorant Garamond 500, roman + italic).
  // The site now paints fast enough that, without this, the wordmark animates
  // in the Times fallback and then visibly reflows when Cormorant swaps in
  // mid-animation. We hold the text reveal until the font is ready (see the
  // `.intro.is-ready` gate in styles.css), with a safety cap so a slow or
  // failed font fetch can never stall the intro.
  useEffect(() => {
    document.body.classList.add("intro-active");
    // Drop the static first-paint splash now that React's own <Intro> has
    // rendered underneath it (see #intro-static in index.html). The static node
    // exists only to give the browser something to paint before the JS boots.
    const staticSplash = document.getElementById("intro-static");
    if (staticSplash) staticSplash.remove();
    let settled = false;
    const ready = () => { if (!settled) { settled = true; setFontsReady(true); } };
    try {
      if (document.fonts && document.fonts.load) {
        Promise.all([
          document.fonts.load('500 112px "Cormorant Garamond"'),
          document.fonts.load('italic 500 112px "Cormorant Garamond"'),
        ]).then(ready, ready);
      } else {
        ready();
      }
    } catch (e) {
      ready();
    }
    const cap = setTimeout(ready, 1500);
    return () => { clearTimeout(cap); document.body.classList.remove("intro-active"); };
  }, []);

  // Run the intro → hero sequence only once the wordmark font is in, so the
  // whole on-screen moment plays in the correct typeface.
  useEffect(() => {
    if (!fontsReady) return undefined;
    const t1 = setTimeout(() => { setIntroLeaving(true); setHeroRevealed(true); }, 3300);
    const t2 = setTimeout(() => { setIntroVisible(false); document.body.classList.remove("intro-active"); }, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [fontsReady]);

  return (
    <React.Fragment>
      {introVisible && <Intro leaving={introLeaving} ready={fontsReady} />}
      <Nav />
      {heroVariant === "mosaic" && <HeroMosaic revealed={heroRevealed} />}
      {heroVariant === "slides" && <HeroSlides revealed={heroRevealed} />}
      {heroVariant === "reel" && (
        <React.Fragment>
          <Hero revealed={heroRevealed} />
          <TrustBar />
          <RoofReel />
        </React.Fragment>
      )}
      {heroVariant !== "reel" && <TrustBar />}
      <Manufacturers />
      <JobsMap />
      <Discontinued onJump={(id) => window.location.href = `contact.html`} />
      <SystemsNote />
      <EthosEcho />
      <Partners />
      <Journal />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
