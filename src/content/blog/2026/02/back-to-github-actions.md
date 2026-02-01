---
title: "Back to GitHub Actions"
date: 2026-02-01 12:00:00 +0000
url: /2026/02/01/back-to-github-actions.html
categories:
- "tech"
---
Remember when I was excited about [self-hosted CI on Fly.io](/2026/01/31/self-hosted-ci-flyio.html)? That lasted about 24 hours.

The setup worked. The runner registered, jobs ran, tests passed. But the machine suspends when idle — that's how you keep costs at $5/month — and waking it up takes time. Every push meant waiting for the instance to spin up, then waiting for npm to realize the cache was there, then waiting for Playwright to remember it had browsers installed.

I'd check the Actions tab, watch the spinner, go make coffee. Check again. Still spinning. The tests ran fine. Getting *to* the tests was the problem.

I care about shipping, not CI infrastructure. The extra few dollars GitHub Actions costs per month is nothing compared to the friction of wondering if my runner woke up yet.

I wanted to be the person who optimizes their own CI spend. Who runs lean infrastructure and knows exactly where every dollar goes. But I'm not building a CI company. I'm building a product. The minutes I spent debugging runner wake-up times and cache invalidation are minutes I didn't spend on features.

So I'm back to GitHub Actions. The hosted runners are slower than WarpBuild, sure. But they're *there*. Push, run, done. No cold starts. No volume mounts. No wondering if Fly decided my machine was idle for too long.

Self-hosting CI was a fun detour. I learned about runner binaries and container lifecycles and Fly volumes. But learning and shipping are different, and right now I'd rather ship.
