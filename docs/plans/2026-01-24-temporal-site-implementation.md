# Temporal Personal Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the static portfolio into a temporal site where visitors scrub through time to see tools, projects, and interests as they evolved.

**Architecture:** Astro static site with build-time AI extraction. Blog posts feed AI inference → merged with human curation → generates timeline JSON → powers interactive frontend.

**Tech Stack:** Astro, TypeScript, Claude API (build-time), YAML for curation data, CSS for strata visualization

---

## Phase 1: Data Model & Manual Seeding

Build the data layer first with manual content. Get the timeline rendering before adding AI.

---

### Task 1: Create Timeline Data Schema

**Files:**
- Create: `src/types/timeline.ts`

**Step 1: Create the TypeScript types**

```typescript
// src/types/timeline.ts

export type ToolStatus = 'active' | 'exploring' | 'dormant' | 'abandoned';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'abandoned';
export type InterestStatus = 'current' | 'recurring' | 'past';
export type InferenceSource = 'ai' | 'manual' | 'confirmed';

export interface TimelineSpan {
  start: string; // ISO date
  end?: string;  // ISO date, undefined means ongoing
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  status: ToolStatus;
  spans: TimelineSpan[];
  take?: string;           // your opinion/note
  replacedBy?: string;     // id of replacement tool
  replaces?: string;       // id of tool this replaced
  source: InferenceSource;
  aiReasoning?: string;    // why AI inferred this
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  spans: TimelineSpan[];
  tools?: string[];        // tool ids used
  links?: string[];
  learnings?: string;
  source: InferenceSource;
  aiReasoning?: string;
}

export interface Interest {
  id: string;
  name: string;
  status: InterestStatus;
  spans: TimelineSpan[];
  depth: 'shallow' | 'medium' | 'deep';
  relatedPosts?: string[]; // blog post slugs
  connections?: string[];  // other interest ids
  source: InferenceSource;
  aiReasoning?: string;
}

export interface TimelineData {
  tools: Tool[];
  projects: Project[];
  interests: Interest[];
  generatedAt: string;
}
```

**Step 2: Verify TypeScript compiles**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npx tsc --noEmit src/types/timeline.ts`
Expected: No errors

**Step 3: Commit**

```bash
git add src/types/timeline.ts
git commit -m "feat: add timeline data schema types"
```

---

### Task 2: Create Manual Curation File

**Files:**
- Create: `data/curation.yaml`

**Step 1: Create data directory and curation file**

```yaml
# data/curation.yaml
# Manual timeline entries and corrections to AI inferences

tools:
  - id: rails
    name: Ruby on Rails
    category: framework
    status: active
    spans:
      - start: "2010-01-01"
    take: "My go-to for web apps. Fast to build, joy to maintain."
    source: manual

  - id: astro
    name: Astro
    category: framework
    status: active
    spans:
      - start: "2024-08-01"
    take: "Perfect for content sites. This site runs on it."
    source: manual

  - id: vue
    name: Vue.js
    category: framework
    status: active
    spans:
      - start: "2018-01-01"
    take: "Preferred frontend framework for complex UIs."
    source: manual

  - id: cursor
    name: Cursor
    category: editor
    status: exploring
    spans:
      - start: "2024-06-01"
    take: "AI-first editor. Seeing how it changes my workflow."
    replaces: vscode
    source: manual

  - id: vscode
    name: VS Code
    category: editor
    status: dormant
    spans:
      - start: "2016-01-01"
        end: "2024-06-01"
    source: manual

projects:
  - id: patient-platform
    name: Patient Data Platform
    description: "Rails 8 system managing sensitive patient records with automated pharmacy data imports."
    status: active
    spans:
      - start: "2023-01-01"
    tools: [rails]
    source: manual

  - id: ericbrookfield-com
    name: ericbrookfield.com
    description: "This personal site. Now becoming a temporal exploration."
    status: active
    spans:
      - start: "2024-08-01"
    tools: [astro]
    source: manual

  - id: podcast-rag
    name: Podcast RAG System
    description: "Semantic search across 470+ podcast episodes using ChromaDB and Claude."
    status: paused
    spans:
      - start: "2024-01-01"
        end: "2024-03-01"
    tools: []
    links:
      - "https://github.com/ericdfields/roderickon"
    source: manual

