// Tool logic tests. Every test case in Spec A (reference/briefs/06-tools-spec.md) is here, plus the rules around them.
import assert from "node:assert/strict";
import test from "node:test";

process.env.SANITY_CONTENT_SOURCE = "seed";

const [scorecard, lift, doa, esop, readiness, deck, share, content, load] = await Promise.all([
  import("../src/lib/tools/scorecard.ts"),
  import("../src/lib/tools/lift.ts"),
  import("../src/lib/tools/doa.ts"),
  import("../src/lib/tools/esop.ts"),
  import("../src/lib/tools/readiness.ts"),
  import("../src/lib/tools/deck.ts"),
  import("../src/lib/tools/share.ts"),
  import("../src/lib/tools/spec.ts"),
  import("../src/sanity/load.ts"),
]);
const caseSlugs = (await load.getCaseList()).map((c) => c.slug);

/* ---------- Tool 1 · Conversion Scorecard ---------- */

const answersFrom = (t, m) => Object.fromEntries([...t.map((a, i) => [`t${i + 1}`, a]), ...m.map((a, i) => [`m${i + 1}`, a])]);
const run = (t, m) => {
  const a = answersFrom(t, m);
  const terms = scorecard.halfScore(a, "terms"), moments = scorecard.halfScore(a, "moments");
  return { terms, moments, verdict: scorecard.verdict(terms, moments), blockers: scorecard.blockers(a).map((s) => s.id.toUpperCase()) };
};

test("Scorecard case 1: all 5s → 100 / 100, It's reach, speed or proof", () => {
  const r = run([5, 5, 5, 5, 5], [5, 5, 5, 5, 5]);
  assert.equal(r.terms, 100); assert.equal(r.moments, 100);
  assert.equal(r.verdict.headline, "It's reach, speed or proof.");
});

test("Scorecard case 2: terms 25, moments 75 → It's the terms; blockers T5, T1, T2", () => {
  const r = run([2, 2, 3, 2, 1], [4, 4, 4, 4, 4]);
  assert.equal(r.terms, 25); assert.equal(r.moments, 75);
  assert.equal(r.verdict.headline, "It's the terms.");
  assert.deepEqual(r.blockers, ["T5", "T1", "T2"]);
});

test("Scorecard case 3: terms 75, moments 20 → It's the moment; blockers M1, M5, M2", () => {
  const r = run([4, 4, 4, 4, 4], [1, 2, 2, 3, 1]);
  assert.equal(r.terms, 75); assert.equal(r.moments, 20);
  assert.equal(r.verdict.headline, "It's the moment.");
  assert.deepEqual(r.blockers, ["M1", "M5", "M2"]);
});

test("Scorecard case 4: 25 / 25 → It's both; blockers T1, T2, T3", () => {
  const r = run([2, 2, 2, 2, 2], [2, 2, 2, 2, 2]);
  assert.equal(r.terms, 25); assert.equal(r.moments, 25);
  assert.equal(r.verdict.headline, "It's both.");
  assert.deepEqual(r.blockers, ["T1", "T2", "T3"]);
});

test("Scorecard case 5: unknown_rate → the 'You can't see it yet' line appears", () => {
  assert.equal(scorecard.unknownNote(true).headline, "You can't see it yet.");
  assert.equal(scorecard.unknownNote(false), null);
  const report = scorecard.scorecardSummary({ sentence: "We need customers to buy again.", unknown: true, rate: 3, answers: answersFrom([3, 3, 3, 3, 3], [3, 3, 3, 3, 3]), forms: scorecard.whoForms("customers"), action: "buy again" });
  assert.match(report, /You can't see it yet\. Measuring the action is step one/);
  assert.match(report, /Today: not known/);
});

test("Scorecard: answers convert to 0, 25, 50, 75, 100 and the threshold is 60", () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(scorecard.answerScore), [0, 25, 50, 75, 100]);
  assert.equal(scorecard.verdictKey(60, 60), "reach");
  assert.equal(scorecard.verdictKey(59, 60), "terms");
  assert.equal(scorecard.verdictKey(60, 59), "moment");
});

