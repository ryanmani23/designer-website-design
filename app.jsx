/* global React, ReactDOM, Nav, Hero, HeroMosaic, HeroSlides, TrustBar, RoofReel, Manufacturers, JobsMap, Discontinued, SystemsNote, EthosEcho, Partners, Journal, FinalCTA, Footer */
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
        <div className="intro-meta">HISTORIC EXTERIORS · SLATE · CLAY · COPPER</div>
      </div>
    </div>
  );
}

function App() {
  const [introVisible, setIntroVisible] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);

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

  useEffect(() => {
    document.body.classList.add("intro-active");
    const t1 = setTimeout(() => { setIntroLeaving(true); setHeroRevealed(true); }, 3300);
    const t2 = setTimeout(() => { setIntroVisible(false); document.body.classList.remove("intro-active"); }, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); document.body.classList.remove("intro-active"); };
  }, []);

  return (
    <React.Fragment>
      {introVisible && <Intro leaving={introLeaving} />}
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
