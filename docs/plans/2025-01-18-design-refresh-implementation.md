# Design Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the burnt orange + teal color system and Space Grotesk typography to all site components.

**Architecture:** Update CSS custom properties in Layout.astro, then propagate changes through each component. The color system uses `--color-primary` (burnt orange) and `--color-secondary` (teal) with theme-aware values.

**Tech Stack:** Astro 5.x, CSS custom properties, Google Fonts (Space Grotesk, Inter)

---

## Task 1: Update Font Imports and Color Variables

**Files:**
- Modify: `src/layouts/Layout.astro`

**Step 1: Update Google Fonts import**

Replace lines 24-29 (the font link) with:

```html
<link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap"
    rel="stylesheet"
/>
```

**Step 2: Update CSS variables**

Replace the entire `:root` and theme blocks (lines 57-129) with:

```css
:root {
    --max-width: 1200px;
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 3rem;
    --spacing-xl: 5rem;

    /* Type scale */
    --text-hero: clamp(3.5rem, 10vw, 6rem);
    --text-h1: clamp(2.5rem, 6vw, 4rem);
    --text-h2: clamp(1.75rem, 4vw, 2.5rem);
    --text-h3: 1.25rem;
    --text-body: 1.125rem;
    --text-small: 0.875rem;
}

/* Dark theme (default) */
:root,
[data-theme="dark"] {
    --color-primary: #E07A3D;
    --color-primary-light: #E8956A;
    --color-primary-dark: #C66A2F;
    --color-secondary: #1A5F5A;
    --color-secondary-light: #2A7A74;
    --color-accent: #E07A3D;
    --color-text: #F5F0E8;
    --color-text-light: #9CA3AF;
    --color-background: #0D1117;
    --color-surface: #161B22;
    --color-surface-elevated: #1C2128;
    --color-border: rgba(255, 255, 255, 0.1);
    --color-hover: rgba(224, 122, 61, 0.1);
}

/* Light theme */
[data-theme="light"] {
    --color-primary: #E07A3D;
    --color-primary-light: #E8956A;
    --color-primary-dark: #C66A2F;
    --color-secondary: #1A5F5A;
    --color-secondary-light: #2A7A74;
    --color-accent: #E07A3D;
    --color-text: #1A2B2A;
    --color-text-light: #5C6B6A;
    --color-background: #FAF7F2;
    --color-surface: #FFFFFF;
    --color-surface-elevated: #FFFFFF;
    --color-border: rgba(26, 95, 90, 0.15);
    --color-hover: rgba(224, 122, 61, 0.1);
}
```

**Step 3: Update base typography**

Replace lines 137-163 (html, body, and heading styles) with:

```css
html,
body {
    margin: 0;
    width: 100%;
    min-height: 100%;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: var(--text-body);
    color: var(--color-text);
    background-color: var(--color-background);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition:
        background-color 0.3s ease,
        color 0.3s ease;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: "Space Grotesk", sans-serif;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.02em;
}

h1 {
    font-size: var(--text-h1);
}

h2 {
    font-size: var(--text-h2);
    position: relative;
    display: inline-block;
}

h2::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--color-secondary);
}

h3 {
    font-size: var(--text-h3);
    font-weight: 600;
}
```

**Step 4: Verify changes**

Run: `npm run dev`

Open: http://localhost:4321

Expected: Site loads with new color scheme (burnt orange links, teal accents, Space Grotesk headlines). Some components may look broken until updated.

**Step 5: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: update color system and typography to burnt orange + teal"
```

---

## Task 2: Update Editorial CSS

**Files:**
- Modify: `src/styles/editorial.css`

**Step 1: Update font variables and remove drop cap styles**

Replace lines 1-71 with:

```css
/* Editorial Typography System - Burnt Orange + Teal */

