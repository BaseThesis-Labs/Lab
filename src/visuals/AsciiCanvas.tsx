import { useEffect, useRef } from 'react';
import { SCENES, type SceneFn } from './ascii-scenes';

interface Props {
  className?: string;
}

const CELL_W = 10;
const CELL_H = 14;

const SCENE_HOLD = 8;
const SCENE_FADE = 2;
const SCENE_TOTAL = SCENE_HOLD + SCENE_FADE;

const MOUSE_RADIUS = 0.15;
const MOUSE_LERP = 0.08;
const MOUSE_INTENSITY_BOOST = 0.3;
const MOUSE_DENSE_RATIO = 0.05;
const MOUSE_DENSE_CHARS = '#@$';

const COLOR_ACCENT = [232, 217, 190] as const;
const COLOR_BRIGHT = [237, 237, 237] as const;
const COLOR_MUTED  = [115, 115, 115] as const;

function intensityToColor(intensity: number): string {
  let r: number, g: number, b: number, a: number;

  if (intensity < 0.15) {
    [r, g, b] = COLOR_MUTED;
    a = 0.1 + intensity * 0.67;
  } else if (intensity > 0.75) {
    const t = (intensity - 0.75) / 0.25;
    r = COLOR_ACCENT[0] + (COLOR_BRIGHT[0] - COLOR_ACCENT[0]) * t;
    g = COLOR_ACCENT[1] + (COLOR_BRIGHT[1] - COLOR_ACCENT[1]) * t;
    b = COLOR_ACCENT[2] + (COLOR_BRIGHT[2] - COLOR_ACCENT[2]) * t;
    a = 0.7 + t * 0.3;
  } else {
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

    const mouse = { x: -1, y: -1, tx: -1, ty: -1, active: false, fadeOut: 0 };

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

      ctx!.clearRect(0, 0, cw, ch);

      const fontSize = Math.round(11 * dpr);
      ctx!.font = `${fontSize}px "JetBrains Mono Variable", "JetBrains Mono", monospace`;
      ctx!.textBaseline = 'top';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / cols;
          const ny = r / rows;

          let cell = current(nx, ny, time);

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

          if (mouse.fadeOut > 0 && mouse.x >= 0) {
            const mdx = nx - mouse.x;
            const mdy = (ny - mouse.y) * 1.4;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mDist < MOUSE_RADIUS) {
              const influence = (1 - mDist / MOUSE_RADIUS) * mouse.fadeOut;

              cell.intensity = Math.min(1, cell.intensity + MOUSE_INTENSITY_BOOST * influence);

              if (mDist < MOUSE_RADIUS * MOUSE_DENSE_RATIO) {
                const denseIdx = Math.floor(Math.random() * MOUSE_DENSE_CHARS.length);
                cell.char = MOUSE_DENSE_CHARS[denseIdx];
              }
            }
          }

          if (cell.intensity < 0.02) continue;

          ctx!.fillStyle = intensityToColor(cell.intensity);
          ctx!.fillText(cell.char, c * cellW, r * cellH);
        }
      }

      if (!reduced) raf = requestAnimationFrame(render);
    }

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

    const el = canvas;
    el.addEventListener('mousemove', onMouseMove, { passive: true });
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize);

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
