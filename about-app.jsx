/* global React, ReactDOM, Nav, PageHero, Ethos, PhilosophySection, ServiceArea, Partners, InstagramFeed, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      {/* Team photo as the hero (Jack, 2026-11-24 call), then straight into
          The Good, the True and the Beautiful. */}
      <PageHero
        eyebrow="Est. 2016"
        title="About Priority Designer"
        image="assets/about/team.webp"
        imagePosition="center 32%"
      />
      <Ethos />
      <ServiceArea />
      <InstagramFeed />
      <PhilosophySection />
      <Partners />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
