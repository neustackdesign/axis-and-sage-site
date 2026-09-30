"use client";

import Link from "next/link";
import { useCallback, useId, useMemo, useState } from "react";
import { bookCallHref } from "@/content/site";
import { currencies, doaAreas, doaCodeNames, doaCodes, doaLevels, doaLimitShares, doaMonetaryAreas, doaUnbudgetedArea, type CurrencyCode, type DoaCode } from "@/content/tools";
import { buildMatrix, footnotes, limitTier, type DoaCell } from "@/lib/tools/doa";
import { doaWorkbook } from "@/lib/tools/xlsx";
import { Segmented, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolEvents } from "./useTool";

type Edit = { code?: DoaCode; limit?: string };
type State = { structure: "single" | "group"; revenue: number | ""; currency: CurrencyCode; levels: { name: string; on: boolean }[]; areas: string[]; edits: Record<string, Edit> };
const initial: State = { structure: "single", revenue: "", currency: "USD", levels: doaLevels.map((name) => ({ name, on: name !== "Group CEO" && name !== "Board committee" })), areas: doaAreas.slice(0, 6), edits: {} };
const fmt = (n: number | null) => (n === null ? "" : Math.round(n).toLocaleString("en-GB"));

/** Delegation of Authority Builder: setup, then an editable matrix. Defaults come from lib/tools/doa. */
export function DoaBuilder() {
  const id = useId();
  const events = useToolEvents("Delegation of Authority Builder");
  const [s, setS] = useState<State>(initial);
  useHashRestore<State>(useCallback((r) => setS({ ...initial, ...r }), []));
  const set = (patch: Partial<State>) => { events.start(); setS((cur) => ({ ...cur, ...patch })); };

  const active = useMemo(() => s.levels.filter((l) => l.on && (s.structure === "group" || l.name !== "Group CEO")).map((l) => l.name), [s.levels, s.structure]);
  const areas = doaAreas.filter((a) => s.areas.includes(a));
  const revenue = s.revenue === "" ? null : s.revenue;
  const defaults = useMemo(() => buildMatrix(areas, active, revenue, s.structure), [areas, active, revenue, s.structure]);
  const key = (a: string, l: string) => `${a}::${l}`;
  const cell = (r: number, c: number): DoaCell => {
    const e = s.edits[key(areas[r], active[c])];
    const d = defaults[r][c];
    return { code: e?.code ?? d.code, limit: e?.limit !== undefined ? (e.limit === "" ? null : Number(e.limit.replace(/[^\d.]/g, "")) || null) : d.limit, note: e ? undefined : d.note };
  };
  const edit = (a: string, l: string, patch: Edit) => { events.start(); setS((cur) => ({ ...cur, edits: { ...cur.edits, [key(a, l)]: { ...cur.edits[key(a, l)], ...patch } } })); };
  const move = (i: number, dir: -1 | 1) => setS((cur) => { const next = [...cur.levels]; const j = i + dir; if (j < 0 || j >= next.length) return cur; [next[i], next[j]] = [next[j], next[i]]; return { ...cur, levels: next }; });
  const cells = areas.map((_, r) => active.map((__, c) => cell(r, c)));
  const text = () => [`Structure: ${s.structure === "group" ? "Group" : "Single company"}`, `Annual revenue: ${revenue === null ? "not given" : `${s.currency} ${revenue.toLocaleString("en-GB")}`}`, "", ...areas.map((a, r) => `${a}\n${active.map((l, c) => { const x = cells[r][c]; return `  ${l}: ${x.code}${x.limit ? ` up to ${s.currency} ${fmt(x.limit)}` : ""}${x.note ? ` (${x.note})` : ""}`; }).join("\n")}`), "", ...footnotes].join("\n");
  const empty = !active.length || !areas.length;

  return (
    <div>
      <ToolPanel>
        <p className="t-label muted">SETUP</p>
        <div className="doa-setup" style={{ marginTop: 20 }}>
          <div className="tool-inputs">
            <div className="field"><span className="field-label">Structure</span><Segmented label="Structure" value={s.structure} onChange={(structure) => set({ structure })} options={[{ key: "single", label: "Single company" }, { key: "group", label: "Group" }]} /></div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-rev`}>Annual revenue</label>
              <div className="number-field"><span className="number-affix">{s.currency}</span><input id={`${id}-rev`} className="field-control" type="number" inputMode="numeric" min={0} value={s.revenue} onChange={(e) => set({ revenue: e.target.value === "" ? "" : Number(e.target.value) })} /></div>
              <span className="field-help">Sets the limits: {doaLimitShares.map((x) => `${(x * 100).toFixed(2).replace(/\.?0+$/, "")}%`).join(", ")} of revenue, rounded.</span>
            </div>
            <Segmented label="Currency" value={s.currency} onChange={(currency) => set({ currency })} options={currencies.map((c) => ({ key: c.code, label: c.code }))} />
          </div>
          <div>
            <span className="field-label">Approval levels</span>
            <p className="field-help" style={{ margin: "4px 0 8px" }}>Highest first. Switch off the ones you don&apos;t have.</p>
            <ul className="level-list">
              {s.levels.map((l, i) => {
                const hidden = s.structure === "single" && l.name === "Group CEO";
                return (
                  <li key={l.name} style={hidden ? { opacity: 0.4 } : undefined}>
                    <input type="checkbox" aria-label={`Include ${l.name}`} checked={l.on && !hidden} disabled={hidden} onChange={(e) => set({ levels: s.levels.map((x) => x.name === l.name ? { ...x, on: e.target.checked } : x) })} style={{ width: 20, height: 20, accentColor: "var(--charcoal-900)" }} />
                    <span>{l.name}{hidden ? " · groups only" : ""}</span>
                    <span style={{ display: "flex", gap: 4 }}>
                      <button type="button" className="icon-btn" aria-label={`Move ${l.name} up`} disabled={i === 0} onClick={() => move(i, -1)}>▲</button>
                      <button type="button" className="icon-btn" aria-label={`Move ${l.name} down`} disabled={i === s.levels.length - 1} onClick={() => move(i, 1)}>▼</button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
            <legend className="field-label">Decision areas</legend>
            <div className="check-list" style={{ marginTop: 12 }}>
              {doaAreas.map((a) => <label key={a} className="check"><input type="checkbox" checked={s.areas.includes(a)} onChange={(e) => set({ areas: e.target.checked ? [...s.areas, a] : s.areas.filter((x) => x !== a) })} /><span>{a}</span></label>)}
            </div>
          </fieldset>
        </div>
      </ToolPanel>

      <ToolPanel>
        <div className="tool-head"><p className="t-label muted">THE MATRIX</p><p className="t-label muted">{areas.length} AREAS · {active.length} LEVELS</p></div>
        {empty ? (
          <div className="work-empty" style={{ marginTop: 20 }}>
            <p className="t-h3">{!active.length ? "Choose at least one approval level." : "Choose at least one decision area."}</p>
            <p className="muted">The matrix appears as soon as there is something to fill in.</p>
          </div>
        ) : (
          <>
            {revenue === null ? <p className="tool-note" style={{ marginTop: 12 }}>Add annual revenue above to fill in the monetary limits.</p> : null}
            <div className="matrix-wrap" style={{ marginTop: 20 }}>
              <table className="matrix">
                <caption className="sr-only">Delegation of authority: decision areas by approval level</caption>
                <thead><tr><th scope="col">Decision area</th>{active.map((l) => <th key={l} scope="col">{l}</th>)}</tr></thead>
                <tbody>
                  {areas.map((a, r) => (
                    <tr key={a}>
                      <th scope="row">{a}</th>
                      {active.map((l, c) => {
                        const x = cells[r][c];
                        const e = s.edits[key(a, l)];
                        return (
                          <td key={l}>
                            <div className="matrix-cell">
                              <select aria-label={`${a}, ${l}: role`} className={x.code === "A" ? "is-a" : undefined} value={x.code} onChange={(ev) => edit(a, l, { code: ev.target.value as DoaCode })}>
                                {doaCodes.map((code) => <option key={code} value={code}>{code} · {doaCodeNames[code]}</option>)}
                              </select>
                              {x.code === "A" || x.code === "R" ? <input aria-label={`${a}, ${l}: limit`} inputMode="numeric" placeholder={x.note ? "No cap" : `Limit, ${s.currency}`} value={e?.limit ?? fmt(x.limit)} onChange={(ev) => edit(a, l, { limit: ev.target.value })} /> : null}
                              {x.note ? <span className="t-label muted" style={{ fontSize: 10 }}>{x.note.toUpperCase()}</span> : null}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="matrix-legend t-label">{doaCodes.map((c) => <span key={c}>{c} · {doaCodeNames[c].toUpperCase()}</span>)}</p>
            <ol className="tool-note" style={{ marginTop: 16, paddingLeft: 18, listStyle: "decimal" }}>{footnotes.map((f) => <li key={f}>{f}</li>)}</ol>
          </>
        )}
        <div className="tool-actions">
          {!empty ? (
            <ToolEmail
              tool="Delegation of Authority Builder" label="Download .xlsx" summary={text} result={() => ({ structure: s.structure, revenue, currency: s.currency, levels: active, areas, cells })} shareUrl={() => toolShareUrl(s)}
              download={{ filename: "delegation-of-authority.xlsx", build: () => doaWorkbook({ areas, levels: active, cells, edited: areas.map((a) => active.map((l) => !!s.edits[key(a, l)])), revenue, currency: s.currency, shares: doaLimitShares, tiers: areas.map((a) => active.map((_, c) => (doaMonetaryAreas.includes(a) ? limitTier(c, active.length, a === doaUnbudgetedArea) : "top"))), footnotes }) }}
            />
          ) : null}
          <Link className="text-link" href={bookCallHref} style={{ alignSelf: "center" }}>Book a call<span className="text-link-arrow" aria-hidden="true">▸</span></Link>
        </div>
      </ToolPanel>
    </div>
  );
}
