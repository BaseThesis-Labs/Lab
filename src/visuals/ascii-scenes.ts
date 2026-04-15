export interface SceneCell {
  char: string;
  intensity: number;
}

export type SceneFn = (
  nx: number,
  ny: number,
  time: number,
) => SceneCell;

const PI = Math.PI;
const TAU = PI * 2;

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

  const x1 = 0.5 + 0.22 * Math.sin(phase);
  const x2 = 0.5 + 0.22 * Math.sin(phase + PI);

  const d1 = Math.abs(nx - x1);
  const d2 = Math.abs(nx - x2);
  const minD = Math.min(d1, d2);

  const midX = (x1 + x2) / 2;
  const span = Math.abs(x1 - x2);
  const onBridge = Math.abs(ny % 0.08 - 0.04) < 0.01
    && nx > Math.min(x1, x2) + 0.02
    && nx < Math.max(x1, x2) - 0.02;

  if (minD < 0.025) {
    const idx = Math.floor((phase * 3) % STRAND_CHARS.length);
    return { char: STRAND_CHARS[Math.abs(idx)], intensity: 0.7 + 0.3 * (1 - minD / 0.025) };
  }

  if (onBridge && span > 0.08) {
    const bridgePos = Math.abs(nx - midX) / (span / 2);
    const idx = Math.floor(bridgePos * BRIDGE_CHARS.length);
    return { char: BRIDGE_CHARS[Math.min(idx, BRIDGE_CHARS.length - 1)], intensity: 0.35 + 0.2 * (1 - bridgePos) };
  }

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

  for (let i = 0; i < NODES.length; i++) {
    const [nodex, nodey] = NODES[i];
    const dx = nx - nodex;
    const dy = (ny - nodey) * 1.6;
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

  let layerStart = 0;
  for (let l = 0; l < LAYER_X.length - 1; l++) {
    const countA = NODES_PER_LAYER[l];
    const countB = NODES_PER_LAYER[l + 1];
    const nextStart = layerStart + countA;

    for (let a = 0; a < countA; a++) {
      for (let b = 0; b < countB; b++) {
        const [ax, ay] = NODES[layerStart + a];
        const [bx, by] = NODES[nextStart + b];

        const dx = bx - ax;
        const dy = by - ay;
        const len2 = dx * dx + dy * dy;
        let t = ((nx - ax) * dx + (ny - ay) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        const px = ax + t * dx;
        const py = ay + t * dy;
        const dist = Math.sqrt((nx - px) ** 2 + ((ny - py) * 1.6) ** 2);

        if (dist < 0.012) {
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
  const combined = (waveA + waveB) / 2;

  const intensity = (combined + 1) / 2;

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
  const angle = time * 0.3;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  const cx = nx - 0.5;
  const cy = (ny - 0.5) * 1.4;
  const rx = cx * ca - cy * sa;
  const ry = cx * sa + cy * ca;

  const scale = 9;
  const sx = rx * scale;
  const sy = ry * scale;

  const q = (sx * Math.sqrt(3) / 3 - sy / 3);
  const r = sy * 2 / 3;

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

  const hx = qr * Math.sqrt(3) + rr * Math.sqrt(3) / 2;
  const hy = rr * 1.5;
  const dist = Math.sqrt((sx - hx) ** 2 + (sy - hy) ** 2);

  if (dist < 0.25) {
    const pulse = 0.7 + 0.3 * Math.sin(time * 1.5 + qr * 2 + rr * 3);
    return { char: dist < 0.1 ? '*' : '+', intensity: pulse };
  }

  if (dist < 0.7) {
    const bondIntensity = 0.2 + 0.15 * (1 - dist / 0.7);
    const bondPhase = Math.sin(time * 2 + dist * 10);
    return { char: bondPhase > 0.3 ? '-' : '.', intensity: bondIntensity };
  }

  return { char: '.', intensity: 0.03 + 0.02 * Math.sin(nx * 15 + ny * 12 + time * 0.3) };
};

// ── Scene 5: Orbital Paths ─────────────────────────────────────────────

interface Orbit {
  a: number;
  b: number;
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
    const lx = cx * ct + cy * st;
    const ly = -cx * st + cy * ct;

    const ex = lx / orb.a;
    const ey = ly / orb.b;
    const ellipseDist = Math.abs(Math.sqrt(ex * ex + ey * ey) - 1);
    const orbitWidth = 0.08;

    if (ellipseDist < orbitWidth) {
      const pathIntensity = 0.25 * (1 - ellipseDist / orbitWidth);

      const eAngle = time * orb.speed + orb.phase;
      const elecX = orb.a * Math.cos(eAngle);
      const elecY = orb.b * Math.sin(eAngle);
      const eWorldX = elecX * ct - elecY * st;
      const eWorldY = elecX * st + elecY * ct;
      const eDist = Math.sqrt((cx - eWorldX) ** 2 + (cy - eWorldY) ** 2);

      let intensity = pathIntensity;
      let char = ':';

      if (eDist < 0.03) {
        intensity = 0.9;
        char = '@';
      } else if (eDist < 0.08) {
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
    const cloud = 0.06 * Math.exp(-nucDist * 4) * (0.8 + 0.2 * Math.sin(nx * 30 + ny * 20 + time));
    return { char: '.', intensity: cloud };
  }

  return { char: bestChar, intensity: maxIntensity };
};

export const SCENES: SceneFn[] = [
  dnaHelix,
  neuralNetwork,
  waveInterference,
  molecularLattice,
  orbitalPaths,
];
