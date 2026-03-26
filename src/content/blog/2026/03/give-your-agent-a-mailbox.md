---
title: "Give Your Agent a Mailbox"
date: 2026-03-25 12:00:00 +0000
url: /2026/03/25/give-your-agent-a-mailbox.html
categories:
- "tech"
- "ai"
---

I spent a few hours tonight giving my AI assistant an email address.

Not so it could write emails for me. Not to pipe newsletters through Claude and get summaries. I gave it an email address so that when something sends it a message, it actually receives the message, wakes up, and does something about it.

Small thing. Changed more than I expected.

---

The assistant is Andy — a [NanoClaw](https://nanoclaw.dev) instance I've been running locally. NanoClaw is a self-hosted agent runtime that lives in a Docker container, connects to WhatsApp or Telegram, and responds when you talk to it. I've been using it as a project manager of sorts: it watches my [Paperclip](https://paperclip.ai) board, wakes up coding agents when there's work to do, and keeps track of what's going on across projects.

It's good at this. But it has a blind spot: it only knows what I tell it. It has no inbox of its own.

---

The fix was three pieces.

**[Fastmail](https://fastmail.com).** I created a custom inbox folder and set up a routing rule so anything sent to `andy@[my-domain].com` lands there. Andy reads it via [JMAP](https://jmap.io) — Fastmail's proper API, not IMAP over a cursed socket.

**[Resend](https://resend.com).** I set Andy up with a Resend inbound address. Anything sent there hits [Resend's receiving API](https://resend.com/docs/dashboard/receiving/introduction). Andy polls `GET /emails/receiving` and pulls the full message: subject, body, headers, raw. No webhook needed for reading. For real-time delivery, Resend fires an `email.received` webhook.

**A relay.** NanoClaw's webhook endpoint expects a plain message string. Resend's webhook sends its own schema. So I wrote a forty-line [Cloudflare Worker](https://workers.cloudflare.com) that sits between them: receives Resend's payload, extracts the email ID, from, and subject, reformats it as a prompt, and POSTs it to NanoClaw. The agent wakes up, fetches the full email, and acts on it.

One evening. Most of it was the relay.

---

Here's the thing.

If a service needs to reach Andy now — to tell it a deploy finished, that a Stripe webhook fired, that a customer replied — it can. It has an address. It's reachable.

Most agents are reactive. You prompt them, they respond, they go to sleep. An agent with an inbox is different. Things can happen *to* it. It's not waiting for you to remember to ask — it's a participant in the infrastructure.

I tested it tonight. Sent an email to Andy's inbound address. Thirty seconds later Andy was reading it in Telegram and telling me what it said.

No magic. Just plumbing.

---

The thing that keeps getting me about this work is how little of it is "AI." The Claude parts — the reasoning, the judgment, the natural language — those are almost the easy part now. The hard part is the same as it always was: APIs, webhooks, routing rules, authentication, format mismatches. Connecting systems together.

Giving Andy an email address didn't require any new model capabilities. It required a Fastmail rule, a Resend account, and a Cloudflare Worker. But once you do that plumbing, the AI part starts to feel more real. Less like a chat window. More like a colleague.

One who lives in a container and has [never had to deal with seven thousand unread emails](/2026/02/20/i-let-claude-read-my-email.html).
