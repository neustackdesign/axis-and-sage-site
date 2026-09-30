"use client";

import { useState } from "react";
import { mailtoFor, validateLead, type LeadErrors, type LeadPayload } from "@/lib/leads";

export type LeadState = "idle" | "loading" | "success" | "error" | "offline";

/** Submit a lead. Validates on the client first; when online delivery is off, hands over a prefilled email instead. */
export function useLead() {
  const [state, setState] = useState<LeadState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<LeadErrors>({});
  const [fallback, setFallback] = useState("");

  async function submit(payload: LeadPayload) {
    const local = validateLead(payload);
    setErrors(local);
    if (Object.keys(local).length) {
      setState("error");
      setMessage("Please check the highlighted fields.");
      return false;
    }
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = (await res.json().catch(() => ({}))) as { message?: string; errors?: LeadErrors };
      if (res.status === 503) {
        setState("offline");
        setMessage(body.message || "Online sending isn't switched on yet.");
        setFallback(mailtoFor(payload));
        return false;
      }
      if (!res.ok) {
        setErrors(body.errors || {});
        setState("error");
        setMessage(body.message || "We couldn't send that. Please try again.");
        return false;
      }
      setState("success");
      setMessage(body.message || "Thanks. One of us will reply within one working day.");
      return true;
    } catch {
      setState("error");
      setMessage("We couldn't reach the server. Check your connection and try again.");
      return false;
    }
  }

  const clearError = (key: keyof LeadErrors) => setErrors((e) => { if (!e[key]) return e; const next = { ...e }; delete next[key]; return next; });

  return { state, message, errors, fallback, submit, clearError, setState };
}
