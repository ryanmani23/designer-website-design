/* global React, ReactDOM, Nav, PageHero, ProjectGrid, ProjectDetail, ProcessSection, FinalCTA, Footer, PROJECTS */
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
      <PageHero
        eyebrow="Selected Work"
        title="Projects of Distinction"
        sub="Estate and historic restorations across the DFW Metroplex — each one documented from strip to ridge."
        image="assets/hero/2-Oct 03 2023 09_56am-6LHU.jpg"
      />
      <ProjectGrid onOpen={(slug) => setActiveSlug(slug)} />
      <ProcessSection />
      <FinalCTA />
      <Footer />
      {activeSlug && <ProjectDetail slug={activeSlug} onClose={() => setActiveSlug(null)} />}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
