---
title: "The Codebase Was the Brief"
description: "I asked an agent to make a hero video for Argus and gave it nothing but the codebase. What it found in the code — and what that says about where creative direction actually lives."
date: 2026-07-14 15:30:00 +0000
url: /2026/07/14/the-codebase-was-the-brief.html
categories:
- "tech"
- "ai"
---

I asked an agent to make a hero video for Argus. I gave it the codebase, the landing pages, the documentation. I did not give it a creative direction, a shot list, a mood board, or a script. I said, more or less: make this work.

It made it work. The result is technically correct — right dimensions, right duration, music muxed in and provable with ffprobe. It got a C-B. Shelved, not published.

That's not a failure. That's the ceiling of the inputs.

## What the agent found

The agent came back with four pillar clips structured around a vocabulary I hadn't mentioned: Observe, Focus, Radiate, Bloom. Those words live in the [Argus](https://argus.build) design system — formalized in the project code as actual design direction. The agent didn't invent them. It read the codebase, found the philosophy sitting there, and used it to structure a video.

<img src="/blog-images/2026/argus-video-contact-sheet-v1.jpg" width="1816" height="1108" alt="Contact sheet from the first hero video iteration: frames titled Observe, Focus, Radiate, and Bloom — the four-pillar vocabulary the agent pulled from the Argus design system">
<p><em>The first iteration's contact sheet. Observe / Focus / Radiate / Bloom — vocabulary the agent found in the codebase, not the prompt.</em></p>

I didn't tell it to do that. The code told it.

This is different from what I usually write about. In [A Hundred Commits and a Nap](https://ericbrookfield.com/2026/02/10/a-hundred-commits-and-a-nap/) I talked about AI pair-programming as the work compressing — more decisions, faster, at a speed you didn't know was possible. And in [I Stopped Prompting AI and Started Managing It](https://ericbrookfield.com/2026/03/28/i-stopped-prompting-ai-and-started-managing-it/) I wrote about how much of agentic work is really about what you hand the agent before it starts. This video project ran that idea somewhere new: the handoff wasn't a prompt. It was the codebase itself.

## What actually shipped

The stack worked. HyperFrames renders video from HTML on a deterministic, seek-safe timeline — an agent can author, lint, and re-render compositions as code, no human in an editor. Brand-locked design tokens gave near-zero visual drift across five clips. A 15-second vibe reel approved before committing to full renders saved at least one long wasted render and should be a permanent gate on any future video work. The local stack produced real MP4s with genuinely muxed audio. Provable with ffprobe. Not vibes.

<video controls preload="metadata" poster="/blog-images/2026/argus-hero-16x9-poster.png" style="max-width:100%;height:auto;" src="https://assets.argus.build/9d22d1b6-d6ec-4362-8b52-82e3670b2569/df76a984-0d39-4e48-8c01-8b9516b37853.mp4"></video>
<p><em>The 80-second hero video that earned its C-B. Served straight from Argus.</em></p>
<img src="/blog-images/2026/argus-video-contact-sheet-v4.jpg" width="1816" height="1108" alt="Contact sheet from the fourth and final hero video iteration, showing nine frames of the finished 80-second Argus hero video">
<p><em>The final iteration's contact sheet, four passes later.</em></p>

The 80-second hero video got an honest C-B. The distance between technically correct and flagship-grade is taste, pacing, narrative punch — exactly the qualities that are hardest to specify in a prompt and impossible to verify from a transcript. The inputs weren't rich enough to produce anything creatively meaningful. No direction beyond "make this work." That's not an indictment of the pipeline. It's what happens when you don't give anyone — human or agent — enough to work with.

## The brief problem

I think of myself as the creative director on these projects. The one asking which creative stones are still left unturned, what needs input from me or another source before the pipeline runs. The agent executes once those questions are answered. It can't supply creative meaning. I can.

The next pass is already in queue. Second-by-second beats. A voiceover script. A story arc. The kind of rich, specific brief that a human director would put together before handing a shot list to a cinematographer.

But the discovery from this first pass is stranger and more interesting than just "write a better brief." If the agent reads the codebase and surfaces the design vocabulary already living there — using it to structure a video without being asked — then what's *in* the codebase matters more than I'd thought. The vibe of a project, kept in structured data and design tokens and documented vocabulary, is becoming as important as the source code itself.

## Where Argus fits

This is what [Argus](https://argus.build) is built to do. Feed your media assets in — sketches, mood boards, reference photos, screenshots — and get expressive structured data back about the broad qualities of what you're working with: dominant colors, moods, use cases, textures, tags. That metadata becomes design-legible to an agent. Instead of an agent guessing at the aesthetic direction of your project, it can read it from a source of truth you've already built.

The Observe/Focus/Radiate/Bloom structure emerging from the codebase was a proof of concept for that idea. A richer Argus media catalog — tagged, described, organized — would have given the agent even more to work from before it wrote a single frame. That's the flywheel: the more meaning you put into your assets upfront, the more coherent the output when an agent draws from them.

## What to do before your first pass

If you're thinking about trying agent-authored video: start with still images. Sketches, mood boards, reference photos, screenshots. Feed them into [Argus](https://argus.build) and let it tell you what you're actually working with. Generate a design brief from that material before you build anything moving. That's how you develop a coherent look across everything you make — and how you give an agent something real to reach for.

An agent with no brief will do its best and produce something technically correct. Give it a brief built from the media itself and you'll start to see something that actually feels like yours.

More to report after the next pass.
