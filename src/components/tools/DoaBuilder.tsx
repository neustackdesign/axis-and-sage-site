"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { bookCallHref } from "@/content/site";
import { currencies, defaultCode, doaAreas, doaCodeNames, doaCodes, doaLevels, type CurrencyCode, type DoaCode } from "@/content/tools";
import { Segmented, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";

type Cell = { code?: DoaCode; limit?: string };

/** Delegation of Authority Builder: setup, then an editable matrix of decision areas against approval levels. */
export function DoaBuilder() {
  const id = useId();
  const [structure, setStructure] = useState<"single" | "group">("single");
  const [revenue, setRevenue] = useState<number | "">("");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [levels, setLevels] = useState(() => doaLevels.map((name) => ({ name, on: name !== "Group CEO" && name !== "Board committee" })));
  const [areas, setAreas] = useState<string[]>(doaAreas.slice(0, 6));
  const [edits, setEdits] = useState<Record<string, Cell>>({});

  const active = useMemo(() => levels.filter((l) => l.on && (structure === "group" || l.name !== "Group CEO")).map((l) => l.name), [levels, structure]);
  const orderedAreas = doaAreas.filter((a) => areas.includes(a));
  const key = (a: string, l: string) => `${a}::${l}`;
  const cell = (a: string, l: string): Required<Cell> => ({ code: edits[key(a, l)]?.code ?? defaultCode(a, active.indexOf(l), active.length), limit: edits[key(a, l)]?.limit ?? "" });
  const edit = (a: string, l: string, patch: Cell) => setEdits((e) => ({ ...e, [key(a, l)]: { ...e[key(a, l)], ...patch } }));

  const move = (i: number, dir: -1 | 1) => setLevels((ls) => { const next = [...ls]; const j = i + dir; if (j < 0 || j >= next.length) return ls; [next[i], next[j]] = [next[j], next[i]]; return next; });

  const csv = () => {
    const rows = [["Decision area", ...active], ...orderedAreas.map((a) => [a, ...active.map((l) => { const c = cell(a, l); return `${c.code}${c.limit ? ` (${c.limit})` : ""}`; })])];
    return rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
  };
  const downloadCsv = () => {
    const blob = new Blob([csv()], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "delegation-of-authority.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const summary = () => [`Structure: ${structure === "group" ? "Group" : "Single company"}`, `Annual revenue: ${revenue === "" ? "not given" : `${currency} ${revenue.toLocaleString("en-GB")}`}`, "", csv()].join("\n");

  return (
    <div>
      <ToolPanel>
        <p className="t-label muted">SETUP</p>
        <div className="doa-setup" style={{ marginTop: 20 }}>
          <div className="tool-inputs">
            <div className="field"><span className="field-label">Structure</span><Segmented label="Structure" value={structure} onChange={setStructure} options={[{ key: "single", label: "Single company" }, { key: "group", label: "Group" }]} /></div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-rev`}>Annual revenue</label>
              <div className="number-field"><span className="number-affix">{currency}</span><input id={`${id}-rev`} className="field-control" type="number" inputMode="numeric" min={0} value={revenue} onChange={(e) => setRevenue(e.target.value === "" ? "" : Number(e.target.value))} /></div>
              <span className="field-help">Used to size the limits you set below.</span>
            </div>
            <Segmented label="Currency" value={currency} onChange={setCurrency} options={currencies.map((c) => ({ key: c.code, label: c.code }))} />
          </div>
          <div>
            <span className="field-label">Approval levels</span>
            <p className="field-help" style={{ margin: "4px 0 8px" }}>Highest first. Switch off the ones you don&apos;t have.</p>
            <ul className="level-list">
              {levels.map((l, i) => {
                const hidden = structure === "single" && l.name === "Group CEO";
                return (
                  <li key={l.name} style={hidden ? { opacity: 0.4 } : undefined}>
                    <input type="checkbox" aria-label={`Include ${l.name}`} checked={l.on && !hidden} disabled={hidden} onChange={(e) => setLevels((ls) => ls.map((x) => x.name === l.name ? { ...x, on: e.target.checked } : x))} style={{ width: 20, height: 20, accentColor: "var(--charcoal-900)" }} />
                    <span>{l.name}{hidden ? " · groups only" : ""}</span>
                    <span style={{ display: "flex", gap: 4 }}>
                      <button type="button" className="icon-btn" aria-label={`Move ${l.name} up`} disabled={i === 0} onClick={() => move(i, -1)}>▲</button>
                      <button type="button" className="icon-btn" aria-label={`Move ${l.name} down`} disabled={i === levels.length - 1} onClick={() => move(i, 1)}>▼</button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
            <legend className="field-label">Decision areas</legend>
            <div className="check-list" style={{ marginTop: 12 }}>
              {doaAreas.map((a) => <label key={a} className="check"><input type="checkbox" checked={areas.includes(a)} onChange={(e) => setAreas((xs) => e.target.checked ? [...xs, a] : xs.filter((x) => x !== a))} /><span>{a}</span></label>)}
            </div>
          </fieldset>
        </div>
      </ToolPanel>

      <ToolPanel>
        <div className="tool-head"><p className="t-label muted">THE MATRIX</p><p className="t-label muted">{orderedAreas.length} AREAS · {active.length} LEVELS</p></div>
        {!active.length || !orderedAreas.length ? (
          <div className="work-empty" style={{ marginTop: 20 }}>
            <p className="t-h3">{!active.length ? "Choose at least one approval level." : "Choose at least one decision area."}</p>
            <p className="muted">The matrix appears as soon as there is something to fill in.</p>
          </div>
        ) : (
          <>
            <div className="matrix-wrap" style={{ marginTop: 20 }}>
              <table className="matrix">
                <caption className="sr-only">Delegation of authority: decision areas by approval level</caption>
                <thead><tr><th scope="col">Decision area</th>{active.map((l) => <th key={l} scope="col">{l}</th>)}</tr></thead>
                <tbody>
                  {orderedAreas.map((a) => (
                    <tr key={a}>
                      <th scope="row">{a}</th>
                      {active.map((l) => {
                        const c = cell(a, l);
                        return (
                          <td key={l}>
                            <div className="matrix-cell">
                              <select aria-label={`${a}, ${l}: role`} className={c.code === "A" ? "is-a" : undefined} value={c.code} onChange={(e) => edit(a, l, { code: e.target.value as DoaCode })}>
                                {doaCodes.map((code) => <option key={code} value={code}>{code} · {doaCodeNames[code]}</option>)}
                              </select>
                              {c.code === "A" || c.code === "R" ? <input aria-label={`${a}, ${l}: limit`} placeholder={`Limit, ${currency}`} value={c.limit} onChange={(e) => edit(a, l, { limit: e.target.value })} /> : null}
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
          </>
        )}
        <div className="tool-actions">
          <ToolEmail tool="Delegation of Authority Builder" label="Download .xlsx" summary={summary} successText="Done. We'll send the .xlsx to your inbox." />
          <button type="button" className="btn btn-secondary" onClick={downloadCsv} disabled={!active.length || !orderedAreas.length}>Download .csv now</button>
          <Link className="text-link" href={bookCallHref} style={{ alignSelf: "center" }}>Book a call<span className="text-link-arrow" aria-hidden="true">▸</span></Link>
        </div>
      </ToolPanel>
    </div>
  );
}
