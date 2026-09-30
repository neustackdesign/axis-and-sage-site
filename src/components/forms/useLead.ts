"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { currentAttribution } from "@/lib/client/attribution";
import { mailtoFor, validateLead, type LeadErrors, type LeadPayload } from "@/lib/leads";
import type { TurnstileHandle } from "./Turnstile";

export type LeadState = "idle" | "loading" | "success" | "error" | "offline";

const endpoint = (p: LeadPayload) => (p.source === "newsletter" ? "/api/newsletter" : "/api/contact");

/** Submit through the lead pipeline. The mailto hand-over appears only when the server says both the database and the email failed. */
export function useLead() {
  const router = useRouter();
  const turnstile = useRef<TurnstileHandle>(null);
  const [state, setState] = useState<LeadState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<LeadErrors>({});
  const [fallback, setFallback] = useState("");

  async function submit(payload: LeadPayload) {
    const local = validateLead(payload);
    setErrors(local);
    if (Object.keys(local).length) { setState("error"); setMessage("Please check the highlighted fields."); return false; }
    setState("loading");
    setMessage("");
    try {
      const turnstileToken = await turnstile.current?.token();
      const res = await fetch(endpoint(payload), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, turnstileToken, attribution: currentAttribution() }) });
      const body = (await res.json().catch(() => ({}))) as { message?: string; errors?: LeadErrors; fallback?: boolean; redirect?: string };
      turnstile.current?.reset();
      if (body.fallback) { setState("offline"); setMessage(body.message || "We couldn't send that just now."); setFallback(mailtoFor(payload)); return false; }
      // Turnstile couldn't verify this browser (a blocker, a flaky network): never strand the enquiry.
      if (res.status === 403) { setState("offline"); setMessage("We couldn't verify this browser, so nothing was sent. Try again, or let your email app send it."); setFallback(mailtoFor(payload)); return false; }
      if (!res.ok) { setErrors(body.errors || {}); setState("error"); setMessage(body.message || "We couldn't send that. Please try again."); return false; }
      if (body.redirect) { router.push(body.redirect); return true; }
      setState("success");
      setMessage(body.message || "Thanks. One of us will reply within one working day.");
      return true;
    } catch {
      // The server could not be reached at all: nothing was saved or sent, so hand over the email.
      setState("offline");
      setMessage("We couldn't reach our server. Your email app can send this instead.");
      setFallback(mailtoFor(payload));
      return false;
    }
  }

  const clearError = (key: keyof LeadErrors) => setErrors((e) => { if (!e[key]) return e; const next = { ...e }; delete next[key]; return next; });

  return { state, message, errors, fallback, submit, clearError, setState, turnstile };
}
