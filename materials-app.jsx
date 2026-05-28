/* global React, ReactDOM, Nav, PageHero, MaterialsPhilosophy, Manufacturers, RequestSample, MaterialComparison, SystemsNote, LifecycleROI, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      <PageHero
        eyebrow="Manufacturer Partnerships"
        title="Materials That Can Recreate the Irreplaceable"
        sub="Four manufacturers — each selected because we would install their products on our own homes, and have."
        image="assets/hero/3-Jul 06 2024 09_34am-W6PV.jpg"
      />
      <MaterialsPhilosophy />
      <Manufacturers banner="none" />
      <RequestSample />
      <MaterialComparison />
      <SystemsNote />
      <LifecycleROI />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
