# Temporal Personal Site Design

## Core Concept

A temporal personal site that functions as living archaeology of your work and thinking.

Instead of a static portfolio with sections (Hero → Projects → Skills → Blog), the site is organized around **time as the primary axis**. Visitors can scrub through a timeline to see what you were building, using, and thinking about at any point.

Everything on the site carries temporal metadata:
- **Tools**: when adopted, how long used, current status (active/dormant/abandoned)
- **Projects**: when started, periods of activity, current state
- **Interests/obsessions**: when they emerged, how deep you went, whether they're still alive

The content is **AI-seeded from your blog posts and Instagram**—parsing your content to infer what was active when—but you **annotate and correct** on top. Both layers are visible, showing the interpretive process alongside your authoritative take.

The result feels less like a portfolio and more like **watching you think and work across time**.

---

## Navigation & Interface

### The Timeline as Primary Navigation

The site opens to "now"—your current state. A horizontal timeline runs across the top or bottom, showing the span of your documented history (as far back as your blog posts go, potentially extended manually).

You can:
- **Scrub** along the timeline to move through time
- **Click a point** to see a snapshot of that moment: what tools were active, what projects were in progress, what you were writing about
- **Zoom** in/out to see finer or coarser time granularity (weeks vs months vs years)

### Strata Visible at Once

At any point on the timeline, content appears in visual layers:
- **Current/Active** — fully visible, prominent
- **Recent** — slightly receded, but present
- **Archived/Past** — faded, available but clearly historical

As you scrub the timeline, these layers shift—what was "current" in 2022 fades as you move to 2024, and new things rise to prominence.

### The "Now" View

Landing on the site shows today's strata: your current tools, active projects, recent writing, present obsessions. This replaces the traditional hero/about section—it *is* the introduction, but a living one.

---

## The AI Layer

### How Content Gets Seeded

A build-time process parses your content and extracts signals:
- **Tools mentioned** — "I've been using Cursor for..." or "switched from VS Code to..."
- **Projects referenced** — what you were building, launching, abandoning
- **Topics and obsessions** — recurring themes, new interests emerging, things going quiet

The AI infers temporal placement: "Based on these 4 posts from Q1 2024, it appears you were actively using Raycast and exploring local LLMs."

### Your Curation Layer

The AI's inferences surface in a private admin view where you can:
- **Confirm** — "Yes, that's accurate"
- **Correct** — "Actually I started using this 3 months earlier"
- **Annotate** — "I abandoned this because..." or "This was a brief experiment, not a real adoption"
- **Add manually** — things the AI missed entirely

### What Visitors See

Both layers are visible but distinguished:
- AI-inferred items have a subtle marker or different treatment
- Your annotations appear as corrections or commentary
- The effect is like seeing tracked changes—the interpretation and your voice together

This makes the site not just a timeline but a **reflection on your own history**.

---

## Content Types & Data Model

### What Lives on the Timeline

Four primary content types, each with temporal metadata:

1. **Tools** — software, frameworks, hardware, workflows
   - Status: `active` | `exploring` | `dormant` | `abandoned`
   - Fields: name, category, adopted date, status changes, your take, what it replaced/what replaced it

2. **Projects** — things you've built or contributed to
   - Status: `active` | `paused` | `completed` | `abandoned`
   - Fields: name, description, start date, activity periods, links, learnings

3. **Interests/Obsessions** — topics, domains, rabbit holes
   - Status: `current` | `recurring` | `past`
   - Fields: name, when it started, depth/intensity, related posts, connections to other interests

4. **Writing** — your blog posts (the source material)
   - These anchor the timeline and provide evidence for everything else
   - AI extracts signals; you write the posts as normal

### Relationships

Items connect across types:
- A project might involve certain tools
- An interest might spawn multiple projects
- Abandoning a tool might coincide with adopting another

These connections become visible as you explore.

---

## Data Sources

### Multi-Signal Inference

The AI draws from multiple sources to build the timeline:

