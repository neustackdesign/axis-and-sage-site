// /contact — three routes: calendar, form, WhatsApp. Mirrors app/(site)/contact + forms/ContactForm.tsx.
function ContactScreen({ go }) {
  const { SiteHeader, PageHero, Section, Field, Button, FormStatus, TextLink } = window.AxisSageDesignSystem_72f554;
  const [state, setState] = React.useState("idle");
  const [email, setEmail] = React.useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) { setState("error"); return; }
    setState("sending");
    setTimeout(() => setState("done"), 900);
  };
  return (
    <>
      <SiteHeader current="Contact" assetBase={ASSET} onNavigate={go} />
      <PageHero label="CONTACT" title="Who needs to act?" sub="Tell us in one sentence. We reply within one working day with a clear next step." />
      <Section tight>
        <div className="contact-routes">
          <div className="contact-route" id="book">
            <span className="t-label muted">01 · BOOK</span>
            <h2 className="t-h3">A 30-minute call</h2>
            <div className="calendar-placeholder"><span className="t-label muted">CAL.COM · AXISANDSAGE/30MIN</span><p className="t-small muted">The booking calendar embeds here.</p></div>
          </div>
          <div className="contact-route">
            <span className="t-label muted">02 · WRITE</span>
            <h2 className="t-h3">One sentence is enough</h2>
            {state === "done" ? (
              <div className="form-success-panel"><p className="t-h3">Thank you.</p><p className="muted">We'll reply within one working day from info@axisandsage.com.</p></div>
            ) : (
              <form className="form-grid" onSubmit={submit} noValidate>
                <Field label="Name" placeholder="Your name" />
                <Field label="Work email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} state={state === "error" ? "error" : undefined} help={state === "error" ? "Add an email so we can reply." : undefined} />
                <div className="span-2"><Field label="Who needs to act, and what do you need them to do?" as="textarea" placeholder="We need ___ to ___ by ___." /></div>
                <Field label="Company" required={false} />
                <Field label="By when" as="select" options={["this month", "this quarter", "this year", "no date yet"]} />
                <div className="span-2"><Button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send"}</Button></div>
              </form>
            )}
          </div>
          <div className="contact-route">
            <span className="t-label muted">03 · DETAILS</span>
            <p>info@axisandsage.com</p>
            <p className="t-small muted">Founders in Dubai and Lagos. Masdar City Free Zone, Abu Dhabi, UAE.</p>
            <TextLink href="#">WhatsApp us</TextLink>
          </div>
        </div>
      </Section>
    </>
  );
}
window.ContactScreen = ContactScreen;
