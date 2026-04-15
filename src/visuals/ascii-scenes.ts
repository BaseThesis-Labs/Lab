export interface SceneCell {
  char: string;
  intensity: number; // 0–1
  r: number;
  g: number;
  b: number;
}

export type SceneFn = (nx: number, ny: number, time: number) => SceneCell;

const PI = Math.PI;

// ── Shared utilities ───────────────────────────────────────────────────

// Cheap integer hash for deterministic substrate
function ihash(a: number, b: number): number {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return (h ^ (h >> 16)) >>> 0;
}

const SUBSTRATE_CHARS = '.<>:;!|/-=+~,';

function substrate(nx: number, ny: number, time: number): SceneCell {
  const col = Math.floor(nx * 80);
  const row = Math.floor(ny * 50);
  const idx = ihash(col, row) % SUBSTRATE_CHARS.length;
  const flicker = 0.04 + 0.02 * Math.sin(nx * 31.7 + ny * 23.1 + time * 0.4);
  return { char: SUBSTRATE_CHARS[idx], intensity: flicker, r: 115, g: 115, b: 115 };
}

const HEAVY = '@#%&W';
const MEDIUM = '*+=~^';
const LIGHT = ':;.,';

function weightedChar(w: number, seed: number): string {
  if (w > 0.7) return HEAVY[Math.abs(seed) % HEAVY.length];
  if (w > 0.4) return MEDIUM[Math.abs(seed) % MEDIUM.length];
  return LIGHT[Math.abs(seed) % LIGHT.length];
}

