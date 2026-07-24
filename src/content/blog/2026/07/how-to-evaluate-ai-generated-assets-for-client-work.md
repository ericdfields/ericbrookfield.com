---
title: "How to Evaluate AI-Generated Assets for Client Work"
description: "A practical framework for creative directors assessing AI-generated images before they reach clients — five questions that distinguish brand-coherent work from something that merely looks good."
date: 2026-07-23 09:00:00 +0000
url: /2026/07/23/how-to-evaluate-ai-generated-assets-for-client-work.html
categories:
- "ai"
- "design"
---

The client asks the question while you're still setting up the presentation. "Is this AI?" They say it lightly, like they're asking about the coffee. But there's weight behind it, and you both know it.

What you say next depends entirely on whether you can actually defend the work in front of you. Not just "yes, we used AI, but we art directed it carefully." Defend it. The composition. The color. The way that image sits in the layout. Whether it looks like it belongs to this brand or just resembles it.

That distinction — belongs versus resembles — is the whole job right now.

---

## The Evaluation Framework

Before any AI-generated image goes into a client deliverable, it needs to pass five questions. Not a mood board approval. Not a gut check. Five specific questions with defensible answers.

### 1. Does it reflect the brand, or is it just aesthetically similar?

This is the trap that catches studios early in their AI work. The image looks good. It's clean, the lighting is right, the vibe is close. But "close" isn't brand coherence — it's coincidence.

Brand reflection means the asset could plausibly live in the brand's existing visual world: same color relationships, same spatial logic, same level of production finish. If you swapped your client's logo for a competitor's and the image still worked, that's a red flag. Generic beauty is not brand.

Before you approve an AI-generated image for a client, pull up three to five reference images from their existing approved library. Put them side by side. If the new asset looks like it came from a different studio — even a good different studio — it's not ready.

### 2. Is the color accurate enough to matter?

There's a difference between "approximately brand blue" and production-ready color. For digital deliverables, a shifted hue might survive. For anything that touches print, signage, packaging, or a brand system with defined palette values, it will not.

AI image models don't know your client's Pantone references. They don't know that the brand's primary green reads warm on screen but needs to pull cool to survive the press. They generate plausible color relationships, not calibrated ones.

Check hue values against brand color specs. Run the asset through whatever color management workflow you'd use for any other image. Tools that can analyze color distribution against a reference palette — comparing the generated asset's dominant tones to the client's defined palette — can catch drift that your eye won't catch under deadline pressure.

If the color needs to be corrected in post, account for that time. If it can't be corrected, re-prompt or source differently.

### 3. Is there compositional logic, or just visual complexity?

AI models are very good at producing images that look composed. They've been trained on millions of photographs with strong compositional grammar. What they don't have is *your* brief.

Compositional logic means the image has a clear subject hierarchy, a reading path that supports how the asset will be used, and negative space that survives cropping to the actual deliverable dimensions. An image that looks balanced at 1:1 may fall apart at the aspect ratio your client's ad template requires.

Before approving, crop the image to every format it needs to live in. Check that the subject survives. Check that the visual emphasis lands where the copy needs it to land. An image that "looks good" at full resolution but decapitates the subject when cropped to a banner ad is not production-ready.

### 4. Can you defend this asset in a client meeting without hedging?

This is the only question that's purely about your judgment as an art director, and it's the most important one.

"I think this works, but..." is not a defense. "We chose this image because it establishes the brand's relationship with the subject in a way that supports the campaign message" is a defense. The difference isn't whether you used AI to generate it — it's whether you made an actual art direction decision or just approved whatever came out.

AI generation shifts your role from creator to selector and refiner. That's a legitimate role. But it requires you to have a clear point of view on why this image, in this version, for this purpose. If you can't articulate that in a client meeting, the image is not done yet.

If you're hedging internally before the meeting, go back to the prompt.

### 5. Is the resolution and format suitable for the actual deliverable medium?

Most AI image outputs are optimized for screen viewing. They look sharp at web resolution. They may not survive a full-bleed print spread, a trade show banner, or a high-DPI display in a retail environment.

Check the pixel dimensions against the spec. If you're scaling up, check for artifacts at the actual output size — not on your monitor at 50% zoom. For print, pull a physical proof. For outdoor applications, don't approve based on a digital mockup.

If the resolution isn't adequate, that's a re-prompt, an upscaling workflow, or a decision to source differently. It's not an approval.

---

## Re-prompt, Re-shoot, or Stock?

Honest answer: use whichever gets you to production-ready fastest.

Re-prompt when the concept is right but the execution missed. When you have a clear art direction note — shift the color temperature, change the spatial relationship between elements, pull the horizon line down — and the prompt can carry that note.

Re-shoot when you need something specific that AI is consistently getting wrong: a real person, a product with exact physical detail, a specific location. AI is genuinely bad at things that require photographic truth. Brand photography exists for reasons, and those reasons don't go away.

Use stock when you need something that exists in the world — a moment, a place, a person — and time is the constraint. Stock has editorial problems AI doesn't: licensing restrictions, recognizable faces, model release issues. But it also has things AI doesn't: photographs that actually happened.

The worst outcome is spending three hours re-prompting for an image that a ten-minute stock search would have solved. Know when to stop.

---

## Presenting AI-Generated Assets to a Skeptical Client

Don't volunteer the process before they've seen the work. Present the creative work first.

If a client asks during or after the presentation whether the images are AI-generated, answer directly: yes, and here's how we art directed them. Walk them through the evaluation you did — the brand coherence check, the color review, the compositional logic. Show them the decision-making, not just the output.

What clients are actually worried about when they ask about AI is whether you made real creative decisions or just hit a button. Show them you made real decisions, and most clients will accept the answer. They hire you for your judgment, and AI doesn't replace that — it changes where you apply it.

If a client has a firm no-AI policy, find out before the presentation, not during it. It should be in the brief. If it's not in the brief, ask in kick-off.

Document which assets were AI-generated and how they were art directed. Keep that documentation in your project files. You may need it later, and your client may ask for it.

---

## How Argus Fits In

The evaluation process above lives mostly in your judgment and your review workflow. But parts of it — particularly the color and brand coherence checks — benefit from tooling.

[Argus](https://argus.build) can analyze the visual properties of generated assets against your brand reference images, flagging color drift and tonal inconsistency before it becomes a client conversation. It's not making the creative decision for you. It's giving you data for the decision you're already making, and catching the things that deadline pressure causes human eyes to miss.

The evaluation framework is yours. The tools just make the hard parts faster.

---

*At the end of that client presentation, you want to be able to say: we evaluated every image in this deck against your brand standards, we can tell you exactly why each one is here, and we'll stand behind it. That answer doesn't depend on whether you used AI. It depends on whether you did the work.*
