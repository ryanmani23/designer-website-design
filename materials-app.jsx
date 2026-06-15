/* global React, ReactDOM, Nav, PageHero, Manufacturers, RequestSample, MaterialComparison, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      {/* TODO(jack): swap the hero image for the showroom photo once supplied. */}
      {/* Jack 2026-06-11: showroom hero, title only; lead with the sample request,
          then the materials, then the comparison sheet. Trimmed the long
          MaterialsPhilosophy / InstallProcess / LifecycleROI sections. */}
      <PageHero
        title="Materials That Can Recreate the Irreplaceable"
        image="assets/hero/3-Jul 06 2024 09_34am-W6PV.jpg"
      />
      <MaterialComparison />
      <RequestSample />
      <Manufacturers banner="none" />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
