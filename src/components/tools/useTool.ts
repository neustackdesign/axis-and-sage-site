"use client";

import { useCallback, useEffect, useRef } from "react";
import { recordToolComplete } from "@/lib/client/analytics";
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

/** Records one anonymous "Tools" row per result, the first time a result is shown. */
export function useToolComplete(tool: string) {
  const done = useRef(false);
  return useCallback((answers: unknown, result: unknown) => {
    if (done.current) return;
    done.current = true;
    recordToolComplete(tool, answers, result);
  }, [tool]);
}

export const toolShareUrl = (state: unknown) => shareUrl(window.location.origin, window.location.pathname, state);