interests:
  - id: ai-tooling
    name: AI-Assisted Development
    status: current
    spans:
      - start: "2023-03-01"
    depth: deep
    source: manual

  - id: design-engineering
    name: Design Engineering
    status: current
    spans:
      - start: "2010-01-01"
    depth: deep
    source: manual
```

**Step 2: Verify YAML is valid**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npx js-yaml data/curation.yaml`
Expected: Parses without error (install js-yaml if needed: `npm install -D js-yaml`)

**Step 3: Commit**

```bash
git add data/curation.yaml
git commit -m "feat: add initial curation data with manual entries"
```

---

### Task 3: Create Data Loading Utility

**Files:**
- Create: `src/lib/timeline.ts`
- Modify: `package.json` (add js-yaml dependency)

**Step 1: Install js-yaml**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm install js-yaml && npm install -D @types/js-yaml`

**Step 2: Create the data loader**

```typescript
// src/lib/timeline.ts
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { TimelineData, Tool, Project, Interest } from '../types/timeline';

interface CurationFile {
  tools?: Tool[];
  projects?: Project[];
  interests?: Interest[];
}

export function loadTimelineData(): TimelineData {
  const curationPath = path.join(process.cwd(), 'data', 'curation.yaml');

  let curation: CurationFile = { tools: [], projects: [], interests: [] };

  if (fs.existsSync(curationPath)) {
    const raw = fs.readFileSync(curationPath, 'utf-8');
    curation = yaml.load(raw) as CurationFile;
  }

  return {
    tools: curation.tools || [],
    projects: curation.projects || [],
    interests: curation.interests || [],
    generatedAt: new Date().toISOString(),
  };
}

export function getActiveAtDate(
  items: (Tool | Project | Interest)[],
  date: Date
): (Tool | Project | Interest)[] {
  const dateStr = date.toISOString().split('T')[0];

  return items.filter(item => {
    return item.spans.some(span => {
      const started = span.start <= dateStr;
      const notEnded = !span.end || span.end >= dateStr;
      return started && notEnded;
    });
  });
}

export function getTimelineRange(data: TimelineData): { start: Date; end: Date } {
  const allSpans = [
    ...data.tools.flatMap(t => t.spans),
    ...data.projects.flatMap(p => p.spans),
    ...data.interests.flatMap(i => i.spans),
  ];

  const starts = allSpans.map(s => new Date(s.start));
  const ends = allSpans
    .filter(s => s.end)
    .map(s => new Date(s.end!));

  const earliest = new Date(Math.min(...starts.map(d => d.getTime())));
  const latest = ends.length > 0
    ? new Date(Math.max(...ends.map(d => d.getTime())))
    : new Date();

  return { start: earliest, end: latest };
}
```

**Step 3: Verify it compiles**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npx tsc --noEmit src/lib/timeline.ts`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/timeline.ts package.json package-lock.json
git commit -m "feat: add timeline data loading utilities"
```

---

## Phase 2: Timeline UI Components

Build the timeline interface, starting with a simple scrubber and strata display.

---

### Task 4: Create Timeline Scrubber Component

**Files:**
- Create: `src/components/TimelineScrubber.astro`

**Step 1: Create the scrubber component**

```astro
---
// src/components/TimelineScrubber.astro
export interface Props {
  startYear: number;
  endYear: number;
}

const { startYear, endYear } = Astro.props;
const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
---

<div class="timeline-scrubber" data-start={startYear} data-end={endYear}>
  <div class="timeline-track">
    <div class="timeline-progress"></div>
    <div class="timeline-handle" tabindex="0" role="slider" aria-label="Timeline position"></div>
  </div>
  <div class="timeline-years">
    {years.map(year => (
      <span class="year-marker" data-year={year}>{year}</span>
    ))}
  </div>
  <div class="timeline-current">
    <span class="current-date"></span>
  </div>
</div>

