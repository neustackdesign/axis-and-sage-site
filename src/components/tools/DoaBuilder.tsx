"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { bookCallHref } from "@/lib/routes";
import {
  currencies, doaAreas, doaBands, doaBookCopy, doaCodeNames, doaCodes, doaFootnotes, doaGroupCeoShare, doaLevelNotes, doaLevels,
  type CurrencyCode, type DoaArea, type DoaCode, type DoaLevel,
} from "@/lib/tools/spec";
import { buildMatrix, formatCell, levelLabel, type DoaCell, type Structure } from "@/lib/tools/doa";
import { doaWorkbook } from "@/lib/tools/xlsx";
import { Segmented, ToolDisclaimer, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolComplete } from "./useTool";

type Edit = { code?: DoaCode; limit?: string };
type Num = number | "";
type State = { structure: Structure; revenue: Num; groupRevenue: Num; currency: CurrencyCode; levels: { name: DoaLevel; on: boolean }[]; areas: DoaArea[]; edits: Record<string, Edit> };
const initial: State = { structure: "single", revenue: "", groupRevenue: "", currency: "NGN", levels: doaLevels.map((name) => ({ name, on: true })), areas: [...doaAreas], edits: {} };
const fmt = (n: number | null) => (n === null ? "" : Math.round(n).toLocaleString("en-GB"));
const pctText = (x: number) => `${Number((x * 100).toFixed(2))}%`;

