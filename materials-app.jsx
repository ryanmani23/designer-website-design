/* global React, ReactDOM, Nav, PageHero, Manufacturers, RequestSample, MaterialComparison, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      {/* Jack 2026-06-11/06-13: showroom hero, title only; lead with the sample
          request, then the materials (like the homepage), then the comparison
          sheet. Trimmed the long MaterialsPhilosophy / InstallProcess /
          LifecycleROI sections. Hero photo supplied/swapped by Jack 2026-06-18. */}
      <PageHero
        title="Materials That Can Recreate the Irreplaceable"
        image="assets/hero/materials-showroom.webp"
      />
      <RequestSample />
      <Manufacturers banner="none" />
      <MaterialComparison />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