<style>
  .timeline-scrubber {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .timeline-track {
    position: relative;
    height: 8px;
    background: var(--color-border);
    border-radius: 4px;
    cursor: pointer;
  }

  .timeline-progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: var(--color-primary);
    border-radius: 4px;
    width: 100%;
    pointer-events: none;
  }

  .timeline-handle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
    width: 20px;
    height: 20px;
    background: var(--color-primary);
    border: 3px solid var(--color-surface);
    border-radius: 50%;
    cursor: grab;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.1s ease;
  }

  .timeline-handle:hover,
  .timeline-handle:focus {
    transform: translate(50%, -50%) scale(1.2);
    outline: none;
  }

  .timeline-handle:active {
    cursor: grabbing;
  }

  .timeline-years {
    display: flex;
    justify-content: space-between;
    margin-top: var(--spacing-xs);
    font-size: var(--text-small);
    color: var(--color-text-light);
  }

  .year-marker {
    opacity: 0.6;
    transition: opacity 0.2s ease;
  }

  .year-marker.active {
    opacity: 1;
    color: var(--color-primary);
    font-weight: 600;
  }

  .timeline-current {
    text-align: center;
    margin-top: var(--spacing-xs);
    font-family: "Space Grotesk", sans-serif;
    font-size: var(--text-h3);
    color: var(--color-text);
  }
</style>

<script>
  class TimelineScrubber {
    private container: HTMLElement;
    private track: HTMLElement;
    private progress: HTMLElement;
    private handle: HTMLElement;
    private currentDateEl: HTMLElement;
    private startYear: number;
    private endYear: number;
    private position: number = 1; // 0-1, starts at end (now)

    constructor(container: HTMLElement) {
      this.container = container;
      this.track = container.querySelector('.timeline-track')!;
      this.progress = container.querySelector('.timeline-progress')!;
      this.handle = container.querySelector('.timeline-handle')!;
      this.currentDateEl = container.querySelector('.current-date')!;
      this.startYear = parseInt(container.dataset.start || '2010');
      this.endYear = parseInt(container.dataset.end || '2026');

      this.init();
    }

    private init() {
      this.updateDisplay();
      this.bindEvents();
    }

    private bindEvents() {
      let isDragging = false;

      this.handle.addEventListener('mousedown', () => isDragging = true);
      this.track.addEventListener('click', (e) => this.handleClick(e));

      document.addEventListener('mousemove', (e) => {
        if (isDragging) this.handleDrag(e);
      });

      document.addEventListener('mouseup', () => isDragging = false);

      // Keyboard support
      this.handle.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.position = Math.max(0, this.position - 0.02);
          this.updateDisplay();
          this.emitChange();
        } else if (e.key === 'ArrowRight') {
          this.position = Math.min(1, this.position + 0.02);
          this.updateDisplay();
          this.emitChange();
        }
      });
    }

    private handleClick(e: MouseEvent) {
      const rect = this.track.getBoundingClientRect();
      this.position = (e.clientX - rect.left) / rect.width;
      this.position = Math.max(0, Math.min(1, this.position));
      this.updateDisplay();
      this.emitChange();
    }

    private handleDrag(e: MouseEvent) {
      const rect = this.track.getBoundingClientRect();
      this.position = (e.clientX - rect.left) / rect.width;
      this.position = Math.max(0, Math.min(1, this.position));
      this.updateDisplay();
      this.emitChange();
    }

    private updateDisplay() {
      const percentage = this.position * 100;
      this.progress.style.width = `${percentage}%`;
      this.handle.style.right = `${100 - percentage}%`;
      this.handle.style.transform = `translate(50%, -50%)`;

      const currentDate = this.getCurrentDate();
      this.currentDateEl.textContent = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      // Update year markers
      const currentYear = currentDate.getFullYear();
      this.container.querySelectorAll('.year-marker').forEach(marker => {
        const year = parseInt((marker as HTMLElement).dataset.year || '0');
        marker.classList.toggle('active', year === currentYear);
      });
    }

    private getCurrentDate(): Date {
      const totalMs = new Date(this.endYear, 11, 31).getTime() - new Date(this.startYear, 0, 1).getTime();
      const currentMs = new Date(this.startYear, 0, 1).getTime() + (totalMs * this.position);
      return new Date(currentMs);
    }

    private emitChange() {
      const event = new CustomEvent('timeline:change', {
        detail: { date: this.getCurrentDate(), position: this.position },
        bubbles: true,
      });
      this.container.dispatchEvent(event);
    }
  }

  document.querySelectorAll('.timeline-scrubber').forEach(el => {
    new TimelineScrubber(el as HTMLElement);
  });
