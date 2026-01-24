# Synthesizer Control Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the theme toggle with an expandable control panel featuring three arc-based controls (temperature, glow, noise) that modulate page appearance with localStorage persistence.

**Architecture:** CSS custom properties drive all visual effects. A ControlPanel component manages state and renders arc controls. Initialization script in `<head>` prevents flash. Effects cascade through existing components via updated CSS variables.

**Tech Stack:** Astro, vanilla JS, CSS custom properties, SVG for arc controls

---

## Task 1: Add Initialization Script to Layout

**Files:**
- Modify: `src/layouts/Layout.astro:61-67`

**Step 1: Add synth initialization alongside theme init**

In `Layout.astro`, update the existing inline script to also initialize synth variables:

```javascript
// Initialize theme and synth settings immediately to prevent flash
(function () {
    const root = document.documentElement;

    // Theme
    const theme = localStorage.getItem("theme") || "dark";
    root.setAttribute("data-theme", theme);

    // Synth controls
    root.style.setProperty('--synth-temp', localStorage.getItem('synth-temperature') ?? '50');
    root.style.setProperty('--synth-glow', localStorage.getItem('synth-glow') ?? '40');
    root.style.setProperty('--synth-noise', localStorage.getItem('synth-noise') ?? '0');
})();
```

**Step 2: Verify no flash on page load**

Run: `npm run dev`
Open browser, check that no flash occurs on load.

**Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add synth control initialization to prevent flash"
```

---

## Task 2: Add CSS Variables and Temperature Effect

**Files:**
- Modify: `src/layouts/Layout.astro:75-127` (global styles)

**Step 1: Add synth CSS custom properties with HSL color calculations**

Add after the `[data-theme="light"]` block, before the `*` reset:

```css
/* Synth control defaults */
:root {
    --synth-temp: 50;
    --synth-glow: 40;
    --synth-noise: 0;

    /* Temperature offset: maps 0-100 to -30deg to +30deg */
    --temp-offset: calc((var(--synth-temp) - 50) * 0.6);

    /* Glow intensity: maps 0-100 to usable multiplier */
    --glow-intensity: calc(var(--synth-glow) / 100);

    /* Noise opacity */
    --noise-opacity: calc(var(--synth-noise) / 100);
}

/* Override colors with temperature-shifted HSL */
:root,
[data-theme="dark"] {
    --color-primary: hsl(calc(25 + var(--temp-offset, 0)), 74%, 55%);
    --color-primary-light: hsl(calc(25 + var(--temp-offset, 0)), 74%, 66%);
    --color-primary-dark: hsl(calc(25 + var(--temp-offset, 0)), 74%, 46%);
    --color-secondary: hsl(calc(174 + var(--temp-offset, 0)), 57%, 24%);
    --color-secondary-light: hsl(calc(174 + var(--temp-offset, 0)), 50%, 31%);
    --color-accent: hsl(calc(25 + var(--temp-offset, 0)), 74%, 55%);
}

[data-theme="light"] {
    --color-primary: hsl(calc(25 + var(--temp-offset, 0)), 74%, 55%);
    --color-primary-light: hsl(calc(25 + var(--temp-offset, 0)), 74%, 66%);
    --color-primary-dark: hsl(calc(25 + var(--temp-offset, 0)), 74%, 46%);
    --color-secondary: hsl(calc(174 + var(--temp-offset, 0)), 57%, 24%);
    --color-secondary-light: hsl(calc(174 + var(--temp-offset, 0)), 50%, 31%);
    --color-accent: hsl(calc(25 + var(--temp-offset, 0)), 74%, 55%);
}
```

**Step 2: Test temperature shift manually**

Run: `npm run dev`
Open browser console, run:
```javascript
document.documentElement.style.setProperty('--synth-temp', '0');
// Should shift cool (bluer)
document.documentElement.style.setProperty('--synth-temp', '100');
// Should shift warm (more orange/gold)
```

**Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add temperature-based HSL color shifting"
```

---

## Task 3: Add Noise Overlay

**Files:**
- Modify: `src/layouts/Layout.astro` (global styles, after body styles)

**Step 1: Add noise overlay pseudo-element**

Add after the `html, body` styles:

```css
/* Noise texture overlay */
body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: var(--noise-opacity, 0);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
    mix-blend-mode: overlay;
    animation: noise-shift 0.5s steps(5) infinite;
}

@keyframes noise-shift {
    0% { background-position: 0 0; }
    100% { background-position: 256px 256px; }
}
```

**Step 2: Test noise manually**

