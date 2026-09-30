"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WorkCard } from "@/components/ds/blocks";
import { actions, roles, type ActionKey, type Role, type WorkItem } from "@/content/work";

/** Filter chips for the work index. State lives in the URL so filters can be linked from the footer and case pages. */
export function WorkFilter({ items }: { items: WorkItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const action = (actions.find((a) => a.key === params.get("action"))?.key || null) as ActionKey | null;
  const roleParam = params.get("role")?.toUpperCase();
  const role = (roles.find((r) => r === roleParam) || null) as Role | null;

  const set = (key: "action" | "role", value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const shown = items.filter((w) => (!action || w.actions.includes(action)) && (!role || w.roles.includes(role)));

  return (
    <div>
      <div className="work-filters">
        <div className="work-filter-group" role="group" aria-labelledby="filter-action">
          <span id="filter-action" className="t-label muted">ACTION</span>
          <div className="chip-row">
            {actions.map((a) => <button key={a.key} type="button" className="chip chip-conversion" aria-pressed={action === a.key} onClick={() => set("action", action === a.key ? null : a.key)}>{action === a.key ? "✓ " : ""}{a.label.toUpperCase()}</button>)}
          </div>
        </div>
        <div className="work-filter-group" role="group" aria-labelledby="filter-role">
          <span id="filter-role" className="t-label muted">ROLE</span>
          <div className="chip-row">
            {roles.map((r) => <button key={r} type="button" className="chip" aria-pressed={role === r} onClick={() => set("role", role === r ? null : r.toLowerCase())}>{role === r ? "✓ " : ""}{r}</button>)}
          </div>
        </div>
        <p className="work-filter-count t-label" aria-live="polite">
          {shown.length} OF {items.length}
          {action || role ? <button type="button" className="work-filter-clear" onClick={() => router.replace(pathname, { scroll: false })}>CLEAR FILTERS</button> : null}
        </p>
      </div>
      {shown.length ? (
        <div className="work-grid">{shown.map((w) => <WorkCard key={w.slug} item={w} />)}</div>
      ) : (
        <div className="work-empty">
          <p className="t-h3">Nothing matches both filters yet.</p>
          <button type="button" className="text-link" style={{ background: "none", border: 0, padding: 0 }} onClick={() => router.replace(pathname, { scroll: false })}>Clear filters<span className="text-link-arrow" aria-hidden="true">▸</span></button>
        </div>
      )}
    </div>
  );
}
