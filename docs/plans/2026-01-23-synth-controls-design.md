# Synthesizer Control Panel Design

Portfolio redesign introducing interactive controls that modulate page appearance, inspired by the business card at `src/assets/business-card.html`. Settings persist in localStorage.

## Overview

Replace the current `ThemeToggle.astro` with an expanded `ControlPanel.astro` component. Three abstract controls adjust visual parameters in real-time:

- **Temperature** — warm/cool palette shift
- **Glow** — radiance/bloom intensity
- **Noise** — film grain texture density

## Architecture

### State Flow

```
localStorage <--> CSS Custom Properties <--> Visual Effects
                        ^
                 ControlPanel.astro
```

### localStorage Keys

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `synth-temperature` | 0–100 | 50 | Palette warmth (50 = neutral) |
| `synth-glow` | 0–100 | 40 | Glow/bloom intensity |
| `synth-noise` | 0–100 | 0 | Noise texture opacity |
| `synth-interacted` | boolean | false | Stops pulse animation after first use |
| `theme` | "dark"/"light" | "dark" | Existing, unchanged |

### Initialization

Blocking script in `<head>` reads localStorage and sets CSS custom properties before render, preventing flash:

```javascript
(function() {
  const root = document.documentElement;
  root.style.setProperty('--synth-temp', localStorage.getItem('synth-temperature') ?? '50');
  root.style.setProperty('--synth-glow', localStorage.getItem('synth-glow') ?? '40');
  root.style.setProperty('--synth-noise', localStorage.getItem('synth-noise') ?? '0');
})();
```

## Control Panel UI

### Collapsed State

- Single circular button (44px), fixed top-right
- Abstract icon (ring or arc)
- Subtle pulsing glow until `synth-interacted` becomes true

### Expanded State

Compact panel (~180px wide) slides/fades below the button:

1. **Three arc controls** — semicircular gauges with draggable dot indicator
   - Minimal labels: T (temperature), G (glow), N (noise) or abstract symbols
2. **Theme toggle** — sun/moon toggle moves inside panel
3. **Reset** — appears on hover, restores defaults (50, 40, 0)

### Interaction Model

- Click button: open/close panel
- Drag arc: value updates CSS in real-time
- Release: persist to localStorage
- Click outside: close panel
- First interaction: set `synth-interacted: true`, stop pulse

## CSS Custom Properties

### Temperature (--synth-temp)

Controls hue rotation on the palette:

- **50 (neutral):** Current palette unchanged
- **< 50 (cool):** Shifts toward teals/blues, hue rotates -30° at 0
- **> 50 (warm):** Shifts toward ambers/golds, hue rotates +30° at 100

Implementation uses HSL with calculated offsets. Current orange primary (~25° hue) shifts ±30° based on temperature value.

Affects:
- `--color-primary` and variants
- `--color-secondary` and variants
- `--color-accent`

### Glow (--synth-glow)

Controls radiance across interactive elements:

- **0:** Clean, flat design
- **100:** Maximum bloom

Affects:
- Box-shadow spread/opacity on cards
- Radial gradient mouse-tracking glow (business card technique)
- Subtle text-shadow on headings
- Border glow on hero image
- SVG drop-shadow on topographic lines

### Noise (--synth-noise)

Controls film grain overlay:

- **0:** Invisible
- **100:** Visible grain

Implementation:
- `body::after` pseudo-element with SVG noise filter or tiled texture
- Opacity tied to `--synth-noise`
- Subtle animation (background-position shift) for analog feel

## Component Changes

### Layout.astro

- Add initialization script for synth variables
- Add noise overlay `::after` on body
- Existing theme initialization unchanged

### ControlPanel.astro (new, replaces ThemeToggle.astro)

- Fixed position top-right
- Collapsed/expanded states
- Arc control components
- Theme toggle integration
- localStorage read/write
- Cross-tab sync via storage event

### Hero.astro

- Topographic SVG paths: `filter: drop-shadow()` tied to glow
- Hero image border: temperature-shifted accent color
- Bio text: subtle text-shadow at high glow

### Projects.astro / Skills.astro

- Cards gain mouse-tracking glow effect from business card
- Intensity scales with `--glow-intensity`

### Global Styles

- Color variables use HSL with temperature offset calculations
- Existing color transitions make shifts smooth
- Utility classes for mouse-tracking glow available to all components

## Business Card Integration

The interaction patterns from `src/assets/business-card.html` become reusable:

- 3D tilt on hover (optional per-component)
- Mouse-tracking radial gradient glow
- Gold accent line reveal animation

These can be extracted as utility styles or a mixin.

## Reset Behavior

- Restores temperature (50), glow (40), noise (0)
- Preserves theme choice (dark/light)
- Does not reset `synth-interacted`

## Cross-Tab Sync

Listen for `storage` event to sync changes across tabs (same pattern as existing theme toggle).
