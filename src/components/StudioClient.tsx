"use client";

import { Studio } from "sanity";
import config from "../../sanity.config";

export function StudioClient() {
  return <div className="studio-shell"><Studio config={config} /></div>;
}
