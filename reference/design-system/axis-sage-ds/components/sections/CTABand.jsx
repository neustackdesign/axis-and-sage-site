import React from "react";
/** CTABand.Orange: "Who needs to act?" with the inline sentence form. Used on most pages. */
export function CTABand({ headline = "Who needs to act?", line = "Tell us in one sentence. We reply within one working day with a clear next step." }) {
  const [sent, setSent] = React.useState(false);
  return (
    <section className="cta-band">
      <div className="wrap cta-band-grid">
        <div><h2 style={{ margin: 0 }}>{headline}</h2><p className="cta-band-line">{line}</p></div>
        <div>
          {sent ? <div className="form-success-panel" style={{ borderTopColor: "var(--midnight-900)" }}><p className="t-h3">Thank you. We'll reply within one working day.</p></div> : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="cta-sentence">
                <span>WE NEED</span><input className="ms-input" placeholder="WHO" aria-label="Who" />
                <span>TO</span><input className="ms-input" placeholder="DO WHAT" aria-label="Do what" />
                <span>BY</span><span className="ms-select"><select aria-label="By when" defaultValue="this quarter"><option>this month</option><option>this quarter</option><option>this year</option><option>no date yet</option></select></span>
              </div>
              <div className="cta-band-form-row"><input className="field-control" type="email" placeholder="Work email" aria-label="Work email" /><button className="btn btn-dark" type="submit">Send</button></div>
            </form>
          )}
          <p className="cta-band-links"><a className="text-link" href="#">Book a 30-minute call<span className="text-link-arrow">▸</span></a><a className="text-link" href="#">WhatsApp us<span className="text-link-arrow">▸</span></a></p>
        </div>
      </div>
    </section>
  );
}
