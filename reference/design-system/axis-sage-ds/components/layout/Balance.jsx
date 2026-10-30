import React from "react";

/* Balance: every text block keeps an even shape.
   CSS `text-wrap: balance` evens blocks up to six lines. For longer blocks, and for any block whose
   last line still falls under two-thirds of its longest, this narrows the box a few pixels at a time
   (never more than 12%) until the last line carries its weight. Runs on load, on resize and on change. */
const SEL = "p, li, dd, dt, blockquote, figcaption, td, th, .t-body, .t-body-l, .t-small, [data-balance]";
const MIN = 0.66;
const SKIP = ".btn, .chip, .text-link, .nav-link, .t-label, [data-balance='off']";

function measure(el) {
  const r = document.createRange();
  r.selectNodeContents(el);
  const lines = {};
  for (const x of r.getClientRects()) {
    if (x.width < 1 || x.height < 4) continue;
    const k = Math.round(x.bottom / 4);
    const o = lines[k] || (lines[k] = { l: Infinity, r: -Infinity });
    o.l = Math.min(o.l, x.left); o.r = Math.max(o.r, x.right);
  }
  const ws = Object.keys(lines).map(Number).sort((a, b) => a - b).map((k) => lines[k].r - lines[k].l);
  if (ws.length < 2) return { n: ws.length, ratio: 1 };
  return { n: ws.length, ratio: ws[ws.length - 1] / Math.max(...ws) };
}

function words(el) { return (el.textContent || "").trim().split(/\s+/).length; }

function fit(el) {
  if (el.dataset.balW) { el.style.maxWidth = el.dataset.balOrig || ""; delete el.dataset.balW; }
  if (!el.offsetParent || words(el) < 5) return;
  const cs = getComputedStyle(el);
  if (!/^(block|list-item|table-cell)$/.test(cs.display)) return;
  const m = measure(el);
  if (m.n < 2 || m.ratio >= MIN) return;
  const w = el.getBoundingClientRect().width;
  const orig = el.style.maxWidth;
  let best = null;
  for (let s = 4; s <= w * 0.12; s += 4) {
    el.style.maxWidth = (w - s) + "px";
    const t = measure(el);
    if (t.ratio >= MIN && t.n <= m.n + 1) { best = w - s; break; }
  }
  if (best) { el.dataset.balOrig = orig; el.dataset.balW = String(best); el.style.maxWidth = best + "px"; }
  else el.style.maxWidth = orig;
}

/** Balance every text block under `root`. */
export function balanceText(root) {
  if (typeof document === "undefined") return;
  const scope = root || document;
  scope.querySelectorAll(SEL).forEach((el) => {
    if (el.closest(SKIP)) return;
    if (el.querySelector("p, li, div, blockquote, ul, ol, table")) return;
    fit(el);
  });
}

let started = false;
export function startBalance() {
  if (started || typeof window === "undefined") return;
  started = true;
  let t = 0;
  const run = () => { clearTimeout(t); t = setTimeout(() => balanceText(document), 120); };
  window.addEventListener("resize", run);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true, characterData: true });
  run();
}
if (typeof window !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startBalance);
  else startBalance();
}

/** Balance: a block that always keeps an even shape. Use for copy that sits outside p/li/dd/blockquote. */
export function Balance({ as = "div", children, ...rest }) {
  return React.createElement(as, { "data-balance": "", ...rest }, children);
}
