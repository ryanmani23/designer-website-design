/* global React, ReactDOM, Nav, PageHero, ContactForm, Testimonials, FinalCTA, Footer */
function App() {
  return (
    <React.Fragment>
      <Nav />
      <PageHero
        eyebrow="Get in Touch"
        title="Schedule a Consultation"
        sub="We review every inquiry personally. Expect a response within one business day."
        image="assets/hero/6-Sep 11 2024 11_17am-BXjq.jpg"
      />
      {/* Jack 2026-06-11: "What Happens Next" removed — the form + CTA are the
          direct prompt to schedule a consultation. */}
      <ContactForm />
      <Testimonials />
      <FinalCTA variant="contact" />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
