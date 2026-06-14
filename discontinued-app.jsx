/* global React, ReactDOM, Nav, PageHero, DiscontinuedIntro, ThreeReasonsSection, Discontinued, WhatToDo, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      {/* Jack 2026-06-11: subheader removed; hero is now a "failed roof" overview
          pulled from the discontinued-product photos. FAQ moved off to the blog. */}
      <PageHero
        eyebrow="Industry Knowledge · Trade Standards"
        title="Discontinued Products We Know in the Field"
        image="assets/discontinued/imported-slate/01.webp"
      />
      <DiscontinuedIntro />
      <Discontinued onJump={() => { window.location.href = "contact.html"; }} />
      <ThreeReasonsSection />
      <WhatToDo />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