/* Typography Variables */
:root {
    --font-display: 'Space Grotesk', sans-serif;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    /* Line Heights */
    --leading-tight: 0.9;
    --leading-snug: 1.2;
    --leading-normal: 1.6;
    --leading-relaxed: 1.8;
    --leading-loose: 2;

    /* Letter Spacing */
    --tracking-tighter: -0.03em;
    --tracking-tight: -0.02em;
    --tracking-normal: 0;
    --tracking-wide: 0.025em;
    --tracking-wider: 0.05em;
    --tracking-widest: 0.1em;
}

/* Editorial Color Palette */
[data-theme="dark"] {
    --editorial-cream: #F5F0E8;
    --editorial-gray: #9CA3AF;
    --editorial-dark-bg: #0D1117;
    --editorial-surface: rgba(255, 255, 255, 0.03);
    --editorial-border: rgba(255, 255, 255, 0.1);
}

[data-theme="light"] {
    --editorial-cream: #1A2B2A;
    --editorial-gray: #5C6B6A;
    --editorial-dark-bg: #FAF7F2;
    --editorial-surface: rgba(0, 0, 0, 0.03);
    --editorial-border: rgba(26, 95, 90, 0.15);
}
```

**Step 2: Update lead text and remove drop cap class**

Replace lines 73-87 with:

```css
/* Lead Text */
.lead-text {
    font-size: var(--text-body);
    line-height: var(--leading-normal);
    margin-bottom: 1.5rem;
    font-weight: 400;
    color: var(--color-text-light);
    font-family: var(--font-body);
}
```

**Step 3: Update pull quotes**

Replace lines 88-129 with:

```css
/* Pull Quotes */
.pull-quote {
    font-family: var(--font-display);
    font-size: var(--text-h2);
    font-weight: 500;
    text-align: center;
    margin: 3rem 0;
    padding: 2.5rem;
    border-top: 2px solid var(--color-secondary);
    border-bottom: 2px solid var(--color-secondary);
    color: var(--editorial-cream);
    line-height: var(--leading-snug);
    position: relative;
}

.pull-quote::before {
    content: '"';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 6rem;
    color: var(--color-primary);
    opacity: 0.3;
    font-family: var(--font-display);
}

.pull-quote.accent {
    background: var(--editorial-surface);
    border-left: 4px solid var(--color-primary);
    border-top: none;
    border-bottom: none;
    text-align: left;
    padding: 2rem;
}
```

**Step 4: Update headlines and chapter labels**

Replace lines 130-173 with:

```css
/* Headlines */
.headline {
    font-family: var(--font-display);
    font-size: var(--text-hero);
    font-weight: 700;
    line-height: var(--leading-tight);
    margin-bottom: 2rem;
    color: var(--editorial-cream);
    letter-spacing: var(--tracking-tight);
}

.headline-xl {
    font-size: clamp(4rem, 10vw, 8rem);
}

.headline-lg {
    font-size: var(--text-hero);
}

.headline-md {
    font-size: var(--text-h1);
}

/* Subheadlines */
.subheadline {
    font-family: var(--font-body);
    font-size: var(--text-body);
    font-weight: 400;
    color: var(--editorial-gray);
    margin-bottom: 1rem;
    letter-spacing: var(--tracking-wide);
}

/* Chapter Labels */
.chapter-label {
    font-family: var(--font-display);
    font-size: var(--text-small);
    font-weight: 700;
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--color-primary);
    display: block;
    margin-bottom: 1rem;
}
```

**Step 5: Update stats and timeline to use new colors**

Replace lines 188-250 with:

```css
/* Stats Blocks */
.stats-block {
    display: flex;
    justify-content: space-around;
    padding: 2.5rem;
    background: var(--editorial-surface);
    border-left: 4px solid var(--color-secondary);
    margin: 2rem 0;
    flex-wrap: wrap;
    gap: 2rem;
}

.stat {
    text-align: center;
}

.stat-number {
    display: block;
    font-family: var(--font-display);
    font-size: var(--text-h1);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: var(--editorial-gray);
}

/* Timeline */
.timeline {
    margin: 2rem 0;
}

.timeline-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--editorial-border);
    transition: all 0.3s;
}