</script>
```

**Step 2: Verify build passes**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm run build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/TimelineScrubber.astro
git commit -m "feat: add timeline scrubber component"
```

---

### Task 5: Create Strata Display Component

**Files:**
- Create: `src/components/TimelineStrata.astro`

**Step 1: Create the strata component**

```astro
---
// src/components/TimelineStrata.astro
import type { Tool, Project, Interest } from '../types/timeline';

export interface Props {
  tools: Tool[];
  projects: Project[];
  interests: Interest[];
}

const { tools, projects, interests } = Astro.props;
---

<div class="timeline-strata">
  <div class="strata-layer strata-tools">
    <h3 class="strata-label">Tools</h3>
    <div class="strata-items">
      {tools.map(tool => (
        <div
          class={`strata-item tool-item status-${tool.status} source-${tool.source}`}
          data-id={tool.id}
          data-spans={JSON.stringify(tool.spans)}
        >
          <span class="item-name">{tool.name}</span>
          <span class="item-status">{tool.status}</span>
          {tool.take && <p class="item-take">{tool.take}</p>}
          {tool.source === 'ai' && tool.aiReasoning && (
            <p class="item-reasoning">AI: {tool.aiReasoning}</p>
          )}
        </div>
      ))}
    </div>
  </div>

  <div class="strata-layer strata-projects">
    <h3 class="strata-label">Projects</h3>
    <div class="strata-items">
      {projects.map(project => (
        <div
          class={`strata-item project-item status-${project.status} source-${project.source}`}
          data-id={project.id}
          data-spans={JSON.stringify(project.spans)}
        >
          <span class="item-name">{project.name}</span>
          <span class="item-status">{project.status}</span>
          <p class="item-description">{project.description}</p>
        </div>
      ))}
    </div>
  </div>

  <div class="strata-layer strata-interests">
    <h3 class="strata-label">Interests</h3>
    <div class="strata-items">
      {interests.map(interest => (
        <div
          class={`strata-item interest-item status-${interest.status} depth-${interest.depth} source-${interest.source}`}
          data-id={interest.id}
          data-spans={JSON.stringify(interest.spans)}
        >
          <span class="item-name">{interest.name}</span>
          <span class="item-depth">{interest.depth}</span>
        </div>
      ))}
    </div>
  </div>
</div>

<style>
  .timeline-strata {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg) 0;
  }

  .strata-layer {
    position: relative;
  }

  .strata-label {
    font-family: "Space Grotesk", sans-serif;
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-light);
    margin-bottom: var(--spacing-sm);
  }

  .strata-items {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .strata-item {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 8px;
    transition: all 0.3s ease;
    max-width: 300px;
  }

  /* Status-based opacity */
  .strata-item.status-active,
  .strata-item.status-current {
    opacity: 1;
    border-color: var(--color-primary);
  }

  .strata-item.status-exploring {
    opacity: 0.9;
    border-style: dashed;
  }

  .strata-item.status-paused,
  .strata-item.status-recurring {
    opacity: 0.7;
  }

  .strata-item.status-dormant,
  .strata-item.status-past {
    opacity: 0.5;
  }

  .strata-item.status-completed {
    opacity: 0.6;
    border-color: var(--color-secondary);
  }

  .strata-item.status-abandoned {
    opacity: 0.4;
    text-decoration: line-through;
  }

  /* Source-based styling */
  .strata-item.source-ai {
    border-style: dashed;
    background: repeating-linear-gradient(
      45deg,
      var(--color-surface),
      var(--color-surface) 10px,
      var(--color-surface-elevated) 10px,
      var(--color-surface-elevated) 20px
    );
  }

  .strata-item.source-confirmed {
    border-width: 2px;
  }

  /* Temporal visibility - controlled by JS */
  .strata-item.temporal-hidden {
    opacity: 0.15;
    transform: scale(0.95);
  }

  .strata-item.temporal-faded {
    opacity: 0.4;
  }

  .item-name {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 600;
    display: block;
    color: var(--color-text);
  }

  .item-status,
  .item-depth {
    font-size: var(--text-small);
    color: var(--color-text-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .item-take,
  .item-description {
    font-size: var(--text-small);
    color: var(--color-text-light);
    margin-top: var(--spacing-xs);
    line-height: 1.5;
  }

  .item-reasoning {
    font-size: calc(var(--text-small) * 0.9);
    color: var(--color-primary);
    font-style: italic;
    margin-top: var(--spacing-xs);
    padding-left: var(--spacing-sm);
    border-left: 2px solid var(--color-primary);
    opacity: 0.7;
  }

  /* Depth indicators for interests */
  .interest-item.depth-deep {
    border-width: 3px;
  }

  .interest-item.depth-medium {
    border-width: 2px;
  }

  .interest-item.depth-shallow {
    border-width: 1px;
  }

  @media (max-width: 768px) {
    .strata-item {
      max-width: 100%;
      width: 100%;
    }
  }
</style>

<script>
  function updateStrataVisibility(date: Date) {
    const dateStr = date.toISOString().split('T')[0];

    document.querySelectorAll('.strata-item').forEach(item => {
      const spans = JSON.parse((item as HTMLElement).dataset.spans || '[]');

      const isActive = spans.some((span: { start: string; end?: string }) => {
        const started = span.start <= dateStr;
        const notEnded = !span.end || span.end >= dateStr;
        return started && notEnded;
      });

      const wasActive = spans.some((span: { start: string; end?: string }) => {
        return span.end && span.end < dateStr;
      });

      const willBeActive = spans.some((span: { start: string }) => {
        return span.start > dateStr;
      });

      item.classList.remove('temporal-hidden', 'temporal-faded');

      if (!isActive && !wasActive && willBeActive) {
        item.classList.add('temporal-hidden');
      } else if (!isActive && wasActive) {
        item.classList.add('temporal-faded');
      }
    });
  }

  // Listen for timeline changes
  document.addEventListener('timeline:change', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    updateStrataVisibility(detail.date);
  });

  // Initialize with current date
  updateStrataVisibility(new Date());
</script>
```

