/* global React, ReactDOM, Nav, PageHero, ContactForm, WhatToExpect, Testimonials, Footer */
const { useState } = React;

function App() {
  const [onLight, setOnLight] = useState(false);
  return (
    <React.Fragment>
      <Nav onLight={onLight} />
      <PageHero
        eyebrow="Get in Touch"
        title="Schedule a Consultation"
        sub="We review every inquiry personally. Expect a response within one business day."
        image="assets/hero/6-Sep 11 2024 11_17am-BXjq.jpg"
      />
      <ContactForm />
      <WhatToExpect />
      <Testimonials />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
