/* global React, ReactDOM, Nav, PageHero, ProjectGrid, ProjectDetail, ProcessSection, FinalCTA, Footer, PROJECTS */
// 2026-11-24: links to the static area hubs (/areas/*), brief item P4.
const AREA_LINKS = [
  { href: "areas/highland-park", kind: "Texas", name: "Highland Park & University Park", line: "Slate and copper on Park Cities homes", image: "assets/projects/highland-park-variegated-slate-copper/01.webp" },
  { href: "areas/st-louis", kind: "Missouri", name: "St. Louis", line: "Historic clay tile and slate, matched and rebuilt", image: "assets/projects/st-louis-central-west-end-clay/02.webp" },
];
function AreaLinks() {
  return (
    <section className="mp-explore pj-areas" aria-label="Browse by area">
      <div className="mp-explore-head">
        <div>
          <span className="mp-label">Browse by Area</span>
          <h2>Where we work most</h2>
        </div>
      </div>
      <div className="mp-explore-row">
        {AREA_LINKS.map((a) =>
          <a className="mp-explore-card" href={a.href} key={a.href}>
            <span className="mp-explore-img" style={{ backgroundImage: `url('${a.image}')`, backgroundPosition: "center" }} />
            <span className="mp-explore-text">
              <span className="mp-explore-kind">{a.kind}</span>
              <span className="mp-explore-name">{a.name}</span>
              <span className="mp-explore-line">{a.line}</span>
            </span>
            <span className="mp-explore-arrow" aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </section>);
}

function App() {
  const [activeSlug, setActiveSlug] = React.useState(null);

  // Honor ?p=<slug> deep links coming from the homepage JobsMap.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get("p");
    if (wanted && PROJECTS.some((p) => p.slug === wanted)) {
      setActiveSlug(wanted);
    }
  }, []);

  return (
    <React.Fragment>
      <Nav />
      {/* Jack 2026-06-11: subheading removed — "leave it at Projects of Distinction." */}
      <PageHero
        eyebrow="Selected Work"
        title="Projects of Distinction"
        image="assets/hero/portfolio-hero.webp"
      />
      <ProjectGrid onOpen={(slug) => setActiveSlug(slug)} />
      <AreaLinks />
      <ProcessSection />
      <FinalCTA />
      <Footer />
      {activeSlug && <ProjectDetail slug={activeSlug} onClose={() => setActiveSlug(null)} />}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
