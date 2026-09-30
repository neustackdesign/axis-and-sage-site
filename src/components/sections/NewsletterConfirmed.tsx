"use client";

import { useSearchParams } from "next/navigation";

/** Shown after the double opt-in link is clicked. */
export function NewsletterConfirmed() {
  const status = useSearchParams().get("confirmed");
  if (status === "1") return <p className="form-status is-success" role="status" style={{ marginTop: 16 }}>✓ Confirmed. The next issue comes to your inbox.</p>;
  if (status === "invalid") return <p className="form-status is-error" role="alert" style={{ marginTop: 16 }}>✕ That confirmation link has expired or isn&apos;t valid. Sign up again and we&apos;ll send a new one.</p>;
  return null;
}
