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

function fbm(x: number, y: number, oct: number): number {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < oct; i++) { v += amp * noise2(x * freq, y * freq); amp *= 0.5; freq *= 2; }
  return v;
}

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function clamp01(x: number): number { return x < 0 ? 0 : x > 1 ? 1 : x; }

type C3 = readonly number[];

function lerpC(a: C3, b: C3, t: number): [number, number, number] {
  const s = clamp01(t);
  return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s];
}

function lerpC3(c1: C3, c2: C3, c3: C3, t: number): [number, number, number] {
  if (t < 0.5) return lerpC(c1, c2, t * 2);
  return lerpC(c2, c3, (t - 0.5) * 2);
}

const HEAVY = '@#%$&WMB';
const MED   = '*+=~^XOD';
const LIGHT = ':;.,\'`"';

function wchar(w: number, seed: number): string {
  if (w > 0.65) return HEAVY[(seed >>> 0) % HEAVY.length];
  if (w > 0.35) return MED[(seed >>> 0) % MED.length];
  return LIGHT[(seed >>> 0) % LIGHT.length];
}

// Formula text tiling — maps grid position to a character from a formula string
function formulaChar(text: string, col: number, row: number): string {
  return text[(row * 83 + col) % text.length];
}

// ════════════════════════════════════════════════════════════════════════
// SCENE 1 — DNA / MOLECULAR BIOLOGY
//
// Central double helix with 3D depth + base pairs
// Secondary helices at different depths
// Floating protein complexes (ribosome-like blobs)
// mRNA strand peeling off from main helix
// Background: tiling scientific notation (C5H10O4, PO4, ATCG...)
// Phospholipid bilayer band at bottom
// Hydrogen bond dotted lines between strands
//
// Palette: deep amber → gold → rose → bright white
// ════════════════════════════════════════════════════════════════════════

const DNA_BG:      readonly number[] = [160, 115, 55];
const DNA_STRAND:  readonly number[] = [255, 220, 110];
const DNA_RUNG:    readonly number[] = [255, 140, 170];
const DNA_BRIGHT:  readonly number[] = [255, 250, 215];
const DNA_PROTEIN: readonly number[] = [180, 220, 140];
const DNA_MRNA:    readonly number[] = [140, 200, 255];
const DNA_MEMBRANE:readonly number[] = [200, 160, 100];

const BIO_TEXT = 'AATTCCGG-PO4-C5H10O4-NH2-COOH-ATP>ADP-H2O-mRNA-tRNA-ribosome-helicase-polymerase-';

// Protein blob positions (animated)
function proteinPos(idx: number, time: number): [number, number, number] {
  const baseX = 0.15 + idx * 0.25;
  const baseY = 0.2 + idx * 0.2;
  return [
    baseX + 0.04 * Math.sin(time * 0.5 + idx * 2.5),
    baseY + 0.03 * Math.cos(time * 0.4 + idx * 1.8),
    0.04 + idx * 0.01, // radius
  ];
}