.timeline-item:hover {
    background: var(--editorial-surface);
    border-left: 3px solid var(--color-secondary);
    margin-left: -3px;
}

.timeline-item.active {
    background: var(--editorial-surface);
    border-left: 4px solid var(--color-primary);
}

.timeline .time {
    font-weight: 600;
    color: var(--color-primary);
}

.timeline .event {
    color: var(--editorial-cream);
}
```

**Step 6: Update callout blocks**

Replace lines 251-273 with:

```css
/* Callout Blocks */
.callout {
    padding: 2rem;
    background: var(--editorial-surface);
    border-left: 4px solid var(--color-secondary);
    margin: 2rem 0;
    border-radius: 0;
}

.callout-title {
    font-family: var(--font-display);
    font-size: var(--text-h3);
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--color-primary);
}

.callout-content {
    font-size: var(--text-body);
    line-height: var(--leading-relaxed);
    color: var(--editorial-cream);
}
```

**Step 7: Verify changes**

Run: `npm run dev`

Expected: Typography updates visible, teal/orange accents on editorial elements.

**Step 8: Commit**

```bash
git add src/styles/editorial.css
git commit -m "feat: update editorial styles for new design system"
```

---

## Task 3: Redesign Hero Component

**Files:**
- Modify: `src/components/Hero.astro`

**Step 1: Update the hero markup**

Replace lines 14-38 with:

```html
<section class="hero">
    <div class="container">
        <div class="hero-content">
            <div class="hero-text">
                <span class="chapter-label">Portfolio & Works</span>
                <h1 class="headline headline-lg">{name}</h1>
                <div class="byline">
                    <span class="title">{title}</span>
                    <span class="separator">/</span>
                    <span class="location">{location}</span>
                </div>
                <p class="bio">
                    I excel at building digital products and leading teams through
                    the software development lifecycle. With over 15 years in the
                    industry, I bring a unique combination of technical expertise
                    and design sensibility to create meaningful digital experiences.
                </p>
            </div>
            <div class="hero-image">
                <img src={imageUrl} alt={`${name} headshot`} />
            </div>
        </div>
    </div>
</section>
```

**Step 2: Replace all styles**

Replace lines 40-144 with:

```css
<style>
    .hero {
        padding: var(--spacing-xl) 0;
        background: var(--color-secondary);
    }

    [data-theme="light"] .hero {
        background: var(--color-background);
    }

    .hero-content {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--spacing-xl);
        align-items: center;
    }

    .hero-text .chapter-label {
        color: var(--color-primary);
        animation: fadeInUp 0.6s ease-out;
    }

    [data-theme="light"] .hero-text .chapter-label {
        color: var(--color-primary);
    }

    .hero-text .headline {
        color: var(--color-primary);
        margin-bottom: var(--spacing-sm);
        animation: fadeInUp 0.8s ease-out 0.1s backwards;
    }

    [data-theme="light"] .hero-text .headline {
        color: var(--color-secondary);
    }

    .byline {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: var(--spacing-md);
        animation: fadeInUp 1s ease-out 0.2s backwards;
    }

    .title {
        font-family: "Inter", sans-serif;
        font-size: 1.1rem;
        font-weight: 500;
        color: #F5F0E8;
    }

    [data-theme="light"] .title {
        color: var(--color-text);
    }

    .separator {
        color: var(--color-primary);
        opacity: 0.5;
    }

    .location {
        font-family: "Inter", sans-serif;
        font-size: 1.1rem;
        color: rgba(245, 240, 232, 0.7);
    }

    [data-theme="light"] .location {
        color: var(--color-text-light);
    }

    .bio {
        font-family: "Inter", sans-serif;
        font-size: var(--text-body);
        line-height: 1.7;
        max-width: 550px;
        color: rgba(245, 240, 232, 0.85);
        animation: fadeInUp 1.2s ease-out 0.3s backwards;
    }

    [data-theme="light"] .bio {
        color: var(--color-text-light);
    }

    .hero-image {
        width: 260px;
        height: 260px;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid var(--color-primary);
        animation: fadeInUp 1s ease-out 0.2s backwards;
    }

    .hero-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .hero-image {
            width: 180px;
            height: 180px;
            margin: 0 auto;
            order: -1;
        }

        .byline {
            justify-content: center;
        }

        .bio {
            margin: 0 auto;
        }
    }
