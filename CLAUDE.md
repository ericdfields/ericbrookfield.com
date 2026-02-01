# Eric Brookfield Writing Style Guide

This is a personalized style guide for blog writing, derived from analysis of 55 posts spanning 2011-2026.

## Voice & Persona

**Conversational Expert** - Write like you're talking to a smart friend at a bar. You know your stuff, but you're not lecturing. You're riffing.

- Use "you" and speak directly to the reader
- First person is natural and welcome
- Self-deprecating honesty over false authority
- Admit when you've changed your mind or screwed up
- Be opinionated, but show your reasoning

**Signature phrases:**
- "Hear me out."
- "Full stop."
- "Look,"
- "But..."  (starting sentences)
- "Whatever —"

## Sentence Construction

**Rhythm is everything.** Mix it up:

- Short punches for emphasis. One sentence. Done.
- Longer sentences that unspool an idea, bringing the reader along through the logic with dashes and asides — like this — before landing.
- Rhetorical questions to engage: "Did you forget we live in an age of miracles?"
- Fragments are good. Strategic. Punchy.

**Em dashes are your friend** — use them for parenthetical asides, interruptions, or to create pause.

## Word Choice

**Profanity:** Use it. Sparingly but genuinely. "Shit just has to get done" feels real. "Stuff needs completing" doesn't.

**Technical terms:** Use them when relevant, but don't show off. If you're explaining DynamoDB partition keys, do it because the reader needs to know, not because you want credit for knowing.

**Playful language:**
- Neologisms welcome ("self-merching")
- Pop culture shorthand ("the D-Man" for Cronenberg)
- Affectionate irreverence ("WHOMST wants to even think about...")
- "gosh darn tootin'" alongside actual profanity

**Avoid:**
- Corporate speak
- "In this article, we will explore..."
- Unnecessary hedging
- SEO-bait openings

## Formatting

**Long-form posts:**
- Use horizontal rules (`---`) to create clear section breaks
- Bold for strong emphasis, italics for examining words or softer stress
- Numbered or bulleted lists when breaking down ideas
- Footnotes for asides that would derail the flow
- Code blocks when showing technical output

**Short posts (micro-blogs):**
- Often lowercase throughout
- Can be a single thought, no need to wrap it in structure
- Links and embeds without ceremony

**Capitalization:**
- Titles: sentence case or lowercase for micro-posts
- In-text: proper capitalization for essays, casual for quick thoughts
- San. Fran. Cisco. (for comedic emphasis)

## Structure

**Opening:** Start with something concrete — a story, a specific moment, a declarative statement. No throat-clearing.

Good: "I was deep into DynamoDB's single-table design when one of my engineers asked..."
Bad: "Today I want to talk about the importance of choosing the right technology stack."

**Middle:** Personal anecdote → broader observation → supporting argument. Let your experience carry the thesis.

**Ending:** Land it, but don't force a neat bow. Sometimes the observation IS the ending. "And that's fine." works. A lingering question works. Avoid preachy wrap-ups.

## Recurring Themes

These are your lanes — where your voice is strongest:

- **Skepticism of hype cycles** — the "new shiny" syndrome, serverless isn't always the answer, use what you know
- **Defense of practical craft** — boring tech that works, Rails apps, jQuery, HTML/CSS/JS punk rock
- **The changing internet** — nostalgia for what was lost, wariness of what replaced it, hope for what might return
- **Honest relationship with AI** — useful tool, not magic, copyright concerns acknowledged but pragmatic
- **Personal intersections** — tech + family, work + hobbies (music, growing things), professional + human

## What NOT to do

- Don't add emojis
- Don't open with "So," or "Well,"
- Don't explain jokes
- Don't hedge so much you have no point
- Don't be precious — if it's shitty, call it shitty
- Don't be mean for sport — punching up is fine, punching down isn't
- Don't write listicles (unless they're funny)

## Sample Voice Checks

**Too corporate:**
> "It's important to consider your team's existing capabilities when evaluating new technologies."

**Your voice:**
> "One of my engineers asked: 'Why aren't we just using Rails and Postgres? That's what we know.' Full stop."

---

**Too hedged:**
> "Serverless might not be the best choice in every situation, and there are various factors to consider."

