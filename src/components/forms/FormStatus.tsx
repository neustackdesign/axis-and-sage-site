import type { LeadState } from "./useLead";
import { CONTACT_EMAIL } from "@/lib/routes";

/** Inline status: error, success, and the email hand-over when online sending is off. */
export function FormStatus({ state, message, fallback }: { state: LeadState; message: string; fallback: string }) {
  if (state === "offline") {
    return (
      <div className="form-fallback" role="status">
        <span>{message}</span>
        <a className="text-link" href={fallback}>Open it in your email app<span className="text-link-arrow" aria-hidden="true">▸</span></a>
        <span className="t-small">Or write to <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</span>
      </div>
    );
  }
  return (
    <p className={`form-status${state === "error" ? " is-error" : state === "success" ? " is-success" : ""}`} role={state === "error" ? "alert" : "status"} aria-live="polite">
      {state === "error" ? "✕ " : state === "success" ? "✓ " : ""}{message}
    </p>
  );
}
