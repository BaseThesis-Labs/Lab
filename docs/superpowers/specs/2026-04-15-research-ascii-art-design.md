# Research Section ASCII Art — Design Spec

## Overview

Replace the Research section's 2x2 SVG visualization grid with a cinematic split layout: one large, animated, interactive ASCII art canvas on the left and stacked research area cards on the right. The ASCII art cycles through procedurally generated scientific visuals that morph into each other continuously, with mouse-driven interaction.

Inspired by General Intuition's colored ASCII art treatment but differentiated: monochrome accent palette, procedural/mathematical scenes (not image-sourced), and interactive mouse influence.

---

## 1. Layout Restructure

### Current → New

**Current:** `SectionLabel` at top, then a `md:grid-cols-2` grid of 4 research cards, each with its own SVG visualization (ContourMap, ArchitectureBlocks, Waveform, MoleculeGraph) inside a VizFrame.

**New:** `SectionLabel` at top (full width, unchanged), then a `md:grid-cols-12` split:

- **Left (md:col-span-6):** `AsciiCanvas` component — full height of the content area
- **Right (md:col-span-6):** Research areas stacked vertically, separated by thin `ink-border` dividers

### Desktop (md+)

```
┌─────────────────────────────────────────────────────────┐
│  02 / Research                                          │
│  "Four programs. Long horizons."                        │
│  (section intro text)                                   │
├──────────────────────────┬──────────────────────────────┤
│                          │  R.01 · World Models         │
│   ASCII ART CANVAS       │  (title + body + footer)     │
│   (full height)          ├──────────────────────────────┤
│                          │  R.02 · Post-Transformer     │
│   Soft fade on right     │  Architectures               │
│   and bottom edges       ├──────────────────────────────┤
│                          │  R.03 · Neural Interfaces    │
│                          ├──────────────────────────────┤
│                          │  R.04 · Swarm Intelligence   │
└──────────────────────────┴──────────────────────────────┘
```

### Mobile

- ASCII art on top, `aspect-ratio: 16/10`, full width
- Research cards stacked below
- Mouse interaction becomes tap-and-hold on touch devices

---

## 2. AsciiCanvas Component

### File: `src/visuals/AsciiCanvas.tsx`

### Character Grid

