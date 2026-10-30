"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { FormStatus } from "@/components/forms/FormStatus";
import { useLead } from "@/components/forms/useLead";
import type { ContactPath } from "@/lib/content/types";
import { sentenceOf } from "@/lib/leads";
import { whenOptions } from "@/lib/content/vocab";

type Copy = { title: string; sub?: string; label: string; note?: string; email: string; based: string };

/** Contact with prefill from ?engagement=&who=&what=&when=&source= (tools, offers and buttons link here). Render inside Suspense. */
export function ContactPathsFromQuery(props: { paths: ContactPath[]; copy: Copy }) {
  const q = useSearchParams();
  const key = (q.get("engagement") || "").toLowerCase();
  const start = key ? Math.max(0, props.paths.findIndex((p) => p.key === key || p.label.toLowerCase().includes(key) || key.includes(p.key))) : 0;
  const when = q.get("when") || "";
  return <ContactPaths key={`${start}${q.toString()}`} {...props} start={start} prefill={{ who: q.get("who") || "", what: q.get("what") || "", when: (whenOptions as readonly string[]).includes(when) ? when : "", origin: q.get("source") || undefined }} />;
}

/**
 * Pick what fits on the left; the form on the right relabels and re-prompts to suit it, so the enquiry arrives framed.
 * Sends through the contact lead path (name, sentence, consent), the same as before.
 */
export function ContactPaths({ paths, copy, start = 0, prefill }: { paths: ContactPath[]; copy: Copy; start?: number; prefill?: { who: string; what: string; when: string; origin?: string } }) {
  const id = useId();
  const [pick, setPick] = useState(start);
  const path = paths[pick];
  const [v, setV] = useState({ name: "", email: "", company: "", who: prefill?.who ?? "", what: prefill?.what ?? "", when: prefill?.when || "this quarter", consent: false, website: "" });
  const [localErr, setLocalErr] = useState<{ who?: string; what?: string }>({});
  const { state, message, errors, fallback, submit, clearError, check } = useLead();
  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => {
    setV((s) => ({ ...s, [k]: value }));
    if (k === "who" || k === "what") setLocalErr((e) => ({ ...e, [k]: undefined }));
    if (k === "name" || k === "email" || k === "consent") clearError(k);
    if (k === "who" || k === "what") clearError("message");
  };
  const f = (k: string) => `${id}-${k}`;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const le = { who: v.who.trim() ? undefined : "Say who needs to act.", what: v.what.trim() ? undefined : "Say what they need to do." };
    setLocalErr(le);
    const payload = { source: "contact" as const, name: v.name, email: v.email, company: v.company, who: v.who, what: v.what, when: v.when, consent: v.consent, website: v.website,
      message: [sentenceOf(v), path ? `Starting point: ${path.label}.` : ""].filter(Boolean).join(" "), engagement: path?.label, origin: prefill?.origin };
    // An incomplete sentence still reads as ten characters, so it is checked here; every other error shows at once.
    if (le.who || le.what) { check(payload); return; }
    submit(payload);
  };

  return (
    <div className="ct">
      <div className="l edge">
        <p className="lbl">{copy.label}</p>
        <h1 id="page-title" className="disp">{copy.title}</h1>
        {copy.sub ? <p className="lead">{copy.sub}</p> : null}
        <div className="paths" role="group" aria-label="What would you like to start with?">
          {paths.map((p, i) => (
            <button key={p.key} type="button" aria-pressed={i === pick} onClick={() => setPick(i)}>
              <span className="stack" style={{ gap: 4 }}><span className="h3">{p.title}</span><span className="small" style={{ color: "var(--sunset-100)" }}>{p.line}</span></span>
              <span className="lbl" style={{ color: "var(--cloud-50)" }}>{i === pick ? "Selected" : "▸"}</span>
            </button>
          ))}
        </div>
        <p className="small" style={{ color: "var(--sunset-100)", marginTop: "auto" }}>Or email <a className="tl" href={`mailto:${copy.email}`}>{copy.email}</a> · {copy.based}</p>
      </div>
      <div className="r edge-r">
        <div className="fp lite" style={{ marginBlock: 0 }}>
          {state === "success" ? (
            <div className="ok stack" role="status" style={{ gap: 16 }}>
              <svg width="44" height="44" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" /><path className="tick" d="M12 20.5l5.5 5.5L28.5 15" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
              <p className="h2">Sent.</p>
              <p className="lead">We reply within one working day with a clear next step.</p>
              <p className="small muted">Your sentence: {sentenceOf(v)}</p>
            </div>
          ) : (
            <form className="stack" style={{ gap: 18 }} noValidate onSubmit={onSubmit}>
              <p className="lbl ink" aria-live="polite">{path?.label}{prefill?.origin ? <span className="muted"> · prefilled from where you came</span> : null}</p>
              <div className={`fld${localErr.who ? " bad" : ""}`}><label htmlFor={f("who")}>We need</label><input id={f("who")} value={v.who} onChange={(e) => set("who", e.target.value)} placeholder={path?.who} aria-invalid={!!localErr.who} aria-describedby={localErr.who ? f("who-e") : undefined} />{localErr.who ? <span id={f("who-e")} className="tag-err">{localErr.who}</span> : null}</div>
              <div className={`fld${localErr.what || errors.message ? " bad" : ""}`}><label htmlFor={f("what")}>to</label><input id={f("what")} value={v.what} onChange={(e) => set("what", e.target.value)} placeholder={path?.what} aria-invalid={!!(localErr.what || errors.message)} aria-describedby={localErr.what || errors.message ? f("what-e") : undefined} />{localErr.what || errors.message ? <span id={f("what-e")} className="tag-err">{localErr.what || errors.message}</span> : null}</div>
              <div className="fld-row">
                <div className="fld"><label htmlFor={f("when")}>by</label><select id={f("when")} value={v.when} onChange={(e) => set("when", e.target.value)}>{whenOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
                <div className={`fld${errors.email ? " bad" : ""}`}><label htmlFor={f("email")}>Work email</label><input id={f("email")} type="email" inputMode="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? f("email-e") : undefined} />{errors.email ? <span id={f("email-e")} className="tag-err">{errors.email}</span> : null}</div>
              </div>
              <div className="fld-row">
                <div className={`fld${errors.name ? " bad" : ""}`}><label htmlFor={f("name")}>Name</label><input id={f("name")} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? f("name-e") : undefined} />{errors.name ? <span id={f("name-e")} className="tag-err">{errors.name}</span> : null}</div>
                <div className="fld"><label htmlFor={f("company")}>Organisation <span className="muted">(optional)</span></label><input id={f("company")} autoComplete="organization" value={v.company} onChange={(e) => set("company", e.target.value)} /></div>
              </div>
              <div className="honeypot" aria-hidden="true"><label htmlFor={f("website")}>Website</label><input id={f("website")} tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} /></div>
              <label className="check"><input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? f("consent-e") : undefined} /><span>I agree to be contacted about this request.</span></label>
              {errors.consent ? <span id={f("consent-e")} className="tag-err">{errors.consent}</span> : null}
              <div className="row" style={{ gap: 16 }}>
                <button className="btn btn-primary" type="submit" disabled={state === "loading"}>{state === "loading" ? <><span className="spin" aria-hidden="true" />Sending…</> : "Send"}</button>
                {copy.note ? <span className="small muted">{copy.note}</span> : null}
              </div>
              {state === "offline" || (state === "error" && !Object.keys(errors).length) ? <FormStatus state={state} message={message} fallback={fallback} /> : null}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
