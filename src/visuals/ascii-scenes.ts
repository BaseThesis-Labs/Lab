export interface SceneCell {
  char: string;
  intensity: number;
  r: number;
  g: number;
  b: number;
}

export type SceneFn = (nx: number, ny: number, time: number) => SceneCell;

const PI = Math.PI;

// ── Utilities ──────────────────────────────────────────────────────────

function ihash(a: number, b: number): number {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return (h ^ (h >> 16)) >>> 0;
}

function fract(x: number): number { return x - Math.floor(x); }

// Simple 2D noise (value noise via integer hashing)
function noise2(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = (ihash(ix, iy) & 0xffff) / 0xffff;
  const b = (ihash(ix + 1, iy) & 0xffff) / 0xffff;
  const c = (ihash(ix, iy + 1) & 0xffff) / 0xffff;
  const d = (ihash(ix + 1, iy + 1) & 0xffff) / 0xffff;
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

function fbm(x: number, y: number, octaves: number): number {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * noise2(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2;
  }
  return v;
}

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function clamp01(x: number): number { return x < 0 ? 0 : x > 1 ? 1 : x; }

function lerpC(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
  t: number,
): [number, number, number] {
  const s = clamp01(t);
  return [r1 + (r2 - r1) * s, g1 + (g2 - g1) * s, b1 + (b2 - b1) * s];
}

function rgb(c: readonly number[]): { r: number; g: number; b: number } {
  return { r: c[0], g: c[1], b: c[2] };
}

const HEAVY = '@#%$&WMB';
const MED   = '*+=~^XOD';
const LIGHT = ':;.,\'`"';

function wchar(w: number, seed: number): string {
  if (w > 0.65) return HEAVY[(seed >>> 0) % HEAVY.length];
  if (w > 0.35) return MED[(seed >>> 0) % MED.length];
  return LIGHT[(seed >>> 0) % LIGHT.length];
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 1 — DNA DOUBLE HELIX
// Dense nucleotide field with bright spiraling strands & base-pair rungs
// Palette: deep amber → gold → bright white
// ════════════════════════════════════════════════════════════════════════

const DNA_BG:     readonly number[] = [160, 115, 55];
const DNA_STRAND: readonly number[] = [255, 220, 110];
const DNA_RUNG:   readonly number[] = [255, 140, 170];
const DNA_BRIGHT: readonly number[] = [255, 250, 215];

const NUCLEOTIDES = 'AATTCCGGTTAACCGG{}[]()<>|/\\:;=-~+';

export const dnaHelix: SceneFn = (nx, ny, time) => {
  const col = Math.floor(nx * 80);
  const row = Math.floor(ny * 55);
  const h = ihash(col, row);

  // ── Background: scrolling nucleotide field ──
  const scrollY = ny + time * 0.02;
  const bgChar = NUCLEOTIDES[ihash(col, Math.floor(scrollY * 55)) % NUCLEOTIDES.length];
  const bgNoise = 0.12 + 0.08 * noise2(nx * 12 + time * 0.3, ny * 10);

  // ── Multiple helix strands at different depths ──
  let bestIntensity = bgNoise;
  let bestChar = bgChar;
  let bestR = DNA_BG[0], bestG = DNA_BG[1], bestB = DNA_BG[2];

  const helices = [
    { cx: 0.50, amp: 0.20, freq: 7.5, speed: 1.3, weight: 1.0 },
    { cx: 0.30, amp: 0.10, freq: 9.0, speed: 0.9, weight: 0.5 },
    { cx: 0.72, amp: 0.08, freq: 10,  speed: 1.6, weight: 0.4 },
  ];

  for (const hx of helices) {
    const phase = ny * hx.freq + time * hx.speed;
    const x1 = hx.cx + hx.amp * Math.sin(phase);
    const x2 = hx.cx + hx.amp * Math.sin(phase + PI);
    const depth1 = Math.cos(phase);

    const d1 = Math.abs(nx - x1);
    const d2 = Math.abs(nx - x2);
    const front1 = depth1 > 0;

    const strandW = 0.035 * hx.weight;
    const glowW = 0.12 * hx.weight;

    // Strand 1
    if (d1 < strandW) {
      const w = (1 - d1 / strandW);
      const intensity = (front1 ? 0.85 : 0.50) * w * hx.weight;
      if (intensity > bestIntensity) {
        bestIntensity = intensity;
        bestChar = wchar(w, h);
        const [r, g, b] = front1 ? lerpC(...DNA_STRAND, ...DNA_BRIGHT, w * 0.5) : DNA_STRAND as unknown as [number, number, number];
        bestR = r; bestG = g; bestB = b;
      }
    }
    // Strand 2
    if (d2 < strandW) {
      const w = (1 - d2 / strandW);
      const intensity = (front1 ? 0.50 : 0.85) * w * hx.weight;
      if (intensity > bestIntensity) {
        bestIntensity = intensity;
        bestChar = wchar(w, h + 50);
        const [r, g, b] = !front1 ? lerpC(...DNA_STRAND, ...DNA_BRIGHT, w * 0.5) : DNA_STRAND as unknown as [number, number, number];
        bestR = r; bestG = g; bestB = b;
      }
    }

    // Base-pair rungs (primary helix only)
    if (hx.weight > 0.8) {
      const rungMod = ny % 0.04;
      const onRung = rungMod < 0.006 || rungMod > 0.034;
      const lx = Math.min(x1, x2) + strandW;
      const rx = Math.max(x1, x2) - strandW;
      if (onRung && nx > lx && nx < rx && Math.abs(x1 - x2) > 0.05) {
        const pos = (nx - lx) / (rx - lx);
        const rungI = 0.45 + 0.2 * Math.sin(pos * PI);
        if (rungI > bestIntensity) {
          bestIntensity = rungI;
          bestChar = '=-~=:=-~'[Math.floor(pos * 8) % 8];
          bestR = DNA_RUNG[0]; bestG = DNA_RUNG[1]; bestB = DNA_RUNG[2];
        }
      }
    }

    // Glow field around strands
    const minD = Math.min(d1, d2);
    if (minD < glowW && minD >= strandW) {
      const glow = (1 - (minD - strandW) / (glowW - strandW)) * hx.weight;
      const glowI = glow * 0.25;
      if (glowI > bestIntensity) {
        bestIntensity = glowI;
        bestChar = wchar(glow * 0.3, h);
        const [r, g, b] = lerpC(...DNA_BG, ...DNA_STRAND, glow * 0.6);
        bestR = r; bestG = g; bestB = b;
      }
    }
  }

  return { char: bestChar, intensity: bestIntensity, r: bestR, g: bestG, b: bestB };
};

// ════════════════════════════════════════════════════════════════════════
// SCENE 2 — NEURAL ACTIVATION FIELD
// Dense matrix of activation values with bright nodes & signal flow
// Palette: deep navy → electric blue → cyan → white
// ════════════════════════════════════════════════════════════════════════

const NN_DEEP:   readonly number[] = [25, 55, 110];
const NN_BLUE:   readonly number[] = [55, 130, 225];
const NN_CYAN:   readonly number[] = [100, 225, 255];
const NN_WHITE:  readonly number[] = [230, 250, 255];

const MATRIX_CHARS = '01001101001011100110><[]{}|:;+=-~';

interface NNode { x: number; y: number; }

const GRID_NODES: NNode[] = (() => {
  const out: NNode[] = [];
  for (let gx = 0; gx < 6; gx++) {
    for (let gy = 0; gy < 4; gy++) {
      // Slightly irregular grid
      const jx = ((ihash(gx * 7, gy * 13) & 0xff) / 255 - 0.5) * 0.04;
      const jy = ((ihash(gx * 13, gy * 7) & 0xff) / 255 - 0.5) * 0.04;
      out.push({ x: 0.08 + gx * 0.17 + jx, y: 0.1 + gy * 0.25 + jy });
    }
  }
  return out;
})();

export const neuralNetwork: SceneFn = (nx, ny, time) => {
  const col = Math.floor(nx * 80);
  const row = Math.floor(ny * 55);
  const h = ihash(col, row);

  // ── Background: pulsing activation field ──
  const activation = fbm(nx * 6 + time * 0.4, ny * 5 - time * 0.3, 3);
  const wave = 0.5 + 0.5 * Math.sin(nx * 15 + ny * 10 + time * 2 + activation * 6);
  const bgI = 0.10 + activation * 0.16 + wave * 0.06;
  const bgChar = MATRIX_CHARS[h % MATRIX_CHARS.length];
  const [bgR, bgG, bgB] = lerpC(...NN_DEEP, ...NN_BLUE, activation);

  let bestI = bgI;
  let bestChar = bgChar;
  let bestR = bgR, bestG = bgG, bestB = bgB;

  // ── Connection mesh: dense web between nearby nodes ──
  // For performance, check the 4 nearest nodes
  let minNodeDist = 999;
  let nearestNode = 0;

  for (let i = 0; i < GRID_NODES.length; i++) {
    const nd = GRID_NODES[i];
    const dx = nx - nd.x;
    const dy = (ny - nd.y) * 1.4;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < minNodeDist) { minNodeDist = d; nearestNode = i; }
  }

  // Dense connection lines between nodes
  for (let i = 0; i < GRID_NODES.length; i++) {
    if (i === nearestNode) continue;
    const a = GRID_NODES[nearestNode];
    const b = GRID_NODES[i];
    const abDx = b.x - a.x;
    const abDy = b.y - a.y;
    const abLen = Math.sqrt(abDx * abDx + abDy * abDy);
    if (abLen > 0.35) continue; // Only nearby connections

    const abLen2 = abDx * abDx + abDy * abDy;
    let t = ((nx - a.x) * abDx + (ny - a.y) * abDy) / abLen2;
    t = Math.max(0, Math.min(1, t));
    const px = a.x + t * abDx;
    const py = a.y + t * abDy;
    const dist = Math.sqrt((nx - px) ** 2 + ((ny - py) * 1.4) ** 2);

    const lineW = 0.012;
    if (dist < lineW) {
      const lw = 1 - dist / lineW;
      // Signal pulse
      const sig = fract(t - time * 1.5 + nearestNode * 0.2 + i * 0.1);
      const pulse = smoothstep(0.0, 0.08, sig) * smoothstep(0.16, 0.08, sig);
      const lineI = lw * (0.2 + pulse * 0.65);
      if (lineI > bestI) {
        bestI = lineI;
        bestChar = pulse > 0.3 ? wchar(pulse, h) : (t % 0.04 < 0.02 ? ':' : '.');
        const [r, g, b] = pulse > 0.3 ? lerpC(...NN_CYAN, ...NN_WHITE, pulse) : NN_BLUE as unknown as [number, number, number];
        bestR = r; bestG = g; bestB = b;
      }
    }
  }

  // ── Nodes: bright circles with halos ──
  if (minNodeDist < 0.06) {
    const pulse = 0.6 + 0.4 * Math.sin(time * 2.5 + nearestNode * 1.1);
    if (minNodeDist < 0.015) {
      // Core
      const w = 1 - minNodeDist / 0.015;
      const nodeI = (0.85 + 0.15 * w) * pulse;
      if (nodeI > bestI) {
        bestI = nodeI;
        bestChar = '@';
        const [r, g, b] = lerpC(...NN_CYAN, ...NN_WHITE, w * pulse);
        bestR = r; bestG = g; bestB = b;
      }
    } else if (minNodeDist < 0.03) {
      const w = 1 - (minNodeDist - 0.015) / 0.015;
      const nodeI = 0.55 * w * pulse;
      if (nodeI > bestI) {
        bestI = nodeI;
        bestChar = '#';
        bestR = NN_CYAN[0]; bestG = NN_CYAN[1]; bestB = NN_CYAN[2];
      }
    } else {
      const w = 1 - (minNodeDist - 0.03) / 0.03;
      const nodeI = 0.25 * w * pulse;
      if (nodeI > bestI) {
        bestI = nodeI;
        bestChar = '*';
        bestR = NN_BLUE[0]; bestG = NN_BLUE[1]; bestB = NN_BLUE[2];
      }
    }
  }

  return { char: bestChar, intensity: bestI, r: bestR, g: bestG, b: bestB };
};

// ════════════════════════════════════════════════════════════════════════
// SCENE 3 — WAVE INTERFERENCE / RIPPLE FIELD
// Full-frame interference pattern, every cell visually active
// Palette: deep teal → emerald green → bright lime → white
// ════════════════════════════════════════════════════════════════════════

const WV_DEEP:   readonly number[] = [20, 80, 70];
const WV_TEAL:   readonly number[] = [45, 175, 150];
const WV_GREEN:  readonly number[] = [100, 245, 155];
const WV_BRIGHT: readonly number[] = [200, 255, 225];

export const waveInterference: SceneFn = (nx, ny, time) => {
  const h = ihash(Math.floor(nx * 80), Math.floor(ny * 55));
  const aspect = 1.4;

  // Three wave sources for richer interference
  const sources: [number, number][] = [
    [0.25 + 0.05 * Math.sin(time * 0.3), 0.30],
    [0.75 - 0.05 * Math.sin(time * 0.4), 0.70],
    [0.50, 0.15 + 0.05 * Math.cos(time * 0.25)],
  ];

  let combined = 0;
  for (const [sx, sy] of sources) {
    const d = Math.sqrt((nx - sx) ** 2 + ((ny - sy) * aspect) ** 2);
    combined += Math.sin(d * 35 - time * 3.2);
  }
  // Normalize: range is roughly -3 to +3 → 0 to 1
  const wave = (combined + 3) / 6;

  // Source markers
  for (const [sx, sy] of sources) {
    const d = Math.sqrt((nx - sx) ** 2 + ((ny - sy) * aspect) ** 2);
    if (d < 0.02) {
      return { char: '@', intensity: 0.95, r: 255, g: 255, b: 255 };
    }
    if (d < 0.04) {
      const w = 1 - (d - 0.02) / 0.02;
      return { char: '#', intensity: 0.7 * w, r: 255, g: 255, b: 230 };
    }
  }

  // Map wave to character density + color — FULL FRAME coverage
  // High wave = bright, constructive. Low wave = dim, destructive.
  let intensity: number;
  let char: string;
  let cr: number, cg: number, cb: number;

  if (wave > 0.75) {
    // Bright constructive peak
    const w = (wave - 0.75) / 0.25;
    intensity = 0.5 + w * 0.45;
    char = wchar(0.5 + w * 0.5, h);
    [cr, cg, cb] = lerpC(...WV_GREEN, ...WV_BRIGHT, w);
  } else if (wave > 0.5) {
    // Medium-high
    const w = (wave - 0.5) / 0.25;
    intensity = 0.25 + w * 0.25;
    char = wchar(0.3 + w * 0.2, h);
    [cr, cg, cb] = lerpC(...WV_TEAL, ...WV_GREEN, w);
  } else if (wave > 0.25) {
    // Medium-low
    const w = (wave - 0.25) / 0.25;
    intensity = 0.12 + w * 0.13;
    char = LIGHT[h % LIGHT.length];
    [cr, cg, cb] = lerpC(...WV_DEEP, ...WV_TEAL, w);
  } else {
    // Destructive trough — still visible, just dim
    const w = wave / 0.25;
    intensity = 0.09 + w * 0.07;
    char = '.,:;'[h % 4];
    [cr, cg, cb] = WV_DEEP as unknown as [number, number, number];
  }

  // Add subtle noise variation
  intensity += 0.02 * noise2(nx * 20 + time, ny * 15);

  return { char, intensity, r: cr, g: cg, b: cb };
};

// ════════════════════════════════════════════════════════════════════════
// SCENE 4 — CRYSTAL / MOLECULAR LATTICE
// Dense crystalline structure filling the entire frame
// Palette: deep wine → rose → pink → bright white-pink
// ════════════════════════════════════════════════════════════════════════

const CR_DEEP:   readonly number[] = [110, 45, 70];
const CR_ROSE:   readonly number[] = [230, 115, 155];
const CR_PINK:   readonly number[] = [255, 175, 215];
const CR_BRIGHT: readonly number[] = [255, 230, 245];

export const molecularLattice: SceneFn = (nx, ny, time) => {
  const h = ihash(Math.floor(nx * 80), Math.floor(ny * 55));

  const angle = time * 0.2;
  const ca = Math.cos(angle), sa = Math.sin(angle);

  const cx = nx - 0.5;
  const cy = (ny - 0.5) * 1.4;
  const rx = cx * ca - cy * sa;
  const ry = cx * sa + cy * ca;

  // TWO overlapping lattice scales for depth
  let bestI = 0;
  let bestChar = '.';
  let bestR = CR_DEEP[0], bestG = CR_DEEP[1], bestB = CR_DEEP[2];

  const scales = [
    { s: 8,  off: 0,    weight: 1.0 },
    { s: 14, off: 0.5,  weight: 0.45 },
  ];

  for (const layer of scales) {
    const sx = (rx + layer.off) * layer.s;
    const sy = (ry + layer.off) * layer.s;

    // Hex grid
    const q = sx * 2 / 3;
    const r = -sx / 3 + Math.sqrt(3) / 3 * sy;
    let rq = Math.round(q), rr = Math.round(r);
    const rs = Math.round(-q - r);
    const dq = Math.abs(rq - q), dr = Math.abs(rr - r), ds = Math.abs(rs + q + r);
    if (dq > dr && dq > ds) rq = -rr - rs;
    else if (dr > ds) rr = -rq - rs;

    const hx2 = rq * 1.5;
    const hy2 = (rq * 0.5 + rr) * Math.sqrt(3);
    const dist = Math.sqrt((sx - hx2) ** 2 + (sy - hy2) ** 2);

    const pulse = 0.65 + 0.35 * Math.sin(time * 1.6 + rq * 2.1 + rr * 3.4);
    const w = layer.weight;

    if (dist < 0.3) {
      // Atom core
      const aw = (1 - dist / 0.3);
      const intensity = aw * 0.85 * pulse * w;
      if (intensity > bestI) {
        bestI = intensity;
        bestChar = dist < 0.1 ? '@' : dist < 0.18 ? '#' : '*';
        const [cr, cg, cb] = aw > 0.6 ? lerpC(...CR_PINK, ...CR_BRIGHT, (aw - 0.6) / 0.4) : CR_PINK as unknown as [number, number, number];
        bestR = cr; bestG = cg; bestB = cb;
      }
    } else if (dist < 0.75) {
      // Bond region
      const bw = 1 - (dist - 0.3) / 0.45;
      const bondPulse = 0.5 + 0.5 * Math.sin(time * 2.2 + dist * 14);
      const intensity = bw * bondPulse * 0.35 * w;
      if (intensity > bestI) {
        bestI = intensity;
        bestChar = bondPulse > 0.6 ? '-' : (bondPulse > 0.3 ? ':' : '.');
        const [cr, cg, cb] = lerpC(...CR_DEEP, ...CR_ROSE, bw * bondPulse);
        bestR = cr; bestG = cg; bestB = cb;
      }
    }
  }

  // ── Background: electron density field ──
  if (bestI < 0.08) {
    const density = fbm(rx * 4 + time * 0.15, ry * 4 - time * 0.1, 2);
    bestI = 0.09 + density * 0.12;
    bestChar = wchar(density * 0.3, h);
    const [cr, cg, cb] = lerpC(...CR_DEEP, ...CR_ROSE, density * 0.5);
    bestR = cr; bestG = cg; bestB = cb;
  }

  return { char: bestChar, intensity: bestI, r: bestR, g: bestG, b: bestB };
};

// ════════════════════════════════════════════════════════════════════════
// SCENE 5 — ATOMIC ORBITALS / QUANTUM FIELD
// Dense probability clouds with bright orbital shells & electrons
// Palette: deep indigo → violet → lavender → white
// ════════════════════════════════════════════════════════════════════════

const QM_DEEP:    readonly number[] = [40, 25, 90];
const QM_VIOLET:  readonly number[] = [155, 120, 230];
const QM_LAV:     readonly number[] = [210, 190, 255];
const QM_BRIGHT:  readonly number[] = [245, 240, 255];
const QM_NUCLEUS: readonly number[] = [255, 230, 190];

interface Orbit { a: number; b: number; tilt: number; speed: number; phase: number; }

const ORBITS: Orbit[] = [
  { a: 0.30, b: 0.10, tilt: 0.3,  speed: 1.1, phase: 0 },
  { a: 0.22, b: 0.16, tilt: -0.8, speed: 0.7, phase: 2.1 },
  { a: 0.35, b: 0.08, tilt: 1.4,  speed: 1.5, phase: 4.2 },
  { a: 0.15, b: 0.15, tilt: -0.1, speed: 2.0, phase: 1.0 },
  { a: 0.28, b: 0.12, tilt: 2.2,  speed: 0.5, phase: 3.5 },
  { a: 0.38, b: 0.06, tilt: 0.8,  speed: 1.8, phase: 5.0 },
];

export const orbitalPaths: SceneFn = (nx, ny, time) => {
  const h = ihash(Math.floor(nx * 80), Math.floor(ny * 55));
  const cx = nx - 0.5;
  const cy = (ny - 0.5) * 1.4;
  const nucDist = Math.sqrt(cx * cx + cy * cy);

  // ── Background: quantum probability field (always visible) ──
  const psi = fbm(nx * 5 + time * 0.2, ny * 5 - time * 0.15, 3);
  const radial = Math.exp(-nucDist * 2.5);
  const bgDensity = (psi * 0.6 + radial * 0.4);
  let bestI = 0.09 + bgDensity * 0.18;
  let bestChar = wchar(bgDensity * 0.35, h);
  let [bestR, bestG, bestB] = lerpC(...QM_DEEP, ...QM_VIOLET, bgDensity * 0.6);

  // ── Orbital shells (probability density near each orbit) ──
  for (const orb of ORBITS) {
    const ct = Math.cos(orb.tilt), st = Math.sin(orb.tilt);
    const lx = cx * ct + cy * st;
    const ly = -cx * st + cy * ct;

    const ex = lx / orb.a;
    const ey = ly / orb.b;
    const ellipseR = Math.sqrt(ex * ex + ey * ey);
    const ellipseDist = Math.abs(ellipseR - 1);

    // Thick orbital shell (probability cloud, not thin line)
    const shellWidth = 0.18;
    if (ellipseDist < shellWidth) {
      const shellW = 1 - ellipseDist / shellWidth;
      const shellI = shellW * shellW * 0.4; // Quadratic falloff for softer glow

      // Electron position
      const eAngle = time * orb.speed + orb.phase;
      const eLx = orb.a * Math.cos(eAngle);
      const eLy = orb.b * Math.sin(eAngle);
      const ewx = eLx * ct - eLy * st;
      const ewy = eLx * st + eLy * ct;
      const eDist = Math.sqrt((cx - ewx) ** 2 + (cy - ewy) ** 2);

      // Trail
      const localAngle = Math.atan2(ly, lx);
      const elecAngle = Math.atan2(eLy, eLx);
      let aDiff = localAngle - elecAngle;
      while (aDiff > PI) aDiff -= 2 * PI;
      while (aDiff < -PI) aDiff += 2 * PI;
      const trail = (aDiff > -1.5 && aDiff < 0) ? (1 + aDiff / 1.5) : 0;

      let cellI: number;
      let cellChar: string;
      let cr: number, cg: number, cb: number;

      if (eDist < 0.025) {
        // Electron — bright white
        cellI = 0.95;
        cellChar = '@';
        [cr, cg, cb] = [255, 255, 255];
      } else if (eDist < 0.05) {
        // Electron glow
        const gw = 1 - (eDist - 0.025) / 0.025;
        cellI = 0.6 * gw;
        cellChar = '#';
        [cr, cg, cb] = QM_BRIGHT as unknown as [number, number, number];
      } else if (trail > 0.15) {
        // Comet trail
        cellI = shellW * trail * 0.55;
        cellChar = wchar(trail * 0.6, h);
        [cr, cg, cb] = lerpC(...QM_VIOLET, ...QM_LAV, trail);
      } else {
        // Orbital cloud
        cellI = shellI;
        cellChar = shellW > 0.5 ? wchar(shellW * 0.4, h) : LIGHT[h % LIGHT.length];
        [cr, cg, cb] = lerpC(...QM_VIOLET, ...QM_LAV, shellW * 0.6);
      }

      if (cellI > bestI) {
        bestI = cellI;
        bestChar = cellChar;
        bestR = cr; bestG = cg; bestB = cb;
      }
    }
  }

  // ── Nucleus ──
  if (nucDist < 0.04) {
    const w = 1 - nucDist / 0.04;
    const nI = 0.8 + w * 0.2;
    if (nI > bestI) {
      bestI = nI;
      bestChar = w > 0.5 ? '@' : '#';
      const [r, g, b] = lerpC(...QM_NUCLEUS, 255, 255, 255, w * 0.6);
      bestR = r; bestG = g; bestB = b;
    }
  } else if (nucDist < 0.07) {
    const w = 1 - (nucDist - 0.04) / 0.03;
    const nI = 0.4 * w;
    if (nI > bestI) {
      bestI = nI;
      bestChar = '*';
      bestR = QM_NUCLEUS[0]; bestG = QM_NUCLEUS[1]; bestB = QM_NUCLEUS[2];
    }
  }

  return { char: bestChar, intensity: bestI, r: bestR, g: bestG, b: bestB };
};

// ════════════════════════════════════════════════════════════════════════

export const SCENES: SceneFn[] = [
  dnaHelix,
  neuralNetwork,
  waveInterference,
  molecularLattice,
  orbitalPaths,
];
