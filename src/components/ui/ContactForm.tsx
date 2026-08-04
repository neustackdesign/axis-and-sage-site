"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get("company")) {
      setState("success");
      setMessage("Thanks — your message has been received.");
      form.reset();
      return;
    }
    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const payload = await response.json() as { message?: string };
      if (!response.ok) throw new Error(payload.message || "We could not send your message.");
      setState("success");
      setMessage(payload.message || "Thanks — your message has been received.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not send your message.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label htmlFor="name">Name <span>*</span></label>
        <input id="name" name="name" type="text" autoComplete="name" required placeholder="Your name" />
      </div>
      <div className="form-row">
        <label htmlFor="email">Work email <span>*</span></label>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
      </div>
      <div className="form-row">
        <label htmlFor="organisation">Organisation</label>
        <input id="organisation" name="organisation" type="text" autoComplete="organization" placeholder="Optional" />
      </div>
      <fieldset className="form-row form-services"><legend>What do you need? <span>*</span></legend><div className="form-checks">{["Strategy", "Design", "Growth", "Venture Building", "Storytelling"].map((service) => <label key={service}><input type="checkbox" name="needs" value={service} /> <span>{service}</span></label>)}</div></fieldset>
      <div className="form-row">
        <label htmlFor="timeline">Timeline</label>
        <select id="timeline" name="timeline" defaultValue=""><option value="" disabled>Select if useful</option><option>As soon as possible</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Exploring</option></select>
      </div>
      <div className="form-row">
        <label htmlFor="message">Message <span>*</span></label>
        <textarea id="message" name="message" required rows={4} placeholder="Tell us what you&apos;re building, solving or exploring." />
      </div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="company">Company</label><input id="company" name="company" tabIndex={-1} autoComplete="off" /></div>
      <div className="form-actions">
        <button className="button button-dark" type="submit" disabled={state === "loading"}>{state === "loading" ? "Sending…" : "Send enquiry"}<span aria-hidden="true">↗</span></button>
        <p className={`form-status form-status-${state}`} role={state === "error" ? "alert" : "status"}>{message}</p>
      </div>
      <p className="form-note">We&apos;ll only use your details to respond to this enquiry.</p>
    </form>
  );
}
