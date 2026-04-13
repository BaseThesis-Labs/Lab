# BaseThesis Labs — Landing Page Design

## Purpose

Single-page marketing site for BaseThesis Labs — a frontier research lab with three pillars: (1) fundamental research, (2) product development, (3) a founder-in-residence fund. Target audience: researchers, founders, investors, press.

## Aesthetic

Frontier-lab modern minimalism. Reference: decart.ai, Anthropic, Ideogram. Dark-first, oversized typography, single accent color, subtle WebGL motion. No stock imagery. No gradient soup.

- **Palette**: background `#0A0A0A`, surface `#111111`, text `#EDEDED`, muted `#737373`, accent `#C6F24E` (electric lime)
- **Type**: Geist Sans (UI + display), JetBrains Mono (labels, wordmark, indices), Fraunces italic (editorial accents only)
- **Motion**: WebGL shader noise field in hero, scroll-triggered fades (Framer Motion), cursor-reactive hover states, no parallax
- **Grid**: 12 column, 1200px max content width, generous whitespace

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS v3 (custom theme tokens)
- Framer Motion (scroll reveals, hover)
- Raw WebGL fragment shader in hero (no three.js — keeps bundle lean)
- Fonts via `@fontsource` packages (self-hosted)

## Sections

1. **Nav** — sticky, translucent on scroll. Wordmark `BASETHESIS / LABS` in mono, right-aligned links: Research, Products, Fund, Contact.
2. **Hero** — fullscreen minus nav. Shader noise background. Headline: "A frontier research lab building the substrate for the next computing paradigm." Subhead one line. Single CTA → Fund section. Small mono footer with coordinates/year.
3. **Manifesto** — two short paragraphs, editorial column, Fraunces italic pull-quote accent.
4. **Research** — section label `01 / RESEARCH`. 4-card grid. Each card: index (`R.01`), title, 2-sentence description, hover reveals thin accent line. Areas: World Models, Post-Transformer Architectures, Neural Interfaces, Computational Biology.
5. **Products** — section label `02 / PRODUCTS`. 3 alternating rows. Each: mono codename, product name, 2-sentence description, status chip. Drafts: *Helix* (Research Preview), *Meridian* (Private Beta), *Atlas* (In Development).
6. **Fund** — section label `03 / FUND`. Two-column split. Left: pitch paragraph + apply CTA. Right: 4 stat tiles — $250K cheque, 6 founders/cohort, 12 weeks, 7% equity.
7. **Footer** — wordmark, location placeholder (San Francisco · Remote), contact email, social links, © line.

## Component Architecture

```
src/
  App.tsx                  — page composition
  components/
    Nav.tsx
    Hero.tsx
    ShaderBackground.tsx   — WebGL canvas
    Manifesto.tsx
    Research.tsx
    ResearchCard.tsx
    Products.tsx
    ProductRow.tsx
    Fund.tsx
    StatTile.tsx
    Footer.tsx
    SectionLabel.tsx       — shared `NN / TITLE` label
    RevealOnScroll.tsx     — Framer Motion wrapper
  content/
    site.ts                — all copy centralized (easy edits)
  styles/
    index.css              — Tailwind base + font imports
  main.tsx
  vite-env.d.ts
```

All copy lives in `content/site.ts` so the user can edit placeholder text without touching components.

## Shader

Single fragment shader: animated Simplex noise field, low alpha, accent color multiplied in at low intensity, vignette falloff. Pauses when tab hidden (`visibilitychange`). Falls back to static CSS gradient if WebGL unavailable.

## Responsiveness

- Mobile (< 640px): stacks, hero headline scales to ~40px, shader still runs
- Tablet (640–1024px): 2-col grids
- Desktop (> 1024px): full layout as designed

## Accessibility

- Respect `prefers-reduced-motion` → disable shader animation, keep static frame
- Semantic landmarks (`nav`, `main`, `section`, `footer`)
- Sufficient contrast on all text (muted text min 4.5:1 on bg)
- Focus rings on all interactive elements (accent-colored)

## Out of Scope (v1)

- Routing / multi-page
- CMS / dynamic content
- Contact form (mailto link only)
- Analytics
- Dark/light toggle (dark only)

## Success Criteria

- Lighthouse performance ≥ 90, accessibility ≥ 95
- Runs `npm run dev` and `npm run build` clean
- Looks taste-aligned with decart.ai on first load
- All copy swappable from one file