Run: `npm run dev`
Open browser console, run:
```javascript
document.documentElement.style.setProperty('--synth-noise', '50');
// Should show visible grain
document.documentElement.style.setProperty('--synth-noise', '0');
// Should be invisible
```

**Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add animated noise texture overlay"
```

---

## Task 4: Add Glow Effects to Components

**Files:**
- Modify: `src/layouts/Layout.astro` (global styles)
- Modify: `src/components/Hero.astro`

**Step 1: Add glow utility styles globally**

Add to global styles in Layout.astro:

```css
/* Glow effects driven by --glow-intensity */
.glow-text {
    text-shadow: 0 0 calc(20px * var(--glow-intensity, 0)) var(--color-primary);
}

.glow-border {
    box-shadow:
        0 0 calc(30px * var(--glow-intensity, 0)) calc(-5px * var(--glow-intensity, 0)) var(--color-primary),
        inset 0 0 calc(10px * var(--glow-intensity, 0)) rgba(255, 255, 255, calc(0.1 * var(--glow-intensity, 0)));
}

/* Mouse-tracking glow mixin pattern */
.glow-track {
    --mouse-x: 50%;
    --mouse-y: 50%;
    position: relative;
}

.glow-track::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: radial-gradient(
        400px circle at var(--mouse-x) var(--mouse-y),
        hsla(calc(25 + var(--temp-offset, 0)), 74%, 55%, calc(0.25 * var(--glow-intensity, 0))),
        transparent 40%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
}

.glow-track:hover::after {
    opacity: 1;
}
```

**Step 2: Add glow to hero image**

In `Hero.astro`, update the `.hero-image` styles:

```css
.hero-image {
    position: relative;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid var(--color-primary);
    animation: fadeInUp 1s ease-out 0.2s backwards;
    box-shadow: 0 0 calc(40px * var(--glow-intensity, 0)) calc(-10px) var(--color-primary);
    transition: box-shadow 0.3s ease;
}
```

**Step 3: Add glow to headline**

In `Hero.astro`, update the `.hero-text .headline` styles:

```css
.hero-text .headline {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
    animation: fadeInUp 0.8s ease-out 0.1s backwards;
    text-shadow: 0 0 calc(30px * var(--glow-intensity, 0)) var(--color-primary);
    transition: text-shadow 0.3s ease;
}
```

**Step 4: Test glow manually**

Run: `npm run dev`
Open browser console, run:
```javascript
document.documentElement.style.setProperty('--synth-glow', '100');
// Should show dramatic glow on headline and image
document.documentElement.style.setProperty('--synth-glow', '0');
// Should be flat
```

**Step 5: Commit**

```bash
git add src/layouts/Layout.astro src/components/Hero.astro
git commit -m "feat: add glow effects to hero section"
```

---

## Task 5: Create Arc Control Component

**Files:**
- Create: `src/components/ArcControl.astro`

**Step 1: Create the arc control component**

```astro
---
export interface Props {
    id: string;
    label: string;
    min?: number;
    max?: number;
    defaultValue?: number;
}

const { id, label, min = 0, max = 100, defaultValue = 50 } = Astro.props;
---

<div class="arc-control" data-id={id} data-min={min} data-max={max} data-default={defaultValue}>
    <svg class="arc-svg" viewBox="0 0 60 40" aria-hidden="true">
        <!-- Background arc -->
        <path
            class="arc-bg"
            d="M 10 35 A 25 25 0 0 1 50 35"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
        />
        <!-- Value arc -->
        <path
            class="arc-value"
            d="M 10 35 A 25 25 0 0 1 50 35"
            fill="none"
            stroke="var(--color-primary)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-dasharray="78.5"
            stroke-dashoffset="78.5"
        />
        <!-- Draggable dot -->
        <circle
            class="arc-dot"
            cx="10"
            cy="35"
            r="6"
            fill="var(--color-primary)"
        />
    </svg>
    <span class="arc-label">{label}</span>
</div>

<style>
    .arc-control {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: grab;
        user-select: none;
        touch-action: none;
    }

    .arc-control:active {
        cursor: grabbing;
    }

    .arc-svg {
        width: 60px;
        height: 40px;
    }

    .arc-bg {
        color: rgba(255, 255, 255, 0.15);
    }

    :global([data-theme="light"]) .arc-bg {
        color: rgba(0, 0, 0, 0.15);
    }

    .arc-value {
        transition: stroke-dashoffset 0.1s ease-out;
    }

    .arc-dot {
        transition: transform 0.1s ease-out;
        filter: drop-shadow(0 0 4px var(--color-primary));
    }

    .arc-label {
        font-size: 10px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-text-light);
    }
