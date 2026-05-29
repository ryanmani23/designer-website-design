/* global React, ReactDOM, Nav, PageHero, ArticleGrid, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      <PageHero
        eyebrow="Resource Library"
        title="A Searchable Library of Roofing Knowledge"
        sub="Material guides, warranty and insurance notes, and field research — written by tradesmen who have spent decades on roofs that don't forgive shortcuts."
        image="assets/hero/5-Jul 27 2024 01_06am-aSX4.jpg"
      />
      <ArticleGrid />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
