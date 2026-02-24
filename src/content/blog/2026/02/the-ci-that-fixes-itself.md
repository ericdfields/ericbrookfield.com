---
title: "The CI That Fixes Itself"
date: 2026-02-24 18:00:00 +0000
url: /2026/02/24/the-ci-that-fixes-itself.html
categories:
- "tech"
- "ai"
---

The development loop I've landed on for [Picket](https://sellwithpicket.com): I write the spec. Claude turns the spec into tests. Claude turns the tests into code. The code ships to CI. If anything breaks, Claude fixes it — code or test, whichever is wrong — and CI reruns. I go work on the next feature.

Let the robot give itself homework.

---

Here's the mechanical part. Two auto-fix workflows in CI, plus a third that hooks into Sentry.

**Failing tests.** Both the unit test job and the E2E job pipe output to a file as they run. On failure, the last several thousand characters of that output go to Claude Code Action with a simple mandate: figure out what's wrong and fix it.

Claude reads the failure, reads the relevant files, makes changes. The tests run again. If they pass, the fix commits and pushes. If they still fail, nothing commits, the job exits non-zero, and I get the notification.

**Sentry issues.** Sentry comments on pull requests when it catches a runtime error. The comment has the error type, message, and stack trace. A separate workflow triggers on those comments, checks out the branch, and passes the comment to Claude: find the root cause in the source, fix it, and if you can't determine a safe fix with confidence, make no changes.

If Claude has an answer, it commits and pushes. If not, the workflow says so and moves on.

---

The guard that keeps this from spiraling: **one shot per cycle.**

Every auto-fix step reads the last commit message first. If it already contains `[auto-fix]` — or for the Sentry workflow, if the last commit was from a Claude email address — the step skips and the job fails immediately. One attempt, then a human has to look.

Without this, you get a robot retrying the same wrong fix in a loop. The loop prevention is what makes delegation safe.

---

The honest version of what this means day-to-day: I mostly don't think about implementation. I think about what the product should do, work through the design, hand that to Claude, and the rest mostly takes care of itself. When it doesn't — when CI pings me with a failure that survived the auto-fix — that's genuinely signal. Something ambiguous enough that the robot couldn't figure it out. Those are the interesting ones.

Everything else is just infrastructure doing its job.