</style>
```

**Step 3: Verify changes**

Run: `npm run dev`

Expected: Hero has teal background (dark mode), burnt orange name, circular headshot with orange border.

**Step 4: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: redesign hero with teal background and orange accents"
```

---

## Task 4: Update Blog Posts Component

**Files:**
- Modify: `src/components/BlogPosts.astro`

**Step 1: Update section headline styling**

Replace lines 12-18 with:

```html
<section class="blog-posts">
    <div class="container">
        <span class="chapter-label">Recent Writing</span>
        <h2>Words & Thoughts</h2>
        <p class="section-intro">
            Thoughts on technology, design, and the craft of building digital products.
        </p>
```

**Step 2: Replace all styles**

Replace lines 84-239 with:

```css
<style>
    .blog-posts {
        padding: var(--spacing-xl) 0;
        background: var(--color-background);
    }

    .blog-posts .chapter-label {
        animation: fadeInUp 0.6s ease-out;
    }

    .blog-posts h2 {
        margin-bottom: var(--spacing-sm);
        color: var(--color-text);
        animation: fadeInUp 0.8s ease-out 0.1s backwards;
    }

    .section-intro {
        font-size: var(--text-body);
        margin-bottom: var(--spacing-lg);
        max-width: 700px;
        animation: fadeInUp 1s ease-out 0.2s backwards;
        color: var(--color-text-light);
    }

    .posts-list {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--spacing-lg);
    }

    .post {
        padding: 1.5rem 0;
        border-bottom: 1px solid var(--color-border);
        transition: all 0.3s ease;
    }

    .post:hover {
        background: var(--color-hover);
        padding-left: 1rem;
        margin-left: -1rem;
        margin-right: -1rem;
        padding-right: 1rem;
        border-left: 3px solid var(--color-secondary);
    }

    .post:last-of-type {
        border-bottom: none;
    }

    .post-content {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
    }

    .post-date {
        font-family: "Inter", sans-serif;
        font-size: var(--text-small);
        font-weight: 600;
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        min-width: 120px;
        padding-top: 0.25rem;
    }

    .post-text {
        flex: 1;
    }

    .post h3 {
        margin-bottom: var(--spacing-xs);
        font-family: "Space Grotesk", sans-serif;
        font-size: var(--text-h2);
        font-weight: 700;
        line-height: 1.2;
    }

    .post h3::after {
        display: none;
    }

    .post h3 a {
        color: var(--color-text);
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .post h3 a:hover {
        color: var(--color-primary);
    }

    .post-excerpt {
        font-family: "Inter", sans-serif;
        font-size: 1rem;
        line-height: 1.7;
        margin-top: var(--spacing-xs);
        color: var(--color-text-light);
        font-weight: 400;
    }

    .view-all {
        text-align: center;
        padding-top: var(--spacing-md);
    }

    .archive-link {
        font-family: "Inter", sans-serif;
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-primary);
        text-decoration: none;
        transition: all 0.2s ease;
        display: inline-block;
        position: relative;
    }

    .archive-link:hover {
        color: var(--color-primary-dark);
    }

    .archive-link::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--color-primary);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .archive-link:hover::after {
        transform: scaleX(1);
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .post-content {
            flex-direction: column;
            gap: 0.5rem;
        }

        .post-date {
            min-width: auto;
        }

        .post h3 {
            font-size: 1.5rem;
        }

        .post:hover {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
        }
    }
</style>
```

**Step 3: Verify changes**

Expected: Blog posts use orange dates, teal left-border on hover.

**Step 4: Commit**

```bash
git add src/components/BlogPosts.astro
git commit -m "feat: update blog posts with new color scheme"
```

---

## Task 5: Update Projects and ProjectCard

**Files:**
- Modify: `src/components/Projects.astro`
- Modify: `src/components/ProjectCard.astro`

