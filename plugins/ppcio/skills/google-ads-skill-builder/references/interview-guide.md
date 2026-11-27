# Interview guide

How to find out what the skill needs, one question at a time.

## Contents
- Rules of the interview
- The ground to cover (with why each answer matters)
- Branches by task type
- When to stop
- Example opening exchanges

## Rules of the interview

- One question per message. Plain words. Match their vocabulary.
- Ask only if the answer changes the skill. Otherwise propose and move on.
- Build on the last answer. "You said brand terms go to a separate
  campaign. Should the skill ever suggest negatives inside that campaign?"
- Say why you ask when it is not obvious: "This decides whether the skill
  reads CSVs or talks to the account directly."
- "Not sure" or "you pick" means: propose a default, give the reason in one
  line, continue.
- Capture their corrections word for word. They become rules.

## The ground to cover

Each item lists what to learn and what it changes in the built skill.

### 1. The task
- What job do they want to hand over? What starts it (a weekly habit, a
  client asking, a number dropping)?
- What does "done well" look like? Ask for one past example if they have it.
- Changes: the description's trigger words, the workflow, the output.

### 2. Account setup
- Agency with many clients, or in-house with one account? Manager account?
- Campaign types in play: Search, PMax, Shopping, Demand Gen, Video.
- Rough monthly spend and conversion volume (ranges are fine).
- Changes: whether the skill loops over accounts, which knowledge files to
  include, and how much data is "enough" before acting.

### 3. Naming conventions
- How campaigns and ad groups are named. Ask them to paste two or three
  real names.
- Changes: the skill parses names to group results (brand vs non-brand,
  geo, funnel stage) instead of guessing.

### 4. Goals and KPIs
- The main goal: leads, sales, calls, value, or awareness.
- The real targets: target CPA, target ROAS, or break-even numbers. Per
  campaign if they differ.
- Which conversion actions count. Primary only?
- Typical time from click to conversion (conversion lag). Same day? Weeks?
- Changes: every threshold in the skill. Use their numbers, not benchmarks.
  Lag decides how many recent days the skill ignores before judging.

### 5. Data access
- CSV exports from the Google Ads UI, Google Ads Editor, a spreadsheet, a
  connector, or Google's Google Ads MCP server?
- If MCP: is it set up and working in their AI tool? Read-only or with the
  asset and label tools on?
- Changes: the Inputs section. CSV means exact export steps and column
  names. MCP means GAQL queries and the gotchas in data-access.md.

### 6. Brand voice (only if the skill writes copy)
- Words and claims they always use, words they never use, legal lines,
  tone. Ask for a brand guide or three ads they love.
- Changes: a voice reference file and a banned-phrases check.

### 7. Approval and guardrails
- Who approves changes? Does anything ever go live without a human?
- Terms that must never be negated or paused (brand, products, competitors
  they bid on on purpose).
- Spend or change limits ("never suggest more than 20% budget change").
- Client sensitivities (regulated industry, trademark rules).
- Changes: the Guardrails section and the self-check.

### 8. Output
- Who reads it: them, the team, a client, a boss?
- Format: chat summary, table, Google Sheet-ready CSV, Google Ads Editor
  upload file, slide notes, email draft.
- Length and tone.
- Changes: the output template.

## Branches by task type

- Search terms / negatives: ask about match types they use, shared
  negative lists, protected terms, and minimum spend before judging a term.
- RSA / copy: ask for USPs, offers, proof points, banned words, pinning
  habits, and whether one headline must always show (pin rule).
- Audit: ask what decision the audit feeds (new client pitch, quarterly
  review), and what they never want flagged.
- Report: ask who reads it, what they care about, what period compares to
  what (week vs prior week, vs same week last year), and how to explain
  drops.
- PMax: ask whether there is a Merchant Center feed, brand exclusions,
  Final URL expansion settings, and whether Search runs alongside.
- Bidding / budgets: ask the targets, the budget owner, and the largest
  change they would accept in one go.

## When to stop

Stop asking when you can fill every field in templates/skill-spec.md.
Fill gaps with labelled defaults ("default, change if wrong").

## Example opening exchanges

Good:
> I see you uploaded a 90-day search terms export for a plumbing client.
> What do you want this skill to do with exports like this: find negatives,
> find new keywords, or both?

Bad (a form, not an interview):
> Please answer the following: 1) Account type 2) Monthly spend 3) KPIs
> 4) Naming convention 5) Brand voice...
