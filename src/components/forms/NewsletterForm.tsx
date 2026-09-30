"use client";

import { useId, useState } from "react";
import { useLead } from "./useLead";
import { FormStatus } from "./FormStatus";
import { Turnstile } from "./Turnstile";

/** Newsletter.Inline · Newsletter.Footer: email and one button. */
export function NewsletterForm({ label = "Work email", dark, primary }: { label?: string; dark?: boolean; primary?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const { state, message, errors, fallback, submit, clearError, turnstile } = useLead();
  const done = state === "success";
  return (
    <form
      className={dark ? "on-dark" : undefined}
      noValidate
      onSubmit={async (e) => { e.preventDefault(); if (await submit({ source: "newsletter", email })) setEmail(""); }}
    >
      <div className={`field${errors.email ? " is-error" : ""}`}>
        <label className="sr-only" htmlFor={`${id}-email`}>{label}</label>
        <div className="newsletter-form">
          <input id={`${id}-email`} className="field-control" type="email" inputMode="email" autoComplete="email" placeholder={label} value={email} onChange={(e) => { setEmail(e.target.value); clearError("email"); }} aria-invalid={!!errors.email} aria-describedby={`${id}-help`} disabled={done} />
          <button className={`btn ${primary ? "btn-primary" : dark ? "btn-secondary" : "btn-dark"}`} type="submit" disabled={state === "loading" || done}>{state === "loading" ? "Subscribing…" : done ? "Check your inbox" : "Subscribe"}</button>
        </div>
        <span id={`${id}-help`} className="field-help">{errors.email ? `✕ ${errors.email}` : ""}</span>
      </div>
      <Turnstile ref={turnstile} />
      {state !== "idle" && !errors.email ? <FormStatus state={state} message={message} fallback={fallback} /> : null}
    </form>
  );
}
