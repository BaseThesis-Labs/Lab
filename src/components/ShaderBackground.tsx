import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Raymarched gyroid-inside-sphere. Slow rotation, fresnel rim in accent, dim fog.
// Kept in a single fragment shader — no three.js. ~80 LOC of GLSL.
const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec3  u_accent;

#define MAX_STEPS 72
#define MAX_DIST  14.0
#define SURF_DIST 0.0015

// 2D rotation
mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

// Gyroid SDF (approximate — scaled by 0.45 to keep marching stable)
float sdGyroid(vec3 p, float scale, float thickness, float bias) {
  p *= scale;
  float g = dot(sin(p), cos(p.yzx)) - bias;
  return (abs(g) - thickness) / scale;
}

float sdSphere(vec3 p, float r) { return length(p) - r; }

float opSmoothUnion(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
  // offset object to the right and slightly up
  p -= vec3(0.95, 0.15, 0.0);

  // slow rotation
  p.xz *= rot(u_time * 0.10);
  p.yz *= rot(u_time * 0.06);

  // animated bias morphs the lattice
  float bias = 0.25 * sin(u_time * 0.20);

  // thin-walled gyroid — structure is visible
  float g = sdGyroid(p, 3.2, 0.025, bias);

  // bound by sphere → compact lattice ball
  float s = sdSphere(p, 0.95);
  return max(g, s);
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

float raymarch(vec3 ro, vec3 rd, out vec3 hitPos) {
  float t = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    if (d < SURF_DIST) { hitPos = p; return t; }
    if (t > MAX_DIST) break;
    t += d * 0.9;
  }
  hitPos = vec3(0.0);
  return -1.0;
}

// small hash for dithering (banding killer)
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);

  // subtle mouse parallax
  vec2 m = (u_mouse - 0.5) * 0.15;

  // camera
  vec3 ro = vec3(m.x, m.y * 0.5, 3.6);
  vec3 rd = normalize(vec3(uv, -1.45));

  vec3 hitPos;
  float t = raymarch(ro, rd, hitPos);

  // background: near-pure black with a faint off-axis glow behind the object
  vec2 glowCenter = vec2(0.55, 0.08);
  float gd = length((uv - glowCenter) * vec2(1.1, 1.0));
  vec3 bg = vec3(0.020, 0.022, 0.024);
  bg += u_accent * 0.105 * smoothstep(0.95, 0.0, gd);

  vec3 col = bg;

  if (t > 0.0) {
    vec3 n = calcNormal(hitPos);
    vec3 v = -rd;

    // soft key light
    vec3 L1 = normalize(vec3(0.4, 0.7, 0.5));
    float diff = max(dot(n, L1), 0.0);

    // rim / fresnel — much gentler
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);

    // material
    vec3 base = vec3(0.085, 0.090, 0.095);
    base += vec3(0.16) * diff;

    // accent edge
    vec3 rim = u_accent * fres * 1.45;

    // specular pin
    vec3 H = normalize(L1 + v);
    float spec = pow(max(dot(n, H), 0.0), 26.0) * 0.45;
    base += vec3(spec);

    // accent tint on lit facets
    base += u_accent * diff * 0.10;

    col = base + rim;

    // distance fog toward bg
    float fog = 1.0 - exp(-t * 0.22);
    col = mix(col, bg, fog * 0.7);
  }

  // subtle global vignette from canvas center
  float r = length(uv * vec2(1.3, 1.0));
  col *= smoothstep(1.65, 0.3, r);

  // dither (kills banding)
  col += (hash12(gl_FragCoord.xy) - 0.5) * 0.010;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('shader compile:', gl.getShaderInfoLog(s));
  }
  return s;
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('program link:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uAccent = gl.getUniformLocation(program, 'u_accent');
    // Mulberry / wine-rose — #B85F7A
    gl.uniform3f(uAccent, 0.722, 0.373, 0.478);

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      // Lower DPR for this heavier shader so it stays 60fps on retina
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const frame = () => {
      if (!visible) return;
      // ease mouse
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      resize();
      const t = reduced ? 2.0 : (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const onVis = () => {
      visible = !document.hidden;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    document.addEventListener('visibilitychange', onVis);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ display: 'block' }}
    />
  );
}