**Step 1: Update Projects.astro section headline**

Replace lines 29-40 with:

```html
<section class="projects">
    <div class="container">
        <span class="chapter-label">Selected Work</span>
        <h2>Projects</h2>
        <p class="section-intro">
            A showcase of recent projects and long-term enterprise solutions
            I've architected and delivered.
        </p>
        <div class="projects-grid">
            {projects.map((project, index) => <ProjectCard {...project} index={index} />)}
        </div>
    </div>
</section>
```

**Step 2: Update Projects.astro styles**

Replace lines 42-96 with:

```css
<style>
    .projects {
        padding: var(--spacing-xl) 0;
        background: var(--color-surface);
    }

    .projects .chapter-label {
        margin-bottom: 0.5rem;
    }

    .projects h2 {
        margin-bottom: var(--spacing-sm);
        color: var(--color-text);
    }

    .section-intro {
        font-size: var(--text-body);
        margin-bottom: var(--spacing-lg);
        max-width: 700px;
        color: var(--color-text-light);
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: var(--spacing-md);
    }

    @media (max-width: 768px) {
        .projects-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
```

**Step 3: Update ProjectCard.astro props**

Replace lines 1-19 with:

```astro
---
export interface Props {
    title: string;
    description: string;
    tags?: string[];
    link?: string;
    image?: string;
    featured?: boolean;
    index?: number;
}

const {
    title,
    description,
    tags = [],
    link,
    image,
    featured = false,
    index = 0,
} = Astro.props;

const accentColor = index % 2 === 0 ? 'orange' : 'teal';
---
```

**Step 4: Update ProjectCard markup**

Replace line 21 with:

```html
<article class={`project-card ${featured ? "featured" : ""} accent-${accentColor}`}>
```

**Step 5: Replace ProjectCard styles**

Replace lines 56-160 with:

```css
<style>
    .project-card {
        background: var(--color-background);
        border: 1px solid var(--color-border);
        overflow: hidden;
        transition: all 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .project-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .project-card.accent-orange:hover {
        border-color: var(--color-primary);
    }

    .project-card.accent-teal:hover {
        border-color: var(--color-secondary);
    }

    .project-card.featured {
        grid-column: span 2;
    }

    .project-image {
        width: 100%;
        height: 200px;
        background: var(--color-surface);
        overflow: hidden;
    }

    .project-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .project-card:hover .project-image img {
        transform: scale(1.05);
    }

    .project-content {
        padding: var(--spacing-md);
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .project-content h3 {
        margin-bottom: var(--spacing-sm);
        color: var(--color-text);
        font-family: "Space Grotesk", sans-serif;
    }

    .project-content h3::after {
        display: none;
    }

    .project-content p {
        margin-bottom: var(--spacing-sm);
        flex: 1;
        color: var(--color-text-light);
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-xs);
        margin-bottom: var(--spacing-sm);
    }

    .accent-orange .tag {
        background: rgba(224, 122, 61, 0.15);
        color: var(--color-primary);
    }

    .accent-teal .tag {
        background: rgba(26, 95, 90, 0.15);
        color: var(--color-secondary);
    }

    .tag {
        padding: 0.35rem 0.85rem;
        font-size: 0.8rem;
        font-weight: 500;
        font-family: "Inter", sans-serif;
        border-radius: 2px;
        transition: opacity 0.2s ease;
    }

    .project-link {
        display: inline-flex;
        align-items: center;
        font-weight: 600;
        font-family: "Inter", sans-serif;
        margin-top: auto;
    }

    .accent-orange .project-link {
        color: var(--color-primary);
    }

    .accent-teal .project-link {
        color: var(--color-secondary);
    }

    .project-link:hover {
        opacity: 0.8;
    }

    @media (max-width: 768px) {
        .project-card.featured {
            grid-column: span 1;
        }
    }
</style>
```

**Step 6: Verify changes**

Expected: Project cards alternate between orange and teal accents.

**Step 7: Commit**