test("Scorecard: display forms of {who}", () => {
  const team = scorecard.whoForms("our team");
  assert.equal(team.who, "our team"); assert.equal(team.Who, "Our team"); assert.equal(team.whoCount, "people on our team");
  assert.equal(scorecard.fill(content.scorecardRateQuestion, team, "hit the new plan"), "Out of every 10 people on our team who reach the point of deciding, how many hit the new plan today?");
  assert.equal(scorecard.fill(content.scorecardStatements[0].text, scorecard.whoForms("users"), "sign up"), "Users or beneficiaries can see what's in it for them, in their words, in one sentence.");
  const own = scorecard.whoForms("other", "Franchise owners");
  assert.equal(own.who, "franchise owners"); assert.equal(own.Who, "Franchise owners"); assert.equal(own.whoCount, "franchise owners");
  for (const s of content.scorecardStatements) assert.doesNotMatch(scorecard.fill(`${s.text} ${s.check}`, team, "x"), /\{/);
});

test("Scorecard: verdict bodies fill {Who} and {who}", () => {
  const f = scorecard.whoForms("investors");
  assert.equal(scorecard.verdict(20, 80, f).body.slice(0, 26), "Investors can act easily. ");
  assert.match(scorecard.verdict(80, 80, f).body, /how many investors reach the decision/);
});

test("Scorecard: sentence and actions follow Spec A", () => {
  assert.equal(scorecard.sentenceFor("partners", "renew", "this quarter"), "We need partners to renew by this quarter.");
  assert.equal(scorecard.sentenceFor("partners", "renew", "no date yet"), "We need partners to renew.");
  assert.deepEqual(content.scorecardWho.find((w) => w.key === "customers").actions, ["buy for the first time", "buy again", "switch to us", "pay on time"]);
});

test("Scorecard: each related case links to a case page that exists", () => {
  assert.equal(scorecard.relatedCaseSlug("users"), "mular");
  assert.equal(scorecard.relatedCaseSlug("our team"), "gv-solutions");
  assert.equal(scorecard.relatedCaseSlug("other"), "farmcrowdy");
  for (const w of content.scorecardWho) assert.ok(caseSlugs.includes(scorecard.relatedCaseSlug(w.key)), w.key);
});

/* ---------- Tool 2 · What's a lift worth? ---------- */

test("Lift case 1: Customers N 1,000; r0 10; V $100; Δ 5", () => {
  const m = lift.liftModel({ mode: "customers", base: 1000, rate: 10, value: 100, lift: 5, target: 0 });
  assert.equal(m.today, 100); assert.equal(m.extra, 50); assert.equal(m.valueMonth, 5000); assert.equal(m.valueYear, 60000); assert.equal(m.perPoint, 1000);
  assert.equal(content.money(m.perPoint, "USD"), "$1,000");
});

test("Lift case 2: Investors N 40; T $250,000; Δ 5", () => {
  const m = lift.liftModel({ mode: "investors", base: 40, rate: 5, value: 250000, lift: 5, target: 0 });
  assert.equal(m.extra, 2); assert.equal(m.valueMonth, 500000); assert.equal(m.perPoint, 100000);
});

test("Lift case 3: Team N 50; r0 40; r1 90; V $500", () => {
  const m = lift.liftModel({ mode: "team", base: 50, rate: 40, value: 500, lift: 0, target: 90 });
  assert.equal(m.extra, 25); assert.equal(m.valueMonth, 12500); assert.equal(m.valueYear, 150000);
  assert.equal(lift.liftModel({ mode: "team", base: 10, rate: 50, value: 1, lift: 0, target: 30 }).extra, 0);
});

test("Lift case 4: break-even F $5,000; V $100 → 50 extra actions", () => {
  assert.equal(lift.paybackActions(100, { amount: 5000, currency: "USD" }, "USD"), 50);
  assert.equal(lift.paybackActions(30, { amount: 5000, currency: "USD" }, "USD"), 167);
  assert.equal(lift.paybackActions(100, { amount: null, currency: "USD" }, "USD"), null);
  assert.equal(lift.paybackActions(100, { amount: 5000, currency: "USD" }, "NGN"), null);
});

test("Lift: Spec A defaults", () => {
  const d = Object.fromEntries(content.liftModes.map((m) => [m.key, m.defaults]));
  assert.deepEqual([d.customers.base, d.customers.rate, d.customers.value, d.customers.lift], [1000, 10, 100, 5]);
  assert.deepEqual([d.investors.base, d.investors.rate, d.investors.value, d.investors.lift], [40, 5, 250000, 5]);
  assert.deepEqual([d.team.base, d.team.rate, d.team.target, d.team.value], [50, 40, 90, 500]);
});

test("Formatting: en-GB digits and abbreviated large values", () => {
  assert.equal(content.money(1_660_000_000, "NGN"), "₦1.66bn");
  assert.equal(content.money(2_100_000, "USD"), "$2.1M");
  assert.equal(content.money(1234567.89, "USD", { decimals: 2 }), "$1.23M");
  assert.equal(content.money(123456.7, "USD"), "$123,457");
  assert.equal(content.money(0.45, "USD", { decimals: 2 }), "$0.45");
  assert.equal(content.count(1234567), "1,234,567");
});

/* ---------- Tool 3 · Delegation of Authority Builder ---------- */

const allLevels = [...content.doaLevels];

test("DoA test case: ₦10bn, single company, all levels on", () => {
  const [row] = doa.buildMatrix(["Capital spend"], allLevels, 10_000_000_000, "single");
  const by = Object.fromEntries(allLevels.map((l, i) => [l, row[i]]));
  assert.equal(doa.formatCell(by.Manager, "NGN"), "A ≤ ₦5M");
  assert.equal(doa.formatCell(by["Function head"], "NGN"), "A ≤ ₦25M");
  assert.equal(doa.formatCell(by.CFO, "NGN"), "A ≤ ₦100M");
  assert.equal(doa.formatCell(by["CEO / MD"], "NGN"), "A ≤ ₦500M");
  assert.equal(doa.formatCell(by.Board, "NGN"), "A > ₦500M");
  assert.equal(by["Board committee"].limit, null);
  assert.equal(by["Group CEO"].code, "–");
});

test("DoA test case: unbudgeted spend of ₦80M goes to the CEO, one level up from the CFO", () => {
  const [budgeted, unbudgeted] = doa.buildMatrix(["Capital spend", "Unbudgeted spend"], allLevels, 10_000_000_000, "single");
  assert.equal(doa.approverFor(80_000_000, budgeted, allLevels), "CFO");
  assert.equal(doa.approverFor(80_000_000, unbudgeted, allLevels), "CEO / MD");
  assert.equal(unbudgeted[allLevels.indexOf("Manager")].code, "R");
});

test("DoA: limits are 0.05%, 0.25%, 1% and 5% of revenue, rounded to 2 significant figures", () => {
  assert.deepEqual(doa.revenueLimits(12_345_678), [6200, 31000, 120000, 620000]);
  assert.equal(doa.roundSig(1234, 2), 1200);
  assert.equal(doa.roundSig(0.0456, 2), 0.046);
});

test("DoA: bands follow the named level, not the column position, and apply to the five monetary areas", () => {
  const levels = ["Board", "CFO", "CEO / MD", "Manager"]; // reordered, with levels off
  const [row] = doa.buildMatrix(["Supplier contracts"], levels, 10_000_000_000, "single");
  assert.deepEqual(row.map((c) => c.limit), [500_000_000, 100_000_000, 500_000_000, 5_000_000]);
  for (const area of content.doaMonetaryAreas) assert.equal(doa.buildMatrix([area], allLevels, 1e9, "single")[0][allLevels.indexOf("CFO")].op, "≤");
});

test("DoA: Board committees never hold a monetary limit", () => {
  const rows = doa.buildMatrix([...content.doaAreas], allLevels, 1e10, "group", 5e10);
  const i = allLevels.indexOf("Board committee");
  for (const row of rows) assert.ok(row[i].unit !== "money", "committee holds no monetary limit");
});

test("DoA: groups add the Group CEO up to 5% of group revenue and label the MD as subsidiary MD", () => {
  const [row] = doa.buildMatrix(["Capital spend"], allLevels, 10_000_000_000, "group", 40_000_000_000);
  const by = Object.fromEntries(allLevels.map((l, i) => [l, row[i]]));
  assert.equal(doa.formatCell(by["CEO / MD"], "NGN"), "A ≤ ₦500M");
  assert.equal(doa.formatCell(by["Group CEO"], "NGN"), "A ≤ ₦2bn");
  assert.equal(doa.formatCell(by.Board, "NGN"), "A > ₦2bn");
  assert.equal(doa.levelLabel("CEO / MD", "group"), "Subsidiary MD");
  assert.equal(doa.levelLabel("CEO / MD", "single"), "CEO / MD");
});

test("DoA: Spec A non-monetary defaults", () => {
  const rows = doa.buildMatrix(["Annual budget and plan", "Pricing and discounts", "Borrowing and guarantees", "Related-party transactions", "Mergers, acquisitions and disposals"], allLevels, null, "single");
  const codes = (row) => Object.fromEntries(allLevels.map((l, i) => [l, row[i].code]));
  assert.deepEqual(codes(rows[0]), { Board: "A", "Board committee": "C", "Group CEO": "–", "CEO / MD": "R", CFO: "R", "Function head": "R", Manager: "–" });
  const pricing = rows[1];
  assert.equal(doa.formatCell(pricing[allLevels.indexOf("Manager")], "NGN"), "A ≤ 5%");
  assert.equal(doa.formatCell(pricing[allLevels.indexOf("Function head")], "NGN"), "A ≤ 15%");
  assert.equal(doa.formatCell(pricing[allLevels.indexOf("CEO / MD")], "NGN"), "A > 15%");
  assert.equal(codes(rows[2]).Board, "A"); assert.equal(codes(rows[2]).CFO, "R");
  assert.equal(codes(rows[3])["Board committee"], "C"); assert.equal(codes(rows[3]).Board, "A");
  assert.deepEqual(codes(rows[4]), { Board: "A", "Board committee": "–", "Group CEO": "–", "CEO / MD": "R", CFO: "–", "Function head": "–", Manager: "–" });
});

test("DoA: footnotes include Spec A's three rules and the personal-interest rule", () => {
  assert.equal(content.doaFootnotes.length, 4);
  assert.match(content.doaFootnotes.join(" "), /Related-party transactions always go to the Board/);
  assert.match(content.doaFootnotes.join(" "), /within 48 hours/);
  assert.match(content.doaFootnotes.join(" "), /personal interest/);
});

/* ---------- Tool 4 · ESOP & Share Pool Calculator ---------- */

const esopDefaults = { shares: 10_000_000, founders: 8_000_000, poolPct: 10, grantPct: 0.5, strike: null, valuation: 5_000_000, exit: 50_000_000, years: 4, cliffMonths: 12, round: false, dilutionPct: 20 };

test("ESOP test case (defaults)", () => {
  const m = esop.esopModel(esopDefaults);
  assert.equal(m.P, 1_111_111);
  assert.equal(m.FD, 11_111_111);
  assert.equal((m.foundersBefore * 100).toFixed(2), "80.00");
  assert.equal((m.foundersAfter * 100).toFixed(2), "72.00");
  assert.equal(m.G, 55_556);
  assert.equal(m.strike.toFixed(2), "0.45");
  assert.equal(m.exitPrice.toFixed(2), "4.50");
  assert.equal(esop.about(m.grantValue), 225_000);
});

test("ESOP test case: toggle on → exit price $3.60, grant value ≈ $175,000", () => {
  const m = esop.esopModel({ ...esopDefaults, round: true });
  assert.equal(m.exitPrice.toFixed(2), "3.60");
  assert.equal(esop.about(m.grantValue), 175_000);
});

test("ESOP test case: vesting at months 11, 12, 24 and 48", () => {
  const m = esop.esopModel(esopDefaults);
  assert.equal(esop.vested(11, m.G, 4, 12), 0);
  assert.equal(esop.vested(12, m.G, 4, 12), 13_889);
  assert.equal(esop.vested(24, m.G, 4, 12), 27_778);
  assert.equal(esop.vested(48, m.G, 4, 12), 55_556);
  assert.deepEqual([11, 12, 24, 48].map((x) => m.vesting[x].vested), [0, 13_889, 27_778, 55_556]);
});

test("ESOP: an entered strike replaces Vc / FD, and value never goes below zero", () => {
  assert.equal(esop.esopModel({ ...esopDefaults, strike: 1 }).strike, 1);
  assert.equal(esop.esopModel({ ...esopDefaults, strike: 10 }).grantValue, 0);
});

/* ---------- Tool 5 · Investor Readiness Score ---------- */

const allAnswers = (a) => Object.fromEntries(content.readinessGroups.flatMap((g) => g.checks.map((_, i) => [readiness.checkKey(g.key, i), a])));

test("Readiness test cases: all yes 100% Ready; all partly 50% Close; all no 0% Not yet with 25 gaps", () => {
  assert.equal(content.readinessGroups.reduce((n, g) => n + g.checks.length, 0), 25);
  const yes = readiness.readinessScore(allAnswers("yes"));
  assert.equal(yes.pct, 100); assert.equal(yes.band.headline, "Ready.");
  const partly = readiness.readinessScore(allAnswers("partly"));
  assert.equal(partly.pct, 50); assert.equal(partly.band.headline, "Close.");
  const no = readiness.readinessScore(allAnswers("no"));
  assert.equal(no.pct, 0); assert.equal(no.band.headline, "Not yet.");
  assert.equal(readiness.readinessGaps(allAnswers("no")).length, 25);
});

test("Readiness: group % is points / 10 and bands break at 50 and 80", () => {
  const a = { ...allAnswers("no"), "story-0": "yes", "story-1": "partly" };
  assert.equal(readiness.readinessScore(a).groups.find((g) => g.key === "story").pct, 30);
  assert.equal(readiness.readinessScore({ ...allAnswers("yes"), ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`process-${i}`, "no"])) }).band.headline, "Ready.");
  assert.equal(readiness.readinessScore({ ...allAnswers("yes"), ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`process-${i}`, "no"])), "company-0": "partly" }).band.headline, "Close.");
});

