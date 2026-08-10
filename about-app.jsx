/* global React, ReactDOM, Nav, PageHero, Ethos, PhilosophySection, ServiceArea, Partners, InstagramFeed, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      {/* TODO(jack): swap the hero image for the team group photo once supplied. */}
      <PageHero
        eyebrow="Est. 2016 · Dallas–Fort Worth"
        title="About Priority Designer"
        image="assets/hero/1-Nov 30 2021 08_21am-NnLB.jpg"
      />
      <ServiceArea />
      <Ethos />
      <InstagramFeed />
      <PhilosophySection />
      <Partners />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