function lerp3(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
  t: number,
): [number, number, number] {
  return [
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t,
  ];
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ── Scene 1: DNA Double Helix ──────────────────────────────────────────
// Gold strands with rose base-pairs, clear 3D depth

const DNA_GOLD: [number, number, number] = [232, 200, 122];
const DNA_ROSE: [number, number, number] = [212, 140, 160];
const DNA_BRIGHT: [number, number, number] = [245, 235, 210];

export const dnaHelix: SceneFn = (nx, ny, time) => {
  const phase = ny * 7.5 + time * 1.4;
  const amplitude = 0.18;

  // Two strands
  const x1 = 0.5 + amplitude * Math.sin(phase);
  const x2 = 0.5 + amplitude * Math.sin(phase + PI);

  // Depth: which strand is in front?
  const depth1 = Math.cos(phase);        // >0 = front
  const depth2 = Math.cos(phase + PI);   // opposite

  const d1 = Math.abs(nx - x1);
  const d2 = Math.abs(nx - x2);

  // Strand thickness
  const strandWidth = 0.04;
  const glowWidth = 0.10;

  // Check strand 1 (front when depth1 > 0)
  const isFront1 = depth1 > 0;
  const s1Intensity = isFront1 ? 0.85 : 0.45;

  if (d1 < strandWidth) {
    const w = 1 - d1 / strandWidth;
    const intensity = w * s1Intensity;
    const seed = Math.floor(phase * 5 + nx * 20);
    const [r, g, b] = isFront1
      ? lerp3(...DNA_GOLD, ...DNA_BRIGHT, w * 0.4)
      : DNA_GOLD;
    return { char: isFront1 ? weightedChar(w, seed) : weightedChar(w * 0.6, seed), intensity, r, g, b };
  }

  // Check strand 2
  const isFront2 = depth2 > 0;
  const s2Intensity = isFront2 ? 0.85 : 0.45;

  if (d2 < strandWidth) {
    const w = 1 - d2 / strandWidth;
    const intensity = w * s2Intensity;
    const seed = Math.floor(phase * 5 + nx * 20 + 100);
    const [r, g, b] = isFront2
      ? lerp3(...DNA_GOLD, ...DNA_BRIGHT, w * 0.4)
      : DNA_GOLD;
    return { char: isFront2 ? weightedChar(w, seed) : weightedChar(w * 0.6, seed), intensity, r, g, b };
  }

  // Base pairs (rungs) — every 5% of height
  const rungSpacing = 0.05;
  const rungPhase = ny % rungSpacing;
  const onRung = rungPhase < 0.008 || rungPhase > rungSpacing - 0.008;
  const leftX = Math.min(x1, x2) + strandWidth;
  const rightX = Math.max(x1, x2) - strandWidth;

  if (onRung && nx > leftX && nx < rightX && Math.abs(x1 - x2) > 0.06) {
    const pos = (nx - leftX) / (rightX - leftX);
    const rungIntensity = 0.45 + 0.15 * Math.sin(pos * PI);
    const chars = '=-~=:-';
    const ci = Math.floor(pos * chars.length);
    return { char: chars[ci % chars.length], intensity: rungIntensity, r: DNA_ROSE[0], g: DNA_ROSE[1], b: DNA_ROSE[2] };
  }

  // Glow around strands
  const minD = Math.min(d1, d2);
  if (minD < glowWidth) {
    const glow = (1 - minD / glowWidth);
    const intensity = glow * 0.18;
    return { char: weightedChar(glow * 0.3, Math.floor(nx * 50 + ny * 30)), intensity, r: DNA_GOLD[0], g: DNA_GOLD[1], b: DNA_GOLD[2] };
  }

  return substrate(nx, ny, time);
};

// ── Scene 2: Neural Network ────────────────────────────────────────────
// Cyan nodes, blue connections, white signal pulses

const NN_CYAN: [number, number, number] = [107, 195, 225];
const NN_BLUE: [number, number, number] = [70, 120, 180];
const NN_WHITE: [number, number, number] = [220, 240, 255];

const LAYER_X = [0.08, 0.28, 0.50, 0.72, 0.92];
const NODES_PER_LAYER = [3, 5, 6, 5, 3];

interface NNode { x: number; y: number; layer: number; idx: number; }

const ALL_NODES: NNode[] = (() => {
  const out: NNode[] = [];
  for (let l = 0; l < LAYER_X.length; l++) {
    const count = NODES_PER_LAYER[l];
    for (let n = 0; n < count; n++) {
      out.push({ x: LAYER_X[l], y: (n + 1) / (count + 1), layer: l, idx: out.length });
    }
  }
  return out;
})();

// Precompute connections as [nodeA_idx, nodeB_idx] pairs
const CONNECTIONS: [number, number][] = (() => {
  const out: [number, number][] = [];
  let startA = 0;
  for (let l = 0; l < LAYER_X.length - 1; l++) {
    const countA = NODES_PER_LAYER[l];
    const countB = NODES_PER_LAYER[l + 1];
    const startB = startA + countA;
    for (let a = 0; a < countA; a++) {
      // Connect to ~3 nodes in next layer (not all, to reduce density and improve perf)
      for (let b = 0; b < countB; b++) {
        if ((a + b) % 2 === 0) out.push([startA + a, startB + b]);
      }
    }
    startA += countA;
  }
  return out;
})();

export const neuralNetwork: SceneFn = (nx, ny, time) => {
  const aspect = 1.4;

  // Check nodes first (most visually important)
  for (const node of ALL_NODES) {
    const dx = nx - node.x;
    const dy = (ny - node.y) * aspect;
    const d = Math.sqrt(dx * dx + dy * dy);
    const pulse = 0.65 + 0.35 * Math.sin(time * 2.2 + node.idx * 0.8);

    // Core
    if (d < 0.022) {
      const w = 1 - d / 0.022;
      return { char: '@', intensity: pulse * (0.8 + 0.2 * w), ...rgb(NN_WHITE) };
    }
    // Inner halo
    if (d < 0.04) {
      const w = 1 - (d - 0.022) / 0.018;
      return { char: '#', intensity: pulse * w * 0.7, ...rgb(NN_CYAN) };
    }
    // Outer glow
    if (d < 0.065) {
      const w = 1 - (d - 0.04) / 0.025;
      return { char: '*', intensity: pulse * w * 0.35, ...rgb(NN_CYAN) };
    }
  }

  // Check connections
  for (const [ai, bi] of CONNECTIONS) {
    const a = ALL_NODES[ai];
    const b = ALL_NODES[bi];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    let t = ((nx - a.x) * dx + (ny - a.y) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const px = a.x + t * dx;
    const py = a.y + t * dy;
    const dist = Math.sqrt((nx - px) ** 2 + ((ny - py) * aspect) ** 2);

    if (dist < 0.015) {
      // Signal pulse traveling along connection
      const signalPos = ((time * 1.8 + ai * 0.5 + bi * 0.3) % 2) / 2; // 0-1 looping
      const signalDist = Math.abs(t - signalPos);
      const isSignal = signalDist < 0.08;

      if (isSignal) {
        const sw = 1 - signalDist / 0.08;
        return { char: weightedChar(sw * 0.8, ai + bi), intensity: 0.6 + sw * 0.35, ...rgb(NN_WHITE) };
      }

      // Regular connection line
      const lineW = 1 - dist / 0.015;
      const chars = t % 0.06 < 0.03 ? ':' : '.';
      return { char: chars, intensity: 0.2 + lineW * 0.15, ...rgb(NN_BLUE) };
    }
  }

  return substrate(nx, ny, time);
};

// ── Scene 3: Wave Interference ─────────────────────────────────────────
// Green/teal concentric waves from two sources

const WAVE_GREEN: [number, number, number] = [100, 210, 140];
const WAVE_TEAL: [number, number, number] = [60, 180, 170];
const WAVE_BRIGHT: [number, number, number] = [180, 255, 200];

const SRC_A: [number, number] = [0.3, 0.35];
const SRC_B: [number, number] = [0.7, 0.65];

export const waveInterference: SceneFn = (nx, ny, time) => {
  const aspect = 1.4;
  const da = Math.sqrt((nx - SRC_A[0]) ** 2 + ((ny - SRC_A[1]) * aspect) ** 2);
  const db = Math.sqrt((nx - SRC_B[0]) ** 2 + ((ny - SRC_B[1]) * aspect) ** 2);

  // Sources
  if (da < 0.025) {
    const w = 1 - da / 0.025;
    return { char: '@', intensity: 0.85 + 0.15 * w, r: 255, g: 255, b: 255 };
  }
  if (db < 0.025) {
    const w = 1 - db / 0.025;
    return { char: '@', intensity: 0.85 + 0.15 * w, r: 255, g: 255, b: 255 };
  }

  const freq = 32;
  const speed = 2.8;
  const waveA = Math.sin(da * freq - time * speed);
  const waveB = Math.sin(db * freq - time * speed * 1.05);

  // Interference: -2 to +2 → 0 to 1
  const combined = (waveA + waveB + 2) / 4;

  // Constructive interference = bright & dense
  // Destructive = dim substrate
  const seed = Math.floor(nx * 60 + ny * 40);

  if (combined > 0.65) {
    // Strong constructive
    const w = (combined - 0.65) / 0.35;
    const [r, g, b] = lerp3(...WAVE_GREEN, ...WAVE_BRIGHT, w);
    return { char: weightedChar(0.5 + w * 0.5, seed), intensity: 0.4 + w * 0.55, r, g, b };
  }

  if (combined > 0.4) {
    // Medium
    const w = (combined - 0.4) / 0.25;
    return { char: weightedChar(w * 0.4, seed), intensity: 0.15 + w * 0.25, ...rgb(WAVE_TEAL) };
  }

  if (combined > 0.2) {
    // Light ripple
    const w = (combined - 0.2) / 0.2;
    return { char: LIGHT[seed % LIGHT.length], intensity: 0.07 + w * 0.08, ...rgb(WAVE_TEAL) };
  }

  // Destructive — substrate with teal tint
  return { char: SUBSTRATE_CHARS[ihash(seed, seed + 1) % SUBSTRATE_CHARS.length], intensity: 0.04 + 0.02 * combined, r: 70, g: 110, b: 105 };
};

// ── Scene 4: Molecular Lattice ─────────────────────────────────────────
// Rose/pink atoms on a rotating hex grid with visible bonds

const MOL_ROSE: [number, number, number] = [220, 140, 165];
const MOL_PINK: [number, number, number] = [180, 110, 140];
const MOL_BRIGHT: [number, number, number] = [255, 200, 220];

export const molecularLattice: SceneFn = (nx, ny, time) => {
  const angle = time * 0.25;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  const cx = nx - 0.5;
  const cy = (ny - 0.5) * 1.4;

  // Rotate
  const rx = cx * ca - cy * sa;
  const ry = cx * sa + cy * ca;

  const scale = 7;
  const sx = rx * scale;
  const sy = ry * scale;

  // Hex grid coordinates
  const q = sx * 2 / 3;
  const r = (-sx / 3 + Math.sqrt(3) / 3 * sy);

  // Round hex
  let rq = Math.round(q);
  let rr = Math.round(r);
  const rs = Math.round(-q - r);
  const dq = Math.abs(rq - q);
  const dr = Math.abs(rr - r);
  const ds = Math.abs(rs + q + r);

  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;

  // Hex center in cartesian
  const hx = rq * 1.5;
  const hy = (rq * 0.5 + rr) * Math.sqrt(3);
  const dist = Math.sqrt((sx - hx) ** 2 + (sy - hy) ** 2);

  // Vignette — fade at edges
  const edgeDist = Math.sqrt(cx * cx + cy * cy);
  const vignette = smoothstep(0.45, 0.15, edgeDist);

  if (vignette < 0.01) return substrate(nx, ny, time);

  const pulse = 0.7 + 0.3 * Math.sin(time * 1.8 + rq * 2.5 + rr * 3.3);

  // Atom node
  if (dist < 0.35) {
    const w = 1 - dist / 0.35;
    const intensity = pulse * w * 0.9 * vignette;
    const [cr, cg, cb] = w > 0.6 ? lerp3(...MOL_ROSE, ...MOL_BRIGHT, (w - 0.6) / 0.4) : MOL_ROSE;
    const char = dist < 0.12 ? '@' : dist < 0.22 ? '#' : '*';
    return { char, intensity, r: cr, g: cg, b: cb };
  }

  // Bond region
  if (dist < 0.85) {
    const bondW = (1 - (dist - 0.35) / 0.5);
    const bondPulse = 0.5 + 0.5 * Math.sin(time * 2.5 + dist * 12);
    const intensity = bondW * bondPulse * 0.35 * vignette;
    const char = bondPulse > 0.6 ? '-' : '.';
    return { char, intensity, ...rgb(MOL_PINK) };
  }

  // Faint lattice glow
  const faint = (1 - dist / 1.2) * 0.08 * vignette;
  if (faint > 0.02) {
    return { char: '.', intensity: faint, ...rgb(MOL_PINK) };
  }

  return substrate(nx, ny, time);
};

// ── Scene 5: Orbital Paths ─────────────────────────────────────────────
// Violet orbits around a warm nucleus, bright electrons

const ORB_VIOLET: [number, number, number] = [155, 140, 210];
const ORB_BRIGHT: [number, number, number] = [200, 190, 255];
const ORB_NUCLEUS: [number, number, number] = [232, 217, 190];

interface Orbit { a: number; b: number; tilt: number; speed: number; phase: number; }

const ORBITS: Orbit[] = [
  { a: 0.32, b: 0.11, tilt: 0.35, speed: 1.1, phase: 0 },
  { a: 0.25, b: 0.18, tilt: -0.7, speed: 0.75, phase: 2.1 },
  { a: 0.36, b: 0.09, tilt: 1.3, speed: 1.4, phase: 4.2 },
  { a: 0.16, b: 0.16, tilt: -0.1, speed: 1.9, phase: 1.0 },
  { a: 0.30, b: 0.14, tilt: 2.1, speed: 0.6, phase: 3.5 },
];

export const orbitalPaths: SceneFn = (nx, ny, time) => {
  const cx = nx - 0.5;
  const cy = (ny - 0.5) * 1.4;
  const nucDist = Math.sqrt(cx * cx + cy * cy);

  // Nucleus
  if (nucDist < 0.035) {
    const w = 1 - nucDist / 0.035;
    const [r, g, b] = lerp3(...ORB_NUCLEUS, 255, 255, 255, w * 0.5);
    return { char: w > 0.5 ? '@' : '#', intensity: 0.8 + w * 0.2, r, g, b };
  }
  if (nucDist < 0.06) {
    const w = 1 - (nucDist - 0.035) / 0.025;
    return { char: '*', intensity: 0.4 * w, ...rgb(ORB_NUCLEUS) };
  }

  let maxIntensity = 0;
  let bestChar = '.';
  let bestR = 115, bestG = 115, bestB = 115;

  for (const orb of ORBITS) {
    const ct = Math.cos(orb.tilt);
    const st = Math.sin(orb.tilt);
    const lx = cx * ct + cy * st;
    const ly = -cx * st + cy * ct;

    const ex = lx / orb.a;
    const ey = ly / orb.b;
    const ellipseR = Math.sqrt(ex * ex + ey * ey);
    const ellipseDist = Math.abs(ellipseR - 1);

    const pathWidth = 0.12;

    if (ellipseDist < pathWidth) {
      const pathW = 1 - ellipseDist / pathWidth;

      // Electron position
      const eAngle = time * orb.speed + orb.phase;
      const elecLx = orb.a * Math.cos(eAngle);
      const elecLy = orb.b * Math.sin(eAngle);
      const ewx = elecLx * ct - elecLy * st;
      const ewy = elecLx * st + elecLy * ct;
      const eDist = Math.sqrt((cx - ewx) ** 2 + (cy - ewy) ** 2);

      // Trail behind electron
      const trailAngle = Math.atan2(ly, lx);
      const elecAngleLocal = Math.atan2(orb.b * Math.sin(eAngle), orb.a * Math.cos(eAngle));
      let angleDiff = trailAngle - elecAngleLocal;
      while (angleDiff > PI) angleDiff -= 2 * PI;
      while (angleDiff < -PI) angleDiff += 2 * PI;
      const trail = angleDiff > -1.2 && angleDiff < 0 ? (1 + angleDiff / 1.2) : 0;

      let intensity: number;
      let char: string;
      let cr: number, cg: number, cb: number;

      if (eDist < 0.025) {
        // Electron
        intensity = 0.95;
        char = '@';
        [cr, cg, cb] = [255, 255, 255];
      } else if (trail > 0.1) {
        // Trail
        intensity = pathW * trail * 0.6;
        char = weightedChar(trail * 0.6, Math.floor(lx * 50));
        [cr, cg, cb] = lerp3(...ORB_VIOLET, ...ORB_BRIGHT, trail);
      } else {
        // Orbit path
        intensity = pathW * 0.2;
        char = pathW > 0.5 ? ':' : '.';
        [cr, cg, cb] = ORB_VIOLET;
      }

      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        bestChar = char;
        bestR = cr; bestG = cg; bestB = cb;
      }
    }
  }

  // Probability cloud
  if (maxIntensity < 0.05) {
    const cloud = 0.08 * Math.exp(-nucDist * 3.5) * (0.7 + 0.3 * Math.sin(nx * 40 + ny * 25 + time * 0.6));
    if (cloud > 0.03) {
      return { char: '.', intensity: cloud, ...rgb(ORB_VIOLET) };
    }
    return substrate(nx, ny, time);
  }

  return { char: bestChar, intensity: maxIntensity, r: bestR, g: bestG, b: bestB };
};

// ── Helpers ────────────────────────────────────────────────────────────

function rgb(c: [number, number, number]): { r: number; g: number; b: number } {
  return { r: c[0], g: c[1], b: c[2] };
}

/** All scenes in cycle order */
export const SCENES: SceneFn[] = [
  dnaHelix,
  neuralNetwork,
  waveInterference,
  molecularLattice,
  orbitalPaths,
];
