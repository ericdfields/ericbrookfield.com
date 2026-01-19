# Design Refresh: Bold Retro-Modern

## Overview

A visual refresh focused on bold color and contrast with a burnt orange + teal palette and geometric typography. The goal is a distinctive, personality-forward design that stands out from typical portfolio sites.

## Design Principles

1. **Color as the hero** - Burnt orange and teal create complementary tension
2. **Geometric confidence** - Space Grotesk headlines with tight tracking
3. **Alternating energy** - Sections trade off between warm/cool dominance
4. **Less decoration** - Drop caps and flourishes removed in favor of bold color blocks

---

## Color System

### Primary Palette

| Role | Hex | Usage |
|------|-----|-------|
| Burnt Orange | `#E07A3D` | Primary accent, CTAs, links, highlights |
| Deep Teal | `#1A5F5A` | Secondary accent, headers, section backgrounds |
| Dark Background | `#0D1117` | Near-black with cool undertone |
| Light Background | `#FAF7F2` | Warm off-white for light mode |

### Dark Mode

| Role | Value |
|------|-------|
| `--color-text` | `#F5F0E8` |
| `--color-text-secondary` | `#9CA3AF` |
| `--color-background` | `#0D1117` |
| `--color-surface` | `#161B22` |
| `--color-border` | `rgba(255,255,255,0.1)` |
| `--color-primary` | `#E07A3D` |
| `--color-secondary` | `#1A5F5A` |

### Light Mode

| Role | Value |
|------|-------|
| `--color-text` | `#1A2B2A` |
| `--color-text-secondary` | `#5C6B6A` |
| `--color-background` | `#FAF7F2` |
| `--color-surface` | `#FFFFFF` |
| `--color-border` | `rgba(26,95,90,0.15)` |
| `--color-primary` | `#E07A3D` |
| `--color-secondary` | `#1A5F5A` |

---

## Typography System

### Fonts

| Role | Font | Weights |
|------|------|---------|
| Headlines | Space Grotesk | 500, 700 |
| Body | Inter | 400, 500, 600 |

Google Fonts URL:
```
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap
```

### Type Scale

```css
--text-hero: clamp(3.5rem, 10vw, 6rem);
--text-h1: clamp(2.5rem, 6vw, 4rem);
--text-h2: clamp(1.75rem, 4vw, 2.5rem);
--text-h3: 1.25rem;
--text-body: 1.125rem;
--text-small: 0.875rem;
```

### Key Decisions

- Headlines: Space Grotesk, letter-spacing `-0.02em`
- Body: Inter at 1.125rem, line-height 1.7
- Labels/metadata: Inter 600, uppercase, letter-spacing `0.05em`
- No drop caps - replaced with color blocking or bold first lines

---

## Component Specifications

### Hero Section

**Dark mode:**
- Full-width teal (`#1A5F5A`) background
- Name in burnt orange (`#E07A3D`), Space Grotesk 700
- Bio text in warm white (`#F5F0E8`)
- Headshot: circular crop, 4px burnt orange border

**Light mode:**
- Warm off-white background
- Name in deep teal
- Bio text in dark teal-black

**Layout:**
- Two-column grid maintained
- Chapter label: uppercase, small, burnt orange
- Headshot overlaps section boundary slightly for visual interest

### Blog Posts

- Date: burnt orange, Inter 600, uppercase
- Title: Space Grotesk 700, teal-black (dark: warm white)
- Hover: teal left-border appears, subtle surface background
- Remove slide-left animation

### Projects & Skills

- Cards with subtle border (no background fill)
- Alternating accent colors: odd cards use orange accents, even use teal
- Section headline: Space Grotesk with short teal underline (40px wide, 3px thick)

### Contact

- Centered layout
- Links in burnt orange, underline grows on hover
- Optional: teal background block to mirror hero

### Theme Toggle

- Position: fixed top-right
- Icon: sun/moon
- Hover: burnt orange color

---

## Files to Modify

1. `src/layouts/Layout.astro` - CSS variables, font imports
2. `src/styles/editorial.css` - Typography system, remove drop caps
3. `src/components/Hero.astro` - New hero design
4. `src/components/BlogPosts.astro` - Updated post styling
5. `src/components/Projects.astro` - Card accent alternation
6. `src/components/Skills.astro` - Card accent alternation
7. `src/components/Contact.astro` - Simplified styling
8. `src/components/ThemeToggle.astro` - Repositioned, new icon style

---

## Migration Notes

- Remove Playfair Display and Crimson Text font imports
- Remove `.drop-cap` and `.drop-cap-inline` styles
- Update all `--color-primary` references (was green, now orange)
- Add `--color-secondary` variable for teal