- Rendered on a `<canvas>` element
- Cell size: ~10px wide x 14px tall (JetBrains Mono proportions)
- Columns and rows calculated dynamically from container dimensions
- Font: JetBrains Mono (consistent with site's mono font)
- Character density set: ` .,:;!|/?#@$` (12 levels, light → heavy)

### Scene System

5 procedural scenes, each a pure function: `(col, row, time, mouseX, mouseY) → { char, intensity }`

**Scene 1 — DNA Helix:**
Two sinusoidal waves offset by π, connected by horizontal base-pair bridges (`=`, `-`, `~`). Rotates vertically over time. Strand characters: `(`, `)`, `/`, `\` to convey curvature.

**Scene 2 — Neural Network:**
4-5 vertical layers of nodes (dense character clusters: `@`, `#`). Diagonal connection paths between layers: `.`, `:`, `|`. Nodes pulse in intensity. Connections animate left-to-right.

**Scene 3 — Wave Interference:**
Two point sources emitting concentric circular waves. Constructive overlap = dense characters, destructive = sparse. Ring characters: `.`, `o`, `O`, `0`. Creates moire-like pattern.

**Scene 4 — Molecular Lattice:**
Hexagonal node grid (`*`, `+`) connected by bonds (`-`, `/`, `\`). Slowly rotates in pseudo-3D isometric projection. Bond characters change to convey perspective.

**Scene 5 — Orbital Paths:**
Elliptical paths at various tilts around central nucleus (`@`). Electrons move along orbits leaving fading trails. Probability cloud density mapped to character weight.

### Scene Transitions

- Each scene holds for ~8 seconds
- Crossfade over ~2 seconds
- During crossfade: interpolate intensity between outgoing and incoming scene
- Character chosen from whichever scene has higher intensity at each cell
- Creates organic dissolve, not hard cut

### Animation Loop

- `requestAnimationFrame` loop
- Canvas paint every frame, scene calculations throttled to ~24fps (~42ms intervals)
- Uses `document.hidden` / visibility API to pause when tab is hidden
- `prefers-reduced-motion`: stops scene cycling, renders a single static frame, disables mouse interaction

---

## 3. Color Treatment

All colors from the existing site palette — no new colors introduced.

| Role | Color | Opacity Range |
|------|-------|---------------|
| Base characters | `#E8D9BE` (accent) | 0.15 – 0.8 mapped to intensity |
| High-intensity peaks (nodes, nuclei, wave crests) | `#EDEDED` (ink-text) | 0.7 – 1.0 |
| Background fill (low-density substrate) | `#737373` (ink-muted) | 0.1 – 0.2 |
| Canvas background | `transparent` | — |

No per-scene color variation. Differentiation comes from shapes and patterns. Monochrome stays cohesive with site design.

---

## 4. Mouse Interaction

- Track mouse position relative to canvas, normalized to 0–1
- **Influence radius:** ~15% of canvas width
- **Displacement:** Characters within radius shift away from cursor (gravitational lens effect)
- **Intensity boost:** +0.3 intensity for characters near cursor (brighter glow)
- **Character override:** Closest ~5% of characters to cursor swap to denser characters (`#`, `@`, `$`)
- **Easing:** Mouse position lerps at 0.08 factor per frame (smooth, laggy follow)
- **Mouse leave:** Influence fades over ~0.5s, field returns to natural state
- **Touch (mobile):** Tap-and-hold activates same effect at touch position. Release fades out.
- **Listener options:** `{ passive: true }` on all mouse/touch listeners

---

## 5. Edge Treatment

No hard border on the canvas. CSS mask applied to the canvas element:

- **Right edge:** Gradient fade to transparent (toward text column)
- **Bottom edge:** Gradient fade to transparent
- **Left edge:** Bleeds to section/container boundary
- **Top edge:** Bleeds to section/container boundary

Implementation: CSS `mask-image` with `linear-gradient` composite, same pattern as the hero section's gradient overlays.

---

## 6. Research Cards (Right Column)

Simplified from current card-with-visualization to text-only stacked items.

### Per Card Structure

```
┌──────────────────────────────┐
│ R.01 · Active                │  micro-label + status badge
│                              │
│ World Models                 │  title: text-2xl md:text-3xl
│                              │
│ Learned simulators of        │  body: text-base, ink-dim
│ physical and economic...     │
│                              │
│ Program lead · TBA        →  │  footer: mono, ink-muted, hover arrow
└──────────────────────────────┘
```

- No VizFrame, no individual SVG visualization per card
- Separated by `border-b border-ink-border` dividers (not full border boxes)
- Padding: `py-8 md:py-10` per card
- Hover accent underline animation preserved (scale-x-0 → scale-x-100)
- `RevealOnScroll` stagger preserved for each card
- Last card has no bottom border

---

## 7. Performance

| Concern | Mitigation |
|---------|------------|
| DPR scaling | Capped at 2 (same as ShaderBackground) |
| Canvas sizing | Sized to container, not window |
| Tab hidden | Pause animation via visibility API |
| Reduced motion | Static frame, no animation, no interaction |
| Mouse listeners | `{ passive: true }` |
| Scene calculation | Throttled to ~24fps, canvas paint at native rate |

---

## 8. File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/visuals/AsciiCanvas.tsx` | **Create** | Canvas component: scene engine, animation loop, mouse interaction, edge masking |
| `src/components/Research.tsx` | **Rewrite** | Split layout, AsciiCanvas left, stacked cards right. Remove VizFrame/SVG viz imports |
| `src/styles/index.css` | **Minor edit** | Add CSS mask utility for canvas edge fade if not achievable inline |

### Not Touched

- `src/visuals/ContourMap.tsx`, `ArchitectureBlocks.tsx`, `Waveform.tsx`, `MoleculeGraph.tsx` — remain in codebase, no longer imported by Research. Still used potentially elsewhere.
- All other components, content files, and config files unchanged.

---

## 9. Accessibility

- Canvas element gets `aria-hidden="true"` (purely decorative)
- All research content remains in semantic HTML (headings, paragraphs)
- `prefers-reduced-motion` respected: static frame, no animation
- Tab/keyboard navigation unaffected — canvas is not focusable
- Touch interaction is enhancement only, not required for content access
