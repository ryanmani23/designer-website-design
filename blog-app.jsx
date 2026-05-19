/* global React, ReactDOM, Nav, PageHero, FeaturedArticle, ArticleGrid, Footer */
const { useState } = React;

function App() {
  const [onLight, setOnLight] = useState(false);
  return (
    <React.Fragment>
      <Nav onLight={onLight} />
      <PageHero
        eyebrow="Roofing Field Journal"
        title="Expert Notes on Materials, Restoration, and Historic Craft"
        sub="Written by tradesmen who have spent decades on roofs that don't forgive shortcuts."
        image="assets/hero/5-Jul 27 2024 01_06am-aSX4.jpg"
      />
      <FeaturedArticle />
      <ArticleGrid />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
