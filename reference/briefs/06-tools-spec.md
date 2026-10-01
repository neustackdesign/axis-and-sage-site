# Spec A · Tools (file 06)

### Rules shared by every tool

- **No sign-up to use a tool.** Email is asked only for "Send me the model", "Email me this report" or template downloads.
- **Shareable results.** Answers are encoded in the URL query string so a result can be shared and reopened. The URL never carries personal data.
- **Saving results.** Anonymous submissions are stored as tool + answers + scores + timestamp + UTM, with no personal data. If the person gives an email, the same record goes to the CRM as a contact with the result attached.
- **Formatting:**
  - Currency selector: NGN (₦), USD ($), AED (AED).
  - Numbers use en-GB format (1,234,567.89).
  - Large values are abbreviated on screen (₦1.66bn, $2.1M), with full values in exports.
- **Disclaimer line** (small, under every result): *An illustrative planning estimate, not financial, legal or tax advice.*
- **Every result ends with two buttons:**
  - The orange next step (usually **Book a Diagnostic**; tool-specific where noted).
  - The email option.
- **Analytics events:** `tool_start`, `tool_step` (with step number), `tool_complete`, `tool_email_requested`, `tool_cta_click`. Each carries `{tool, variant}`.

---

### Tool 1 · Conversion Scorecard (`/tools/conversion-scorecard`)

**Purpose.** It turns the method into a six-minute self-assessment. It qualifies the lead: the visitor leaves with a sentence we can quote back on the first call.

#### Step 1 · The action

**Who** (single choice):
- Investors
- Partners
- Our team
- Customers
- Users or beneficiaries
- Something else (free text, 40 characters)

**Action** (options depend on who):

| Who | Actions |
|---|---|
| Investors | commit to this round · follow on · move from first meeting to term sheet faster |
| Partners | sign · renew · commit more volume |
| Our team | work to a new structure or process · hit the new plan · adopt a new system |
| Customers | buy for the first time · buy again · switch to us · pay on time |
| Users or beneficiaries | sign up · finish onboarding · keep using it |
| Something else | free text, 40 characters |

**When:** this month · this quarter · this year · no date yet.

The assembled sentence is kept for later: `We need {who} to {action} by {when}.`

**Display forms of {who}.** Mid-sentence, {who} is the chosen label in lower case: investors, partners, our team, customers, users or beneficiaries, or the visitor's own words. At the start of a sentence it is capitalised ({Who}). After a number it uses {who_count}, which is the same except that "our team" becomes "people on our team".

#### Step 2 · Where things stand

- `rate`: "Out of every 10 {who_count} who reach the point of deciding, how many {action} today?" Integer 0–10.
- `unknown_rate`: a boolean for "I don't know". When ticked, the rate is null.
- `volume`: "How many reach that point in a typical month?" Optional integer.

#### Step 3 · Ten statements

Each is scored 1–5 (1 Not true · 2 Rarely · 3 Sometimes · 4 Mostly · 5 Fully true). `{who}` and `{action}` are filled from step 1.

**Terms**
- **T1** {Who} can see what's in it for them, in their words, in one sentence.
- **T2** What we ask of {who} holds up against what they're offered elsewhere: price, equity, pay, share of upside.
- **T3** The risk {who} carry is clear, capped and fair.
- **T4** The people on our side who can say yes are named, and so are their limits.
- **T5** Our incentives reward the people who get {who} to {action}.

**Moments**
- **M1** {Who} can {action} in one sitting, without having to ask us a question.
- **M2** When they act, they know exactly what happens next.
- **M3** Our people, product and materials tell {who} the same story.
- **M4** We can see where {who} drop off, step by step.
- **M5** The ask reaches {who} when they're ready to decide.

#### Scoring

- Each answer converts to `s = (a − 1) / 4 × 100`, giving 0, 25, 50, 75 or 100.
- `terms = round(mean(T1..T5))`
- `moments = round(mean(M1..M5))`
- The threshold is **60**.

#### Verdicts

| Condition | Headline | Body |
|---|---|---|
| terms < 60 and moments ≥ 60 | **It's the terms.** | {Who} can act easily. The question is whether they want to. The fix usually sits in strategy and investment: the offer, the structure, the incentives or who decides. |
| terms ≥ 60 and moments < 60 | **It's the moment.** | {Who} want what you offer, then lose the thread. The fix usually sits in product and brand: the flow, the message, the timing. |
| both < 60 | **It's both.** | Start with the terms. A clear moment can't rescue a weak offer. |
| both ≥ 60 | **It's reach, speed or proof.** | Your terms and moments hold up. Check how many {who} reach the decision, how long it takes, and what proof they see first. |

- If `unknown_rate` is true, add: **You can't see it yet.** Measuring the action is step one, and it's the first thing a Diagnostic sets up.

