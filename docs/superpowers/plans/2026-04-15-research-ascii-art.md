# Research Section ASCII Art — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Research section's SVG visualization grid with a cinematic split layout featuring one large, animated, interactive canvas-based ASCII art that cycles through 5 procedural scientific scenes.

**Architecture:** A pure-function scene system (`ascii-scenes.ts`) feeds into a canvas renderer (`AsciiCanvas.tsx`) that handles animation, transitions, and mouse interaction. The Research component is rewritten as a two-column split: ASCII canvas left, stacked text cards right.

**Tech Stack:** React 18 + TypeScript, Canvas 2D API, requestAnimationFrame, CSS mask-image for edge fading, Tailwind for layout.

**Spec:** `docs/superpowers/specs/2026-04-15-research-ascii-art-design.md`

---

### Task 1: Create Scene Functions

**Files:**
- Create: `src/visuals/ascii-scenes.ts`

This file defines the `SceneFn` type and 5 procedural scene functions. Each scene is a pure function that maps a grid cell + time to a character and intensity value.

- [ ] **Step 1: Create `src/visuals/ascii-scenes.ts` with types and all 5 scenes**

```ts
// src/visuals/ascii-scenes.ts

export interface SceneCell {
  char: string;
  intensity: number; // 0–1
}

/**
 * A scene function computes the character and intensity for one grid cell.
 * All coordinates are normalized 0–1 (nx = col/cols, ny = row/rows).
 */
export type SceneFn = (
  nx: number,
  ny: number,
  time: number,
) => SceneCell;

const PI = Math.PI;
const TAU = PI * 2;

// Character sets for different visual roles
const DENSITY = ' .,:;!|/?#@$';
function densityChar(t: number): string {
  const i = Math.floor(Math.max(0, Math.min(1, t)) * (DENSITY.length - 1));
  return DENSITY[i];
}

// ── Scene 1: DNA Double Helix ──────────────────────────────────────────

const STRAND_CHARS = '(){}|/\\';
const BRIDGE_CHARS = '=-~:';

export const dnaHelix: SceneFn = (nx, ny, time) => {
  const freq = 8;
  const phase = ny * freq + time * 1.2;

  // Two strands offset by PI
  const x1 = 0.5 + 0.22 * Math.sin(phase);
  const x2 = 0.5 + 0.22 * Math.sin(phase + PI);

  const d1 = Math.abs(nx - x1);
  const d2 = Math.abs(nx - x2);
  const minD = Math.min(d1, d2);

  // Bridge between strands when they're close in x
  const midX = (x1 + x2) / 2;
  const span = Math.abs(x1 - x2);
  const onBridge = Math.abs(ny % 0.08 - 0.04) < 0.01
    && nx > Math.min(x1, x2) + 0.02
    && nx < Math.max(x1, x2) - 0.02;

  if (minD < 0.025) {
    // On a strand
    const idx = Math.floor((phase * 3) % STRAND_CHARS.length);
    return { char: STRAND_CHARS[Math.abs(idx)], intensity: 0.7 + 0.3 * (1 - minD / 0.025) };
  }

  if (onBridge && span > 0.08) {
    const bridgePos = Math.abs(nx - midX) / (span / 2);
    const idx = Math.floor(bridgePos * BRIDGE_CHARS.length);
    return { char: BRIDGE_CHARS[Math.min(idx, BRIDGE_CHARS.length - 1)], intensity: 0.35 + 0.2 * (1 - bridgePos) };
  }

  // Background: faint substrate
  if (minD < 0.12) {
    const fade = 1 - minD / 0.12;
    return { char: densityChar(fade * 0.2), intensity: fade * 0.12 };
  }

  return { char: '.', intensity: 0.04 + 0.02 * Math.sin(nx * 20 + ny * 15 + time) };
};

// ── Scene 2: Neural Network ────────────────────────────────────────────

const LAYER_X = [0.12, 0.32, 0.52, 0.72, 0.92];
const NODES_PER_LAYER = [3, 5, 6, 5, 3];

function nodePositions(): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let l = 0; l < LAYER_X.length; l++) {
    const count = NODES_PER_LAYER[l];
    for (let n = 0; n < count; n++) {
      const y = (n + 1) / (count + 1);
      out.push([LAYER_X[l], y]);
    }
  }
  return out;
}

const NODES = nodePositions();

export const neuralNetwork: SceneFn = (nx, ny, time) => {
  let maxIntensity = 0;
  let bestChar = '.';

  // Check proximity to nodes
  for (let i = 0; i < NODES.length; i++) {
    const [nodex, nodey] = NODES[i];
    const dx = nx - nodex;
    const dy = (ny - nodey) * 1.6; // aspect correction
    const d = Math.sqrt(dx * dx + dy * dy);
    const pulse = 0.6 + 0.4 * Math.sin(time * 2.5 + i * 0.7);

    if (d < 0.02) {
      const intensity = pulse * 0.95;
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        bestChar = '@';
      }
    } else if (d < 0.045) {
      const intensity = pulse * 0.55 * (1 - d / 0.045);
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        bestChar = '#';
      }
    }
  }

  // Check connections between adjacent layers
  let layerStart = 0;
  for (let l = 0; l < LAYER_X.length - 1; l++) {
    const countA = NODES_PER_LAYER[l];
    const countB = NODES_PER_LAYER[l + 1];
    const nextStart = layerStart + countA;

    for (let a = 0; a < countA; a++) {
      for (let b = 0; b < countB; b++) {
        const [ax, ay] = NODES[layerStart + a];
        const [bx, by] = NODES[nextStart + b];

        // Point-to-line-segment distance
        const dx = bx - ax;
        const dy = by - ay;
        const len2 = dx * dx + dy * dy;
        let t = ((nx - ax) * dx + (ny - ay) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        const px = ax + t * dx;
        const py = ay + t * dy;
        const dist = Math.sqrt((nx - px) ** 2 + ((ny - py) * 1.6) ** 2);

        if (dist < 0.012) {
          // Flowing signal animation
          const signal = 0.3 + 0.3 * Math.sin(t * 8 - time * 4 + a + b);
          if (signal > maxIntensity) {
            maxIntensity = signal;
            bestChar = t % 0.15 < 0.075 ? ':' : '.';
          }
        }
      }
    }
    layerStart += countA;
  }

  if (maxIntensity < 0.03) {
    return { char: '.', intensity: 0.03 + 0.015 * Math.sin(nx * 25 + ny * 18 + time * 0.5) };
  }

  return { char: bestChar, intensity: maxIntensity };
};

// ── Scene 3: Wave Interference ─────────────────────────────────────────

const SOURCE_A: [number, number] = [0.3, 0.35];
const SOURCE_B: [number, number] = [0.7, 0.65];
const WAVE_CHARS = ' .oO0@';

export const waveInterference: SceneFn = (nx, ny, time) => {
  const aspect = 1.4;
  const da = Math.sqrt((nx - SOURCE_A[0]) ** 2 + ((ny - SOURCE_A[1]) * aspect) ** 2);
  const db = Math.sqrt((nx - SOURCE_B[0]) ** 2 + ((ny - SOURCE_B[1]) * aspect) ** 2);

  const freq = 28;
  const speed = 3;
  const waveA = Math.sin(da * freq - time * speed);
  const waveB = Math.sin(db * freq - time * speed * 1.1);
  const combined = (waveA + waveB) / 2; // -1 to 1

  const intensity = (combined + 1) / 2; // 0 to 1

  // Near sources: bright markers
  if (da < 0.03 || db < 0.03) {
    return { char: '@', intensity: 0.9 };
  }

  const charIdx = Math.floor(intensity * (WAVE_CHARS.length - 1));
  return {
    char: WAVE_CHARS[charIdx],
    intensity: intensity * 0.65 + 0.05,
  };
};

// ── Scene 4: Molecular Lattice ─────────────────────────────────────────

export const molecularLattice: SceneFn = (nx, ny, time) => {
  // Hex grid with slow rotation
  const angle = time * 0.3;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  // Center and rotate
  const cx = nx - 0.5;
  const cy = (ny - 0.5) * 1.4; // aspect
  const rx = cx * ca - cy * sa;
  const ry = cx * sa + cy * ca;

  // Hex grid parameters
  const scale = 9;
  const sx = rx * scale;
  const sy = ry * scale;

  // Hex coordinates
  const q = (sx * Math.sqrt(3) / 3 - sy / 3);
  const r = sy * 2 / 3;

  // Round to nearest hex center
  let qr = Math.round(q);
  let rr = Math.round(r);
  const sr = Math.round(-q - r);
  const qDiff = Math.abs(qr - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(sr - (-q - r));

  if (qDiff > rDiff && qDiff > sDiff) {
    qr = -rr - sr;
  } else if (rDiff > sDiff) {
    rr = -qr - sr;
  }

  // Distance from nearest hex center
  const hx = qr * Math.sqrt(3) + rr * Math.sqrt(3) / 2;
  const hy = rr * 1.5;
  const dist = Math.sqrt((sx - hx) ** 2 + (sy - hy) ** 2);

  // Node
  if (dist < 0.25) {
    const pulse = 0.7 + 0.3 * Math.sin(time * 1.5 + qr * 2 + rr * 3);
    return { char: dist < 0.1 ? '*' : '+', intensity: pulse };
  }

  // Bond lines (approximate: if far from node center but within cell)
  if (dist < 0.7) {
    const bondIntensity = 0.2 + 0.15 * (1 - dist / 0.7);
    const bondPhase = Math.sin(time * 2 + dist * 10);
    return { char: bondPhase > 0.3 ? '-' : '.', intensity: bondIntensity };
  }

  return { char: '.', intensity: 0.03 + 0.02 * Math.sin(nx * 15 + ny * 12 + time * 0.3) };
};

// ── Scene 5: Orbital Paths ─────────────────────────────────────────────

interface Orbit {
  a: number;  // semi-major
  b: number;  // semi-minor
  tilt: number;
  speed: number;
  phase: number;
}

const ORBITS: Orbit[] = [
  { a: 0.35, b: 0.12, tilt: 0.3, speed: 1.2, phase: 0 },
  { a: 0.28, b: 0.20, tilt: -0.8, speed: 0.8, phase: 2 },
  { a: 0.38, b: 0.08, tilt: 1.2, speed: 1.5, phase: 4 },
  { a: 0.18, b: 0.18, tilt: 0, speed: 2.0, phase: 1 },
];

export const orbitalPaths: SceneFn = (nx, ny, time) => {
  const cx = nx - 0.5;
  const cy = (ny - 0.5) * 1.4;

  // Nucleus
  const nucDist = Math.sqrt(cx * cx + cy * cy);
  if (nucDist < 0.025) {
    return { char: '@', intensity: 0.95 };
  }
  if (nucDist < 0.05) {
    return { char: '#', intensity: 0.6 };
  }

  let maxIntensity = 0;
  let bestChar = '.';

  for (const orb of ORBITS) {
    const ct = Math.cos(orb.tilt);
    const st = Math.sin(orb.tilt);
    // Rotate point into orbit frame
    const lx = cx * ct + cy * st;
    const ly = -cx * st + cy * ct;

    // Ellipse distance (approximate)
    const ex = lx / orb.a;
    const ey = ly / orb.b;
    const ellipseDist = Math.abs(Math.sqrt(ex * ex + ey * ey) - 1);
    const orbitWidth = 0.08;

    if (ellipseDist < orbitWidth) {
      // Orbit path
      const pathIntensity = 0.25 * (1 - ellipseDist / orbitWidth);

      // Electron position
      const eAngle = time * orb.speed + orb.phase;
      const elecX = orb.a * Math.cos(eAngle);
      const elecY = orb.b * Math.sin(eAngle);
      // Rotate back
      const eWorldX = elecX * ct - elecY * st;
      const eWorldY = elecX * st + elecY * ct;
      const eDist = Math.sqrt((cx - eWorldX) ** 2 + (cy - eWorldY) ** 2);

      let intensity = pathIntensity;
      let char = ':';

      if (eDist < 0.03) {
        intensity = 0.9;
        char = '@';
      } else if (eDist < 0.08) {
        // Trail behind electron
        intensity = 0.5 * (1 - eDist / 0.08);
        char = '*';
      }

      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        bestChar = char;
      }
    }
  }

  if (maxIntensity < 0.03) {
    // Probability cloud: faint radial glow
    const cloud = 0.06 * Math.exp(-nucDist * 4) * (0.8 + 0.2 * Math.sin(nx * 30 + ny * 20 + time));
    return { char: '.', intensity: cloud };
  }

  return { char: bestChar, intensity: maxIntensity };
};

/** All scenes in cycle order */
export const SCENES: SceneFn[] = [
  dnaHelix,
  neuralNetwork,
  waveInterference,
  molecularLattice,
  orbitalPaths,
];
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /Users/sidgraph/Lab && npx tsc --noEmit src/visuals/ascii-scenes.ts`
Expected: No errors (pure TS, no JSX, no imports from other project files)

