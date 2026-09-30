// Tool logic tests. Cases below cover the rules stated in brief 08.
// FILE 06: add every test case from 06-library-tools-and-guides.md here, word for word, when the file is supplied.
import assert from "node:assert/strict";
import test from "node:test";

const [scorecard, lift, doa, esop, readiness, deck, share, content] = await Promise.all([
  import("../src/lib/tools/scorecard.ts"),
  import("../src/lib/tools/lift.ts"),
  import("../src/lib/tools/doa.ts"),
  import("../src/lib/tools/esop.ts"),
  import("../src/lib/tools/readiness.ts"),
  import("../src/lib/tools/deck.ts"),
  import("../src/lib/tools/share.ts"),
  import("../src/content/tools.ts"),
]);

test("scorecard: {who} and {action} are substituted", () => {
  assert.equal(scorecard.fillStatement("We ask {who} to {action} now.", "investors", "commit to the round"), "We ask investors to commit to the round now.");
  for (const s of content.scorecardStatements) assert.doesNotMatch(scorecard.fillStatement(s.text, "x", "y"), /\{who\}|\{action\}/);
});

test("scorecard: each answer scores 0 to 100 and each half is the average", () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(scorecard.answerScore), [0, 25, 50, 75, 100]);
  const answers = Object.fromEntries(content.scorecardStatements.map((s, i) => [s.id, s.half === "terms" ? [1, 2, 3, 4, 5][i % 5] : 5]));
  const terms = content.scorecardStatements.filter((s) => s.half === "terms").map((s) => scorecard.answerScore(answers[s.id]));
  assert.equal(scorecard.halfScore(answers, "terms"), Math.round(terms.reduce((a, b) => a + b) / terms.length));
  assert.equal(scorecard.halfScore(answers, "moments"), 100);
});

test("scorecard: four verdicts", () => {
  assert.equal(scorecard.verdict(20, 80).key, "terms");
  assert.equal(scorecard.verdict(80, 20).key, "moment");
  assert.equal(scorecard.verdict(20, 20).key, "both");
  assert.equal(scorecard.verdict(80, 80).key, "reach");
});

test("scorecard: 'I don't know' shows the 'You can't see it yet' line", () => {
  assert.equal(scorecard.unknownNote(true).headline, "You can't see it yet");
  assert.equal(scorecard.unknownNote(false), null);
});

test("scorecard: three blockers, lowest first, each with its check line", () => {
  const answers = Object.fromEntries(content.scorecardStatements.map((s) => [s.id, 4]));
  answers.m3 = 1; answers.t2 = 1; answers.m1 = 2;
  const b = scorecard.blockers(answers);
  assert.equal(b.length, 3);
  assert.deepEqual(b.map((s) => s.id), ["t2", "m3", "m1"]); // tie at 0: Terms first (interim rule)
  for (const s of b) assert.ok(s.check.length > 10);
});

test("lift: customers and investors add points; Our team uses the target rate r1", () => {
  const c = lift.liftModel({ mode: "customers", base: 2000, rate: 3, lift: 2, target: 0, value: 50 });
  assert.equal(c.extraActions, 40); assert.equal(c.extraMonth, 2000); assert.equal(c.extraYear, 24000); assert.equal(c.perPointMonth, 1000);
  const t = lift.liftModel({ mode: "team", base: 120, rate: 40, lift: 99, target: 80, value: 400 });
  assert.equal(t.points, 40); assert.equal(t.extraActions, 48); assert.equal(t.r1, 80);
  assert.equal(lift.liftModel({ mode: "team", base: 10, rate: 50, lift: 0, target: 30, value: 1 }).points, 0);
});

test("lift: break-even uses the Diagnostic price and hides while unset", () => {
  assert.equal(lift.breakEvenMonths(1000, { amount: null, currency: "USD" }, "USD"), null);
  assert.equal(lift.breakEvenMonths(1000, { amount: 5000, currency: "USD" }, "USD"), 5);
  assert.equal(lift.breakEvenMonths(1500, { amount: 5000, currency: "USD" }, "USD"), 3.4);
  assert.equal(lift.breakEvenMonths(1000, { amount: 5000, currency: "USD" }, "NGN"), null);
});