#### Top three blockers

Sort the ten statements by score, lowest first.

**Tie-breaks:**
1. Statements from the weaker side come first. If the two sides score equal, Terms come first.
2. Then statement order (T1 before T2, and so on).

Show three blockers, each with its "What we'd check first" line:

| Statement | What we'd check first |
|---|---|
| T1 | Rewrite the proposition from their side: what {who} get, in their words. |
| T2 | Benchmark the ask against the real alternatives {who} have. |
| T3 | Map the risk {who} carry and where it can be shared or capped. |
| T4 | Write down who can approve what, up to which limit. The Delegation of Authority Builder is a start. |
| T5 | Trace who is rewarded when {who} {action}, and who isn't. |
| M1 | Walk the path yourself and count every question {who} must ask. |
| M2 | Design the confirmation and the next three steps they'll see. |
| M3 | Put sales, product and materials on one story. |
| M4 | Instrument each step so you can see the drop-off. |
| M5 | Move the ask to the moment they're ready: after proof, before doubt. |

#### Related case (chosen by who)

| Who | Related case |
|---|---|
| Investors | Uganda Investor Summit |
| Partners | Nature Roots |
| Our team | GV Solutions |
| Customers | Farmcrowdy |
| Users or beneficiaries | Mular (Kolibri has no case page yet; switch when it does) |
| Something else | Farmcrowdy |

The related case must link to a page that exists.

#### Result buttons

- **Book a Diagnostic with this sentence.** Opens `/contact` with the sentence pre-filled in the "Who needs to act" field and `source=scorecard` carried through.
- **Email me this report.** Sends a PDF or HTML email containing the sentence, the rate, both scores, the verdict and the three blockers.
- **Share result link.**

#### Test cases

| # | Terms answers | Moments answers | Expected |
|---|---|---|---|
| 1 | 5,5,5,5,5 | 5,5,5,5,5 | terms 100, moments 100 → "It's reach, speed or proof" |
| 2 | 2,2,3,2,1 | 4,4,4,4,4 | terms 25, moments 75 → "It's the terms"; blockers T5, T1, T2 |
| 3 | 4,4,4,4,4 | 1,2,2,3,1 | terms 75, moments 20 → "It's the moment"; blockers M1, M5, M2 |
| 4 | 2,2,2,2,2 | 2,2,2,2,2 | 25 / 25 → "It's both"; blockers T1, T2, T3 |
| 5 | any | any | `unknown_rate` true → the "You can't see it yet" line appears |

---

### Tool 2 · What's a lift worth? (`/tools/conversion-value-calculator`)

**Purpose.** Puts a number on the size of the problem. This is the OUI Life launch-economics pattern: live outputs, then "Send me the model".

#### Mode A · Customers (default)

**Inputs** (slider plus number field):
- N: people who reach the decision each month (default 1,000)
- r0: how many act today, % (default 10)
- V: value of each action (default 100, currency selector)
- Δ: target lift in percentage points (1–30, default 5)

**Outputs:**
- today = N × r0 / 100
- extra_month = N × Δ / 100
- value_month = extra_month × V
- value_year = value_month × 12
- per_point = N × 0.01 × V

**Copy:** *Every point of lift is worth {per_point} a month.*

#### Mode B · Investors

**Inputs:**
- N: investor conversations in your process (default 40)
- r0: % who commit today (default 5)
- T: average cheque (default 250,000)
- Δ: target lift in points (default 5)

**Outputs:**
- extra_commitments = N × Δ / 100
- extra_capital = extra_commitments × T
- per_point = N × 0.01 × T

#### Mode C · Our team

**Inputs:**
- N: people who need to work the new way (default 50)
- r0: % who do today (default 40)
- r1: target % (default 90)
- V: monthly value per person when they do (default 500). Hint: hours saved × cost, or revenue they drive.

**Outputs:**
- gap_people = N × (r1 − r0) / 100
- value_month = gap_people × V
- value_year = value_month × 12

#### Break-even line

Shown once the Diagnostic price F is set in the CMS.

- **Customers mode:** payback_actions = ceil(F / V). Copy: *A Diagnostic pays for itself after {payback_actions} extra {actions}.*
- Hide the line in the other modes unless it reads naturally there.

#### "Send me the model"

- Asks for an email.
- Generates an .xlsx with the inputs in cells and the outputs as live formulas.
- Emails the file with a link to the Scorecard.
- Fires the `tool_email_requested` event.

#### Test cases