</style>
```

**Step 2: Commit**

```bash
git add src/components/ArcControl.astro
git commit -m "feat: create arc control component"
```

---

## Task 6: Create Control Panel Component

**Files:**
- Create: `src/components/ControlPanel.astro`

**Step 1: Create the control panel component**

```astro
---
import ArcControl from "./ArcControl.astro";
---

<div class="control-panel" id="controlPanel">
    <button class="control-toggle" id="controlToggle" aria-label="Open appearance controls" aria-expanded="false">
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
    </button>

    <div class="control-drawer" id="controlDrawer">
        <div class="control-grid">
            <ArcControl id="temperature" label="T" defaultValue={50} />
            <ArcControl id="glow" label="G" defaultValue={40} />
            <ArcControl id="noise" label="N" defaultValue={0} />
        </div>

        <div class="control-divider"></div>

        <button class="theme-toggle-inner" id="themeToggleInner" aria-label="Toggle theme">
            <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        </button>

        <button class="reset-button" id="resetControls" aria-label="Reset to defaults" title="Reset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
            </svg>
        </button>
    </div>
</div>

<style>
    .control-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
    }

    .control-toggle {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    :global([data-theme="light"]) .control-toggle {
        border-color: var(--color-border);
    }

    .control-toggle:hover {
        border-color: var(--color-primary);
        background: rgba(224, 122, 61, 0.1);
    }

    .control-toggle svg {
        width: 20px;
        height: 20px;
        color: rgba(255, 255, 255, 0.7);
        transition: color 0.3s ease;
    }

    :global([data-theme="light"]) .control-toggle svg {
        color: var(--color-text);
    }

    .control-toggle:hover svg {
        color: var(--color-primary);
    }

    /* Pulse animation for first-time discovery */
    .control-toggle.pulse {
        animation: toggle-pulse 3s ease-in-out infinite;
    }

    @keyframes toggle-pulse {
        0%, 100% { box-shadow: 0 0 0 0 transparent; }
        50% { box-shadow: 0 0 20px 2px var(--color-primary); }
    }

    .control-drawer {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
        pointer-events: none;
        transition: all 0.2s ease;
    }

    .control-drawer.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    }

    .control-grid {
        display: flex;
        gap: 16px;
    }

    .control-divider {
        width: 100%;
        height: 1px;
        background: var(--color-border);
    }

    .theme-toggle-inner {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid var(--color-border);
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.3s ease;
    }

    .theme-toggle-inner:hover {
        border-color: var(--color-primary);
        background: var(--color-hover);
    }

    .theme-toggle-inner svg {
        width: 18px;
        height: 18px;
        position: absolute;
        color: var(--color-text-light);
        transition: all 0.3s ease;
    }

    .theme-toggle-inner:hover svg {
        color: var(--color-primary);
    }

    .sun-icon { opacity: 0; transform: rotate(180deg); }
    .moon-icon { opacity: 1; transform: rotate(0deg); }

    :global([data-theme="light"]) .sun-icon { opacity: 1; transform: rotate(0deg); }
    :global([data-theme="light"]) .moon-icon { opacity: 0; transform: rotate(-180deg); }

    .reset-button {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        border: none;
        background: transparent;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .control-drawer:hover .reset-button {
        opacity: 0.5;
    }

    .reset-button:hover {
        opacity: 1 !important;
    }

    .reset-button svg {
        width: 14px;
        height: 14px;
        color: var(--color-text-light);
    }

    @media (max-width: 768px) {
        .control-panel {
            top: 10px;
            right: 10px;
        }
    }
</style>
```

**Step 2: Commit**

```bash
git add src/components/ControlPanel.astro
git commit -m "feat: create control panel component with drawer"
```

---

## Task 7: Add Control Panel JavaScript

**Files:**
- Modify: `src/components/ControlPanel.astro` (add script at bottom)

**Step 1: Add the interaction script**

Add at the bottom of `ControlPanel.astro`, after the closing `</style>`:

```astro
<script>
    // State
    const state = {
        temperature: parseInt(localStorage.getItem('synth-temperature') ?? '50'),
        glow: parseInt(localStorage.getItem('synth-glow') ?? '40'),
        noise: parseInt(localStorage.getItem('synth-noise') ?? '0'),
        interacted: localStorage.getItem('synth-interacted') === 'true',
        isOpen: false
    };

    // Elements
    const panel = document.getElementById('controlPanel');
    const toggle = document.getElementById('controlToggle');
    const drawer = document.getElementById('controlDrawer');
    const themeToggle = document.getElementById('themeToggleInner');
    const resetBtn = document.getElementById('resetControls');

    // Pulse animation if not interacted
    if (!state.interacted && toggle) {
        toggle.classList.add('pulse');
    }

    // Toggle drawer
    toggle?.addEventListener('click', () => {
        state.isOpen = !state.isOpen;
        drawer?.classList.toggle('open', state.isOpen);
        toggle.setAttribute('aria-expanded', String(state.isOpen));

        if (!state.interacted) {
            state.interacted = true;
            localStorage.setItem('synth-interacted', 'true');
            toggle.classList.remove('pulse');
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (state.isOpen && panel && !panel.contains(e.target as Node)) {
            state.isOpen = false;
            drawer?.classList.remove('open');
            toggle?.setAttribute('aria-expanded', 'false');
        }
    });

    // Theme toggle
    themeToggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // Reset controls
    resetBtn?.addEventListener('click', () => {
        state.temperature = 50;
        state.glow = 40;
        state.noise = 0;

        updateCSS('temperature', 50);
        updateCSS('glow', 40);
        updateCSS('noise', 0);

        localStorage.setItem('synth-temperature', '50');
        localStorage.setItem('synth-glow', '40');
        localStorage.setItem('synth-noise', '0');

        // Update arc visuals
        updateArcVisual('temperature', 50);
        updateArcVisual('glow', 40);
        updateArcVisual('noise', 0);
    });

    // Arc control interaction
    const arcControls = document.querySelectorAll('.arc-control');

    arcControls.forEach(control => {
        const id = control.getAttribute('data-id');
        const min = parseInt(control.getAttribute('data-min') || '0');
        const max = parseInt(control.getAttribute('data-max') || '100');
        const defaultVal = parseInt(control.getAttribute('data-default') || '50');

        // Initialize visual
        const initial = id ? (state as any)[id] ?? defaultVal : defaultVal;
        updateArcVisual(id!, initial);

        let isDragging = false;

        const handleMove = (clientX: number, clientY: number) => {
            if (!isDragging) return;

            const svg = control.querySelector('.arc-svg');
            if (!svg) return;

            const rect = svg.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.bottom;

            // Calculate angle from center to pointer
            const angle = Math.atan2(centerY - clientY, clientX - centerX);

            // Map angle (PI to 0) to value (0 to 100)
            let normalized = (Math.PI - angle) / Math.PI;
            normalized = Math.max(0, Math.min(1, normalized));
            const value = Math.round(min + normalized * (max - min));

            updateArcVisual(id!, value);
            updateCSS(id!, value);
            (state as any)[id!] = value;
        };

        const handleEnd = () => {
            if (isDragging && id) {
                isDragging = false;
                const key = id === 'temperature' ? 'synth-temperature' :
                            id === 'glow' ? 'synth-glow' : 'synth-noise';
                localStorage.setItem(key, String((state as any)[id]));
            }
        };

        control.addEventListener('mousedown', (e) => {
            isDragging = true;
            handleMove((e as MouseEvent).clientX, (e as MouseEvent).clientY);
        });

        control.addEventListener('touchstart', (e) => {
            isDragging = true;
            const touch = (e as TouchEvent).touches[0];
            handleMove(touch.clientX, touch.clientY);
        }, { passive: true });

        document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        }, { passive: true });

        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchend', handleEnd);
    });

    function updateArcVisual(id: string, value: number) {
        const control = document.querySelector(`[data-id="${id}"]`);
        if (!control) return;

        const min = parseInt(control.getAttribute('data-min') || '0');
        const max = parseInt(control.getAttribute('data-max') || '100');
        const normalized = (value - min) / (max - min);

        const arcPath = control.querySelector('.arc-value') as SVGPathElement;
        const dot = control.querySelector('.arc-dot') as SVGCircleElement;

        if (arcPath) {
            // Arc length is ~78.5 (half circle with r=25)
            const dashOffset = 78.5 * (1 - normalized);
            arcPath.style.strokeDashoffset = String(dashOffset);
        }

        if (dot) {
            // Calculate dot position along arc
            const angle = Math.PI - (normalized * Math.PI);
            const cx = 30 + 25 * Math.cos(angle);
            const cy = 35 - 25 * Math.sin(angle);
            dot.setAttribute('cx', String(cx));
            dot.setAttribute('cy', String(cy));
        }
    }

    function updateCSS(id: string, value: number) {
        const root = document.documentElement;
        const varName = id === 'temperature' ? '--synth-temp' :
                        id === 'glow' ? '--synth-glow' : '--synth-noise';
        root.style.setProperty(varName, String(value));
    }

    // Cross-tab sync
    window.addEventListener('storage', (e) => {
        if (e.key === 'synth-temperature' && e.newValue) {
            const val = parseInt(e.newValue);
            state.temperature = val;
            updateCSS('temperature', val);
            updateArcVisual('temperature', val);
        }
        if (e.key === 'synth-glow' && e.newValue) {
            const val = parseInt(e.newValue);
            state.glow = val;
            updateCSS('glow', val);
            updateArcVisual('glow', val);
        }
        if (e.key === 'synth-noise' && e.newValue) {
            const val = parseInt(e.newValue);
            state.noise = val;
            updateCSS('noise', val);
            updateArcVisual('noise', val);
        }
        if (e.key === 'theme' && e.newValue) {
            document.documentElement.setAttribute('data-theme', e.newValue);
        }
    });
