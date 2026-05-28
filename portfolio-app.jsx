/* global React, ReactDOM, Nav, PageHero, ProjectGrid, ProcessSection, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      <PageHero
        eyebrow="Selected Work"
        title="Projects of Distinction"
        sub="Estate and historic restorations across the DFW Metroplex — each one documented from strip to ridge."
        image="assets/hero/2-Oct 03 2023 09_56am-6LHU.jpg"
      />
      <ProjectGrid />
      <ProcessSection />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
