"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { engagements } from "@/content/engagements";
import { scorecardHref } from "@/content/site";
import { sentenceOf } from "@/lib/leads";
import { useLead } from "./useLead";
import { FormStatus } from "./FormStatus";

const whenChoices = ["this month", "this quarter", "this year", "exploring"];
const heardChoices = ["LinkedIn", "A referral", "Search", "An event", "The newsletter", "Other"];

type Prefill = { message: string; when: string; engagement: string };
const empty: Prefill = { message: "", when: "", engagement: "" };

/** Prefill from ?who=&what=&when=&engagement= (the Scorecard and the engagement buttons link here). Render inside Suspense. */
export function ContactFormFromQuery() {
  const q = useSearchParams();
  const key = (q.get("engagement") || "").toLowerCase();
  const engagement = key ? engagements.find((e) => e.name.toLowerCase().includes(key))?.name || q.get("engagement") || "" : "";
  const sentence = sentenceOf({ who: q.get("who") || "", what: q.get("what") || "", when: q.get("when") || "" });
  const prefill = { message: [sentence, engagement ? `We'd like to talk about: ${engagement}.` : ""].filter(Boolean).join(" "), when: q.get("when") || "", engagement };
  return <ContactForm key={prefill.message} prefill={prefill} />;
}

/** Contact form: Fields in the design system treatment. Errors inline, in plain language. Success goes to /thank-you. */
export function ContactForm({ prefill = empty }: { prefill?: Prefill }) {
  const initialMessage = prefill.message;
  const initialWhen = prefill.when;
  const id = useId();
  const [v, setV] = useState({ name: "", email: "", company: "", role: "", message: initialMessage, when: whenChoices.includes(initialWhen) ? initialWhen : "", heard: "", heardDetail: "", consent: false, website: "" });
  const { state, message, errors, fallback, submit, clearError } = useLead();
  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => { setV((s) => ({ ...s, [k]: value })); if (k === "name" || k === "email" || k === "message" || k === "consent") clearError(k); };

  if (state === "success") {
    return (
      <div className="form-success-panel" role="status">
        <p className="t-h3">Thanks. One of us will reply within one working day.</p>
        <p>While you wait, <Link className="text-link" href={scorecardHref}>take the Scorecard<span className="text-link-arrow" aria-hidden="true">▸</span></Link></p>
      </div>
    );
  }

  const f = (k: string) => `${id}-${k}`;
  const err = (k: keyof typeof errors) => errors[k];

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); submit({ source: "contact", ...v, engagement: prefill.engagement || undefined }); }}>
      <div className="form-grid">
        <div className={`field${err("name") ? " is-error" : ""}`}>
          <label className="field-label" htmlFor={f("name")}>Name</label>
          <input id={f("name")} className="field-control" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!err("name")} aria-describedby={f("name-help")} />
          <span id={f("name-help")} className="field-help">{err("name") ? `✕ ${err("name")}` : ""}</span>
        </div>
        <div className={`field${err("email") ? " is-error" : ""}`}>
          <label className="field-label" htmlFor={f("email")}>Work email</label>
          <input id={f("email")} className="field-control" type="email" inputMode="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!err("email")} aria-describedby={f("email-help")} />
          <span id={f("email-help")} className="field-help">{err("email") ? `✕ ${err("email")}` : "We reply within one working day."}</span>
        </div>
        <div className="field">
          <label className="field-label" htmlFor={f("company")}>Company</label>
          <input id={f("company")} className="field-control" autoComplete="organization" value={v.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor={f("role")}>Role</label>
          <input id={f("role")} className="field-control" autoComplete="organization-title" value={v.role} onChange={(e) => set("role", e.target.value)} />
        </div>
        <div className={`field span-2${err("message") ? " is-error" : ""}`}>
          <label className="field-label" htmlFor={f("message")}>Who needs to act, and what do you need them to do?</label>
          <textarea id={f("message")} className="field-control" rows={4} placeholder="We need our branch managers to approve within new limits by March" value={v.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!err("message")} aria-describedby={f("message-help")} />
          <span id={f("message-help")} className="field-help">{err("message") ? `✕ ${err("message")}` : "One sentence is enough."}</span>
        </div>
        <div className="field">
          <label className="field-label" htmlFor={f("when")}>When does it need to happen?</label>
          <select id={f("when")} className="field-control" value={v.when} onChange={(e) => set("when", e.target.value)}>
            <option value="">Choose one</option>
            {whenChoices.map((w) => <option key={w} value={w}>{w[0].toUpperCase() + w.slice(1)}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor={f("heard")}>How did you hear about us?</label>
          <select id={f("heard")} className="field-control" value={v.heard} onChange={(e) => set("heard", e.target.value)}>
            <option value="">Choose one</option>
            {heardChoices.map((h) => <option key={h} value={h}>{h === "A referral" ? "A referral: who?" : h}</option>)}
          </select>
        </div>
        {v.heard === "A referral" || v.heard === "Other" ? (
          <div className="field span-2">
            <label className="field-label" htmlFor={f("heardDetail")}>{v.heard === "A referral" ? "Who referred you?" : "Where did you hear about us?"}</label>
            <input id={f("heardDetail")} className="field-control" value={v.heardDetail} onChange={(e) => set("heardDetail", e.target.value)} />
          </div>
        ) : null}
        <div className="honeypot" aria-hidden="true"><label htmlFor={f("website")}>Website</label><input id={f("website")} tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} /></div>
        <div className="span-2 stack-8">
          <label className={`check${err("consent") ? " is-error" : ""}`}>
            <input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!err("consent")} aria-describedby={f("consent-help")} />
            <span>I agree to be contacted about this request.</span>
          </label>
          {err("consent") ? <span id={f("consent-help")} className="field-help" style={{ color: "var(--error-600)" }}>✕ {err("consent")}</span> : null}
        </div>
        <div className="span-2 stack-16">
          <button className="btn btn-primary" type="submit" disabled={state === "loading"}>{state === "loading" ? "Sending…" : "Send"}</button>
          {state !== "idle" ? <FormStatus state={state} message={message} fallback={fallback} /> : null}
        </div>
      </div>
    </form>
  );
}
