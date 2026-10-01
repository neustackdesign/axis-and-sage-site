"use client";

import { doaBands, doaCodeNames, doaCodes, doaGroupCeoShare, TOOL_DISCLAIMER, type CurrencyCode, type LiftMode } from "@/lib/tools/spec";
import { formatCell, type DoaCell } from "./doa";
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

const note = (ws: Sheet) => { ws.addRow([]); ws.addRow([TOOL_DISCLAIMER]); };

export async function liftWorkbook(i: { mode: LiftMode; modeLabel: string; labels: Record<string, string>; base: number; rate: number; lift: number; target: number; value: number; currency: string; diagnosticPrice: number | null }) {
  const wb = await workbook();
  const ws = wb.addWorksheet("Lift model");
  ws.columns = [{ width: 52 }, { width: 20 }, { width: 44 }];
  ws.addRow(["What's a lift worth?", i.modeLabel]); head(ws, 1);
  ws.addRow([]);
  ws.addRow(["Inputs (edit the green cells)", "Value", "Notes"]); head(ws, 3);
  ws.addRow([`N: ${i.labels.base}`, i.base]); input(ws, "B4");
  ws.addRow([`r0: ${i.labels.rate}`, i.rate]); input(ws, "B5");
  if (i.mode === "team") ws.addRow([`r1: ${i.labels.target}`, i.target]);
  else ws.addRow([`Δ: ${i.labels.lift}`, i.lift]);
  input(ws, "B6");
  ws.addRow([`${i.mode === "investors" ? "T" : "V"}: ${i.labels.value} (${i.currency})`, i.value]); input(ws, "B7");
  ws.addRow([`F: Diagnostic price (${i.currency})`, i.diagnosticPrice ?? "", "Blank when the price is in another currency"]); input(ws, "B8");
  ws.addRow([]);
  ws.addRow(["Outputs", "Value"]); head(ws, 10);
  const rows: [string, string, string][] = i.mode === "team"
    ? [["Acting today", "B4*B5/100", "#,##0"], ["Gap in people", "B4*MAX(0,B6-B5)/100", "#,##0.0"], [`Value per month (${i.currency})`, "B12*B7", "#,##0"], [`Value per year (${i.currency})`, "B13*12", "#,##0"]]
    : i.mode === "investors"
      ? [["Committing today", "B4*B5/100", "#,##0.0"], ["Extra commitments", "B4*B6/100", "#,##0.0"], [`Extra capital (${i.currency})`, "B12*B7", "#,##0"], [`Each point of lift (${i.currency})`, "B4*0.01*B7", "#,##0"]]
      : [["Acting today, per month", "B4*B5/100", "#,##0"], ["Extra actions per month", "B4*B6/100", "#,##0.0"], [`Value per month (${i.currency})`, "B12*B7", "#,##0"], [`Value per year (${i.currency})`, "B13*12", "#,##0"], [`Each point of lift, per month (${i.currency})`, "B4*0.01*B7", "#,##0"], ["Extra actions to pay for a Diagnostic", 'IF(AND(ISNUMBER(B8),B8>0,B7>0),ROUNDUP(B8/B7,0),"")', "#,##0"]];
  rows.forEach(([k, f, fmt]) => { const r = ws.addRow([k, { formula: f }]); r.getCell(2).numFmt = fmt; });
  note(ws);
  return toBlob(wb);
}

export async function doaWorkbook(i: { areas: string[]; levels: string[]; labels: string[]; cells: DoaCell[][]; edited: boolean[][]; revenue: number | null; groupRevenue: number | null; group: boolean; currency: CurrencyCode; footnotes: string[] }) {
  const wb = await workbook();
  const set = wb.addWorksheet("Settings");
  set.columns = [{ width: 44 }, { width: 20 }];
  set.addRow(["Delegation of authority · settings"]); head(set, 1);
  set.addRow([`Annual revenue${i.group ? ", subsidiary" : ""} (${i.currency})`, i.revenue ?? 0]); input(set, "B2");
  set.addRow([`Group revenue (${i.currency})`, i.groupRevenue ?? 0]); input(set, "B3");
  ["B2", "B3"].forEach((c) => { set.getCell(c).numFmt = "#,##0"; });
  set.addRow([]);
  set.addRow(["Level", "Share of revenue"]); head(set, 5);
  const shareRow: Record<string, string> = {};
  doaBands.forEach((b, k) => { set.addRow([b.level, b.share]); shareRow[b.level] = `Settings!$B$2*Settings!$B$${6 + k}`; });
  set.addRow(["Group CEO (share of group revenue)", doaGroupCeoShare]); shareRow["Group CEO"] = `Settings!$B$3*Settings!$B$${6 + doaBands.length}`;
  for (let r = 6; r <= 6 + doaBands.length; r++) { set.getCell(`B${r}`).numFmt = "0.00%"; input(set, `B${r}`); }
  set.addRow([]);
  set.addRow(["Limits are rounded to 2 significant figures."]);

  const ws = wb.addWorksheet("Matrix");
  ws.columns = [{ width: 38 }, ...i.levels.map(() => ({ width: 26 }))];
  ws.addRow(["Decision area", ...i.labels]); head(ws, 1);
  i.areas.forEach((area, r) => {
    const row = ws.addRow([area]);
    i.levels.forEach((_, c) => {
      const cell = i.cells[r][c];
      const target = row.getCell(c + 2);
      if (cell.band && cell.op && !i.edited[r][c]) {
        // Live formula: revenue × the band's share, rounded to 2 significant figures.
        const x = shareRow[cell.band.level];
        target.value = { formula: `IF(${x}>0,"${cell.code} ${cell.op} "&TEXT(ROUND(${x},1-INT(LOG10(ABS(${x})))),"#,##0"),"${cell.code}")` };
      } else {
        target.value = formatCell(cell, i.currency, true);
      }
    });
  });
  ws.addRow([]);
  ws.addRow(["Legend"]); head(ws, ws.rowCount);
  doaCodes.forEach((c) => ws.addRow([`${c} · ${doaCodeNames[c]}`]));
  ws.addRow([]);
  ws.addRow(["Notes"]); head(ws, ws.rowCount);
  i.footnotes.forEach((f, n) => ws.addRow([`${n + 1}. ${f}`]));
  note(ws);
  return toBlob(wb);
}

