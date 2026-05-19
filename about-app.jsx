/* global React, ReactDOM, Nav, PageHero, CompanyStory, PhilosophySection, ProcessOverview, TeamSection, ServiceArea, Partners, Footer */
const { useState } = React;

function App() {
  const [onLight, setOnLight] = useState(false);
  return (
    <React.Fragment>
      <Nav onLight={onLight} />
      <PageHero
        eyebrow="Est. 1986 · Dallas–Fort Worth"
        title="About Priority Designer"
        sub="Forty years of historic exterior restoration. The same people, the same standards, the same phone number."
        image="assets/hero/1-Nov 30 2021 08_21am-NnLB.jpg"
      />
      <CompanyStory />
      <PhilosophySection />
      <ProcessOverview />
      <TeamSection />
      <ServiceArea />
      <Partners />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
