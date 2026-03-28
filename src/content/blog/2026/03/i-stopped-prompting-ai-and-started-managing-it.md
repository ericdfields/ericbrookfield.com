---
title: "I Stopped Prompting AI and Started Managing It. A Paperclip Field Report."
date: 2026-03-28 12:00:00 +0000
url: /2026/03/28/i-stopped-prompting-ai-and-started-managing-it.html
categories:
- "tech"
- "ai"
---

I'm an engineer and builder juggling multiple software projects at once. Earlier this year, I started using [Paperclip](https://paperclip.ing), an open-source agent orchestration platform, to manage the engineering across all of them.



Paperclip isn't a chatbot. It's an org chart, issue tracker, and governance layer for AI agents. You hire agents, give them roles, assign work through tickets, and set budgets. Think of it less as a tool you prompt and more as a company you run.



Here's what I've learned.



-----



## From Tab Chaos to Structured Work



I still use the terminal daily. But when I was working on two or three projects simultaneously, the terminal approach got chaotic. I really struggled with more than three [Claude Code](https://docs.anthropic.com/en/docs/claude-code) tabs open at once. Keeping my own context straight and prioritizing work became the biggest challenge.



It wasn't just the chaos — it was a feeling of carelessness. Spawning new tabs whenever a new idea came up, never writing things down, never thinking them through. Using an issue tracker that talks to agents was the missing part of my workflow.



So how many agents am I running now? Two to four at any given time. Same scale as when I had tabs open. The difference is that now I have a forward issue log and conversation history around every feature we're working on. The work has continuity.



-----



## The Org Chart



I over-hired at the start. I'd encourage other Paperclip users to keep the org really small — just a CEO and a builder agent — and see how far that gets you. I paused QA and Data Engineer agents I'd spun up early. They were experiments, not deliberate hires.



The Founding Engineer runs the most issues and has agent-creation privileges. That's not about trust levels — it's about scope. The FE works across different types of engineering and coding tasks. Sometimes it's design, sometimes data, sometimes QA. If I give it a big enough spec where a sub-agent would be useful, having the FE spin one up just makes sense.



-----



## How Work Flows



I have two modes for getting work into [Paperclip](https://paperclip.ing). When I'm in deep focus on the computer, I usually have the Paperclip app open and create issues directly. When I'm on the go, I talk to Andy — my executive assistant agent running through [NanoClaw](https://nanoclaw.dev). Andy can write structured issues into Paperclip, keep me notified on what's happening, and even take a screenshot of a bug and get it solved by the Founding Engineer without me touching the keyboard.



It's about what context makes sense at the moment. Same reason you'd sometimes open a Claude Code tab instead of going through a manager — it's situational.



Spec quality matters, but it depends on the size of the issue. For features, you want as much spec as you can muster. For a bug, a screenshot is fine. One thing I've found valuable: if there's a technical challenge, having an agent research the problem *before* handing it off to the builder is a really good step. That's fairly common in my workflow now.



As for where behavioral rules for agents live — I don't want to think about minutiae like that. I tell the CEO how to adjust the behavior of the rest of the company, and the CEO handles it. That governance-through-delegation eventually turns into codified rules, but it starts as a conversation.



-----



## Cost and Control



I'm on the Claude Max plan, so I don't think about token usage much. But giving a rough financial boundary keeps agents from spiraling out of control. The caps are preventative, not reactive. I haven't actually hit diminishing returns on a single session yet. If I were going to set budget caps, it'd probably be per project. But I haven't come across that need.



I did build a Frontend Evaluator agent specifically to pre-screen design before I see it. That came directly from reading [an Anthropic engineering post](https://www.anthropic.com/engineering/harness-design-long-running-apps) about getting better frontend designs through a generator/evaluator process — an adversarial loop inspired by GANs. I wanted to replicate that behavior inside Paperclip. And it works. The designs come back better.



Baked into the rules is that agents provide screenshots of work in progress, so I can see what's happening. If I don't like a direction, it's easy to interrupt and tell the agents to reevaluate.



-----



## Quality and Failure Modes



When an agent marks something done prematurely, I reopen and let them fix it. Canceling and reassigning doesn't make sense — the context is already there.



One of my project briefs ends with "nobody thinks AI played a major role." It's a cue for the evaluator to keep in mind — it seems to help. But at the end of the day, I have over fifteen years of experience building software, and I've developed what I think is reasonable taste for good outcomes. I use my own judgment.



For the specific anti-patterns, there are already [Claude skills](https://github.com/anthropics/skills) out there — like [frontend design guides](https://github.com/anthropics/skills/tree/main/skills/frontend-design) — that document common "AI slop" patterns. You just point the agent at those and say don't do these things.



-----



## The Bigger Picture



I've given agents real infrastructure — email inboxes, webhooks, Cloudflare workers, [QStash](https://upstash.com/docs/qstash/overall/getstarted). Most people just prompt into a chat window. What shifted my thinking was practical: I wanted to move away from the free but limited cron-job.org service I was using for webhooks onto something more professional. Claude recommended QStash. So I tasked my agent to open an account, and it did all the work — getting the right tokens, configuring the service. I didn't have to do anything but prompt an agent.



That was only possible because I'd given Andy a real email address. Once agents have real infrastructure — email, API keys, service accounts — they stop being chat windows and start being actual team members.



When a platform feature is missing, I try to work around it first. If the workaround feels fragile, I start to wonder if it's a bigger problem that could be solved with a feature. But I'm aware my needs might be one-offs best served as plugins. Luckily, [Paperclip](https://paperclip.ing) makes it easy to build plugins. I think plugin-first, upstream-if-broadly-useful.



Across my projects, I've closed hundreds of issues — most built by agents. One of those projects is [Picket](https://sellwithpicket.com), an e-commerce platform for farms and local food producers that I'm building largely this way. It's real software serving real customers, and the majority of the codebase was written by agents managed through Paperclip. But I'm still driving a hundred percent of the time. I pass off implementation to agents, and it's working out. But the vision, the priorities, the judgment calls — those are mine.