export async function esopWorkbook(i: EsopInput & { currency: string }) {
  const wb = await workbook();
  const ws = wb.addWorksheet("ESOP model");
  ws.columns = [{ width: 48 }, { width: 20 }];
  ws.addRow(["ESOP & share pool model"]); head(ws, 1);
  ws.addRow(["Inputs (edit the green cells)", "Value"]); head(ws, 2);
  const rows: [string, number | string][] = [
    ["S: shares in issue today", i.shares], ["F: founders' combined shares", i.founders], ["p: pool after creation (% of fully diluted)", i.poolPct / 100], ["g: one grant (% of fully diluted)", i.grantPct / 100],
    [`Vc: current valuation (${i.currency})`, i.valuation], [`Ve: exit valuation (${i.currency})`, i.exit], [`Strike per share (${i.currency}; blank = Vc / FD)`, i.strike ?? ""],
    ["Vesting years", i.years], ["Cliff months", i.cliffMonths], ["d: dilution in one more round (0 when off)", i.round ? i.dilutionPct / 100 : 0],
  ];
  rows.forEach(([k, v], n) => { ws.addRow([k, v]); input(ws, `B${3 + n}`); });
  ["B5", "B6", "B12"].forEach((c) => { ws.getCell(c).numFmt = "0.00%"; });
  ws.addRow([]);
  ws.addRow(["Outputs", "Value"]); head(ws, 14);
  const out: [string, string, string][] = [
    ["P: pool shares", "ROUND(B5/(1-B5)*B3,0)", "#,##0"],
    ["FD: fully diluted shares", "B3+B15", "#,##0"],
    ["Founders before the pool", "B4/B3", "0.00%"],
    ["Founders after the pool", "B4/B16", "0.00%"],
    ["G: grant in options", "ROUND(B6*B16,0)", "#,##0"],
    ["Strike per share", "IF(ISNUMBER(B9),B9,B7/B16)", "#,##0.00"],
    ["Exit price per share", "B8/B16*(1-B12)", "#,##0.00"],
    ["Grant value at exit, before tax", "B19*MAX(0,B21-B20)", "#,##0"],
  ];
  out.forEach(([k, f, fmt]) => { const r = ws.addRow([k, { formula: f }]); r.getCell(2).numFmt = fmt; });
  ws.addRow([]);
  ws.addRow(["Month", "Options vested"]); head(ws, ws.rowCount);
  for (let m = 0; m <= Math.round(i.years * 12); m++) {
    const r = ws.addRow([m, { formula: `IF(${m}<$B$11,0,ROUND($B$19*MIN(1,FLOOR(${m}/${i.frequencyMonths || 1},1)*${i.frequencyMonths || 1}/($B$10*12)),0))` }]);
    r.getCell(2).numFmt = "#,##0";
  }
  note(ws);
  return toBlob(wb);
}

export async function readinessWorkbook(i: { groups: { label: string; checks: { text: string; answer?: string }[] }[] }) {
  const wb = await workbook();
  const ws = wb.addWorksheet("Readiness checklist");
  ws.columns = [{ width: 6 }, { width: 12 }, { width: 70 }, { width: 12 }, { width: 10 }];
  ws.addRow(["Investor Readiness Score · checklist"]); head(ws, 1);
  ws.addRow(["Answer yes, partly or no in column D. Points: yes 2, partly 1, no 0."]);
  ws.addRow(["#", "Group", "Check", "Answer", "Points"]); head(ws, 3);
  let n = 0;
  i.groups.forEach((g) => g.checks.forEach((c) => {
    n += 1;
    const r = ws.addRow([n, g.label, c.text, c.answer || "no", { formula: `IF(D${3 + n}="yes",2,IF(D${3 + n}="partly",1,0))` }]);
    input(ws, `D${r.number}`);
  }));
  ws.addRow([]);
  const last = 3 + n;
  ws.addRow(["", "", "Overall %", "", { formula: `ROUND(SUM(E4:E${last})/${n * 2}*100,0)` }]); head(ws, ws.rowCount);
  ws.addRow(["", "", "Band", "", { formula: `IF(E${ws.rowCount}>=80,"Ready.",IF(E${ws.rowCount}>=50,"Close.","Not yet."))` }]);
  note(ws);
  return toBlob(wb);
}