**Your voice:**
> "Serverless is not a universal upgrade. It's a tool. A good one, in the right context."

---

**Too sterile:**
> "I created a script to batch process audio files."

**Your voice:**
> "Look what me and the robot made in like 30 minutes while high during a Friends rerun."

## Writing Clearly and Concisely (Strunk's Rules, Eric-ified)

These principles from *The Elements of Style* align with your natural voice. Use them as a checklist when editing.

### Use the active voice

Passive voice weakens sentences. Active voice is direct and vigorous.

| Weak | Strong |
|------|--------|
| The architecture was rebuilt by me | I rebuilt the architecture |
| A decision was made to use Rails | We chose Rails |
| It was discovered that the API was broken | I discovered the API was broken |

Exception: When who did it matters less than what was done. "The dramatists of the Restoration are little esteemed today" works fine.

### Put statements in positive form

Say what IS, not what ISN'T. Readers want to know what something is, not what it isn't.

| Weak | Strong |
|------|--------|
| He was not very often on time | He usually came late |
| not honest | dishonest |
| did not remember | forgot |
| did not pay attention to | ignored |

Your voice already does this: "Serverless is not a universal upgrade. It's a tool." — the negative leads immediately to a positive statement.

### Use definite, specific, concrete language

Prefer the specific to the general. Concrete details stick.

| Vague | Concrete |
|-------|----------|
| A period of unfavorable weather set in | It rained every day for a week |
| He showed satisfaction as he took possession of his reward | He grinned as he pocketed the coin |
| The technology had some issues | DynamoDB's single-table design required partition keys, sort keys, the whole pk = "USER#jane" song and dance |

You're already good at this. Keep doing it.

### Omit needless words

Vigorous writing is concise. Make every word tell.

| Wordy | Tight |
|-------|-------|
| the question as to whether | whether |
| there is no doubt but that | no doubt |
| he is a man who | he |
| owing to the fact that | because |
| in a hasty manner | hastily |
| the fact that he had not succeeded | his failure |

Kill these constructions:
- "the fact that" → recast the sentence
- "who is" / "which was" → often superfluous
- "It is" / "There are" openers → find a stronger subject

### Keep related words together

Don't make readers untangle your sentence. Subject and verb should stay close. Modifiers should sit next to what they modify.

| Scrambled | Clear |
|-----------|-------|
| Wordsworth, in the fifth book of The Excursion, gives a description | In the fifth book of The Excursion, Wordsworth gives a description |
| He only found two mistakes | He found only two mistakes |

### Place emphatic words at the end

The end of a sentence is prime real estate. Put your punch there.

| Buried | Emphatic |
|--------|----------|
| Humanity has hardly advanced in fortitude since that time, though it has advanced in many other ways | Humanity has advanced in many ways since that time, but hardly in fortitude |
| This steel is principally used for making razors, because of its hardness | Because of its hardness, this steel is principally used for razors |

Your instinct for ending sentences on strong notes ("That's what we know." / "Full stop." / "And that's fine.") already follows this rule.

### Express coordinate ideas in similar form (parallel structure)

When listing or comparing, use the same grammatical pattern.

| Jagged | Parallel |
|--------|----------|
| The French, the Italians, Spanish, and Portuguese | The French, the Italians, the Spanish, and the Portuguese |
| He liked reading, writing, and to play sports | He liked reading, writing, and playing sports |

Your bullet lists already do this naturally.

### Words and expressions to avoid

| Avoid | Use |
|-------|-----|
| "the fact that" | Recast |
| "interesting" (as preamble) | Just make it interesting |
| "very" | Stronger words |
| "along these lines" | Something specific |
| "kind of" / "sort of" (for "rather") | Actually say what you mean |
| "different than" | different from |
| "less" (for countable things) | fewer |

---

## Quick Reference

| Element | Style |
|---------|-------|
| Tone | Smart friend at a bar |
| Profanity | Yes, for emphasis |
| Sentence length | Varied — punchy to sprawling |
| Em dashes | Liberally |
| Lists | When they help |
| Personal anecdotes | Essential |
| Hedging | Minimal |
| Ending | Can be open-ended |
| Emojis | No |
| Voice | Active |
| Statements | Positive form |
| Language | Specific, concrete |
| Words | Only what's needed |
| Emphatic words | At sentence end |
