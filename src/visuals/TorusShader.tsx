import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Raymarched torus knot — different geometry from the hero's gyroid sphere.
// Cool blue/teal accent instead of the hero's rose. Wireframe-like surface.
const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec3  u_accent;

#define MAX_STEPS 80
#define MAX_DIST  16.0
#define SURF_DIST 0.002

mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

// Torus knot SDF — a (2,3) trefoil knot wrapped around a torus
float sdTorusKnot(vec3 p) {
  // Rotate for animation
  p.xz *= rot(u_time * 0.08);
  p.yz *= rot(u_time * 0.05);

  float r1 = 1.0;   // major radius
  float r2 = 0.35;   // minor radius (tube thickness)

  // Knot parameters: p=2, q=3 trefoil
  float phi = atan(p.z, p.x);
  float knotAngle = phi * 1.5; // q/p ratio

  // Point on the knot centerline
  vec3 c = vec3(
    (r1 + r2 * 0.5 * cos(knotAngle)) * cos(phi),
    r2 * 0.5 * sin(knotAngle),
    (r1 + r2 * 0.5 * cos(knotAngle)) * sin(phi)
  );

  float d = length(p - c) - 0.12;

  // Add a second pass for the torus base (faint)
  float torusDist = length(vec2(length(p.xz) - r1, p.y)) - 0.06;

  return min(d, torusDist * 1.5);
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(
    sdTorusKnot(p + e.xyy) - sdTorusKnot(p - e.xyy),
    sdTorusKnot(p + e.yxy) - sdTorusKnot(p - e.yxy),
    sdTorusKnot(p + e.yyx) - sdTorusKnot(p - e.yyx)
  ));
}

float raymarch(vec3 ro, vec3 rd, out vec3 hitPos) {
  float t = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * t;
    float d = sdTorusKnot(p);
    if (d < SURF_DIST) { hitPos = p; return t; }
    if (t > MAX_DIST) break;
    t += d * 0.85;
  }
  hitPos = vec3(0.0);
  return -1.0;
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);

  vec2 m = (u_mouse - 0.5) * 0.12;

  vec3 ro = vec3(m.x, m.y * 0.4, 3.8);
  vec3 rd = normalize(vec3(uv, -1.5));

  // Background: subtle radial glow
  vec2 glowCenter = vec2(-0.3, 0.05);
  float gd = length((uv - glowCenter) * vec2(1.0, 1.1));
  vec3 bg = vec3(0.018, 0.020, 0.025);
  bg += u_accent * 0.08 * smoothstep(0.9, 0.0, gd);

  vec3 col = bg;

  vec3 hitPos;
  float t = raymarch(ro, rd, hitPos);

  if (t > 0.0) {
    vec3 n = calcNormal(hitPos);
    vec3 v = -rd;

    // Lighting
    vec3 L1 = normalize(vec3(0.5, 0.8, 0.4));
    float diff = max(dot(n, L1), 0.0);

    // Fresnel rim
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.5);

    // Wireframe-like surface pattern
    vec3 ap = hitPos;
    ap.xz *= rot(u_time * 0.08);
    ap.yz *= rot(u_time * 0.05);
    float phi = atan(ap.z, ap.x);
    float wireU = fract(phi * 6.0);
    float wireV = fract(ap.y * 8.0 + phi * 3.0);
    float wire = smoothstep(0.04, 0.0, min(wireU, 1.0 - wireU))
               + smoothstep(0.04, 0.0, min(wireV, 1.0 - wireV));
    wire = min(wire, 1.0);

    // Material
    vec3 base = vec3(0.04, 0.05, 0.07);
    base += vec3(0.10) * diff;

    // Accent edge + wireframe
    vec3 rim = u_accent * fres * 1.2;
    base += u_accent * wire * 0.25;

    // Specular
    vec3 H = normalize(L1 + v);
    float spec = pow(max(dot(n, H), 0.0), 32.0) * 0.4;
    base += vec3(spec);

    base += u_accent * diff * 0.08;

    col = base + rim;

    // Distance fog
    float fog = 1.0 - exp(-t * 0.18);
    col = mix(col, bg, fog * 0.65);
  }

  // Vignette
  float r = length(uv * vec2(1.2, 1.0));
  col *= smoothstep(1.7, 0.3, r);

  // Dither
  col += (hash12(gl_FragCoord.xy) - 0.5) * 0.008;

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

export function TorusShader() {
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
    // Cool teal-blue accent — #5BA8C8
    gl.uniform3f(uAccent, 0.357, 0.659, 0.784);

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
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
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
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
    window.addEventListener('mousemove', onMove, { passive: true });
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
