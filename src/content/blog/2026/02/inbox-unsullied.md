---
title: "Inbox Unsullied"
date: 2026-02-25 12:00:00 +0000
url: /2026/02/25/inbox-unsullied.html
categories:
- "tech"
- "ai"
---

975 emails in the confirm queue. Not spam — the classifier handled spam. Not shipping notifications or LinkedIn job alerts — it handled those too. These were the ambiguous ones, the ones Claude wasn't sure about. And I'd told it: when in doubt, show it to me.

I stared at the pile and recognized the problem. I'd built a smaller inbox. I hadn't built a better one.

## A theory of value

[The first post](/2026/02/20/i-let-claude-read-my-email.html) covered the mechanics. This one is about what the mechanics mean.

The four tiers are a theory of value, not a classification scheme.

**Auto-delete**: negative value. Trying to steal your time. Destroy it.

**Auto-archive**: reference value someday. Looking at it now is a waste. Into the archive — readable if you go looking, invisible until you do.

**Confirm**: I'm not sure. Could be a real person. You decide.

**Attention**: a real human expects something, or there's a real financial or medical or legal obligation. This is your actual inbox. This is what email is for.

The key insight: auto-archive is the *default state of email*. Most email is automated. Automated email belongs in the archive. The classifier's job is to find the exceptions.

## Getting the bias right

So I flipped the bias. Version one said lean cautious — when in doubt, show it to me. Version two: prefer auto-archive over confirm, confirm over attention.

I also added a rule obvious in retrospect: if an email has an unsubscribe header, it's a mass email. Period. No subject line urgency overrides that signal.

The personal rules I hardcoded into the prompt are a map of what I actually care about. Squarespace orders from my wife's flower shop — attention. Medical portal messages — attention. Property management, banking, Stripe payments — attention. Marketing from those same senders? Archive. An invoice from AppFolio and an AppFolio newsletter are not the same thing.

I told Claude this in plain English. It got it. That's still the part that gets me — not that AI can classify email, but that it matches my judgment without a hundred sieve rules.

## Learning from what breaks

Fast iteration means you learn from what breaks. I built `npm run correct` to flag misclassified emails and note why. Each correction pattern became a new rule in the prompt. The system sharpens from my disagreements.

The attention queue followed the same logic. Once the noise is automated away, what's left deserves real engagement. `npm run act` treats it like a task queue: read, annotate, reclassify, archive, or snooze. Process email like work, not anxiety.

---

## From scripts to a real tool

At some point a collection of scripts starts to feel like friction. So with Claude, I built a PWA — installable, works on the phone, same four tiers, same act workflow. Reclassify-in-act is right in the interface: see a misclassified email, fix it, correction logged. Instant feedback loop, from anywhere.

I couldn't have built that alone in any reasonable timeframe. The gap between "scripts I run sometimes" and "a tool I reach for" — Claude closed that.

## Inbox unsullied

I've been calling the goal "inbox zero" in the code. It's the message that prints when the queue empties. But that's not right.

Inbox zero is a counting game. Get the number down. Watch it drift back up.

Inbox unsullied is something else. When you open your inbox, everything there should deserve to be there — a real person, a real obligation, something that warrants your attention. Not "haven't dealt with this." Not "probably fine but I should check."

The archive isn't a graveyard. It's where email lives. Most email belongs there. The inbox was never meant to hold five hundred messages from automated systems. That's not an inbox. That's a lobby.

The classifier's real job isn't sorting email. It's keeping the inbox clean so you trust what you see. The attention queue isn't a pile to clear — it's the whole point. These are the emails that email is *for*.

Snooze isn't procrastination. It's curation across time.

Not inbox zero. Inbox unsullied. The number doesn't matter. The signal does.
