# Agency & In-House PPC Operations OS Architecture

Why most agency dashboards and internal audit spreadsheets collapse past 10 accounts: per-account checklists multiply into 170 scattered cards, false alerts cause Slack fatigue, and account managers tweak keywords on accounts whose conversion tracking broke two weeks ago.

This architecture encodes the complete operating system proven across 50+ live accounts and adapted cleanly for both agencies and in-house growth teams.

## 1. Three Readers, One Verified System

Every audit and operations screen serves three distinct questions cleanly:
- **PPC Manager / In-House Specialist:** *"What is my #1 move this week to generate more real leads/sales?"* (Visible in 10 seconds with expected impact, inline evidence, owner, and checkbox.)
- **Ops Director / Head of Growth:** *"Are we on top of every account?"* (Answerable in 30 seconds with zero jargon; shows **account health and risk**, NEVER staff-micromanagement activity counts.)
- **Client / Executive:** *"Is the phone ringing / are orders growing, and is the spend worth it?"* (Handled cleanly by `reporting-studio` from the exact same verified data.)

## 2. Batch-by-Task Scaling & Strict Playbook Dependency Order

Per-account to-do lists fail at scale. Group fixes **by task type across accounts** and route by **owner team** in strict dependency order:
1. **Tracking Help Desk (Priority 1 - Hard Blocker):** Conversion tracking integrity (answered calls >=20s, confirmed forms, dynamic checkout revenue; zero 5s calls, button clicks, or page views).
2. **Offline / CRM Feedback & Lead Quality (Priority 2):** OCI / GCLID uploads and form/geo qualification.
3. **Web / Landing Page Team (Priority 3):** High-CTR / low-CVR post-click leaks (`landing-page`).
4. **PPC Account Managers (Priority 4 - Auto-Held When Tracking Is Broken):** Search terms, negatives, RSA copy, bidding adjustments, exported as **read-only Google Ads Editor CSVs**.

**Never cut keywords or add negatives on an account whose conversion counting is broken.** Hold traffic batches automatically in `Waiting on tracking` until Priority 1 clears!

## 3. The 5-Part Finding Contract (Zero Teases)

Every finding MUST contain all 5 elements ON THE PAGE (never *"Open Google Ads > Campaigns to check"*):
1. **Claim:** One crisp sentence with exact number and date range.
2. **Evidence:** Real rows, metrics, or visual table sitting right beside the claim.
3. **Reading:** 1 to 3 sentences judging whether it is actually a problem (e.g., out-of-area clicks converting at $11/lead in local services is `good`, NOT a bug).
4. **Verdict:** Exactly one of `fix | check | good | leave`.
5. **Fix:** Exact action, check-in date (7d after tracking, 14d after bid/keyword edits), and explicit rollback threshold.

## 4. The 10 Noise Rules (How Teams Actually Use Morning Alerts)

1. **Silence is the default:** Never post "all clear" messages; collapse healthy accounts to a single count (*"41 accounts need nothing this week"*).
2. **One batched 07:00 morning alert:** Never ping Slack all day.
3. **Fire once, auto-clear, escalate once at day 3:** Never nag every morning about the same unfixed break.
4. **Persistent `"Not right? Tell us why"` memory:** Rejected suggestions are saved permanently so dismissed advice never comes back.
5. **Real completion = data verified:** A fix is only truly done when the next run stops finding the issue, which automatically starts its 30-day before/after outcome check.
6. **Zero blame & zero agency-firing questions:** State neutral facts with dates (*"Gas keywords paused since 18 Nov"*, never *"your team broke"*). Never ask clients about *our* Google Ads settings; only ask business questions (hours answered, services wanted, job values).
7. **Read-Only Safety Protocol:** Generate previewable Google Ads Editor CSVs or dry-run drafts; never run blind bulk writes without human confirmation.
8. **Optional Zero-Cost Web Deployment:** Deploy the static HTML Ops Hub + 6-tab workbenches to **Cloudflare Pages** (free tier) with Workspace OAuth / Team Code middleware and lightweight KV persistence for team checkboxes and notes.
