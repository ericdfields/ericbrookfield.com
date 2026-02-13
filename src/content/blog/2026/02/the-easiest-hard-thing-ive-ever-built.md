---
title: "The Easiest Hard Thing I've Ever Built"
date: 2026-02-13 12:00:00 +0000
url: /2026/02/13/the-easiest-hard-thing-ive-ever-built.html
categories:
- "tech"
- "ai"
---

I wrote [a post on Monday](/2026/02/10/a-hundred-commits-and-a-nap.html) about shipping a hundred commits in a week and collapsing into bed. Then I woke up Tuesday and did it again.

This isn't part two of that story. That post was about what AI pair-programming *feels like* — the compression, the exhaustion, the discovery that the hard part is steering, not typing. This post is about the infrastructure that made the steering possible.

Because here's the thing: Claude wrote the code, but Claude didn't provision the databases. Claude didn't issue SSL certificates for custom domains. Claude didn't handle Stripe webhooks in production. A layer of tools did that — and those tools existing, right now, in this form — that's the actual story.

---

Between Tuesday and Thursday, [Picket](https://sellwithpicket.com) gained: a full Stripe billing system with tier enforcement, self-service signup that provisions a Neon database automatically, an onboarding wizard, a redesigned admin sidebar (twice — the first version was wrong), CSA subscription management with pickup locations and skip weeks, order invoicing from admin, custom themes per tenant, and a complete rebrand from "Flora Stora" to "Picket" across every file in the codebase.

Oh, and Terms of Service. Because nothing says "real product" like a legal page nobody reads.

I'm listing all of this not to impress you but because I'm still processing it. I've been building software professionally for over a decade. This isn't a normal week. This isn't even a normal month. And it happened less because of me or Claude than because of what's underneath both of us.

---

Here's what actually built Picket this week:

**[Neon](https://neon.tech)** spins up a Postgres database in seconds via API. Multi-tenant architecture means every new signup needs their own database — schema pushed, seed data loaded, connection string registered. That's a provisioning script, not a support ticket. I didn't build a database provisioning system. I called an API that did it for me.

**[Fly.io](https://fly.io)** handles custom domains with automatic SSL certificates. A tenant wants `mindys-mums.mypicket.app`? One API call to Fly, a DNS record on their end, and it works. I didn't configure Nginx or manage Let's Encrypt. Fly did.

**[Stripe Connect](https://stripe.com/connect)** let me wire up connected accounts for marketplace payments without building payment infrastructure. Stripe handles onboarding, KYC, payouts. I built the UI around it.

**[Turborepo](https://turbo.build)** turned a messy migration into three clean packages — app, web, shared — with cached builds. The monorepo restructure that would've been a week of yak-shaving was a day.

**[Claude](https://claude.ai/claude-code)** wrote the implementations. Every commit says `Co-Authored-By: Claude Opus 4.6` and that's accurate. But Claude didn't make the architectural decisions or choose the tools. I did — and the choices were easy because the tools are *that* good.

Five years ago, half of this stack didn't exist. Neon launched in 2022. Fly's machine API is recent. Stripe Connect V2 is new. The AI pair-programming thing is barely a year old. Each one of these tools removed a category of work that used to be measured in weeks.

---

I keep coming back to a thought I can't shake: this is what it feels like when the infrastructure catches up to the ambition.

Picket started because [my wife](https://brookfield-blooms.com) needed an ecommerce solution for her small side-hustle and nothing fit. Shopify, Square, all of them — either too complex for what she needed, or they ate unreasonably into margins. So I started building one. And this time, the plumbing just... wasn't a problem.

This time, the plumbing took days. Not because I got better at plumbing — because the plumbing got better at being plumbing.

A new farmer signs up on the marketing site. That triggers a Neon API call that creates their database, pushes the schema, seeds their data. Their store is live at `mindys-mums.mypicket.app` before they finish the onboarding wizard. If they want a custom domain, one Fly API call handles the certificate. Their first customer pays through Stripe Connect, and the farmer sees the money in their dashboard.

I didn't build any of that infrastructure. I *composed* it. The tools are Lego bricks now, and the bricks have gotten absurdly good.

---

By the numbers: 163 commits across the week. Roughly 62,000 lines added, 21,000 deleted. The product went from a single-tenant flower farm tool to a multi-tenant SaaS platform with billing, self-service signup, and a marketing site — complete with pricing pages and auto-generated screenshots.

And it still doesn't have a single paying customer.

Building is the easy part now. The tools made it easy. The hard part — finding the businesses who need this, earning their trust, surviving contact with real usage — that hasn't started yet. A hundred and sixty-three commits don't mean anything until real orders flow through this.

But I'll say this: for the first time, the gap between "idea" and "product" feels crossable by one person. Not because of AI alone — because of everything. The databases that provision themselves. The payment platforms that handle compliance. The hosting that manages certificates. The AI that writes the glue.

We're standing on a pretty remarkable stack right now. I'm trying not to waste it.
