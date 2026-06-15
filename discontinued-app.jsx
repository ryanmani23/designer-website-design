/* global React, ReactDOM, Nav, PageHero, ThreeReasonsSection, Discontinued, WhatToDo, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      {/* 2026-06-15: the "note from the field" is folded into the hero subheading
          (attribution dropped); the standalone DiscontinuedIntro section is gone. */}
      <PageHero
        eyebrow="Note From the Field"
        title="Discontinued Products We Know in the Field"
        sub="We do not wish to hoard information from any competition that might see it; rather, we wish to educate and inform homeowners so that they can better protect their homes and finances."
        image="assets/discontinued/imported-slate/01.webp"
      />
      <Discontinued onJump={() => { window.location.href = "contact.html"; }} />
      <ThreeReasonsSection />
      <WhatToDo />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
