---
title: "A Second Pair of Eyes (Made of API Calls)"
date: 2026-03-09 12:00:00 +0000
url: /2026/03/09/a-second-pair-of-eyes.html
categories:
- "tech"
- "ai"
---

Anthropic [announced Code Review for Claude Code](https://www.threads.com/@claudeai/post/DVrOfogkWbV) this week. When a PR opens, Claude dispatches agents to hunt for bugs. I've been doing this since February.

When you're a solo dev building a SaaS product, you build the tools you're missing. I needed a second pair of eyes.

## What I built

Two workflows. The first is a custom review bot. A Node script fetches the PR diff, sends it to Claude via the API, and posts inline comments on the changed lines. It only comments on things it's confident about: bugs, security gaps, bad async patterns, Prisma type misuse. The prompt says "err on the side of silence" because noisy reviewers train you to ignore reviews.

The second is `claude-code-action`, Anthropic's GitHub Action. I can @claude in any PR comment or issue and it responds in context. It reads CI results, looks at the code, suggests fixes. The review bot is the automated pass; this is the conversational layer on top.

<img src="/blog-images/2026/Screenshot 2026-03-09 at 7.39.30 PM.png" width="768" height="768" alt="GitHub PR conversation where I ask Claude if flagged issues are real bugs, and Claude responds that all three are false positives, explaining why each one is correct">

## What Anthropic's version gets right

Dispatching multiple agents per review is smart. My bot is one Claude call against the whole diff. Splitting the review across specialized agents, one for security, one for performance, one for correctness, would catch more. I've felt the limits of the single-pass approach on big PRs where the diff gets truncated at 80K characters.

The other thing they get right is making it a feature instead of a script you maintain. My review bot is 490 lines of JavaScript that parses diffs, validates line numbers, handles GitHub's 422 errors on invalid comment positions, and falls back to posting comments one by one when the batch API chokes. It works. It's also the kind of thing I'd rather not own.

## Why it matters

Every PR gets reviewed. That's it. Solo dev means nobody's looking at your code. You merge your own PRs. You review your own diffs at 11 PM and tell yourself it looks fine. Something that reads every line and occasionally says "this might be null" is worth more than its hit rate suggests.

I'll probably migrate to Anthropic's version once it's available. Until then, the script works.