export const dnaHelix: SceneFn = (nx, ny, time) => {
  const col = Math.floor(nx * 80);
  const row = Math.floor(ny * 55);
  const h = ihash(col, row);

  // ── Layer 0: Scientific formula background ──
  const scrollY = ny + time * 0.015;
  const bgChar = formulaChar(BIO_TEXT, col, Math.floor(scrollY * 55));
  const bgNoise = 0.12 + 0.08 * noise2(nx * 10 + time * 0.3, ny * 8);
  let bestI = bgNoise;
  let bestChar = bgChar;
  let bestR = DNA_BG[0], bestG = DNA_BG[1], bestB = DNA_BG[2];

  // ── Layer 1: Phospholipid bilayer at bottom ──
  if (ny > 0.88) {
    const memY = (ny - 0.88) / 0.12;
    const lipidWave = 0.5 + 0.5 * Math.sin(nx * 40 + time * 1.5);
    const isUpper = memY < 0.4;
    const isLower = memY > 0.6;
    if (isUpper || isLower) {
      const memI = 0.25 + lipidWave * 0.2;
      if (memI > bestI) {
        bestI = memI;
        bestChar = isUpper ? (lipidWave > 0.6 ? 'o' : '.') : (lipidWave > 0.6 ? 'O' : ':');
        bestR = DNA_MEMBRANE[0]; bestG = DNA_MEMBRANE[1]; bestB = DNA_MEMBRANE[2];
      }
    } else {
      // Membrane interior
      const intI = 0.15 + 0.05 * noise2(nx * 30, ny * 30 + time);
      if (intI > bestI) {
        bestI = intI;
        bestChar = '~';
        bestR = DNA_MEMBRANE[0]; bestG = DNA_MEMBRANE[1]; bestB = DNA_MEMBRANE[2];
      }
    }
  }

  // ── Layer 2: Protein complexes (floating blobs) ──
  for (let p = 0; p < 3; p++) {
    const [px, py, pr] = proteinPos(p, time);
    const dx = nx - px;
    const dy = (ny - py) * 1.4;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < pr) {
      const w = 1 - d / pr;
      const protI = w * 0.65;
      if (protI > bestI) {
        bestI = protI;
        bestChar = d < pr * 0.3 ? '@' : (d < pr * 0.6 ? '#' : '*');
        const [r, g, b] = lerpC(DNA_PROTEIN, [220, 255, 180], w);
        bestR = r; bestG = g; bestB = b;
      }
    } else if (d < pr * 1.5) {
      // Protein glow
      const gw = 1 - (d - pr) / (pr * 0.5);
      const glowI = gw * 0.15;
      if (glowI > bestI) {
        bestI = glowI;
        bestChar = '.';
        bestR = DNA_PROTEIN[0]; bestG = DNA_PROTEIN[1]; bestB = DNA_PROTEIN[2];
      }
    }
  }

  // ── Layer 3: mRNA strand peeling off (single strand, blue) ──
  const mrnaPhase = ny * 12 + time * 1.8;
  const mrnaX = 0.62 + 0.08 * Math.sin(mrnaPhase) + (ny > 0.5 ? (ny - 0.5) * 0.3 : 0);
  const mrnaD = Math.abs(nx - mrnaX);
  const mrnaActive = ny > 0.35 && ny < 0.85;
  if (mrnaActive && mrnaD < 0.02) {
    const mw = 1 - mrnaD / 0.02;
    const mrnaI = mw * 0.7;
    if (mrnaI > bestI) {
      bestI = mrnaI;
      bestChar = 'AUGC'[Math.floor(mrnaPhase * 2) % 4];
      bestR = DNA_MRNA[0]; bestG = DNA_MRNA[1]; bestB = DNA_MRNA[2];
    }
  } else if (mrnaActive && mrnaD < 0.06) {
    const gw = 1 - (mrnaD - 0.02) / 0.04;
    const glowI = gw * 0.12;
    if (glowI > bestI) {
      bestI = glowI;
      bestChar = '.';
      bestR = DNA_MRNA[0]; bestG = DNA_MRNA[1]; bestB = DNA_MRNA[2];
    }
  }

  // ── Layer 4: Main helices ──
  const helices = [
    { cx: 0.42, amp: 0.18, freq: 7.5, speed: 1.3, weight: 1.0 },
    { cx: 0.20, amp: 0.08, freq: 9.5, speed: 0.9, weight: 0.45 },
    { cx: 0.78, amp: 0.06, freq: 11,  speed: 1.7, weight: 0.35 },
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
    const glowW = 0.10 * hx.weight;

    // Strands
    for (const [d, isFront] of [[d1, front1], [d2, !front1]] as [number, boolean][]) {
      if (d < strandW) {
        const w = 1 - d / strandW;
        const intensity = (isFront ? 0.90 : 0.50) * w * hx.weight;
        if (intensity > bestI) {
          bestI = intensity;
          bestChar = wchar(w, h + (isFront ? 0 : 50));
          const [r, g, b] = isFront ? lerpC(DNA_STRAND, DNA_BRIGHT, w * 0.5) : DNA_STRAND as unknown as [number, number, number];
          bestR = r; bestG = g; bestB = b;
        }
      }
    }

    // Base-pair rungs + hydrogen bonds (primary helix)
    if (hx.weight > 0.8) {
      const rungMod = ny % 0.035;
      const onRung = rungMod < 0.005 || rungMod > 0.030;
      const lx = Math.min(x1, x2) + strandW;
      const rx = Math.max(x1, x2) - strandW;
      if (onRung && nx > lx && nx < rx && Math.abs(x1 - x2) > 0.04) {
        const pos = (nx - lx) / (rx - lx);
        // Hydrogen bonds — dotted pattern in the middle
        const isHBond = pos > 0.35 && pos < 0.65;
        const rungI = isHBond ? 0.35 + 0.1 * Math.sin(pos * PI * 4) : 0.50 + 0.2 * Math.sin(pos * PI);
        if (rungI > bestI) {
          bestI = rungI;
          bestChar = isHBond ? (Math.floor(pos * 20) % 2 === 0 ? '.' : ':') : '=-~=:=-~'[Math.floor(pos * 8) % 8];
          bestR = DNA_RUNG[0]; bestG = DNA_RUNG[1]; bestB = DNA_RUNG[2];
        }
      }
    }

    // Glow
    const minD = Math.min(d1, d2);
    if (minD < glowW && minD >= strandW) {
      const glow = (1 - (minD - strandW) / (glowW - strandW)) * hx.weight;
      const glowI = glow * 0.22;
      if (glowI > bestI) {
        bestI = glowI;
        bestChar = wchar(glow * 0.3, h);
        const [r, g, b] = lerpC(DNA_BG, DNA_STRAND, glow * 0.6);
        bestR = r; bestG = g; bestB = b;
      }
    }
  }

  return { char: bestChar, intensity: bestI, r: bestR, g: bestG, b: bestB };
};