- [ ] **Step 3: Commit**

```bash
git add src/visuals/ascii-scenes.ts
git commit -m "feat: add 5 procedural ASCII scene functions for research viz"
```

---

### Task 2: Create AsciiCanvas Component

**Files:**
- Create: `src/visuals/AsciiCanvas.tsx`

The canvas renderer that: sizes a character grid to its container, runs the animation loop, cycles through scenes with crossfade transitions, handles mouse interaction, and respects reduced motion.

- [ ] **Step 1: Create `src/visuals/AsciiCanvas.tsx`**

```tsx
// src/visuals/AsciiCanvas.tsx

import { useEffect, useRef } from 'react';
import { SCENES, type SceneFn } from './ascii-scenes';

interface Props {
  className?: string;
}

// Grid cell dimensions in CSS pixels (JetBrains Mono proportions)
const CELL_W = 10;
const CELL_H = 14;

// Scene timing
const SCENE_HOLD = 8;     // seconds per scene
const SCENE_FADE = 2;     // crossfade duration
const SCENE_TOTAL = SCENE_HOLD + SCENE_FADE;

// Mouse interaction
const MOUSE_RADIUS = 0.15;        // 15% of canvas width
const MOUSE_LERP = 0.08;          // easing factor per frame
const MOUSE_INTENSITY_BOOST = 0.3;
const MOUSE_DENSE_RATIO = 0.05;   // closest 5% of influenced chars
const MOUSE_DENSE_CHARS = '#@$';

// Colors (from site palette)
const COLOR_ACCENT = [232, 217, 190] as const;   // #E8D9BE
const COLOR_BRIGHT = [237, 237, 237] as const;    // #EDEDED
const COLOR_MUTED  = [115, 115, 115] as const;    // #737373

function intensityToColor(intensity: number): string {
  let r: number, g: number, b: number, a: number;

  if (intensity < 0.15) {
    // Muted substrate
    [r, g, b] = COLOR_MUTED;
    a = 0.1 + intensity * 0.67; // 0.1–0.2
  } else if (intensity > 0.75) {
    // Bright peaks
    const t = (intensity - 0.75) / 0.25;
    r = COLOR_ACCENT[0] + (COLOR_BRIGHT[0] - COLOR_ACCENT[0]) * t;
    g = COLOR_ACCENT[1] + (COLOR_BRIGHT[1] - COLOR_ACCENT[1]) * t;
    b = COLOR_ACCENT[2] + (COLOR_BRIGHT[2] - COLOR_ACCENT[2]) * t;
    a = 0.7 + t * 0.3;
  } else {
    // Base accent
    [r, g, b] = COLOR_ACCENT;
    a = 0.15 + (intensity - 0.15) * (0.8 - 0.15) / (0.75 - 0.15);
  }

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a.toFixed(3)})`;
}

