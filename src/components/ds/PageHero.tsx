import type { ReactNode } from "react";
import { Opening } from "@/components/v26/blocks";

/** Page hero: the 2026 opening on every page. Headline and subcopy run the grid width; the folio closes the row. */
export function PageHero({ label, title, sub, children }: { label: string; title: ReactNode; sub?: ReactNode; children?: ReactNode; display?: boolean }) {
  return <div className="v26"><Opening label={label} title={title} sub={sub}>{children}</Opening></div>;
}