test("DoA: limits are 0.05%, 0.25%, 1% and 5% of revenue, rounded to 2 significant figures", () => {
  assert.deepEqual(doa.revenueLimits(12_345_678), [6200, 31000, 120000, 620000]);
  assert.equal(doa.roundSig(1234, 2), 1200);
  assert.equal(doa.roundSig(0.0456, 2), 0.046);
});

test("DoA: lowest level gets the smallest limit; the top level approves without a cap", () => {
  const levels = ["Board", "CEO", "CFO", "Head of function", "Line manager"];
  const row = levels.map((_, i) => doa.defaultCell("Capital expenditure", i, levels, 10_000_000));
  assert.deepEqual(row.map((c) => c.limit), [null, 500000, 100000, 25000, 5000]);
  assert.equal(row[0].code, "A");
});

test("DoA: unbudgeted spend goes one level up", () => {
  const levels = ["Board", "CEO", "CFO", "Head of function", "Line manager"];
  const budgeted = levels.map((_, i) => doa.defaultCell("Capital expenditure", i, levels, 10_000_000));
  const unbudgeted = levels.map((_, i) => doa.defaultCell("Spend outside the approved budget", i, levels, 10_000_000));
  assert.equal(unbudgeted[4].code, "R");
  for (let i = 1; i < 4; i++) assert.equal(unbudgeted[i].limit, budgeted[i + 1].limit);
});

test("ESOP: pool, grant, strike, dilution and vesting", () => {
  const m = esop.esopModel({ shares: 900_000, founders: 900_000, poolPct: 10, grantPct: 1, strike: null, valuation: 10_000_000, exit: 100_000_000, years: 4, cliffMonths: 12, round: true, dilutionPct: 20 });
  assert.equal(Math.round(m.poolShares), 100_000);
  assert.equal(Math.round(m.total), 1_000_000);
  assert.equal(Math.round(m.grantShares), 10_000);
  assert.equal(m.priceToday, 10);
  assert.equal(m.strike, 10);
  assert.equal(Math.round(m.priceExit), 80);
  assert.equal(Math.round(m.valueExit), 700_000);
  assert.deepEqual(m.vesting.map((v) => v.vestedPct), [0.25, 0.5, 0.75, 1]);
  assert.equal(m.foundersAfter, 0.9);
});

test("readiness: 25 checks scored 2 / 1 / 0", () => {
  const all = (a) => Object.fromEntries(content.readinessGroups.flatMap((g) => g.checks.map((_, i) => [readiness.checkKey(g.key, i), a])));
  assert.equal(content.readinessGroups.reduce((n, g) => n + g.checks.length, 0), 25);
  assert.equal(readiness.readinessScore(all("yes")).points, 50);
  assert.equal(readiness.readinessScore(all("partly")).pct, 50);
  assert.equal(readiness.readinessScore({}).pct, 0);
  const gaps = readiness.readinessGaps({ ...all("yes"), "story-1": "partly", "terms-0": "no" });
  assert.deepEqual(gaps.map((g) => g.answer), ["no", "partly"]);
});

test("pitch deck: twelve questions give twelve slides with the user's words", () => {
  assert.equal(content.deckQuestions.length, 12);
  const o = deck.deckOutline(["Axis & Sage"]);
  assert.equal(o.length, 12);
  assert.equal(o[0].words, "Axis & Sage");
  assert.match(deck.deckText([]), /\[to write\]/);
});

test("share links round-trip tool state, including non-ASCII", () => {
  const state = { who: "investors", answers: { t1: 3 }, note: "₦ 1.66bn · Dubai" };
  assert.deepEqual(share.decodeState(share.encodeState(state)), state);
  assert.deepEqual(share.readHashState(`#r=${share.encodeState(state)}`), state);
  assert.equal(share.decodeState("%%%"), null);
});