export function AsciiCanvas({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mouse state
    const mouse = { x: -1, y: -1, tx: -1, ty: -1, active: false, fadeOut: 0 };

    // Animation state
    let raf = 0;
    let visible = true;
    let lastCalc = 0;
    const startTime = performance.now();

    function resize() {
      const rect = container!.getBoundingClientRect();
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        canvas!.style.width = `${rect.width}px`;
        canvas!.style.height = `${rect.height}px`;
      }
    }

    function getScenes(time: number): { current: SceneFn; next: SceneFn | null; blend: number } {
      const cycleTime = time % (SCENES.length * SCENE_TOTAL);
      const sceneIdx = Math.floor(cycleTime / SCENE_TOTAL) % SCENES.length;
      const elapsed = cycleTime - sceneIdx * SCENE_TOTAL;

      if (elapsed > SCENE_HOLD) {
        const blend = (elapsed - SCENE_HOLD) / SCENE_FADE;
        return {
          current: SCENES[sceneIdx],
          next: SCENES[(sceneIdx + 1) % SCENES.length],
          blend: Math.min(1, blend),
        };
      }

      return { current: SCENES[sceneIdx], next: null, blend: 0 };
    }

    function render(now: number) {
      if (!visible) return;

      const time = reduced ? 2.0 : (now - startTime) / 1000;

      // Throttle scene calculation to ~24fps
      const shouldCalc = now - lastCalc >= 42;
      if (!shouldCalc && !reduced) {
        raf = requestAnimationFrame(render);
        return;
      }
      lastCalc = now;

      resize();

      const cw = canvas!.width;
      const ch = canvas!.height;
      const cellW = CELL_W * dpr;
      const cellH = CELL_H * dpr;
      const cols = Math.floor(cw / cellW);
      const rows = Math.floor(ch / cellH);

      if (cols < 1 || rows < 1) {
        if (!reduced) raf = requestAnimationFrame(render);
        return;
      }

      // Ease mouse
      if (mouse.active) {
        mouse.x += (mouse.tx - mouse.x) * MOUSE_LERP;
        mouse.y += (mouse.ty - mouse.y) * MOUSE_LERP;
        mouse.fadeOut = 1;
      } else if (mouse.fadeOut > 0) {
        mouse.fadeOut = Math.max(0, mouse.fadeOut - 0.02);
      }

      const { current, next, blend } = reduced
        ? { current: SCENES[0], next: null, blend: 0 }
        : getScenes(time);

      // Clear
      ctx!.clearRect(0, 0, cw, ch);

      // Set font
      const fontSize = Math.round(11 * dpr);
      ctx!.font = `${fontSize}px "JetBrains Mono Variable", "JetBrains Mono", monospace`;
      ctx!.textBaseline = 'top';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / cols;
          const ny = r / rows;

          // Get cell from current scene
          let cell = current(nx, ny, time);

          // Crossfade with next scene
          if (next && blend > 0) {
            const nextCell = next(nx, ny, time);
            if (nextCell.intensity * blend > cell.intensity * (1 - blend)) {
              cell = {
                char: nextCell.char,
                intensity: cell.intensity * (1 - blend) + nextCell.intensity * blend,
              };
            } else {
              cell = {
                char: cell.char,
                intensity: cell.intensity * (1 - blend) + nextCell.intensity * blend,
              };
            }
          }

          // Mouse influence
          if (mouse.fadeOut > 0 && mouse.x >= 0) {
            const mdx = nx - mouse.x;
            const mdy = (ny - mouse.y) * 1.4; // aspect correction
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mDist < MOUSE_RADIUS) {
              const influence = (1 - mDist / MOUSE_RADIUS) * mouse.fadeOut;

              // Intensity boost
              cell.intensity = Math.min(1, cell.intensity + MOUSE_INTENSITY_BOOST * influence);

              // Dense character override for closest chars
              if (mDist < MOUSE_RADIUS * MOUSE_DENSE_RATIO) {
                const denseIdx = Math.floor(Math.random() * MOUSE_DENSE_CHARS.length);
                cell.char = MOUSE_DENSE_CHARS[denseIdx];
              }
            }
          }

          if (cell.intensity < 0.02) continue; // skip invisible cells

          ctx!.fillStyle = intensityToColor(cell.intensity);
          ctx!.fillText(cell.char, c * cellW, r * cellH);
        }
      }

      if (!reduced) raf = requestAnimationFrame(render);
    }

    // Event handlers
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = (e.clientY - rect.top) / rect.height;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      const rect = canvas!.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.tx = (touch.clientX - rect.left) / rect.width;
      mouse.ty = (touch.clientY - rect.top) / rect.height;
      mouse.x = mouse.tx;
      mouse.y = mouse.ty;
      mouse.active = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas!.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.tx = (touch.clientX - rect.left) / rect.width;
      mouse.ty = (touch.clientY - rect.top) / rect.height;
    };

    const onTouchEnd = () => {
      mouse.active = false;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(render);
      }
    };

    // Attach listeners
    const el = canvas;
    el.addEventListener('mousemove', onMouseMove, { passive: true });
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize);

    // Start
    resize();
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="ascii-canvas-mask block h-full w-full"
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /Users/sidgraph/Lab && npx tsc --noEmit src/visuals/AsciiCanvas.tsx`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/visuals/AsciiCanvas.tsx
git commit -m "feat: add AsciiCanvas component with scene cycling, crossfade, and mouse interaction"
```