**Step 2: Verify build passes**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm run build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/TimelineStrata.astro
git commit -m "feat: add timeline strata display component"
```

---

### Task 6: Create Timeline Page

**Files:**
- Create: `src/pages/timeline.astro`

**Step 1: Create the timeline page**

```astro
---
// src/pages/timeline.astro
import Layout from '../layouts/Layout.astro';
import TimelineScrubber from '../components/TimelineScrubber.astro';
import TimelineStrata from '../components/TimelineStrata.astro';
import Contact from '../components/Contact.astro';
import { loadTimelineData, getTimelineRange } from '../lib/timeline';

const data = loadTimelineData();
const range = getTimelineRange(data);
const startYear = range.start.getFullYear();
const endYear = range.end.getFullYear();
---

<Layout
  title="Eric Brookfield - Timeline"
  description="Explore my work, tools, and interests through time."
>
  <main class="timeline-page">
    <header class="timeline-header container">
      <h1>Timeline</h1>
      <p class="subtitle">Scrub through time to see what I was building, using, and thinking about.</p>
    </header>

    <TimelineScrubber startYear={startYear} endYear={endYear} />

    <div class="container">
      <TimelineStrata
        tools={data.tools}
        projects={data.projects}
        interests={data.interests}
      />
    </div>

    <Contact />
  </main>
</Layout>

