---
title: "I Let Claude Read My Email"
date: 2026-02-20 12:00:00 +0000
url: /2026/02/20/i-let-claude-read-my-email.html
categories:
- "tech"
- "ai"
---

I had over seven thousand unread emails in my inbox. Not spam — [Fastmail](https://join.fastmail.com/87aac080) handles spam fine. These were the other kind. The ones that exist only to be ignored. LinkedIn job alerts. Shipping confirmations for things that arrived months ago. GitHub Actions telling me a build passed. Newsletters I subscribed to during a moment of weakness in 2023.

Seven thousand of these. Just sitting there. Judging me.

I could have spent a weekend triaging them by hand. I could have declared bankruptcy, archived the lot, and pretended the problem was solved. Instead I did the thing I keep doing lately — I wrote a script and pointed Claude at it.

---

Here's what I built: a TypeScript tool that pulls unread emails from [Fastmail's](https://join.fastmail.com/87aac080) JMAP API, sends them to Claude in batches, and asks it to sort each one into four tiers.

**Auto-delete** — trash it. Marketing, mass emails, anything with an unsubscribe header that I never asked for.

**Auto-archive** — move it out of the inbox and mark it read. Shipping updates, CI notifications, receipts. Useful if I go looking, useless sitting in my face.

**Confirm** — mark it read but leave it in the inbox. The ambiguous stuff. Newsletters I might actually read, messages from senders I don't recognize. Keep it around, let me decide later.

**Attention** — don't touch it. Personal emails, financial alerts, time-sensitive stuff. These stay unread in the inbox because they actually need me.

The whole thing stores classifications in a [Ghost](https://ghost.build) Postgres database so I can audit what happened, and picks up where it left off if anything goes sideways.

---

The part I didn't expect: Claude is weirdly good at this.

Not "good for an AI" good. Actually good. I've used Gmail's auto-categorization. I've written Fastmail sieve rules. I've tried every email client that promises to fix my inbox. Claude's classification is better than all of them — and it's not close.

It reads the subject, the sender, the preview text, the unsubscribe header — and makes the call I would have made if I'd had the energy to make it seven thousand times in a row. The LinkedIn job alert goes to archive. The cologne marketing email goes to trash. The email from my kid's camp director stays unread.

The trick — the thing that keeps this safe instead of terrifying — is a line in the prompt: *lean cautious when in doubt*. I built a hierarchy of caution into the classification. When Claude isn't sure, it keeps the email instead of trashing it. Better to archive something I don't need than delete something I do. That's how you'd tell a human assistant to handle your mail, and that's how you tell a robot, too.

---

I've run it against 5,559 emails — still going. Here's the breakdown:

- **Auto-archive:** 1,917 (34.5%)
- **Auto-delete:** 1,777 (32.0%)
- **Confirm:** 975 (17.5%)
- **Attention:** 890 (16.0%)

Two-thirds of my inbox was noise. Gone. And the 16% Claude flagged as attention? It's right. Security alerts from Google and Netflix. Unpaid invoices. DistroKid telling me my card declined — forty-five times, apparently, because I ignored the first forty-four. My kid's camp newsletter. A bomb threat notification from the JCC.

That's what keeps hitting me. Not that AI can classify email — of course it can, that's pattern matching with context. But that it matches *my* judgment so closely, without me writing a hundred sieve rules to teach it what I care about. I described the tiers in plain English, told it to be careful, and it figured out the rest.

---

This is what I want AI to be. Not generating mediocre blog posts or replacing jobs. Reading my email. Doing the tedious classification work I'll never do myself — not because it's hard, but because it's boring, and because there's seven thousand of them, and because life is short.

A script I run when my inbox gets out of hand. It works. That's it. No grand vision. No startup. Just a tool doing a job I kept avoiding.

I still have more emails to process and I already feel lighter.