1. **Blog posts** — primary written output, the richest source of tools/projects/thinking
2. **Instagram** — visual signals, interests, what you're doing day-to-day, aesthetic sensibility
3. **GitHub** (optional) — what you're actually committing, languages/tools in use, project activity
4. **Manual additions** — things no platform captures

### How Instagram Fits

Instagram provides:
- **Visual context** — what you're photographing, designing, noticing
- **Temporal grounding** — timestamps on what you were doing when
- **Interests the blog misses** — hobbies, travel, side obsessions, real-life context
- **Aesthetic signal** — your visual taste, which might inform the site's own design over time

The AI correlates signals: "In October 2023, you posted about woodworking on Instagram and mentioned hand tools in a blog post—this appears to be when that interest emerged."

### Privacy Consideration

You control what gets pulled. Not every Instagram post needs to surface—maybe just enough to enrich the timeline inference, or you manually select which posts contribute.

---

## Visual Design & Aesthetics

### Time Made Visible

The temporal dimension shapes how things look:

- **Active items** — full color, full opacity, prominent placement
- **Recent items** — slightly muted, still clearly present
- **Dormant/archived** — faded, perhaps monochromatic, receded in the visual hierarchy
- **Abandoned with reason** — distinct treatment (strikethrough energy, a visible "why I stopped" note)

### The Scrubbing Experience

As you drag through time:
- Items fade in and out based on their active periods
- The whole palette might subtly shift
- There's a sense of *movement through your history*

### Strata Layout

Rather than a single-column scroll, content occupies spatial zones:
- **Center stage** — current/active items
- **Periphery** — recent and adjacent items
- **Background** — archived, still visible but clearly past

This creates depth, reinforcing the archaeological metaphor.

### The AI/Human Distinction

Subtle but clear:
- AI-inferred items have a dashed border or slight transparency until confirmed
- Your annotations appear in a distinct voice (different type treatment, a "note" style)
- Confirmed items look solid, authoritative

---

## Technical Approach

### Build-Time Processing

The site remains static (Astro), but with a richer build pipeline:

1. **Fetch sources** — pull blog posts (already have), Instagram posts via API, optionally GitHub activity
2. **AI extraction** — process content to infer tools, projects, interests with temporal placement
3. **Merge with curation** — overlay your manual corrections/annotations from a data file
4. **Generate timeline data** — output a structured JSON that powers the frontend
5. **Build site** — Astro renders the timeline interface with the processed data

### Data Storage

- **`/content/blog/`** — your posts (already exists)
- **`/data/timeline.json`** — AI-generated inferences, regenerated on build
- **`/data/curation.yaml`** — your corrections, annotations, manual additions (version controlled, you edit this)
- **`/data/sources.yaml`** — config for Instagram, GitHub connections

### The Curation Workflow

After a build, you review new AI inferences:
- New tool detected? Confirm, correct dates, add your take
- Interest inferred? Adjust intensity, add connections
- Something wrong? Override in curation file

This becomes a lightweight editorial practice—tending your timeline.

---

## What This Replaces

| Current | Becomes |
|---------|---------|
| Hero (static intro) | "Now" view — living snapshot of current state |
| Projects (list) | Projects on timeline — with history, status, connections |
| Skills (list) | Tools layer — when adopted, what replaced what, your takes |
| Blog (list of posts) | Writing anchors — posts become evidence, not just content |
| Contact (static) | Stays roughly the same, or becomes part of the "now" view |

---

## Trade-offs

### What You Gain

- The site feels like *you*, not a resume
- Visitors see your thinking process and evolution
- There's a reason to return—it changes
- Your history becomes explorable, not hidden
- The AI + curation layer makes maintenance lighter while keeping your voice

### What It Costs

- More complex build pipeline
- New frontend patterns (timeline scrubbing, strata visualization)
- Ongoing curation practice (though lightweight)
- Instagram API integration
- AI processing costs (minimal, build-time only)
