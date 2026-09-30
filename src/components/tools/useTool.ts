"use client";

import { useCallback, useEffect, useRef } from "react";
import { recordToolComplete, trackEvent } from "@/lib/client/analytics";
import { readHashState, shareUrl } from "@/lib/tools/share";

/** Restores tool state from a shared result link (#r=...) once, after mount. */
export function useHashRestore<T>(apply: (state: T) => void) {
  const applied = useRef(false);
  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    const s = readHashState<T>(window.location.hash);
    if (s) apply(s);
  }, [apply]);
}

/** tool_start on first interaction, tool_step on each step, tool_complete once per result. */
export function useToolEvents(tool: string) {
  const started = useRef(false);
  const completed = useRef(false);
  const start = useCallback(() => { if (!started.current) { started.current = true; trackEvent("tool_start", { tool }); } }, [tool]);
  const step = useCallback((name: string) => { start(); trackEvent("tool_step", { tool, step: name }); }, [start, tool]);
  const complete = useCallback((meta: Record<string, string | number | boolean | null> = {}) => { if (!completed.current) { completed.current = true; recordToolComplete(tool, meta); } }, [tool]);
  return { start, step, complete };
}

export const toolShareUrl = (state: unknown) => shareUrl(window.location.origin, window.location.pathname, state);
