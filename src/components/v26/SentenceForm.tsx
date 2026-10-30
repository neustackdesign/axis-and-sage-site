"use client";

import { useId, useState } from "react";
import { FormStatus } from "@/components/forms/FormStatus";
import { useLead } from "@/components/forms/useLead";
import { whenOptions } from "@/lib/content/vocab";

/** The form is the sentence: "We need ___ to ___ by ___." Then a work email, the one plain field. Source "cta". */
export function SentenceForm({ email: contactEmail }: { email: string }) {
  const id = useId();
  const [v, setV] = useState({ who: "", what: "", when: "this quarter", email: "" });
  const { state, message, errors, fallback, submit, clearError, setState } = useLead();
  const set = (k: keyof typeof v, value: string) => { setV((s) => ({ ...s, [k]: value })); if (k !== "when") clearError(k); };

  if (state === "success") {
    return (
      <div className="ok stack" role="status" style={{ gap: 14 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" /><path className="tick" d="M12 20.5l5.5 5.5L28.5 15" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
        <p className="h3">Sent. We reply within one working day with a clear next step.</p>
        <p className="small muted">Your sentence: we need {v.who} to {v.what} by {v.when}.</p>
        <button className="btn btn-primary" type="button" style={{ alignSelf: "flex-start" }} onClick={() => { setV({ who: "", what: "", when: "this quarter", email: "" }); setState("idle"); }}>Send another</button>
      </div>
    );
  }

  return (
    <form className="stack" style={{ gap: 28 }} noValidate onSubmit={(e) => { e.preventDefault(); submit({ source: "cta", ...v }); }}>
      <p className="lbl ink">Your sentence</p>
      <p className="snt">
        <label htmlFor={`${id}-who`}>We need</label>{" "}
        <span className={`sl${errors.who ? " bad" : ""}`}><input id={`${id}-who`} value={v.who} onChange={(e) => set("who", e.target.value)} placeholder="investors" aria-invalid={!!errors.who} aria-describedby={errors.who ? `${id}-who-e` : undefined} autoComplete="off" size={9} /></span>{" "}
        <label htmlFor={`${id}-what`}>to</label>{" "}
        <span className={`sl${errors.what ? " bad" : ""}`}><input id={`${id}-what`} value={v.what} onChange={(e) => set("what", e.target.value)} placeholder="commit to the round" aria-invalid={!!errors.what} aria-describedby={errors.what ? `${id}-what-e` : undefined} autoComplete="off" size={18} /></span>{" "}
        <label htmlFor={`${id}-when`}>by</label>{" "}
        <span className="sl"><select id={`${id}-when`} value={v.when} onChange={(e) => set("when", e.target.value)}>{whenOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></span>.
      </p>
      {errors.who ? <span id={`${id}-who-e`} className="tag-err" style={{ marginTop: -16 }}>{errors.who}</span> : null}
      {errors.what ? <span id={`${id}-what-e`} className="tag-err" style={{ marginTop: -16 }}>{errors.what}</span> : null}
      <div className={`fld${errors.email ? " bad" : ""}`} style={{ borderTop: "1px solid var(--haze-400)", paddingTop: 24 }}>
        <label htmlFor={`${id}-email`}>Work email, for the reply</label>
        <input id={`${id}-email`} type="email" inputMode="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-e` : undefined} />
        {errors.email ? <span id={`${id}-email-e`} className="tag-err">{errors.email}</span> : null}
      </div>
      <button className="btn btn-primary" type="submit" disabled={state === "loading"} style={{ alignSelf: "flex-start" }}>
        {state === "loading" ? <><span className="spin" aria-hidden="true" />Sending…</> : "Send"}
      </button>
      {state === "offline" || (state === "error" && !Object.keys(errors).length) ? <FormStatus state={state} message={message || `That didn't send. Your answers are still here. Try again, or email ${contactEmail}.`} fallback={fallback} /> : null}
    </form>
  );
}