<style>
  .timeline-page {
    min-height: 100vh;
  }

  .timeline-header {
    padding: var(--spacing-xl) 0 var(--spacing-lg);
    text-align: center;
  }

  .timeline-header h1 {
    font-size: var(--text-h1);
    margin-bottom: var(--spacing-sm);
    color: var(--color-text);
  }

  .subtitle {
    font-size: var(--text-body);
    color: var(--color-text-light);
    max-width: 500px;
    margin: 0 auto;
  }
</style>
```

**Step 2: Verify build passes and page renders**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm run build 2>&1 | tail -10`
Expected: Build succeeds, includes `/timeline/index.html`

**Step 3: Commit**

```bash
git add src/pages/timeline.astro
git commit -m "feat: add timeline page with scrubber and strata"
```

---

### Task 7: Add Timeline Link to Navigation

**Files:**
- Modify: `src/components/Hero.astro`

**Step 1: Add timeline link to hero**

Find the `.bio` paragraph in Hero.astro and add a link after it:

```astro
<!-- Add after the <p class="bio">...</p> element -->
<nav class="hero-nav">
  <a href="/timeline" class="timeline-link">
    <span>Explore Timeline</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  </a>
</nav>
```

**Step 2: Add styles for the nav link (add to Hero.astro <style>)**

```css
.hero-nav {
  margin-top: var(--spacing-md);
  animation: fadeInUp 1.4s ease-out 0.4s backwards;
}

.timeline-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: var(--color-background);
  font-family: "Space Grotesk", sans-serif;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.timeline-link:hover {
  background: var(--color-primary-dark);
  transform: translateX(4px);
}

.timeline-link svg {
  transition: transform 0.2s ease;
}

.timeline-link:hover svg {
  transform: translateX(4px);
}
```

**Step 3: Verify build passes**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm run build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: add timeline navigation link to hero"
```

---

## Phase 3: AI Extraction Pipeline

Build the AI layer that parses blog posts and infers timeline data.

---

### Task 8: Create AI Extraction Script

**Files:**
- Create: `scripts/extract-timeline.ts`
- Modify: `package.json` (add script and dependencies)

**Step 1: Install dependencies**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm install @anthropic-ai/sdk gray-matter`

**Step 2: Create extraction script**

```typescript
// scripts/extract-timeline.ts
import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import type { TimelineData, Tool, Project, Interest } from '../src/types/timeline';

const client = new Anthropic();

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data, content } = matter(raw);
        posts.push({
          slug: entry.name.replace('.md', ''),
          title: data.title || '',
          date: data.date?.toISOString?.() || data.date || '',
          content: content.trim(),
        });
      }
    }
  }

  walkDir(blogDir);
  return posts.sort((a, b) => a.date.localeCompare(b.date));
}

async function extractFromPosts(posts: BlogPost[]): Promise<Partial<TimelineData>> {
  const postsContext = posts.map(p =>
    `[${p.date.split('T')[0]}] ${p.title}\n${p.content.slice(0, 500)}...`
  ).join('\n\n---\n\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Analyze these blog posts and extract timeline data about:
1. Tools/technologies being used (with approximate dates)
2. Projects being worked on
3. Interests/topics being explored

For each item, provide:
- A unique id (lowercase, hyphenated)
- Name
- Status (for tools: active/exploring/dormant/abandoned; for projects: active/paused/completed/abandoned; for interests: current/recurring/past)
- Time spans (start date, optional end date)
- Brief reasoning for why you inferred this

Output as JSON matching this structure:
{
  "tools": [{ "id": "", "name": "", "category": "", "status": "", "spans": [{"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}], "aiReasoning": "" }],
  "projects": [{ "id": "", "name": "", "description": "", "status": "", "spans": [...], "aiReasoning": "" }],
  "interests": [{ "id": "", "name": "", "status": "", "depth": "shallow|medium|deep", "spans": [...], "aiReasoning": "" }]
}

Blog posts:
${postsContext}`
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse AI response as JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Add source: 'ai' to all items
  return {
    tools: (parsed.tools || []).map((t: Tool) => ({ ...t, source: 'ai' as const })),
    projects: (parsed.projects || []).map((p: Project) => ({ ...p, source: 'ai' as const })),
    interests: (parsed.interests || []).map((i: Interest) => ({ ...i, source: 'ai' as const })),
  };
}

