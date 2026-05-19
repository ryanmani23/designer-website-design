/* global React, ReactDOM, Nav, PageHero, DiscontinuedIntro, HistoricalContext, Discontinued, WhatToDo, DiscontinuedFAQ, FinalCTA, Footer */
const { useState } = React;

function App() {
  const [onLight, setOnLight] = useState(false);
  return (
    <React.Fragment>
      <Nav onLight={onLight} />
      <PageHero
        eyebrow="Industry Knowledge · Trade Standards"
        title="We've Seen These Fail in the Field"
        sub="Nearly every product on this list was discontinued because it failed — not because something better replaced it."
        image="assets/hero/4-Jul 13 2024 07_44am-uY2n.jpg"
      />
      <DiscontinuedIntro />
      <HistoricalContext />
      <Discontinued onJump={() => { window.location.href = "contact.html"; }} />
      <WhatToDo />
      <DiscontinuedFAQ />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
