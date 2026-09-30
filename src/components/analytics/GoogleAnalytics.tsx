"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const KEY = "as_consent";

/** GA4 with Consent Mode v2. Off unless NEXT_PUBLIC_GA_ID is set; storage is denied until the visitor accepts. */
export function GoogleAnalytics() {
  const [choice, setChoice] = useState<"granted" | "denied" | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(KEY); } catch { /* storage blocked */ }
    // Reading localStorage must wait for the client; this runs once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(stored === "granted" || stored === "denied" ? stored : null);
    setReady(true);
  }, []);
  if (!GA_ID) return null;

  const decide = (value: "granted" | "denied") => {
    try { localStorage.setItem(KEY, value); } catch { /* ignore */ }
    window.gtag?.("consent", "update", { analytics_storage: value });
    setChoice(value);
  };

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:(function(){try{return localStorage.getItem('${KEY}')==='granted'?'granted':'denied'}catch(e){return 'denied'}})()});gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}</Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      {ready && !choice ? (
        <div className="consent-bar" role="region" aria-label="Analytics consent">
          <p className="t-small">We use Google Analytics to see which pages help. Nothing is stored unless you agree.</p>
          <div className="button-row">
            <button type="button" className="btn btn-dark btn-sm" onClick={() => decide("granted")}>Accept</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => decide("denied")}>Decline</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
