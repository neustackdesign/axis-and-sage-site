"use client";

import type { LiftMode } from "@/content/tools";
import type { DoaCell } from "./doa";
import type { EsopInput } from "./esop";

// Workbooks are built in the browser with ExcelJS (loaded only when needed) and carry live formulas.

async function workbook() {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Axis & Sage Advisory";
  wb.created = new Date();
  return wb;
}

type Sheet = Awaited<ReturnType<typeof workbook>>["worksheets"][number];
const head = (ws: Sheet, row: number) => { ws.getRow(row).font = { bold: true }; };
const input = (ws: Sheet, cell: string) => { ws.getCell(cell).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE5EAD8" } }; };

async function toBlob(wb: Awaited<ReturnType<typeof workbook>>) {
  const buf = await wb.xlsx.writeBuffer();
  return new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export async function liftWorkbook(i: { mode: LiftMode; modeLabel: string; baseLabel: string; rateLabel: string; valueLabel: string; base: number; rate: number; lift: number; target: number; value: number; currency: string; diagnosticPrice: number | null }) {
  const wb = await workbook();
  const ws = wb.addWorksheet("Lift model");
  ws.columns = [{ width: 52 }, { width: 20 }, { width: 44 }];
  ws.addRow(["What's a lift worth?", i.modeLabel]); head(ws, 1);
  ws.addRow([]);
  ws.addRow(["Inputs (edit the green cells)", "Value", "Notes"]); head(ws, 3);
  ws.addRow([i.baseLabel, i.base]); input(ws, "B4");
  ws.addRow([`${i.rateLabel} (%)`, i.rate]); input(ws, "B5");
  if (i.mode === "team") ws.addRow(["Target share (%)", i.target, "r1: the share you want"]);
  else ws.addRow(["Lift you want (percentage points)", i.lift]);
  input(ws, "B6");
  ws.addRow([`Value per action (${i.currency})`, i.value]); input(ws, "B7");
  ws.addRow([`Diagnostic fee (${i.currency})`, i.diagnosticPrice ?? "", "Leave blank if not set"]); input(ws, "B8");
  ws.addRow([]);
  ws.addRow(["Outputs", "Value"]); head(ws, 10);
  const points = i.mode === "team" ? "MAX(0,MIN(100,B6)-B5)" : "MAX(0,MIN(100,B5+B6)-B5)";
  ws.addRow(["Lift in points", { formula: points }]);
  ws.addRow(["Extra actions per month", { formula: "B4*B11/100" }]);
  ws.addRow([`Extra value per month (${i.currency})`, { formula: "B12*B7" }]);
  ws.addRow([`Extra value per year (${i.currency})`, { formula: "B13*12" }]);
  ws.addRow([`Each point of lift, per month (${i.currency})`, { formula: "B4/100*B7" }]);
  ws.addRow(["Months to pay back the Diagnostic", { formula: 'IF(AND(ISNUMBER(B8),B8>0,B13>0),ROUNDUP(B8/B13,1),"")' }]);
  ["B13", "B14", "B15"].forEach((c) => { ws.getCell(c).numFmt = "#,##0"; });
  return toBlob(wb);
}

export async function doaWorkbook(i: { areas: string[]; levels: string[]; cells: DoaCell[][]; edited: boolean[][]; revenue: number | null; currency: string; shares: number[]; tiers: (number | "top" | "recommend")[][]; footnotes: string[] }) {
  const wb = await workbook();
  const set = wb.addWorksheet("Settings");
  set.columns = [{ width: 36 }, { width: 18 }];
  set.addRow(["Delegation of authority · settings"]); head(set, 1);
  set.addRow([`Annual revenue (${i.currency})`, i.revenue ?? 0]); input(set, "B2");
  set.getCell("B2").numFmt = "#,##0";
  set.addRow([]);
  set.addRow(["Limit tier", "Share of revenue"]); head(set, 4);
  i.shares.forEach((s, k) => { set.addRow([`Tier ${k + 1}`, s]); set.getCell(`B${5 + k}`).numFmt = "0.00%"; input(set, `B${5 + k}`); });

  const ws = wb.addWorksheet("Matrix");
  ws.columns = [{ width: 36 }, ...i.levels.map(() => ({ width: 22 }))];
  ws.addRow(["Decision area", ...i.levels]); head(ws, 1);
  i.areas.forEach((area, r) => {
    const row = ws.addRow([area]);
    i.levels.forEach((_, c) => {
      const cell = i.cells[r][c];
      const tier = i.tiers[r][c];
      const target = row.getCell(c + 2);
      if (cell.code === "A" && typeof tier === "number" && !i.edited[r][c]) {
        // Live formula: revenue × tier share, rounded to 2 significant figures.
        const x = `Settings!$B$2*Settings!$B$${5 + tier}`;
        target.value = { formula: `IF(${x}>0,"A up to "&TEXT(ROUND(${x},1-INT(LOG10(ABS(${x})))),"#,##0"),"A")` };
      } else {
        target.value = `${cell.code}${cell.limit ? ` up to ${Math.round(cell.limit).toLocaleString("en-GB")}` : ""}${cell.note ? ` (${cell.note})` : ""}`;
      }
    });
  });
  ws.addRow([]);
  ws.addRow(["A approves · R recommends · C consulted · I informed · – no role"]);
  i.footnotes.forEach((f) => ws.addRow([f]));
  return toBlob(wb);
}

export async function esopWorkbook(i: EsopInput & { currency: string }) {
  const wb = await workbook();
  const ws = wb.addWorksheet("ESOP model");
  ws.columns = [{ width: 44 }, { width: 20 }];
  ws.addRow(["ESOP & share pool model"]); head(ws, 1);
  ws.addRow(["Inputs (edit the green cells)", "Value"]); head(ws, 2);
  const rows: [string, number | string][] = [
    ["Shares in issue today", i.shares], ["Founders' shares", i.founders], ["Pool (% after creation)", i.poolPct / 100], ["Grant (% of company)", i.grantPct / 100],
    [`Current valuation (${i.currency})`, i.valuation], [`Exit valuation (${i.currency})`, i.exit], [`Strike price per share (${i.currency}, blank = today's price)`, i.strike ?? ""],
    ["Vesting (years)", i.years], ["Cliff (months)", i.cliffMonths], ["Dilution in one more round (%)", i.round ? i.dilutionPct / 100 : 0],
  ];
  rows.forEach(([k, v], n) => { ws.addRow([k, v]); input(ws, `B${3 + n}`); });
  ["B5", "B6", "B12"].forEach((c) => { ws.getCell(c).numFmt = "0.00%"; });
  ws.addRow([]);
  ws.addRow(["Outputs", "Value"]); head(ws, 14);
  const out: [string, string, string?][] = [
    ["Pool shares", "B3*B5/(1-B5)", "#,##0"],
    ["Total shares after the pool", "B3+B15", "#,##0"],
    ["Founders before the pool", "B4/B3", "0.00%"],
    ["Founders after the pool", "B4/B16", "0.00%"],
    ["Grant in shares", "B16*B6", "#,##0"],
    ["Price per share today", "B7/B16", "#,##0.0000"],
    ["Strike price used", "IF(ISNUMBER(B9),B9,B20)", "#,##0.0000"],
    ["Price per share at exit", "B8/(B16/(1-B12))", "#,##0.0000"],
    ["Grant value today", "B19*MAX(0,B20-B21)", "#,##0"],
    ["Grant value at exit", "B19*MAX(0,B22-B21)", "#,##0"],
  ];
  out.forEach(([k, f, fmt]) => { const r = ws.addRow([k, { formula: f }]); if (fmt) r.getCell(2).numFmt = fmt; });
  ws.addRow([]);
  ws.addRow(["Vesting", "Share vested"]); head(ws, ws.rowCount);
  const start = ws.rowCount + 1;
  for (let y = 1; y <= Math.max(1, Math.round(i.years)); y++) {
    const r = ws.addRow([`Year ${y}`, { formula: `IF(${y}<B11/12,0,MIN(1,${y}/B10))` }]);
    r.getCell(2).numFmt = "0%";
  }
  void start;
  return toBlob(wb);
}