| # | Mode | Inputs | Expected |
|---|---|---|---|
| 1 | Customers | N 1,000; r0 10; V $100; Δ 5 | today 100 · extra 50/month · $5,000/month · $60,000/year · per point $1,000 |
| 2 | Investors | N 40; T $250,000; Δ 5 | extra commitments 2 · extra capital $500,000 · per point $100,000 |
| 3 | Team | N 50; r0 40; r1 90; V $500 | gap 25 people · $12,500/month · $150,000/year |
| 4 | Break-even | F $5,000; V $100 | 50 extra actions |

---

### Tool 3 · Delegation of Authority Builder (`/tools/delegation-of-authority-builder`)

**Purpose.** This is Ifeanyi's core craft as a free tool. It speaks to the primary buyer: a group CEO or COO.

> **Status:** the default thresholds and codes below are starting points. **Ifeanyi confirms or replaces them before launch.**

#### Setup

- **Structure:**
  - Single company
  - Group with subsidiaries (this adds a Group CEO level and a "subsidiary MD" label)
- **Annual revenue** (R) plus currency.
- **Levels** (toggle each on or off, and drag to reorder):
  - Board
  - Board committee (audit or remuneration)
  - Group CEO (groups only)
  - CEO / MD
  - CFO
  - Function head
  - Manager
- **Decision areas** (all on by default):
  - Annual budget and plan
  - Capital spend
  - Unbudgeted spend
  - Customer contracts
  - Supplier contracts
  - Hiring
  - Pay and bonuses
  - Pricing and discounts
  - Write-offs and credit notes
  - Borrowing and guarantees
  - New products or markets
  - Legal claims and settlements
  - Related-party transactions
  - Mergers, acquisitions and disposals
  - Policies

#### Monetary bands (default, as a % of annual revenue R)

| Level | Approves up to |
|---|---|
| Manager | 0.05% of R |
| Function head | 0.25% of R |
| CFO | 1% of R |
| CEO / MD | 5% of R |
| Board | above 5% of R |

- **Rounding:** round each limit to 2 significant figures.
- **Applies to:** capital spend, customer contracts, supplier contracts, write-offs, and legal settlements.
- **Unbudgeted spend:** approval moves **one level up** from the budgeted limit.

#### Non-monetary defaults

Codes: **A** approves · **R** recommends · **C** consulted · **I** informed.

| Decision area | Default codes |
|---|---|
| Annual budget and plan | Function head R · CFO R · CEO R · Committee C · Board A |
| Hiring (within budget) | Manager R · Function head A below head level · CEO A for heads · Board or remuneration committee A for CEO and direct reports |
| Pay and bonuses | Function head R · CFO C · CEO A below C-suite · remuneration committee R for C-suite · Board A for C-suite and CEO |
| Pricing and discounts | Manager A up to 5% · Function head A up to 15% · CEO A above 15% (percentages editable) |
| Borrowing and guarantees | CFO R · CEO R · Board A (all) |
| New products or markets | Function head R · CEO A within plan · Board A outside plan |
| Related-party transactions | CEO R · audit committee C · Board A (all) |
| Mergers, acquisitions and disposals | CEO R · Board A |
| Policies | Function head R · CEO A for operating policies · Board A for governance policies |

**Groups:**
- The Group CEO sits between the Board and the subsidiary MD.
- The subsidiary MD holds the CEO / MD band.
- The Group CEO approves above the subsidiary limit and up to 5% of group revenue.

#### Output

- A matrix: decision areas as rows, levels as columns. Each cell shows a code plus a limit, for example `A ≤ ₦25M`.
- **Footnote rules:**
  - Unbudgeted spend goes one level up.
  - Related-party transactions always go to the Board.
  - In an emergency the CEO may approve and must report to the Board within 48 hours.
- **Actions:**
  - Edit cells inline.
  - **Download .xlsx**, which requires an email and comes with a legend and notes.
  - **Book a call.** The copy offers to tailor the matrix and have it running in 30 days.

#### Test case

Revenue ₦10bn, single company, all levels on:

| Level | Limit |
|---|---|
| Manager | ≤ ₦5M |
| Function head | ≤ ₦25M |
| CFO | ≤ ₦100M |
| CEO | ≤ ₦500M |
| Board | > ₦500M |

For unbudgeted spend of ₦80M the approver is the CEO, one level up from the CFO, whose budgeted limit covers that amount.

---

### Tool 4 · ESOP & Share Pool Calculator (`/tools/esop-calculator`)

#### Inputs

| Input | Default |
|---|---|
| S: shares in issue today | 10,000,000 |
| F: founders' combined shares | 8,000,000 |
| p: pool size after creation, % of fully diluted | 10 |
| g: one grant, % of fully diluted | 0.5 |
| Vc: current valuation | 5,000,000 |
| Ve: exit valuation scenario | 50,000,000 |
| Vesting years | 4 |
| Cliff months | 12 |
| Vesting frequency | monthly |
| One more round before exit (toggle) | off; when on, dilution d = 20% |

#### Logic

