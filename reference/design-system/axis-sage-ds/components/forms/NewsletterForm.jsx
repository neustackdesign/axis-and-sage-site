import React from "react";
/** Newsletter.Inline: email + Subscribe fused into one row. Dark on the midnight footer. */
export function NewsletterForm({ dark, onSubmit }) {
  const [done, setDone] = React.useState(false);
  if (done) return <p className={"form-status is-success" + (dark ? " on-dark" : "")}>Check your inbox to confirm your subscription.</p>;
  return (
    <form className={"newsletter-form" + (dark ? " on-dark" : "")} onSubmit={(e) => { e.preventDefault(); setDone(true); onSubmit && onSubmit(); }}>
      <input className="field-control" type="email" required placeholder="you@company.com" aria-label="Email" />
      <button className="btn btn-primary" type="submit">Subscribe</button>
    </form>
  );
}