</script>
```

**Step 2: Commit**

```bash
git add src/components/ControlPanel.astro
git commit -m "feat: add control panel interactivity and persistence"
```

---

## Task 8: Replace ThemeToggle with ControlPanel

**Files:**
- Modify: `src/layouts/Layout.astro`

**Step 1: Update imports**

Replace the ThemeToggle import with ControlPanel:

```astro
---
import ControlPanel from "../components/ControlPanel.astro";

export interface Props {
```

**Step 2: Update component usage**

Replace `<ThemeToggle />` with `<ControlPanel />` in the body.

**Step 3: Verify the site works**

Run: `npm run dev`
- Click the control button - drawer should open
- Drag arcs - values should update in real-time
- Refresh page - values should persist
- Open in second tab - changes should sync

**Step 4: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: replace ThemeToggle with ControlPanel"
```

---

## Task 9: Add Glow to Project Cards

**Files:**
- Modify: `src/components/Projects.astro`

**Step 1: Read current Projects.astro**

Understand the current card structure.

**Step 2: Add mouse-tracking glow to project cards**

Add the `glow-track` class to project cards and implement mouse tracking.

Add to the component's `<style>`:

```css
.project-card {
    /* existing styles... */
    position: relative;
}

.project-card::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: radial-gradient(
        400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        hsla(calc(25 + var(--temp-offset, 0)), 74%, 55%, calc(0.2 * var(--glow-intensity, 0))),
        transparent 40%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
}

.project-card:hover::after {
    opacity: 1;
}
```

Add script for mouse tracking:

```astro
<script>
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = (card as HTMLElement).getBoundingClientRect();
            const x = (e as MouseEvent).clientX - rect.left;
            const y = (e as MouseEvent).clientY - rect.top;
            (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
            (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
        });
    });
</script>
```

**Step 3: Commit**

```bash
git add src/components/Projects.astro
git commit -m "feat: add mouse-tracking glow to project cards"
```

---

## Task 10: Add Glow to Skills Section

**Files:**
- Modify: `src/components/Skills.astro`

**Step 1: Read current Skills.astro**

Understand the current structure.

**Step 2: Add glow effects**

Apply similar mouse-tracking glow pattern to skill items/cards.

**Step 3: Commit**

```bash
git add src/components/Skills.astro
git commit -m "feat: add glow effects to skills section"
```

---

## Task 11: Final Testing and Cleanup

**Files:**
- Delete: `src/components/ThemeToggle.astro`

**Step 1: Delete the old ThemeToggle**

```bash
rm src/components/ThemeToggle.astro
```

**Step 2: Full test pass**

Run: `npm run build`
Verify build completes without errors.

Run: `npm run dev`
Manual testing checklist:
- [ ] Temperature control shifts colors warm/cool
- [ ] Glow control affects headline, image border, card hovers
- [ ] Noise control adds/removes film grain
- [ ] Theme toggle (inside panel) switches light/dark
- [ ] Reset button restores defaults
- [ ] Pulse animation appears on first visit
- [ ] Pulse stops after first interaction
- [ ] Settings persist across page refresh
- [ ] Settings sync across tabs
- [ ] Mobile: controls work with touch

**Step 3: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove old ThemeToggle component"
```

---

## Task 12: Final Commit and Summary

**Step 1: Review all changes**

```bash
git log --oneline main..HEAD
```

**Step 2: Ensure build passes**

```bash
npm run build
```

**Step 3: Summary**

The synthesizer control panel is complete with:
- Temperature control (warm/cool palette shift)
- Glow control (radiance intensity)
- Noise control (film grain texture)
- Theme toggle (light/dark mode)
- Pulse animation for discovery
- localStorage persistence
- Cross-tab synchronization
- Mouse-tracking glow on cards