/** Delegation of Authority Builder: setup, then an editable matrix. Defaults come from lib/tools/doa. */
export function DoaBuilder() {
  const id = useId();
  const complete = useToolComplete("Delegation of Authority Builder");
  const [s, setS] = useState<State>(initial);
  const [touched, setTouched] = useState(false);
  useHashRestore<State>(useCallback((r) => setS({ ...initial, ...r }), []));
  const set = (patch: Partial<State>) => { setTouched(true); setS((cur) => ({ ...cur, ...patch })); };

  const group = s.structure === "group";
  const active = useMemo(() => s.levels.filter((l) => l.on && (group || l.name !== "Group CEO")).map((l) => l.name), [s.levels, group]);
  const areas = doaAreas.filter((a) => s.areas.includes(a));
  const revenue = s.revenue === "" ? null : s.revenue;
  const groupRevenue = s.groupRevenue === "" ? null : s.groupRevenue;
  const defaults = useMemo(() => buildMatrix(areas, active, revenue, s.structure, groupRevenue), [areas, active, revenue, s.structure, groupRevenue]);
  const key = (a: string, l: string) => `${a}::${l}`;
  const cell = (r: number, c: number): DoaCell => {
    const e = s.edits[key(areas[r], active[c])];
    const d = defaults[r][c];
    if (!e) return d;
    const limit = e.limit !== undefined ? (e.limit.trim() === "" ? null : Number(e.limit.replace(/[^\d.]/g, "")) || null) : d.limit;
    return { ...d, code: e.code ?? d.code, limit, band: undefined };
  };
  const edit = (a: string, l: string, patch: Edit) => { setTouched(true); setS((cur) => ({ ...cur, edits: { ...cur.edits, [key(a, l)]: { ...cur.edits[key(a, l)], ...patch } } })); };
  const move = (i: number, dir: -1 | 1) => setS((cur) => { const next = [...cur.levels]; const j = i + dir; if (j < 0 || j >= next.length) return cur; [next[i], next[j]] = [next[j], next[i]]; return { ...cur, levels: next }; });
  const cells = areas.map((_, r) => active.map((__, c) => cell(r, c)));
  const labels = active.map((l) => levelLabel(l, s.structure));
  const empty = !active.length || !areas.length;

  useEffect(() => {
    if (!touched || empty) return;
    const t = setTimeout(() => complete({ structure: s.structure, currency: s.currency, revenue, groupRevenue, levels: active, areas: areas.length, edits: Object.keys(s.edits).length }, { cells: areas.length * active.length }), 4000);
    return () => clearTimeout(t);
  }, [touched, empty, complete, s.structure, s.currency, revenue, groupRevenue, active, areas.length, s.edits]);

  const text = () => [
    `Structure: ${group ? "Group with subsidiaries" : "Single company"}`,
    `Annual revenue${group ? " (subsidiary)" : ""}: ${revenue === null ? "not given" : `${s.currency} ${revenue.toLocaleString("en-GB")}`}`,
    ...(group ? [`Group revenue: ${groupRevenue === null ? "not given" : `${s.currency} ${groupRevenue.toLocaleString("en-GB")}`}`] : []),
    "",
    ...areas.map((a, r) => `${a}\n${labels.map((l, c) => `  ${l}: ${formatCell(cells[r][c], s.currency, true)}`).join("\n")}`),
    "",
    ...doaFootnotes.map((f, n) => `${n + 1}. ${f}`),
  ].join("\n");

  return (
    <div>
      <ToolPanel>
        <p className="t-label muted">SETUP</p>
        <div className="doa-setup" style={{ marginTop: 20 }}>
          <div className="tool-inputs">
            <div className="field"><span className="field-label">Structure</span><Segmented label="Structure" value={s.structure} onChange={(structure) => set({ structure })} options={[{ key: "single", label: "Single company" }, { key: "group", label: "Group with subsidiaries" }]} /></div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-rev`}>{group ? "Annual revenue of the subsidiary" : "Annual revenue"}</label>
              <div className="number-field"><span className="number-affix">{s.currency}</span><input id={`${id}-rev`} className="field-control" type="number" inputMode="numeric" min={0} value={s.revenue} onChange={(e) => set({ revenue: e.target.value === "" ? "" : Number(e.target.value) })} /></div>
              <span className="field-help">Sets the limits: {doaBands.map((b) => `${b.level} ${pctText(b.share)}`).join(", ")} of revenue, rounded to 2 significant figures. The Board approves above that.</span>
            </div>
            {group ? (
              <div className="field">
                <label className="field-label" htmlFor={`${id}-grev`}>Group revenue</label>
                <div className="number-field"><span className="number-affix">{s.currency}</span><input id={`${id}-grev`} className="field-control" type="number" inputMode="numeric" min={0} value={s.groupRevenue} onChange={(e) => set({ groupRevenue: e.target.value === "" ? "" : Number(e.target.value) })} /></div>
                <span className="field-help">The Group CEO approves above the subsidiary limit, up to {pctText(doaGroupCeoShare)} of group revenue.</span>
              </div>
            ) : null}
            <Segmented label="Currency" value={s.currency} onChange={(currency) => set({ currency })} options={currencies.map((c) => ({ key: c.code, label: c.code }))} />
          </div>
          <div>
            <span className="field-label">Approval levels</span>
            <p className="field-help" style={{ margin: "4px 0 8px" }}>Highest first. Switch off the ones you don&apos;t have.</p>
            <ul className="level-list">
              {s.levels.map((l, i) => {
                const hidden = !group && l.name === "Group CEO";
                const note = doaLevelNotes[l.name];
                return (
                  <li key={l.name} style={hidden ? { opacity: 0.4 } : undefined}>
                    <input type="checkbox" aria-label={`Include ${levelLabel(l.name, s.structure)}`} checked={l.on && !hidden} disabled={hidden} onChange={(e) => set({ levels: s.levels.map((x) => x.name === l.name ? { ...x, on: e.target.checked } : x) })} style={{ width: 20, height: 20, accentColor: "var(--charcoal-900)" }} />
                    <span>{levelLabel(l.name, s.structure)}{note ? <span className="muted"> · {note.toLowerCase()}</span> : null}</span>
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
                <thead><tr><th scope="col">Decision area</th>{labels.map((l) => <th key={l} scope="col">{l}</th>)}</tr></thead>
                <tbody>
                  {areas.map((a, r) => (
                    <tr key={a}>
                      <th scope="row">{a}</th>
                      {active.map((l, c) => {
                        const x = cells[r][c];
                        const e = s.edits[key(a, l)];
                        const label = labels[c];
                        return (
                          <td key={l}>
                            <div className="matrix-cell">
                              <select aria-label={`${a}, ${label}: role`} className={x.code === "A" ? "is-a" : undefined} value={x.code} onChange={(ev) => edit(a, l, { code: ev.target.value as DoaCode })}>
                                {doaCodes.map((code) => <option key={code} value={code}>{code} · {doaCodeNames[code]}</option>)}
                              </select>
                              {x.op ? (
                                <span className="matrix-limit">
                                  <span aria-hidden="true">{x.op}</span>
                                  <input aria-label={`${a}, ${label}: limit ${x.op === ">" ? "above" : "up to"}${x.unit === "pct" ? ", %" : `, ${s.currency}`}`} inputMode="numeric" placeholder={x.unit === "pct" ? "%" : s.currency} value={e?.limit ?? (x.unit === "pct" ? String(x.limit ?? "") : fmt(x.limit))} onChange={(ev) => edit(a, l, { limit: ev.target.value })} />
                                  {x.unit === "pct" ? <span aria-hidden="true">%</span> : null}
                                </span>
                              ) : null}
                              {x.limit !== null && x.unit === "money" ? <span className="t-label muted" style={{ fontSize: 10 }}>{formatCell({ ...x, note: undefined }, s.currency)}</span> : null}
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
            <ol className="tool-note" style={{ marginTop: 16, paddingLeft: 18, listStyle: "decimal" }}>{doaFootnotes.map((f) => <li key={f}>{f}</li>)}</ol>
          </>
        )}
        <p className="t-body-l" style={{ marginTop: 32, maxWidth: 720 }}>{doaBookCopy}</p>
        <div className="tool-actions">
          <Link className="btn btn-primary" href={bookCallHref}>Book a call</Link>
          {!empty ? (
            <ToolEmail
              tool="Delegation of Authority Builder" label="Download .xlsx" summary={text} result={() => ({ structure: s.structure, revenue, groupRevenue, currency: s.currency, levels: labels, areas, cells: cells.map((row) => row.map((x) => formatCell(x, s.currency, true))) })} shareUrl={() => toolShareUrl(s)}
              download={{ filename: "delegation-of-authority.xlsx", build: () => doaWorkbook({ areas, levels: active, labels, cells, edited: areas.map((a) => active.map((l) => !!s.edits[key(a, l)])), revenue, groupRevenue, group, currency: s.currency, footnotes: doaFootnotes }) }}
            />
          ) : null}
        </div>
        <ToolDisclaimer />
      </ToolPanel>
    </div>
  );
}
