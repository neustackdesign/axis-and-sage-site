"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { WorkItem } from "@/lib/content/types";
import { actionLabel, actions, type ActionKey } from "@/lib/content/vocab";

type Kind = "engagement" | "role" | "founded";
/** Whose work it was: an Axis & Sage engagement, a founder's earlier role, or a venture they started. */
export const relationshipOf = (w: WorkItem): Kind => (w.provenance === "axisAndSage" ? "engagement" : w.roles.includes("FOUNDED") ? "founded" : "role");
const title = (r: string) => r.charAt(0) + r.slice(1).toLowerCase();

/** Reads ?action= (the footer's "Investors commit" and older links). Render inside Suspense. */
export function WorkIndexFromQuery(props: Omit<Parameters<typeof WorkIndex>[0], "action">) {
  const a = useSearchParams().get("action");
  const action = actions.some((x) => x.key === a) ? (a as ActionKey) : undefined;
  return <WorkIndex key={action ?? "all"} {...props} action={action} />;
}

/** Everything else, labelled: one ruled row per item, filterable by relationship, and by action when linked with one. */
export function WorkIndex({ items, labels, tags, action: initialAction }: { items: WorkItem[]; labels: Record<"all" | Kind, string>; tags: Record<Kind, string>; action?: ActionKey }) {
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [action, setAction] = useState(initialAction);
  const rows = (filter === "all" ? items : items.filter((w) => relationshipOf(w) === filter)).filter((w) => !action || w.actions.includes(action));
  const kinds = (["all", "engagement", "role", "founded"] as const).filter((k) => k === "all" || items.some((w) => relationshipOf(w) === k));
  return (
    <>
      <div className="row rv d1" style={{ marginTop: 24, gap: 12, justifyContent: "space-between" }}>
        <div className="chips" role="group" aria-label="Filter work">
          {kinds.map((k) => <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{labels[k]}</button>)}
          {action ? <button type="button" aria-pressed="true" aria-label={`${actionLabel(action)}: remove this filter`} onClick={() => setAction(undefined)}>{actionLabel(action)} ✕</button> : null}
        </div>
        <p className="lbl ink" aria-live="polite">{rows.length} shown</p>
      </div>
      <div className="rv d2" style={{ marginTop: 24 }} role="table" aria-label="Work">
        <div className="wr th" role="row"><span className="lbl" role="columnheader">Name</span><span className="lbl" role="columnheader">Relationship</span><span className="lbl" role="columnheader">Role</span><span className="lbl" role="columnheader">What moved</span></div>
        {rows.map((w) => (
          <div className="wr" role="row" key={w.slug}>
            <span role="cell">{w.hasCase ? <Link className="nm" href={`/work/${w.slug}`}>{w.name}</Link> : <span className="nm">{w.name}</span>}</span>
            <span role="cell"><span className="chip">{tags[relationshipOf(w)]}</span></span>
            <span className="lbl ink" role="cell">{w.roles.map(title).join(" · ")}</span>
            <span role="cell">{w.line}</span>
          </div>
        ))}
      </div>
    </>
  );
}
