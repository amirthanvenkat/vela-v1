# VELA: how the roadmap was prioritised

*From the first single-file prototype to the seventh merged pull request (June to November 2026).
A product decision log, explained through RICE, MoSCoW and Kano.*

---

## Summary

VELA is a mobile banking and investing prototype for people earning their first salary. It went
from one HTML file to an installable, tested, offline-capable app in ten rounds of work: a
three-step first build, then seven pull requests.

The order followed one rule: **make the prototype credible before making it clever.** First fix
what would break a reviewer's trust (money that goes negative, buttons that do nothing,
progress lost on refresh). Then put in the foundations that make every later change cheaper and
safer (a real build, routing, offline support, automated tests). Then add the features that make
VELA distinctive (a garden that grows, plain-language lessons, goal-based suggestions).

The most useful lesson came at the end. A Kano review of "promises the app makes" found that
withdrawals, a **basic expectation** for any money app, had never been on the list. RICE scored
it as the second-highest open item at that point, and it shipped next. That gap, and why it
happened, is covered in [What I'd do differently](#what-id-do-differently).

| # | Round | Merged | Theme | Kano type | MoSCoW (at the time) |
|---|---|---|---|---|---|
| 0 | First build: single-file prototype, polish, user story | Jun–Jul | Concept | Mixed | Must |
| 1 | Phone frame, working buttons, money guards, saved progress, accessibility | 28 Sep | Trust | Basic + delighter | Must |
| 2 | Vite + React project, tests and CI/CD | 28 Sep | Foundation | (enabler) | Should |
| 3 | React Router with shareable screen URLs | 29 Sep | Foundation | Performance | Should |
| 4 | Installable app that works offline | 1 Oct | Foundation | Performance | Should |
| 5 | Garden growth over time, three new Learn articles | 4 Nov | Delight | Delighter + performance | Could |
| 6 | Goal-linked invest suggestions | 4 Nov | Guidance | Performance | Could |
| 7 | Withdrawals from the Savings Pot and garden | 5 Nov | Trust | **Basic** | Must (once found) |

---

## How the frameworks are used here

- **RICE** (Reach × Impact × Confidence ÷ Effort) ranks items against each other. The scale used
  here:
  - **Reach:** % of active users who touch the item in a typical month.
  - **Impact:** 3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal.
  - **Confidence:** 100% backed by evidence, 80% strong reasoning, 50% a hunch to test.
  - **Effort:** person-days.

  **The scores are retrospective estimates made for this write-up.** VELA has no live users, so
  none of them is measured. They show the reasoning, not data.
- **MoSCoW** (Must / Should / Could / Won't) sets the scope of each round, and makes explicit
  what was deliberately left out.
- **Kano** sorts features by how users react to them:
  - **basic** features are expected, and their absence destroys trust
  - **performance** features earn more satisfaction the better they are
  - **delighters** are unexpected, and they make the product memorable

  Kano is the lens that caught the biggest gap.

Decision-making: the product owner set the direction and made every call. Each round began with
a short list of options and trade-offs, and the product owner chose. The app was built with an AI
coding partner (Claude Code), which proposed options, implemented, tested and opened each pull
request. Every merge was the product owner's decision.

---

## Round 0: the first build (June to July)

**Goal:** prove the concept in one link that anyone can open on a phone.

- **Must:**
  - onboarding with a jargon-free risk question (🐢 / 🦊 / 🚀)
  - home balance
  - Save, Invest and Learn flows
  - the garden metaphor ("every investment plants a flower")
  - three themes
- **Should:** polish passes (alignment, the bottom navigation hidden on modal screens, balance
  deductions), done in the second commit.
- **Could:** a persona walkthrough. "Maya's user story" became the review artefact, with
  screenshots made reproducible through deep links.
- **Won't (yet):** a build system, real routing, tests.

**Why a single HTML file:** the brief asked for a single shareable link, and the build machine
had no Node.js. That was the right call for validating a concept. It also created technical debt
that the foundation rounds (2–4) paid down.

**Kano at the end of round 0:** the delighters were strong (the garden, the confetti, the
characters). Several basics were missing: money could go negative, "Set a Goal" did nothing,
progress vanished on refresh, and the browser Back button left the app.

---

## Round 1: make it credible (PR #1, 28 Sep)

**Trigger:** the prototype was being shared as a link, mostly opened on laptops, where it
looked like a stretched web page. Reviewers also hit dead ends.

**Options considered:**
- a phone frame
- making the dead-end buttons work
- money-logic guards
- saved progress and a working Back button
- accessibility

**Decision: all five, because together they form one trust bar.**

| Item | R | I | C | E | RICE | Kano |
|---|---|---|---|---|---|---|
| Money guards (no negative balance; choose how much to invest) | 90 | 2 | 100% | 1 | **180** | Basic |
| Saved progress + Back button | 100 | 2 | 80% | 2 | **80** | Basic |
| Desktop phone frame | 60 | 1 | 100% | 1 | **60** | Delighter |
| Dead-end buttons work (goal, bell, cards) | 80 | 1 | 80% | 2 | **32** | Basic |
| Keyboard and reduced-motion accessibility | 15 | 1 | 80% | 1 | **12** | Basic (for those users) |

**Why the frame shipped alongside basics:** for a prototype, the *reviewer* is the user. Most
reviewers open the link on a laptop, so the frame changed the first impression for most of the
audience at the lowest effort of anything in the round.

**Evidence the round needed its own checks:** an automated code review on the PR found two real
bugs before merge.
- Pressing Back after investing reopened the form, so the same investment could be made twice.
- The notifications sheet didn't trap keyboard focus.

Both were fixed in the same PR. A money app has to treat double-submission as a basic-quality
issue, not polish.

---

## Rounds 2 to 4: foundations (PRs #2, #3, #4, 28 Sep to 1 Oct)

| Item | R | I | C | E | RICE | Kano |
|---|---|---|---|---|---|---|
| Vite + React build, tests, CI/CD (PR #2) | 100 | 0.5 | 80% | 3 | **13** | (enabler) |
| Installable app, works offline (PR #4) | 40 | 1 | 50% | 2 | **10** | Performance |
| React Router: a URL for every screen (PR #3) | 30 | 0.5 | 80% | 2 | **6** | Performance |

**On RICE alone, these three would have come after several feature items.** They went first for
reasons RICE doesn't capture:

1. **Dependencies.** Routing and offline support both needed a real build pipeline. The order
   Vite → Router → offline was forced, not chosen.
2. **Cost of delay on every later round.** Before PR #2, every change shipped without tests.
   After it, each pull request ran lint, unit tests and end-to-end tests automatically. That
   safety net paid off:
   - The migration itself surfaced a hidden crash. A missing import was being masked by a new
     browser built-in with the same name (`when()`), and it would have crashed the Home screen
     in some browsers.
   - In round 5, the automated checks caught a date bug before merge.
3. **Risk reduction.** The original prototype loaded five scripts from public CDNs at run time,
   and compiled its code in the browser on every visit. Removing that removed both a failure
   point and a slow first load.

**MoSCoW:**
- **Must:** behaviour identical to before. This was verified by pixel-diffing all 13 documented
  screens against the previous version, with 0% difference.
- **Should:** tests and automatic deploys.
- **Won't:** TypeScript and other refactors. The migration was kept as a pure port so it could be
  reviewed safely, and TypeScript is still deferred.

Swapping the custom router was split into its own round (#3) for the same reason: one
behavioural change per pull request.

---

## Round 5: delight (PR #5, 4 Nov)

| Item | R | I | C | E | RICE | Kano |
|---|---|---|---|---|---|---|
| Three new Learn articles (compound growth, rainy-day fund, dips) | 40 | 1 | 80% | 1 | **32** | Performance |
| Garden growth over days (seedling → sprout → bud → bloom) | 70 | 1 | 50% | 2 | **17.5** | Delighter |

**The key decision was what "growth" should mean.** Three options were considered:
1. Flowers mature by age.
2. Flowers mature by age, plus an illustrative return figure.
3. Simulated market movement, where the garden wilts on dips.

The product owner chose **1, flowers mature by age**. Growth follows the *habit* of planting,
never market prices, so a bad week can never wilt the garden. Option 3 would have been the most
"engaging", and also the most likely to teach beginners to check daily and panic-sell. That
conflicts with the product's purpose, so it was a **Won't**.

The Learn articles were chosen to answer the three questions the garden raises: "is SGD 50
worth it?", "should I invest this money at all?" and "what if it drops?". The one illustrative
figure (SGD 50 a month from 23 versus 33) is labelled as an example rate, not a promise.

---

## Round 6: guidance (PR #6, 4 Nov)

| Item | R | I | C | E | RICE | Kano |
|---|---|---|---|---|---|---|
| Goal-linked invest suggestions | 35 | 2 | 50% | 2 | **17.5** | Performance |

**The key decision was how much to say.** Three approaches were weighed:
- a flat "spread it over 12 months" suggestion
- a timeline-aware nudge
- planting flowers *for* a goal

The product owner chose the **timeline-aware nudge**.
- **Goals 3+ years away:** a suggested monthly amount, pre-filled but editable.
- **Goals under 3 years away:** a recommendation to keep that money in savings instead.

Telling someone *not* to invest money they need soon is the most trust-building thing an investing
app can say. The suggestion deliberately ignores growth, so it errs towards saving more, and
every tip says it's a guide, not advice.

---

## Round 7: the missing basic (PR #7, 5 Nov)

**Trigger:** a review of the app at the end of the original plan, framed as "what does VELA
promise but not do?".
- "You can take your money out whenever you want" appeared on four screens, and there was no way
  to do it.
- The risk choice (🐢 / 🦊 / 🚀) changed nothing.

| Open item at that review | R | I | C | E | RICE | Kano |
|---|---|---|---|---|---|---|
| Install and offline check on a real phone | 100 | 1 | 100% | 0.5 | **200** | (validation) |
| **Withdrawals** | 60 | 3 | 80% | 2 | **72** | **Basic** |
| A Singapore CPF article | 60 | 0.5 | 80% | 0.5 | **48** | Performance |
| Making the risk choice matter | 50 | 1 | 80% | 1.5 | **27** | Basic (a promise) |
| Upkeep (CI versions, self-hosted fonts, accessibility scan) | 100 | 0.25 | 100% | 1 | **25** | (enabler) |
| Goals counting invested money | 25 | 1 | 50% | 2 | **6** | Performance |

The real-phone check scores highest because it's cheap, but it's a manual test by the product
owner, not build work. **Withdrawals was the highest build item, and the only open Kano basic
with high impact**, so it went first. A product that promises "take it out any time" and can't
do it fails the most basic trust test, however good its delighters are.

**Design choices:**
- **The garden follows the amount withdrawn:** one flower leaves per SGD 50, newest first,
  previewed before you confirm.
- **At least one flower stays** while any money remains invested.
- **Instant, with a note:** in this prototype the money arrives straight away, with a line that
  real withdrawals usually take 1–3 working days. That's honest about real-world timing without
  building a pending-transfer system.

---

## The three frameworks side by side

| Framework | What it got right | Where it fell short here |
|---|---|---|
| **RICE** | Ranked the trust fixes in round 1 correctly. Made the case for withdrawals obvious once it was on the list. | Undervalues enablers (rounds 2–4 score low but cut the cost and risk of every later round). It can only rank items someone has thought of. |
| **MoSCoW** | Kept each round shippable, and recorded the deliberate "Won'ts" (TypeScript, simulated markets, a pending-transfer state). | Doesn't say *why* one Must outranks another. |
| **Kano** | Found the gap: a basic expectation (withdrawals) was missing while delighters shipped. | Doesn't size effort, so it's best used to *find* items for RICE to rank. |

**How they work together:** Kano decides what belongs on the list, RICE orders it, and MoSCoW
sets the scope of each release.

---

## What I'd do differently

1. **Run a Kano "promises audit" at the start of every round, not just at the end.** Withdrawals
   was missing for six rounds because the backlog was written as "features to add", not "promises
   to keep". The copy said "take it out any time" from the very first build.
2. **Budget enablers explicitly.** Rounds 2–4 were right, but on RICE they look like a detour.
   Labelling them in advance ("foundation round: cuts the effort of future work by X") would make
   the trade-off visible to stakeholders.
3. **Validate sooner on real devices and with real users.** Five rounds shipped before anyone
   installed VELA on a phone or watched a first-salary user try it. The confidence scores on the
   garden (50%) and the suggestions (50%) are hunches until then.

---

## What's next

| Item | RICE | Status |
|---|---|---|
| Make the risk choice matter (each style gets a shares/bonds mix, shown on Invest; switching shows what changes) | 27 | **In progress** |
| Real-phone install and offline check | 200 | Needs the product owner, on a device |
| Usability sessions with 3–5 first-salary users | n/a | Raises Confidence on everything above |
| Singapore CPF article | 48 | Not started |
| Upkeep: CI action versions, self-hosted fonts, accessibility scan, fix the double focus outline | 25 | Not started |
| Goals counting invested money | 6 | Needs a decision on how invested value counts |
| TypeScript | n/a | Deferred until VELA grows |

---

*See also: [Maya's user story](user-story-maya.md) for how these features feel from a user's
point of view, and the [README](../README.md) for how the app is built and run.*
