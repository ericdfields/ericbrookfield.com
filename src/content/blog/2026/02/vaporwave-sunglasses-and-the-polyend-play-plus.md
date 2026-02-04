---
title: "Vaporwave Sunglasses and the Polyend Play+"
date: 2026-02-04 15:00:00 +0000
url: /2026/02/04/vaporwave-sunglasses-and-the-polyend-play-plus.html
categories:
- "tech"
- "ai"
- "music"
---

I have 8,597 audio samples. Kicks, snares, synths, weird textures I downloaded once and forgot about. They live in folders named "Drums_Final_v2" and "MISC_GOOD" and "sort_later."

The Polyend Play+ is a groovebox that wants organized sample packs — WAV files sorted into folders, under 32 MB. Stock packs are fine, but I wanted my sounds. The problem: I didn't want to spend hours dragging files around. So I just... didn't. The samples sat there, unused.

What I wanted was to describe a vibe — "experimental hip-hop with vaporwave sunglasses" — and get a curated pack of my own samples that matched. So I built that.

---

The interesting part isn't the code. It's what happens when you ask an AI to interpret a vibe.

Claude doesn't know what "vaporwave sunglasses" sounds like. Nobody does. But it knows vaporwave is lo-fi, vintage, warm. It knows sunglasses evoke retro cool. So it translates the vibe into tags — `experimental, hiphop, lo-fi, vintage, retro, warm, saturated, analog, mellow` — and those tags match against my already-analyzed library.

"Power yoga vibes" becomes `energetic, uplifting, electronic, modern, bright, punchy`.

The samples were always there. The AI just helps me find combinations I wouldn't have thought to look for.

---

The Play+ has a feature called Beat Fill — it auto-generates drum patterns from your Kick, Snare, and HiHat folders. It needs at least 5 samples per folder. More samples means more variety in the generated patterns.

So the pack generator prioritizes percussion first, then allocates remaining space by weight. The hardware's constraints shaped the software. Without the Play+'s opinions, I'd have built something generic.

---

I tried Claude Haiku first — cheaper. But Haiku tagged `kick_808_dark_01.wav` as just "kick." The filename already told me that.

Sonnet returned: `bass, electronic, trap, dark, mellow, dubstep, sustained, long, hiphop, sub, fat`. It understood that an 808 kick is also bass, that "dark" implies mood, that the combination suggests genre.

Shallow tags make the whole system useless. You can't search for "vaporwave sunglasses" if everything is tagged by instrument only.

---

It's [on GitHub](https://github.com/ericdfields/polyend-plus-manager). The pattern feels reusable: AI interprets creative intent, structured data enables search, hardware constraints shape output. I'd love to hear about this flow applied to other hardware electronic instruments.

I still don't know what vaporwave sunglasses sound like. But the pack it made sounds right. And I'm finally using samples I forgot I had.