test("Readiness: gaps list every no, then every partly; within each Terms, Numbers, Company, Story, Process", () => {
  const gaps = readiness.readinessGaps({ ...allAnswers("yes"), "story-0": "no", "process-0": "partly", "terms-2": "partly", "company-1": "no", "numbers-4": "no", "terms-0": "no" });
  assert.deepEqual(gaps.map((g) => `${g.answer}:${g.key}-${g.i}`), ["no:terms-0", "no:numbers-4", "no:company-1", "no:story-0", "partly:terms-2", "partly:process-0"]);
});

/* ---------- Tool 6 · Pitch Deck Outline ---------- */

test("Pitch deck: twelve questions give twelve slides, each with a headline from the answer and one note", () => {
  assert.equal(content.deckQuestions.length, 12);
  assert.deepEqual(content.deckQuestions.map((q) => q.slide), ["Title", "Problem", "Customer", "Solution", "Why now", "Traction", "Business model", "Market", "Competition", "Team", "The ask", "Milestones"]);
  const o = deck.deckOutline(["we help farmers get paid on time. We do it with a wallet."]);
  assert.equal(o.length, 12);
  assert.equal(o[0].headline, "We help farmers get paid on time");
  assert.equal(o[0].note, "Say it the way a customer would.");
  assert.match(deck.deckText([]), /\[to write\]/);
});

/* ---------- Shared ---------- */

test("Share links round-trip tool state, including non-ASCII", () => {
  const state = { who: "investors", answers: { t1: 3 }, note: "₦ 1.66bn · Dubai" };
  assert.deepEqual(share.decodeState(share.encodeState(state)), state);
  assert.deepEqual(share.readHashState(`#r=${share.encodeState(state)}`), state);
  assert.equal(share.decodeState("%%%"), null);
});

test("Every result carries the disclaimer line", () => {
  assert.equal(content.TOOL_DISCLAIMER, "An illustrative planning estimate, not financial, legal or tax advice.");
});