```bash
git add src/components/Projects.astro src/components/ProjectCard.astro
git commit -m "feat: update project cards with alternating accent colors"
```

---

## Task 6: Update Skills Component

**Files:**
- Modify: `src/components/Skills.astro`

**Step 1: Update markup to add index for alternating colors**

Replace lines 39-58 with:

```html
<section class="skills">
  <div class="container">
    <span class="chapter-label">Core Expertise</span>
    <h2>Skills</h2>
    <p class="section-intro">
      15+ years of experience bridging the gap between design and engineering,
      with deep expertise in building and scaling digital products.
    </p>
    <div class="skills-grid">
      {skillCategories.map((category, index) => (
        <div class={`skill-category accent-${index % 2 === 0 ? 'orange' : 'teal'}`}>
          <h3>{category.title}</h3>
          <ul>
            {category.skills.map(skill => (
              <li>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Step 2: Replace styles**

Replace lines 61-120 with:

```css
<style>
  .skills {
    padding: var(--spacing-xl) 0;
    background: var(--color-background);
  }

  .skills .chapter-label {
    margin-bottom: 0.5rem;
  }

  .skills h2 {
    margin-bottom: var(--spacing-sm);
    color: var(--color-text);
  }

  .section-intro {
    font-size: var(--text-body);
    margin-bottom: var(--spacing-lg);
    max-width: 700px;
    color: var(--color-text-light);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
  }

  .skill-category {
    background: var(--color-surface);
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
  }

  .skill-category h3 {
    margin-bottom: var(--spacing-md);
    font-size: var(--text-h3);
    font-family: "Space Grotesk", sans-serif;
  }

  .skill-category h3::after {
    display: none;
  }

  .skill-category.accent-orange h3 {
    color: var(--color-primary);
  }

  .skill-category.accent-teal h3 {
    color: var(--color-secondary);
  }

  .skill-category ul {
    list-style: none;
  }

  .skill-category li {
    padding: var(--spacing-xs) 0;
    color: var(--color-text-light);
    position: relative;
    padding-left: 1.5rem;
  }

  .skill-category.accent-orange li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: var(--color-primary);
    font-weight: 400;
  }

  .skill-category.accent-teal li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: var(--color-secondary);
    font-weight: 400;
  }

  @media (max-width: 768px) {
    .skills-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

**Step 3: Verify and commit**

```bash
git add src/components/Skills.astro
git commit -m "feat: update skills with alternating accent colors"
```

---

## Task 7: Update Contact Component

**Files:**
- Modify: `src/components/Contact.astro`

**Step 1: Update markup**

Replace lines 21-44 with:

```html
<section class="contact">
    <div class="container">
        <span class="chapter-label">Get In Touch</span>
        <h2>Let's Connect</h2>
        <p class="section-intro">
            I'm always interested in discussing new opportunities, interesting
            projects, or how I can help your team succeed.
        </p>
        <div class="contact-methods">
            {
                contactMethods.map((method) => (
                    <a
                        href={method.href}
                        class="contact-method"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span class="label">{method.label}</span>
                        <span class="value">{method.value}</span>
                    </a>
                ))
            }
        </div>
    </div>
</section>
```

**Step 2: Replace styles**

Replace lines 46-114 with:

```css
<style>
    .contact {
        padding: var(--spacing-xl) 0;
        background: var(--color-secondary);
        text-align: center;
    }

    [data-theme="light"] .contact {
        background: var(--color-surface);
    }

    .contact .chapter-label {
        color: var(--color-primary);
        margin-bottom: 0.5rem;
    }

    .contact h2 {
        margin-bottom: var(--spacing-sm);
        color: #F5F0E8;
    }

    .contact h2::after {
        background: var(--color-primary);
    }

    [data-theme="light"] .contact h2 {
        color: var(--color-text);
    }

    .section-intro {
        font-size: var(--text-body);
        margin: 0 auto var(--spacing-lg);
        max-width: 600px;
        color: rgba(245, 240, 232, 0.8);
    }

    [data-theme="light"] .section-intro {
        color: var(--color-text-light);
    }

    .contact-methods {
        display: flex;
        justify-content: center;
        gap: var(--spacing-md);
        flex-wrap: wrap;
    }

    .contact-method {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--spacing-md) var(--spacing-lg);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        min-width: 200px;
        transition: all 0.3s ease;
    }

    [data-theme="light"] .contact-method {
        background: var(--color-background);
        border-color: var(--color-border);
    }

    .contact-method:hover {
        transform: translateY(-2px);
        border-color: var(--color-primary);
        background: rgba(224, 122, 61, 0.1);
    }

    .contact-method .label {
        font-family: "Inter", sans-serif;
        font-size: var(--text-small);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-primary);
        margin-bottom: var(--spacing-xs);
    }

    .contact-method .value {
        color: #F5F0E8;
        font-size: 0.95rem;
    }

    [data-theme="light"] .contact-method .value {
        color: var(--color-text);
    }

    @media (max-width: 768px) {
        .contact-methods {
            flex-direction: column;
            align-items: center;
        }

        .contact-method {
            width: 100%;
            max-width: 300px;
        }
    }
</style>
```

**Step 3: Verify and commit**

```bash
git add src/components/Contact.astro
git commit -m "feat: update contact section with teal background"
```

---

## Task 8: Update Theme Toggle

**Files:**
- Modify: `src/components/ThemeToggle.astro`

**Step 1: Replace styles only**

Replace lines 44-103 with:

```css
<style>
    .theme-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        background: transparent;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        padding: 0;
    }

    [data-theme="light"] .theme-toggle {
        border-color: var(--color-border);
    }

    .theme-toggle:hover {
        border-color: var(--color-primary);
        background: rgba(224, 122, 61, 0.1);
    }

    .theme-toggle:hover svg {
        color: var(--color-primary);
    }

    .theme-toggle svg {
        position: absolute;
        color: rgba(255, 255, 255, 0.7);
        transition: all 0.3s ease;
    }

    [data-theme="light"] .theme-toggle svg {
        color: var(--color-text-light);
    }

    .sun-icon {
        opacity: 0;
        transform: rotate(180deg);
    }

    .moon-icon {
        opacity: 1;
        transform: rotate(0deg);
    }

    :global([data-theme="light"]) .sun-icon {
        opacity: 1;
        transform: rotate(0deg);
    }

    :global([data-theme="light"]) .moon-icon {
        opacity: 0;
        transform: rotate(-180deg);
    }

    @media (max-width: 768px) {
        .theme-toggle {
            top: 10px;
            right: 10px;
        }
    }
</style>
```

**Step 2: Verify and commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "feat: update theme toggle styling"
```

---

## Task 9: Final Verification

**Step 1: Run full build**

```bash
npm run build
```

Expected: Build completes without errors.

**Step 2: Preview production build**

```bash
npm run preview
```

**Step 3: Manual verification checklist**

- [ ] Dark mode: Teal hero background, burnt orange name
- [ ] Light mode: Off-white hero, teal name
- [ ] Blog posts: Orange dates, teal hover border
- [ ] Projects: Alternating orange/teal accents
- [ ] Skills: Alternating orange/teal headers
- [ ] Contact: Teal background (dark), surface (light)
- [ ] Theme toggle: Works, orange hover state
- [ ] Mobile: All sections responsive

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: design refresh complete - burnt orange + teal theme"
```

---

## Summary

| Task | Component | Key Changes |
|------|-----------|-------------|
| 1 | Layout.astro | Color variables, font imports |
| 2 | editorial.css | Typography system, remove drop caps |
| 3 | Hero.astro | Teal background, orange name, circular photo |
| 4 | BlogPosts.astro | Orange dates, teal hover border |
| 5 | Projects + ProjectCard | Alternating accent colors |
| 6 | Skills.astro | Alternating accent colors |
| 7 | Contact.astro | Teal background section |
| 8 | ThemeToggle.astro | Circular, orange hover |
| 9 | Verification | Build, preview, manual check |
