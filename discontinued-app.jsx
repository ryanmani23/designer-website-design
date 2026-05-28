/* global React, ReactDOM, Nav, PageHero, DiscontinuedIntro, HistoricalContext, Discontinued, WhatToDo, DiscontinuedFAQ, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      <PageHero
        eyebrow="Industry Knowledge · Trade Standards"
        title="Discontinued Products We Know in the Field"
        sub="Some failed in the field. Others are simply no longer manufactured. Either way, we know how to match, repair, or replace them."
        image="assets/hero/4-Jul 13 2024 07_44am-uY2n.jpg"
      />
      <DiscontinuedIntro />
      <Discontinued onJump={() => { window.location.href = "contact.html"; }} />
      <HistoricalContext />
      <WhatToDo />
      <DiscontinuedFAQ />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
