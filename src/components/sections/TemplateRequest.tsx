"use client";

import { useId, useState } from "react";
import { FormStatus } from "@/components/forms/FormStatus";
import { useLead } from "@/components/forms/useLead";

/** Templates: pick the files, leave a work email. The download is sent by email. */
export function TemplateRequest({ templates }: { templates: { title: string; format: string }[] }) {
  const id = useId();
  const [picked, setPicked] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const { state, message, errors, fallback, submit, clearError } = useLead();

  if (state === "success") return <div className="form-success-panel" role="status"><p className="t-h3">Done. The files are on their way to {email}.</p></div>;

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); if (!picked.length) return; submit({ source: "tool", tool: "Templates", email, summary: `Templates requested:\n${picked.map((p) => `- ${p}`).join("\n")}` }); }}>
      <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
        <legend className="sr-only">Choose templates</legend>
        <ul className="spec-list">
          {templates.map((t, i) => (
            <li key={t.title}>
              <span className="t-label">{String(i + 1).padStart(2, "0")}</span>
              <label className="check" style={{ justifyContent: "space-between", width: "100%" }}>
                <span style={{ display: "flex", gap: 12 }}><input type="checkbox" checked={picked.includes(t.title)} onChange={(e) => setPicked((p) => e.target.checked ? [...p, t.title] : p.filter((x) => x !== t.title))} /><span>{t.title}</span></span>
                <span className="chip">{t.format}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      {touched && !picked.length ? <p className="form-status is-error" role="alert" style={{ marginTop: 12 }}>✕ Choose at least one template.</p> : null}
      <div className={`field${errors.email ? " is-error" : ""}`} style={{ marginTop: 24, maxWidth: 560 }}>
        <label className="field-label" htmlFor={`${id}-email`}>Work email</label>
        <div className="newsletter-form">
          <input id={`${id}-email`} className="field-control" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); clearError("email"); }} aria-invalid={!!errors.email} />
          <button className="btn btn-dark" type="submit" disabled={state === "loading"}>{state === "loading" ? "Sending…" : "Send me the files"}</button>
        </div>
        {errors.email ? <span className="field-help">✕ {errors.email}</span> : null}
      </div>
      {state === "offline" || (state === "error" && !errors.email) ? <div style={{ marginTop: 16 }}><FormStatus state={state} message={message} fallback={fallback} /></div> : null}
    </form>
  );
}
