"use client";

import { useId, useState } from "react";
import { useRenderedAt } from "@/components/forms/useLead";
import { currentAttribution } from "@/lib/client/attribution";
import { downloadBlob } from "@/lib/tools/xlsx";

type Download = { filename: string; build: () => Promise<Blob> };
type State = "idle" | "loading" | "sent" | "failed" | "error";

/**
 * Email capture for a tool result. The result goes through the lead path; the Pipeline Sheet emails it to the visitor.
 * Spreadsheets download straight after the email is captured. Copy says only what actually happened.
 */
export function ToolEmail({ tool, label, summary, result, shareUrl, diagnosticUrl, download }: { tool: string; label: string; summary: () => string; result?: () => unknown; shareUrl?: () => string; diagnosticUrl?: () => string; download?: Download }) {
  const id = useId();
  const renderedAt = useRenderedAt();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const runDownload = async () => {
    if (!download) return false;
    try { downloadBlob(await download.build(), download.filename); setDownloaded(true); return true; } catch { return false; }
  };

  const send = async () => {
    if (!valid) { setState("error"); setMessage("Enter an email like name@company.com."); return; }
    setState("loading");
    try {
      const res = await fetch("/api/tool-result", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool, email, summary: summary(), result: result?.(), shareUrl: shareUrl?.(), diagnosticUrl: diagnosticUrl?.(), renderedAt: renderedAt.current, submittedAt: Date.now(), attribution: currentAttribution() }) });
      const body = (await res.json().catch(() => ({}))) as { stored?: boolean; delivered?: boolean; message?: string };
      if (res.ok && body.stored) {
        const got = await runDownload();
        const file = download ? (got ? " Your file has downloaded." : " The download didn't start: use the button below.") : "";
        setState("sent");
        setMessage(body.delivered ? `Sent to ${email}.${file}` : `Saved. We'll email it to ${email} shortly.${file}`);
        return;
      }
      if (res.status === 400) { setState("error"); setMessage(body.message || "Enter an email like name@company.com."); return; }
      setState("failed");
      setMessage("We couldn't send the email.");
    } catch {
      setState("failed");
      setMessage("We couldn't reach our server, so nothing was sent.");
    }
  };

  if (!open) return <button type="button" className="btn btn-secondary" onClick={() => setOpen(true)}>{label}</button>;

  return (
    <div className="tool-email">
      {state === "sent" ? (
        <div className="stack-8" role="status">
          <p className="form-status is-success">✓ {message}</p>
          {download && !downloaded ? <button type="button" className="btn btn-secondary btn-sm" onClick={runDownload}>Download {download.filename}</button> : null}
        </div>
      ) : (
        <form noValidate onSubmit={(e) => { e.preventDefault(); send(); }}>
          <div className={`field${state === "error" ? " is-error" : ""}`}>
            <label className="field-label" htmlFor={`${id}-email`}>Work email</label>
            <div className="newsletter-form">
              <input id={`${id}-email`} className="field-control" type="email" inputMode="email" autoComplete="email" value={email} autoFocus onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }} aria-invalid={state === "error"} />
              <button className="btn btn-dark" type="submit" disabled={state === "loading"}>{state === "loading" ? "Sending…" : label}</button>
            </div>
            <span className="field-help" role={state === "error" ? "alert" : undefined}>{state === "error" ? `✕ ${message}` : `We send your result to this address${download ? " and download the file" : ""}. No newsletter unless you ask.`}</span>
          </div>
          {state === "failed" ? (
            <div className="form-fallback" role="alert" style={{ marginTop: 12 }}>
              <span>✕ {message}{download ? " You can still download the file." : ""}</span>
              <div className="button-row">
                {download ? <button type="button" className="btn btn-secondary btn-sm" onClick={runDownload}>{downloaded ? "Downloaded" : `Download ${download.filename}`}</button> : null}
                <button type="button" className="btn btn-dark btn-sm" onClick={send}>Try again</button>
              </div>
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}
