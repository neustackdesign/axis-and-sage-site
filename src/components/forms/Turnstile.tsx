"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void; remove: (id: string) => void; getResponse: (id?: string) => string | undefined };
    onTurnstileReady?: () => void;
  }
}

export type TurnstileHandle = { token: () => Promise<string | undefined>; reset: () => void };
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
let loading: Promise<void> | null = null;

function load() {
  if (typeof window === "undefined" || window.turnstile) return Promise.resolve();
  loading ||= new Promise<void>((resolve) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true; s.defer = true; s.onload = () => resolve(); s.onerror = () => resolve();
    document.head.appendChild(s);
  });
  return loading;
}

/** Cloudflare Turnstile, verified on the server. Shows only when Cloudflare needs an interaction. Renders nothing without a site key. */
export const Turnstile = forwardRef<TurnstileHandle>(function Turnstile(_, ref) {
  const el = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const waiters = useRef<((t?: string) => void)[]>([]);
  const last = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    load().then(() => {
      if (cancelled || !el.current || !window.turnstile || id.current) return;
      id.current = window.turnstile.render(el.current, {
        sitekey: SITE_KEY, appearance: "interaction-only", theme: "light",
        callback: (t: string) => { last.current = t; waiters.current.splice(0).forEach((w) => w(t)); },
        "expired-callback": () => { last.current = undefined; },
        "error-callback": () => { waiters.current.splice(0).forEach((w) => w(undefined)); },
      });
    });
    return () => { cancelled = true; if (id.current && window.turnstile) window.turnstile.remove(id.current); id.current = null; };
  }, []);

  useImperativeHandle(ref, () => ({
    token: () => {
      if (!SITE_KEY) return Promise.resolve(undefined);
      if (last.current) return Promise.resolve(last.current);
      return new Promise((resolve) => { waiters.current.push(resolve); setTimeout(() => resolve(undefined), 15000); });
    },
    reset: () => { last.current = undefined; if (id.current && window.turnstile) window.turnstile.reset(id.current); },
  }), []);

  return SITE_KEY ? <div ref={el} className="turnstile" /> : null;
});
