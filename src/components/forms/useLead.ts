"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { currentAttribution } from "@/lib/client/attribution";
import { mailtoFor, validateLead, type LeadErrors, type LeadPayload } from "@/lib/leads";

export type LeadState = "idle" | "loading" | "success" | "error" | "offline";

const endpoint = (p: LeadPayload) => (p.source === "newsletter" ? "/api/newsletter" : "/api/contact");

/** The time the form rendered on this device. Sent with the submission for the 3-second rule. */
export function useRenderedAt() {
  const renderedAt = useRef<number>(0);
  useEffect(() => { renderedAt.current = Date.now(); }, []);
  return renderedAt;
}

/** Submit through the lead path. The mailto hand-over appears only when the server couldn't store the message at all. */
export function useLead() {
  const router = useRouter();
  const renderedAt = useRenderedAt();
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
      const res = await fetch(endpoint(payload), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, renderedAt: renderedAt.current, submittedAt: Date.now(), attribution: currentAttribution() }) });
      const body = (await res.json().catch(() => ({}))) as { message?: string; errors?: LeadErrors; fallback?: boolean; redirect?: string };
      if (body.fallback) { setState("offline"); setMessage(body.message || "We couldn't save that just now."); setFallback(mailtoFor(payload)); return false; }
      if (!res.ok) { setErrors(body.errors || {}); setState("error"); setMessage(body.message || "We couldn't send that. Please try again."); return false; }
      if (body.redirect) { router.push(body.redirect); return true; }
      setState("success");
      setMessage(body.message || "Thanks. One of us will reply within one working day.");
      return true;
    } catch {
      // The server could not be reached at all: nothing was stored, so hand over the email.
      setState("offline");
      setMessage("We couldn't reach our server. Your email app can send this instead.");
      setFallback(mailtoFor(payload));
      return false;
    }
  }

  const clearError = (key: keyof LeadErrors) => setErrors((e) => { if (!e[key]) return e; const next = { ...e }; delete next[key]; return next; });

  return { state, message, errors, fallback, submit, clearError, setState };
}
