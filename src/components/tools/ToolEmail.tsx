"use client";

import { useId, useState } from "react";
import { useLead } from "@/components/forms/useLead";
import { FormStatus } from "@/components/forms/FormStatus";

/** Email capture for tool outputs: "Email me this report", "Send me the model", "Download .xlsx". */
export function ToolEmail({ tool, label, summary, successText }: { tool: string; label: string; summary: () => string; successText: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { state, message, errors, fallback, submit, clearError } = useLead();

  if (state === "success") return <p className="form-status is-success" role="status">✓ {successText}</p>;
  if (!open) return <button type="button" className="btn btn-secondary" onClick={() => setOpen(true)}>{label}</button>;

  return (
    <form className="tool-email" noValidate onSubmit={(e) => { e.preventDefault(); submit({ source: "tool", tool, email, summary: summary() }); }}>
      <div className={`field${errors.email ? " is-error" : ""}`}>
        <label className="field-label" htmlFor={`${id}-email`}>Work email</label>
        <div className="newsletter-form">
          <input id={`${id}-email`} className="field-control" type="email" inputMode="email" autoComplete="email" value={email} autoFocus onChange={(e) => { setEmail(e.target.value); clearError("email"); }} aria-invalid={!!errors.email} />
          <button className="btn btn-dark" type="submit" disabled={state === "loading"}>{state === "loading" ? "Sending…" : label}</button>
        </div>
        <span className="field-help">{errors.email ? `✕ ${errors.email}` : "We use it only to send this. No newsletter unless you ask."}</span>
      </div>
      {state === "offline" || (state === "error" && !errors.email) ? <FormStatus state={state} message={message} fallback={fallback} /> : null}
    </form>
  );
}