// ════════════════════════════════════════════════════════════════════════
// SCENE 2 — NEURAL NETWORK / DEEP LEARNING
//
// Dense node grid with branching dendrites
// Signal pulses flowing along connections
// Loss landscape contour lines in background
// Mathematical notation tiling (f(x)=Wx+b, softmax, grad...)
// Synaptic vesicles (bright dots near node-connection junctions)
// Activation heatmap coloring the field
// Backpropagation arrows (reverse-direction signals)
//
// Palette: deep navy → electric blue → cyan → white
// ════════════════════════════════════════════════════════════════════════

const NN_DEEP:  readonly number[] = [25, 55, 110];
const NN_BLUE:  readonly number[] = [55, 130, 225];
const NN_CYAN:  readonly number[] = [100, 225, 255];
const NN_WHITE: readonly number[] = [230, 250, 255];
const NN_GRAD:  readonly number[] = [255, 160, 80]; // gradient/backprop color (orange)

const ML_TEXT = 'f(x)=Wx+b-sigmoid-ReLU-softmax-dL/dw-grad-loss-epoch-batch-Adam-lr=0.001-dropout-conv-attn-';

interface NNode { x: number; y: number; }
const GRID_NODES: NNode[] = (() => {
  const out: NNode[] = [];
  for (let gx = 0; gx < 6; gx++) {
    for (let gy = 0; gy < 4; gy++) {
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
  const aspect = 1.4;

  // ── Layer 0: Loss landscape contours + ML formula text ──
  const landscape = fbm(nx * 4 + 0.5, ny * 4 + 0.5, 2);
  const contour = Math.abs(Math.sin(landscape * 18));
  const isContourLine = contour < 0.08;

  const activation = fbm(nx * 6 + time * 0.4, ny * 5 - time * 0.3, 2);
  const wave = 0.5 + 0.5 * Math.sin(nx * 15 + ny * 10 + time * 2 + activation * 6);

  let bgI: number;
  let bgChar: string;
  if (isContourLine) {
    bgI = 0.18 + activation * 0.12;
    bgChar = '-';
  } else {
    bgI = 0.10 + activation * 0.14 + wave * 0.05;
    bgChar = formulaChar(ML_TEXT, col, row);
  }
  const [bgR, bgG, bgB] = lerpC3(NN_DEEP, NN_BLUE, NN_CYAN, activation);

  let bestI = bgI;
  let bestChar = bgChar;
  let bestR = bgR, bestG = bgG, bestB = bgB;

  // ── Layer 1: Dendrite branches radiating from nodes ──
  let minNodeDist = 999;
  let nearestNode = 0;
  for (let i = 0; i < GRID_NODES.length; i++) {
    const nd = GRID_NODES[i];
    const dx = nx - nd.x;
    const dy = (ny - nd.y) * aspect;
    const d2 = dx * dx + dy * dy; // skip sqrt for comparison
    if (d2 < minNodeDist) { minNodeDist = d2; nearestNode = i; }
  }
  minNodeDist = Math.sqrt(minNodeDist); // sqrt only for the winner

  // Dendrite: fractal-like branches using angular sectors
  if (minNodeDist > 0.06 && minNodeDist < 0.14) {
    const nd = GRID_NODES[nearestNode];
    const ang = Math.atan2((ny - nd.y) * aspect, nx - nd.x);
    const branches = Math.sin(ang * 4 + nearestNode * 1.5) * Math.sin(ang * 7 + nearestNode * 2.3);
    if (Math.abs(branches) > 0.7) {
      const dw = 1 - (minNodeDist - 0.06) / 0.08;
      const branchI = dw * 0.3 * Math.abs(branches);
      if (branchI > bestI) {
        bestI = branchI;
        bestChar = branches > 0 ? '/' : '\\';
        bestR = NN_BLUE[0]; bestG = NN_BLUE[1]; bestB = NN_BLUE[2];
      }
    }
  }

  // ── Layer 2: Connections with forward + backward signals ──
  // Only check nearby nodes (skip distant ones early for perf)
  const a = GRID_NODES[nearestNode];
  for (let i = 0; i < GRID_NODES.length; i++) {
    if (i === nearestNode) continue;
    const b = GRID_NODES[i];
    const abDx = b.x - a.x;
    const abDy = b.y - a.y;
    const abLen = Math.abs(abDx) + Math.abs(abDy); // Manhattan for fast reject
    if (abLen > 0.4) continue;

    const abLen2 = abDx * abDx + abDy * abDy;
    let t = ((nx - a.x) * abDx + (ny - a.y) * abDy) / abLen2;
    t = Math.max(0, Math.min(1, t));
    const px = a.x + t * abDx;
    const py = a.y + t * abDy;
    const dist = Math.sqrt((nx - px) ** 2 + ((ny - py) * aspect) ** 2);

    if (dist < 0.014) {
      const lw = 1 - dist / 0.014;

      // Forward signal (cyan/white)
      const fwdSig = Math.sin((t - time * 1.5 + nearestNode * 0.2 + i * 0.1) * PI * 8);
      const fwdPulse = smoothstep(0.6, 1.0, fwdSig);

      // Backpropagation signal (orange, reverse direction)
      const bwdSig = Math.sin(((1 - t) - time * 1.2 + i * 0.3) * PI * 6);
      const bwdPulse = smoothstep(0.7, 1.0, bwdSig);

      if (fwdPulse > 0.1) {
        const lineI = lw * (0.35 + fwdPulse * 0.55);
        if (lineI > bestI) {
          bestI = lineI;
          bestChar = wchar(fwdPulse, h);
          const [r, g, b] = lerpC(NN_CYAN, NN_WHITE, fwdPulse);
          bestR = r; bestG = g; bestB = b;
        }
      } else if (bwdPulse > 0.1) {
        const lineI = lw * (0.25 + bwdPulse * 0.4);
        if (lineI > bestI) {
          bestI = lineI;
          bestChar = '<';
          const [r, g, b] = lerpC(NN_BLUE, NN_GRAD, bwdPulse);
          bestR = r; bestG = g; bestB = b;
        }
      } else {
        const lineI = lw * 0.18;
        if (lineI > bestI) {
          bestI = lineI;
          bestChar = t % 0.04 < 0.02 ? ':' : '.';
          bestR = NN_BLUE[0]; bestG = NN_BLUE[1]; bestB = NN_BLUE[2];
        }
      }
    }

    // Synaptic vesicles — bright dots near connection endpoints
    const endDist = Math.min(
      Math.sqrt((nx - a.x) ** 2 + ((ny - a.y) * aspect) ** 2),
      Math.sqrt((nx - b.x) ** 2 + ((ny - b.y) * aspect) ** 2),
    );
    if (dist < 0.02 && endDist < 0.05 && endDist > 0.025) {
      const vesI = 0.5 * (1 - endDist / 0.05);
      if (vesI > bestI) {
        bestI = vesI;
        bestChar = 'o';
        bestR = NN_CYAN[0]; bestG = NN_CYAN[1]; bestB = NN_CYAN[2];
      }
    }
  }

  // ── Layer 3: Nodes with activation glow ──
  if (minNodeDist < 0.06) {
    const pulse = 0.6 + 0.4 * Math.sin(time * 2.5 + nearestNode * 1.1);
    if (minNodeDist < 0.015) {
      const w = 1 - minNodeDist / 0.015;
      const nodeI = (0.88 + 0.12 * w) * pulse;
      if (nodeI > bestI) {
        bestI = nodeI;
        bestChar = '@';
        const [r, g, b] = lerpC(NN_CYAN, NN_WHITE, w * pulse);
        bestR = r; bestG = g; bestB = b;
      }
    } else if (minNodeDist < 0.035) {
      const w = 1 - (minNodeDist - 0.015) / 0.02;
      const nodeI = 0.55 * w * pulse;
      if (nodeI > bestI) {
        bestI = nodeI; bestChar = '#';
        bestR = NN_CYAN[0]; bestG = NN_CYAN[1]; bestB = NN_CYAN[2];
      }
    } else {
      const w = 1 - (minNodeDist - 0.035) / 0.025;
      const nodeI = 0.28 * w * pulse;
      if (nodeI > bestI) {
        bestI = nodeI; bestChar = '*';
        bestR = NN_BLUE[0]; bestG = NN_BLUE[1]; bestB = NN_BLUE[2];
      }
    }
  }

  return { char: bestChar, intensity: bestI, r: bestR, g: bestG, b: bestB };
};

// ════════════════════════════════════════════════════════════════════════
// SCENE 3 — WAVE PHYSICS / INTERFERENCE + DIFFRACTION
//
// 3 moving wave sources with full-frame interference
// Double-slit diffraction barrier
// Phase front rings around sources
// Standing wave resonance bands
// Energy density hotspots (E ∝ A²)
// Physics formulas in background (E=hf, psi, v=lf...)
//
// Palette: deep teal → emerald → lime → bright white
// ════════════════════════════════════════════════════════════════════════

const WV_DEEP:   readonly number[] = [20, 80, 70];
const WV_TEAL:   readonly number[] = [45, 175, 150];
const WV_GREEN:  readonly number[] = [100, 245, 155];
const WV_BRIGHT: readonly number[] = [200, 255, 225];
const WV_SLIT:   readonly number[] = [180, 180, 160];

const PHYS_TEXT = 'E=hf-v=lf-psi-F=ma-E=mc2-dP/dt-H|psi>=E|psi>-k=2pi/l-omega-lambda-';

export const waveInterference: SceneFn = (nx, ny, time) => {
  const col = Math.floor(nx * 80);
  const row = Math.floor(ny * 55);
  const h = ihash(col, row);
  const aspect = 1.4;

  // 3 moving sources
  const sources: [number, number][] = [
    [0.22 + 0.06 * Math.sin(time * 0.3), 0.28],
    [0.78 - 0.06 * Math.sin(time * 0.4), 0.72],
    [0.50, 0.12 + 0.06 * Math.cos(time * 0.25)],
  ];

  // ── Double-slit barrier at x=0.5 ──
  const barrierX = 0.50;
  const barrierW = 0.012;
  const slit1Y = 0.35;
  const slit2Y = 0.65;
  const slitH = 0.06;
  const onBarrier = Math.abs(nx - barrierX) < barrierW
    && !(Math.abs(ny - slit1Y) < slitH)
    && !(Math.abs(ny - slit2Y) < slitH);

  if (onBarrier) {
    const brickY = (ny * 40) % 1;
    const brickI = 0.35 + 0.1 * (brickY > 0.9 ? 1 : 0);
    return { char: brickY > 0.9 ? '=' : '#', intensity: brickI, r: WV_SLIT[0], g: WV_SLIT[1], b: WV_SLIT[2] };
  }

  // ── Wave computation ──
  let combined = 0;
  for (const [sx, sy] of sources) {
    const d = Math.sqrt((nx - sx) ** 2 + ((ny - sy) * aspect) ** 2);
    combined += Math.sin(d * 38 - time * 3.2);
  }

  // Diffraction from slits (secondary sources at slit positions)
  if (nx > barrierX + barrierW) {
    for (const slitY of [slit1Y, slit2Y]) {
      const d = Math.sqrt((nx - barrierX) ** 2 + ((ny - slitY) * aspect) ** 2);
      combined += 0.8 * Math.sin(d * 38 - time * 3.2);
    }
  }

  const maxSources = nx > barrierX + barrierW ? 5 : 3;
  const wave = (combined + maxSources) / (maxSources * 2);

  // ── Source markers ──
  for (const [sx, sy] of sources) {
    const d = Math.sqrt((nx - sx) ** 2 + ((ny - sy) * aspect) ** 2);
    if (d < 0.02) return { char: '@', intensity: 0.95, r: 255, g: 255, b: 255 };
    if (d < 0.04) {
      const w = 1 - (d - 0.02) / 0.02;
      return { char: '#', intensity: 0.7 * w, r: 255, g: 255, b: 230 };
    }
    // Phase front rings
    const ringPhase = d * 38 - time * 3.2;
    const ringVal = Math.abs(Math.sin(ringPhase));
    if (ringVal < 0.04 && d < 0.2 && d > 0.04) {
      return { char: '.', intensity: 0.3 * (1 - d / 0.2), r: 255, g: 255, b: 200 };
    }
  }

  // ── Slit edge glow ──
  for (const slitY of [slit1Y, slit2Y]) {
    const sd = Math.sqrt((nx - barrierX) ** 2 + ((ny - slitY) * aspect) ** 2);
    if (sd < 0.03 && Math.abs(nx - barrierX) < 0.02) {
      return { char: '*', intensity: 0.5, r: WV_BRIGHT[0], g: WV_BRIGHT[1], b: WV_BRIGHT[2] };
    }
  }

  // ── Standing wave resonance bands (horizontal) ──
  const standingWave = Math.sin(ny * 25) * Math.sin(nx * 20 + time * 0.5);
  const standingBoost = Math.abs(standingWave) > 0.85 ? 0.08 : 0;

  // ── Energy density E ∝ A² ──
  const energy = wave * wave;

  // ── Map to output ──
  let intensity: number;
  let char: string;
  let cr: number, cg: number, cb: number;
  const boostedWave = clamp01(wave + standingBoost);

  if (boostedWave > 0.72) {
    const w = (boostedWave - 0.72) / 0.28;
    intensity = 0.50 + w * 0.45 + energy * 0.1;
    char = wchar(0.5 + w * 0.5, h);
    [cr, cg, cb] = lerpC(WV_GREEN, WV_BRIGHT, w);
  } else if (boostedWave > 0.48) {
    const w = (boostedWave - 0.48) / 0.24;
    intensity = 0.25 + w * 0.25;
    char = wchar(0.3 + w * 0.2, h);
    [cr, cg, cb] = lerpC(WV_TEAL, WV_GREEN, w);
  } else if (boostedWave > 0.25) {
    const w = (boostedWave - 0.25) / 0.23;
    intensity = 0.13 + w * 0.12;
    char = formulaChar(PHYS_TEXT, col, row);
    [cr, cg, cb] = lerpC(WV_DEEP, WV_TEAL, w);
  } else {
    const w = boostedWave / 0.25;
    intensity = 0.09 + w * 0.04;
    char = formulaChar(PHYS_TEXT, col, row);
    [cr, cg, cb] = WV_DEEP as unknown as [number, number, number];
  }

  return { char, intensity, r: cr, g: cg, b: cb };
};

// ════════════════════════════════════════════════════════════════════════
// SCENE 4 — CRYSTAL LATTICE / MATERIALS SCIENCE
//
// Two-layer hex lattice with phonon displacement
// Brillouin zone boundary highlight
// Crystal defect (vacancy + interstitial)
// Electron density field (fbm)
// Band structure gradient (top→bottom color shift)
// Chemistry formulas in background
//
// Palette: deep wine → rose → pink → bright white-pink
// ════════════════════════════════════════════════════════════════════════

const CR_DEEP:   readonly number[] = [110, 45, 70];
const CR_ROSE:   readonly number[] = [230, 115, 155];
const CR_PINK:   readonly number[] = [255, 175, 215];
const CR_BRIGHT: readonly number[] = [255, 230, 245];
const CR_DEFECT: readonly number[] = [255, 220, 100]; // yellow for defects

const CHEM_TEXT = 'NaCl-Fe2O3-SiO2-Cu-C60-graphene-BCC-FCC-HCP-phonon-Bragg-dislocation-vacancy-';

export const molecularLattice: SceneFn = (nx, ny, time) => {
  const col = Math.floor(nx * 80);
  const row = Math.floor(ny * 55);

  const angle = time * 0.18;
  const ca = Math.cos(angle), sa = Math.sin(angle);
  const cx = nx - 0.5;
  const cy = (ny - 0.5) * 1.4;
  const rx = cx * ca - cy * sa;
  const ry = cx * sa + cy * ca;

  // ── Layer 0: Chemistry formula background + electron density ──
  const density = fbm(rx * 4 + time * 0.12, ry * 4 - time * 0.08, 2);
  // Band structure: color shifts with vertical position
  const bandT = clamp01(ny * 1.2);
  let bestI = 0.09 + density * 0.12;
  let bestChar = formulaChar(CHEM_TEXT, col, row);
  let [bestR, bestG, bestB] = lerpC3(CR_DEEP, CR_ROSE, CR_PINK, density * 0.4 + bandT * 0.2);

  // ── Layer 1: Brillouin zone boundary (hexagonal outline) ──
  const bzScale = 3.8;
  const bzX = rx * bzScale;
  const bzY = ry * bzScale;
  // Hexagonal distance
  const hd = Math.max(Math.abs(bzX), Math.abs(bzX * 0.5 + bzY * 0.866), Math.abs(bzX * 0.5 - bzY * 0.866));
  const bzDist = Math.abs(hd - 1.0);
  if (bzDist < 0.04) {
    const bzW = 1 - bzDist / 0.04;
    const bzI = bzW * 0.35;
    if (bzI > bestI) {
      bestI = bzI;
      bestChar = bzW > 0.5 ? '=' : '-';
      bestR = CR_BRIGHT[0]; bestG = CR_BRIGHT[1]; bestB = CR_BRIGHT[2];
    }
  }

  // ── Layer 2: Crystal defect (vacancy at a specific hex position) ──
  const defectRx = rx - 0.08;
  const defectRy = ry + 0.05;
  const defectD = Math.sqrt(defectRx * defectRx + defectRy * defectRy);
  if (defectD < 0.06) {
    const dw = 1 - defectD / 0.06;
    const defI = dw * 0.55;
    if (defI > bestI) {
      bestI = defI;
      bestChar = defectD < 0.02 ? 'X' : (defectD < 0.04 ? 'x' : '.');
      bestR = CR_DEFECT[0]; bestG = CR_DEFECT[1]; bestB = CR_DEFECT[2];
    }
  }

  // ── Layer 3: Two hex lattice layers ──
  const scales = [
    { s: 8,  off: 0,   weight: 1.0  },
    { s: 13, off: 0.5, weight: 0.45 },
  ];

  for (const layer of scales) {
    const sx = (rx + layer.off) * layer.s;
    const sy = (ry + layer.off) * layer.s;

    // Phonon displacement (lattice vibration)
    const phononDx = 0.15 * Math.sin(time * 3 + sx * 0.5 + sy * 0.3);
    const phononDy = 0.15 * Math.cos(time * 2.5 + sx * 0.3 - sy * 0.5);
    const psx = sx + phononDx;
    const psy = sy + phononDy;

    // Hex grid
    const q = psx * 2 / 3;
    const r2 = -psx / 3 + Math.sqrt(3) / 3 * psy;
    let rq = Math.round(q), rr = Math.round(r2);
    const rs = Math.round(-q - r2);
    const dq = Math.abs(rq - q), dr = Math.abs(rr - r2), ds = Math.abs(rs + q + r2);
    if (dq > dr && dq > ds) rq = -rr - rs;
    else if (dr > ds) rr = -rq - rs;

    const hx2 = rq * 1.5;
    const hy2 = (rq * 0.5 + rr) * Math.sqrt(3);
    const dist = Math.sqrt((psx - hx2) ** 2 + (psy - hy2) ** 2);

    const pulse = 0.65 + 0.35 * Math.sin(time * 1.6 + rq * 2.1 + rr * 3.4);
    const w = layer.weight;

    if (dist < 0.3) {
      const aw = 1 - dist / 0.3;
      const intensity = aw * 0.85 * pulse * w;
      if (intensity > bestI) {
        bestI = intensity;
        bestChar = dist < 0.1 ? '@' : dist < 0.18 ? '#' : '*';
        const [cr, cg, cb] = aw > 0.5 ? lerpC(CR_PINK, CR_BRIGHT, (aw - 0.5) * 2) : lerpC(CR_ROSE, CR_PINK, aw * 2) as [number, number, number];
        bestR = cr; bestG = cg; bestB = cb;
      }
    } else if (dist < 0.75) {
      const bw = 1 - (dist - 0.3) / 0.45;
      const bondPulse = 0.5 + 0.5 * Math.sin(time * 2.2 + dist * 14);
      const intensity = bw * bondPulse * 0.35 * w;
      if (intensity > bestI) {
        bestI = intensity;
        bestChar = bondPulse > 0.55 ? '-' : (bondPulse > 0.3 ? ':' : '.');
        const [cr, cg, cb] = lerpC(CR_DEEP, CR_ROSE, bw * bondPulse);
        bestR = cr; bestG = cg; bestB = cb;
      }
    }
  }

  return { char: bestChar, intensity: bestI, r: bestR, g: bestG, b: bestB };
};

// ════════════════════════════════════════════════════════════════════════
// SCENE 5 — QUANTUM MECHANICS / ATOMIC ORBITALS
//
// Central nucleus with s, p, d orbital probability clouds
// 6 elliptical orbits with electron trails
// Quantum tunneling region (probability leaking through barrier)
// Wave function nodal surfaces
// Schrodinger/quantum formulas in background
// Spin indicators near electrons
//
// Palette: deep indigo → violet → lavender → white
// ════════════════════════════════════════════════════════════════════════

const QM_DEEP:    readonly number[] = [40, 25, 90];
const QM_VIOLET:  readonly number[] = [155, 120, 230];
const QM_LAV:     readonly number[] = [210, 190, 255];
const QM_BRIGHT:  readonly number[] = [245, 240, 255];
const QM_NUCLEUS: readonly number[] = [255, 230, 190];
const QM_TUNNEL:  readonly number[] = [100, 255, 180]; // green for tunneling

const QM_TEXT = 'H|psi>=E|psi>-ih*d/dt-Schrodinger-n=1,2,3-l=0..n-1-m=-l..l-spin=+-1/2-Planck-Bohr-';

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
  const col = Math.floor(nx * 80);
  const row = Math.floor(ny * 55);
  const h = ihash(col, row);
  const cx = nx - 0.5;
  const cy = (ny - 0.5) * 1.4;
  const nucDist = Math.sqrt(cx * cx + cy * cy);
  const ang = Math.atan2(cy, cx);

  // ── Layer 0: Quantum formula background + probability field ──
  const psi = fbm(nx * 5 + time * 0.2, ny * 5 - time * 0.15, 2);
  const radial = Math.exp(-nucDist * 2.2);

  // p-orbital lobes (figure-8 probability shape)
  const pOrbital = Math.abs(Math.cos(ang)) * Math.exp(-nucDist * 5) * 0.6;
  // d-orbital (cloverleaf)
  const dOrbital = Math.abs(Math.sin(2 * ang)) * Math.exp(-nucDist * 4) * 0.35;

  const bgDensity = psi * 0.35 + radial * 0.3 + pOrbital + dOrbital;
  let bestI = 0.08 + bgDensity * 0.22;
  let bestChar = formulaChar(QM_TEXT, col, row);
  let [bestR, bestG, bestB] = lerpC3(QM_DEEP, QM_VIOLET, QM_LAV, clamp01(bgDensity * 0.7));

  // ── Layer 1: Wave function nodal surfaces ──
  // Nodes where psi = 0 form dark bands
  const waveFunc = Math.sin(nucDist * 20 + ang * 2 - time * 0.5);
  if (Math.abs(waveFunc) < 0.05 && nucDist < 0.35 && nucDist > 0.05) {
    const nodalI = 0.30;
    if (nodalI > bestI) {
      bestI = nodalI;
      bestChar = '0';
      bestR = QM_LAV[0]; bestG = QM_LAV[1]; bestB = QM_LAV[2];
    }
  }

  // ── Layer 2: Quantum tunneling barrier ──
  const barrierX = 0.78;
  const barrierW = 0.02;
  const tunnelRegion = nx > barrierX + barrierW && nx < barrierX + 0.12 && ny > 0.3 && ny < 0.7;
  if (Math.abs(nx - barrierX) < barrierW && ny > 0.3 && ny < 0.7) {
    // Barrier wall
    return { char: '#', intensity: 0.45, r: 160, g: 160, b: 140 };
  }
  if (tunnelRegion) {
    // Exponential decay of probability beyond barrier
    const penetration = (nx - barrierX - barrierW) / 0.10;
    const tunnelProb = Math.exp(-penetration * 4) * 0.5;
    if (tunnelProb > bestI) {
      bestI = tunnelProb;
      bestChar = tunnelProb > 0.25 ? '*' : '.';
      const [r, g, b] = lerpC(QM_TUNNEL, QM_BRIGHT, tunnelProb);
      bestR = r; bestG = g; bestB = b;
    }
  }

  // ── Layer 3: Orbital shells + electrons ──
  for (let oi = 0; oi < ORBITS.length; oi++) {
    const orb = ORBITS[oi];
    const ct = Math.cos(orb.tilt), st = Math.sin(orb.tilt);
    const lx = cx * ct + cy * st;
    const ly = -cx * st + cy * ct;

    const ex = lx / orb.a;
    const ey = ly / orb.b;
    const ellipseR = Math.sqrt(ex * ex + ey * ey);
    const ellipseDist = Math.abs(ellipseR - 1);

    const shellWidth = 0.16;
    if (ellipseDist < shellWidth) {
      const shellW = 1 - ellipseDist / shellWidth;
      const shellI = shellW * shellW * 0.38;

      // Electron
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

      if (eDist < 0.022) {
        cellI = 0.95;
        cellChar = '@';
        [cr, cg, cb] = [255, 255, 255];
      } else if (eDist < 0.045) {
        const gw = 1 - (eDist - 0.022) / 0.023;
        cellI = 0.6 * gw;
        cellChar = '#';
        [cr, cg, cb] = QM_BRIGHT as unknown as [number, number, number];
      } else if (trail > 0.15) {
        cellI = shellW * trail * 0.55;
        cellChar = wchar(trail * 0.6, h);
        [cr, cg, cb] = lerpC(QM_VIOLET, QM_LAV, trail);
      } else {
        cellI = shellI;
        cellChar = shellW > 0.5 ? wchar(shellW * 0.35, h) : LIGHT[h % LIGHT.length];
        [cr, cg, cb] = lerpC(QM_VIOLET, QM_LAV, shellW * 0.5);
      }

      // Spin indicator near electron
      if (eDist > 0.03 && eDist < 0.06) {
        const spinAngle = Math.atan2(cy - ewy, cx - ewx);
        const isUp = spinAngle > 0 && spinAngle < PI * 0.3;
        const isDown = spinAngle < 0 && spinAngle > -PI * 0.3;
        if (isUp || isDown) {
          cellI = 0.45;
          cellChar = isUp ? '^' : 'v';
          [cr, cg, cb] = QM_LAV as unknown as [number, number, number];
        }
      }

      if (cellI > bestI) {
        bestI = cellI;
        bestChar = cellChar;
        bestR = cr; bestG = cg; bestB = cb;
      }
    }
  }

  // ── Layer 4: Nucleus ──
  if (nucDist < 0.04) {
    const w = 1 - nucDist / 0.04;
    const [r, g, b] = lerpC(QM_NUCLEUS, [255, 255, 255], w * 0.6);
    return { char: w > 0.5 ? '@' : '#', intensity: 0.85 + w * 0.15, r, g, b };
  }
  if (nucDist < 0.07) {
    const w = 1 - (nucDist - 0.04) / 0.03;
    const nI = 0.4 * w;
    if (nI > bestI) {
      bestI = nI; bestChar = '*';
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