- P = p / (100 − p) × S, rounded to whole shares. The pool is issued as new shares.
- FD = S + P
- founders_before = F / S
- founders_after = F / FD
- G = g / 100 × FD, rounded
- strike = Vc / FD
- exit_price = Ve / FD × (1 − d if the toggle is on)
- grant_value = G × max(0, exit_price − strike)
- **Vesting** at month m:
  - vested(m) = 0 while m < cliff
  - otherwise vested(m) = G × min(1, m / (years × 12))

#### Output copy

*Offer {G} options vesting over {years} years with a {cliff}-month cliff. If the company sells for {Ve}, they'd be worth about {grant_value} before tax.*

#### Test case (defaults)

| Output | Expected |
|---|---|
| P | 1,111,111 |
| FD | 11,111,111 |
| Founders | 80.00% → 72.00% |
| G | 55,556 |
| Strike | $0.45 |
| Exit price | $4.50 |
| Grant value | ≈ $225,000 |
| Grant value, toggle on | exit price $3.60 → ≈ $175,000 |
| Vested at month 11 | 0 |
| Vested at month 12 | 13,889 |
| Vested at month 24 | 27,778 |
| Vested at month 48 | 55,556 |

#### Result buttons

- **Book an Investor Readiness Sprint**
- Email me this model

---

### Tool 5 · Investor Readiness Score (`/tools/investor-readiness-score`)

Twenty-five checks, each answered **yes (2) / partly (1) / no (0)**.

**Story**
1. A one-sentence description a stranger can repeat.
2. A deck of 15 slides or fewer, tested on three people who don't know you.
3. A clear answer to "why now".
4. The ask (amount, use of funds, milestones) on one slide.
5. A named profile of your ideal lead investor.

**Numbers**
6. A monthly model with assumptions kept separate from outputs.
7. Unit economics per customer: acquisition cost, margin, payback.
8. A written definition for every metric you quote.
9. Twelve months of management accounts.
10. Runway and burn you can state without checking.

**Terms**
11. A clean, current cap table.
12. Every SAFE, note or convertible documented, with its terms.
13. A share-option pool sized for the next 18 months of hires.
14. A valuation rationale grounded in comparables.
15. Founder vesting in place.

**Company**
16. Incorporation and filings up to date.
17. IP assigned to the company.
18. Customer and supplier contracts signed and filed.
19. Licences for what you do, or a clear path to them.
20. A board or advisory structure that keeps minutes.

**Process**
21. A list of 30+ targeted investors, with a reason for each.
22. A data room that opens with an index.
23. Three customers who'll take a reference call.
24. A timeline with a first-close date.
25. One person who owns the process every week.

#### Scoring

- Group % = group points / 10 × 100.
- Overall % = total points / 50 × 100.

| Overall | Band | Line |
|---|---|---|
| 0–49 | **Not yet.** | Fix these before you pitch. |
| 50–79 | **Close.** | Close the gaps below first. |
| 80–100 | **Ready.** | Run a tight process. |

#### Gaps list

- Every "no" first, then every "partly".
- Order within each: Terms, Numbers, Company, Story, Process.

#### Result buttons

- **Book an Investor Readiness Sprint**
- Download the checklist (email)

#### Test cases

| Answers | Expected |
|---|---|
| All yes | 100%, Ready |
| All partly | 50%, Close |
| All no | 0%, Not yet; 25 gaps listed |

---

### Tool 6 · Pitch Deck Outline (`/tools/pitch-deck-outline`)

**Phase 1 is deterministic.** Twelve questions produce twelve slides. Each slide shows a suggested headline built from the user's answer, plus one guidance note.

| # | Question | Slide | Guidance note |
|---|---|---|---|
| 1 | What do you do, in one sentence? | Title | Say it the way a customer would. |
| 2 | What problem do customers have? | Problem | Use the customer's words and one number. |
| 3 | Who has it most? | Customer | Name one customer type, not five. |
| 4 | How do you solve it? | Solution | Show the moment it works. |
| 5 | Why now? | Why now | What changed in the last two years? |
| 6 | What traction do you have? | Traction | One chart, clearly labelled. |
| 7 | How do you make money? | Business model | Price, margin, payback. |
| 8 | How big can it get? | Market | Bottom-up: customers × price. |
| 9 | Who else solves it? | Competition | Show the customer's real alternatives. |
| 10 | Who's on the team? | Team | Why these people for this problem. |
| 11 | How much are you raising, and for what? | The ask | Amount, use of funds, runway. |
| 12 | What will the money prove? | Milestones | The two numbers that win the next round. |

**Actions:** Copy outline · Email me the outline · the **Investor Readiness Sprint** card.

**Phase 2 (parked).** A Claude API rewrite of each headline, with the user's consent.
