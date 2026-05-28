/* global React, ReactDOM, Nav, PageHero, CompanyStory, PhilosophySection, ProcessOverview, TeamSection, ServiceArea, Partners, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      <PageHero
        eyebrow="Est. 2016 · Dallas–Fort Worth"
        title="About Priority Designer"
        sub="A decade of historic exterior restoration. The same people, the same standards, the same phone number."
        image="assets/hero/1-Nov 30 2021 08_21am-NnLB.jpg"
      />
      <CompanyStory />
      <PhilosophySection />
      <ProcessOverview />
      <TeamSection />
      <ServiceArea />
      <Partners />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
