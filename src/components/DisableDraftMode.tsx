"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();
  if (isPresentationTool) return null;
  return <a className="draft-mode-indicator" href="/api/draft-mode/disable">Disable draft mode</a>;
}