async function main() {
  console.log('Loading blog posts...');
  const posts = await loadBlogPosts();
  console.log(`Found ${posts.length} posts`);

  console.log('Extracting timeline data with AI...');
  const aiData = await extractFromPosts(posts);

  console.log('Writing to data/timeline-ai.json...');
  const outputPath = path.join(process.cwd(), 'data', 'timeline-ai.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(aiData, null, 2));

  console.log('Done! Review the output and merge into curation.yaml as needed.');
  console.log(`Extracted: ${aiData.tools?.length || 0} tools, ${aiData.projects?.length || 0} projects, ${aiData.interests?.length || 0} interests`);
}

main().catch(console.error);
```

**Step 3: Add script to package.json**

Add to scripts section:
```json
"extract-timeline": "npx tsx scripts/extract-timeline.ts"
```

**Step 4: Test the script runs (requires ANTHROPIC_API_KEY)**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm run extract-timeline`
Expected: Creates data/timeline-ai.json with extracted data

**Step 5: Commit**

```bash
git add scripts/extract-timeline.ts package.json package-lock.json
git commit -m "feat: add AI timeline extraction script"
```

---

### Task 9: Merge AI Data with Curation

**Files:**
- Modify: `src/lib/timeline.ts`

**Step 1: Update timeline loader to merge AI + curation data**

Replace the loadTimelineData function:

```typescript
// src/lib/timeline.ts
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { TimelineData, Tool, Project, Interest } from '../types/timeline';

interface CurationFile {
  tools?: Tool[];
  projects?: Project[];
  interests?: Interest[];
}

interface AIFile {
  tools?: Tool[];
  projects?: Project[];
  interests?: Interest[];
}

export function loadTimelineData(): TimelineData {
  const curationPath = path.join(process.cwd(), 'data', 'curation.yaml');
  const aiPath = path.join(process.cwd(), 'data', 'timeline-ai.json');

  let curation: CurationFile = { tools: [], projects: [], interests: [] };
  let aiData: AIFile = { tools: [], projects: [], interests: [] };

  if (fs.existsSync(curationPath)) {
    const raw = fs.readFileSync(curationPath, 'utf-8');
    curation = yaml.load(raw) as CurationFile;
  }

  if (fs.existsSync(aiPath)) {
    const raw = fs.readFileSync(aiPath, 'utf-8');
    aiData = JSON.parse(raw) as AIFile;
  }

  // Merge: curation overrides AI data by id
  const mergedTools = mergeById(aiData.tools || [], curation.tools || []);
  const mergedProjects = mergeById(aiData.projects || [], curation.projects || []);
  const mergedInterests = mergeById(aiData.interests || [], curation.interests || []);

  return {
    tools: mergedTools,
    projects: mergedProjects,
    interests: mergedInterests,
    generatedAt: new Date().toISOString(),
  };
}

function mergeById<T extends { id: string }>(aiItems: T[], curationItems: T[]): T[] {
  const merged = new Map<string, T>();

  // Add AI items first
  for (const item of aiItems) {
    merged.set(item.id, item);
  }

  // Curation items override or add
  for (const item of curationItems) {
    merged.set(item.id, item);
  }

  return Array.from(merged.values());
}

export function getActiveAtDate(
  items: (Tool | Project | Interest)[],
  date: Date
): (Tool | Project | Interest)[] {
  const dateStr = date.toISOString().split('T')[0];

  return items.filter(item => {
    return item.spans.some(span => {
      const started = span.start <= dateStr;
      const notEnded = !span.end || span.end >= dateStr;
      return started && notEnded;
    });
  });
}

export function getTimelineRange(data: TimelineData): { start: Date; end: Date } {
  const allSpans = [
    ...data.tools.flatMap(t => t.spans),
    ...data.projects.flatMap(p => p.spans),
    ...data.interests.flatMap(i => i.spans),
  ];

  if (allSpans.length === 0) {
    return { start: new Date('2020-01-01'), end: new Date() };
  }

  const starts = allSpans.map(s => new Date(s.start));
  const ends = allSpans
    .filter(s => s.end)
    .map(s => new Date(s.end!));

  const earliest = new Date(Math.min(...starts.map(d => d.getTime())));
  const latest = ends.length > 0
    ? new Date(Math.max(...ends.map(d => d.getTime())))
    : new Date();

  return { start: earliest, end: latest };
}
```

**Step 2: Verify build passes**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm run build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/lib/timeline.ts
git commit -m "feat: merge AI-extracted data with manual curation"
```

---

## Phase 4: Polish & Integration

Refine the experience and integrate with the main site.

---

### Task 10: Make Timeline the Homepage

**Files:**
- Modify: `src/pages/index.astro`
- Keep: `src/pages/timeline.astro` (as reference, can remove later)

**Step 1: Replace index.astro with timeline-first design**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import TimelineScrubber from '../components/TimelineScrubber.astro';
import TimelineStrata from '../components/TimelineStrata.astro';
import BlogPosts from '../components/BlogPosts.astro';
import Contact from '../components/Contact.astro';
import { loadTimelineData, getTimelineRange } from '../lib/timeline';

const data = loadTimelineData();
const range = getTimelineRange(data);
const startYear = range.start.getFullYear();
const endYear = range.end.getFullYear();
---

<Layout>
  <main class="timeline-home">
    <header class="now-header">
      <div class="container">
        <div class="now-intro">
          <img src="/headshot.jpeg" alt="Eric Brookfield" class="headshot" />
          <div class="now-text">
            <h1>Eric Brookfield</h1>
            <p class="tagline">Engineering Director & Product Designer</p>
            <p class="now-desc">
              This is a living view of what I'm working on, what tools I use, and what I'm thinking about.
              Scrub through time to explore my history.
            </p>
          </div>
        </div>
      </div>
    </header>

    <TimelineScrubber startYear={startYear} endYear={endYear} />

    <div class="container">
      <TimelineStrata
        tools={data.tools}
        projects={data.projects}
        interests={data.interests}
      />
    </div>

    <BlogPosts />
    <Contact />
  </main>
</Layout>

<style>
  .timeline-home {
    min-height: 100vh;
  }

  .now-header {
    background: var(--color-secondary);
    padding: var(--spacing-xl) 0;
  }

  :global([data-theme="light"]) .now-header {
    background: var(--color-background);
  }

  .now-intro {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .headshot {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid var(--color-primary);
    object-fit: cover;
  }

  .now-text h1 {
    font-size: var(--text-h1);
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
  }

  :global([data-theme="light"]) .now-text h1 {
    color: var(--color-secondary);
  }

  .tagline {
    font-size: var(--text-body);
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .now-desc {
    font-size: var(--text-body);
    color: var(--color-text-light);
    max-width: 500px;
  }

  @media (max-width: 768px) {
    .now-intro {
      flex-direction: column;
      text-align: center;
    }

    .headshot {
      width: 100px;
      height: 100px;
    }
  }
</style>
```

**Step 2: Verify build passes**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm run build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: make timeline the homepage experience"
```

---

### Task 11: Add .gitignore for AI Output

**Files:**
- Modify: `.gitignore`

**Step 1: Add timeline-ai.json to gitignore**

Add this line to .gitignore:
```
data/timeline-ai.json
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore AI-generated timeline data"
```

---

### Task 12: Final Build Verification

**Step 1: Run full build**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm run build`
Expected: Build succeeds with no errors

**Step 2: Preview the site**

Run: `cd /Users/ericbrookfield/dev/ericbrookfield.com/.worktrees/temporal-site && npm run preview`
Expected: Site runs, timeline is interactive

**Step 3: Commit any final fixes needed**

---

## Future Tasks (Not in This Plan)

These would be separate implementation phases:

1. **Instagram Integration** - Fetch Instagram posts, add to AI extraction
2. **GitHub Integration** - Pull commit history for project activity
3. **Admin Curation UI** - Web interface for reviewing AI inferences
4. **Zoom Controls** - Week/month/year granularity toggle
5. **Strata Spatial Layout** - Center-stage/periphery positioning
6. **Connection Visualization** - Show relationships between items