---

### Task 3: Add CSS Edge Mask Utility

**Files:**
- Modify: `src/styles/index.css`

Add a CSS class that applies a gradient mask to the canvas, fading out the right and bottom edges.

- [ ] **Step 1: Add `.ascii-canvas-mask` class to index.css**

Add this inside the `@layer utilities` block, after the `.bg-grain` rule:

```css
  .ascii-canvas-mask {
    -webkit-mask-image:
      linear-gradient(to right, black 60%, transparent 100%),
      linear-gradient(to bottom, black 60%, transparent 100%);
    mask-image:
      linear-gradient(to right, black 60%, transparent 100%),
      linear-gradient(to bottom, black 60%, transparent 100%);
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/index.css
git commit -m "feat: add CSS mask utility for ASCII canvas edge fade"
```

---

### Task 4: Rewrite Research Section Layout

**Files:**
- Modify: `src/components/Research.tsx`

Replace the 2x2 grid with a two-column split layout: AsciiCanvas on the left, stacked research cards on the right.

- [ ] **Step 1: Rewrite `src/components/Research.tsx`**

Replace the entire file content with:

```tsx
// src/components/Research.tsx

import { site } from '../content/site';
import { AsciiCanvas } from '../visuals/AsciiCanvas';
import { RevealOnScroll } from './RevealOnScroll';
import { SectionLabel } from './SectionLabel';

export function Research() {
  return (
    <section id="research" className="relative py-28 md:py-36">
      <div className="container-x">
        <SectionLabel
          index={site.research.label}
          title="Four programs. Long horizons."
          intro={site.research.intro}
        />

        <div className="mt-14 grid gap-0 md:grid-cols-12">
          {/* ASCII art — left column */}
          <RevealOnScroll className="md:col-span-6">
            <div className="aspect-[16/10] w-full md:aspect-auto md:h-full md:min-h-[540px]">
              <AsciiCanvas />
            </div>
          </RevealOnScroll>

          {/* Research cards — right column */}
          <div className="md:col-span-6">
            {site.research.areas.map((area, i) => (
              <RevealOnScroll key={area.id} delay={i * 0.05}>
                <article
                  className={`group relative px-0 py-8 md:px-10 md:py-10 ${
                    i < site.research.areas.length - 1 ? 'border-b border-ink-border' : ''
                  }`}
                >
                  <header className="flex items-center justify-between">
                    <span className="micro-label text-accent">{area.id}</span>
                    <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                      Active
                    </span>
                  </header>

                  <h3 className="mt-6 font-sans text-2xl tracking-tight text-ink-text md:text-3xl">
                    {area.title}
                  </h3>
                  <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-ink-dim">
                    {area.body}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-ink-border pt-4">
                    <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                      Program lead · TBA
                    </span>
                    <span className="text-ink-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                      →
                    </span>
                  </div>

                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build compiles**

Run: `cd /Users/sidgraph/Lab && npx tsc --noEmit`
Expected: No errors (full project type check)

- [ ] **Step 3: Commit**

```bash
git add src/components/Research.tsx
git commit -m "feat: rewrite Research section with split layout — ASCII canvas left, stacked cards right"
```

---

### Task 5: Visual Verification

**Files:** None (read-only verification)

- [ ] **Step 1: Start dev server**

Run: `cd /Users/sidgraph/Lab && npm run dev`
Expected: Vite dev server starts on localhost

- [ ] **Step 2: Open in browser and verify**

Check the following in the browser:

1. Research section shows two-column layout on desktop
2. ASCII canvas renders on the left with animated characters
3. Scenes cycle approximately every 10 seconds (8s hold + 2s fade)
4. Mouse hovering over the canvas creates visible distortion/glow
5. Right column shows 4 stacked research cards with dividers
6. Hover on cards shows accent underline animation
7. Mobile viewport: canvas on top (16:10 aspect), cards below
8. Other sections (Hero, Manifesto, Products, Fund, Footer) unchanged
9. No console errors

- [ ] **Step 3: Tune if needed**

If any scene looks wrong or performance is off, adjust parameters in `ascii-scenes.ts` (scene math) or `AsciiCanvas.tsx` (timing, cell size, colors).

- [ ] **Step 4: Final commit if adjustments were made**

```bash
git add -A
git commit -m "fix: tune ASCII art scenes and canvas rendering"
```
