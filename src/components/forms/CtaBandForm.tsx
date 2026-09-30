"use client";

import { useId, useState } from "react";
import { whenOptions } from "@/content/site";
import { useLead } from "./useLead";
import { FormStatus } from "./FormStatus";

/** The inline mono sentence form inside CTABand.Orange. */
export function CtaBandForm() {
  const id = useId();
  const [who, setWho] = useState("");
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");
  const [email, setEmail] = useState("");
  const { state, message, errors, fallback, submit, clearError } = useLead();

  if (state === "success") {
    return (
      <div className="form-success-panel" style={{ borderTopColor: "var(--charcoal-900)" }} role="status">
        <p className="t-h3">Thanks. One of us will reply within one working day.</p>
        <p className="t-label">WE NEED {who} TO {what}{when ? ` BY ${when}` : ""}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); submit({ source: "cta", who, what, when, email }); }}>
      <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
        <legend className="sr-only">Who needs to act, what they need to do, and by when</legend>
        <div className="cta-sentence">
          <span className="ms-slot"><span aria-hidden="true">We need</span>
            <label className="sr-only" htmlFor={`${id}-who`}>Who needs to act</label>
            <input id={`${id}-who`} className={`ms-input${who ? " is-filled" : ""}`} placeholder="__________" value={who} onChange={(e) => { setWho(e.target.value); clearError("who"); }} aria-invalid={!!errors.who} autoComplete="off" />
          </span>
          <span className="ms-slot"><span aria-hidden="true">to</span>
            <label className="sr-only" htmlFor={`${id}-what`}>What you need them to do</label>
            <input id={`${id}-what`} className={`ms-input${what ? " is-filled" : ""}`} placeholder="__________" value={what} onChange={(e) => { setWhat(e.target.value); clearError("what"); }} aria-invalid={!!errors.what} autoComplete="off" />
          </span>
          <span className="ms-slot"><span aria-hidden="true">by</span>
            <label className="sr-only" htmlFor={`${id}-when`}>By when</label>
            <span className={`ms-select${when ? " is-chosen" : ""}`}>
              <select id={`${id}-when`} value={when} onChange={(e) => setWhen(e.target.value)}>
                <option value="">&nbsp;</option>
                {whenOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </span>
          </span>
        </div>
      </fieldset>
      {errors.who || errors.what ? <p className="field-help" style={{ marginTop: 10 }} role="alert">✕ {errors.who || errors.what}</p> : null}
      <div className={`field${errors.email ? " is-error" : ""}`} style={{ marginTop: 28 }}>
        <label className="sr-only" htmlFor={`${id}-email`}>Work email</label>
        <div className="cta-band-form-row" style={{ marginTop: 0 }}>
          <input id={`${id}-email`} className="field-control" type="email" inputMode="email" autoComplete="email" placeholder="Work email" value={email} onChange={(e) => { setEmail(e.target.value); clearError("email"); }} aria-invalid={!!errors.email} />
          <button className="btn btn-dark" type="submit" disabled={state === "loading"}>{state === "loading" ? "Sending…" : "Send"}</button>
        </div>
        {errors.email ? <span className="field-help">✕ {errors.email}</span> : null}
      </div>
      {state === "offline" || (state === "error" && !Object.keys(errors).length) ? <div style={{ marginTop: 16 }}><FormStatus state={state} message={message} fallback={fallback} /></div> : null}
    </form>
  );
}
