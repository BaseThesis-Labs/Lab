export const site = {
  brand: {
    wordmark: 'BASETHESIS',
    suffix: 'LABS',
    year: '2026',
    coords: '37.7749° N / 122.4194° W',
    location: 'San Francisco · Remote',
    email: 'contact@basethesis.xyz',
  },

  nav: [
    { label: 'Research', href: '#research' },
    { label: 'Products', href: '#products' },
    { label: 'Fund', href: '#fund' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    eyebrow: 'Est. 2026 · Frontier Research',
    headline: 'A frontier research lab building the substrate for the next computing paradigm.',
    sub: 'We pursue a small number of high-conviction bets across intelligence, interface, and biology — and turn them into products and companies.',
    cta: { label: 'Apply to the Fund', href: '#fund' },
    secondary: { label: 'Read the thesis', href: '#manifesto' },
  },

  manifesto: {
    paragraphs: [
      'Most research labs optimize for legibility: papers, benchmarks, citations. Most product companies optimize for distribution: users, revenue, retention. Neither system produces the kind of work that reshapes what is possible.',
      'BaseThesis Labs exists in the gap. We take a handful of first-principles bets, give them patient capital and hard deadlines, and ship the ones that survive contact with reality.',
    ],
    pullquote: 'Taste is the scarce input. Everything else is tractable.',
  },

  research: {
    label: '01 / Research',
    intro: 'Four active programs. Each led by a principal investigator, each with a 24-month horizon, each resourced to produce one thing the field did not believe was possible.',
    areas: [
      {
        id: 'R.01',
        title: 'World Models',
        body: 'Learned simulators of physical and economic environments. We believe simulation, not text, is the training substrate of the next decade.',
      },
      {
        id: 'R.02',
        title: 'Post-Transformer Architectures',
        body: 'State-space models, hybrid attention, and recurrent depth. Better scaling laws, cheaper inference, longer memory — pick three.',
      },
      {
        id: 'R.03',
        title: 'Neural Interfaces',
        body: 'Non-invasive read and write channels between silicon and cortex. We ship firmware, not white papers.',
      },
      {
        id: 'R.04',
        title: 'Computational Biology',
        body: 'Generative models for protein design, cell programming, and small-molecule discovery. Wet-lab in the loop, not in the appendix.',
      },
    ],
  },

  products: {
    label: '02 / Products',
    intro: 'When research clears the bar, we spin it into a product with a small, obsessive team. Three are underway.',
    items: [
      {
        codename: 'P.01',
        name: 'Synth',
        body: 'Generative synthesis engine. High-fidelity audio, video, and training data on demand.',
        status: 'Private Beta',
        url: 'https://getsynth.io',
      },
      {
        codename: 'P.02',
        name: 'KoeCode',
        body: 'Voice-native coding environment. Build, edit, and ship software by speaking to it.',
        status: 'Research Preview',
        url: 'https://koecode.io',
      },
      {
        codename: 'P.03',
        name: 'MoltCode',
        body: 'Codebase transformation at repo scale. Migrate, refactor, and modernize legacy systems.',
        status: 'In Development',
        url: 'https://moltcode.io',
      },
    ],
  },

  fund: {
    label: '03 / Fund',
    pitch:
      'The BaseThesis Fund backs a small cohort of founders-in-residence each year. You arrive with a thesis. You leave with a company. In between you get capital, compute, and a room full of people who have done it before.',
    stats: [
      { n: 250, prefix: '$', suffix: 'K', v: 'Initial cheque' },
      { n: 6, v: 'Founders per cohort' },
      { n: 12, suffix: ' wk', v: 'Residency program' },
      { n: 7, suffix: '%', v: 'Target equity' },
    ],
    cta: { label: 'Apply — Cohort 02', href: 'mailto:founders@basethesis.xyz' },
    deadline: 'Applications close 15 June 2026',
  },

  footer: {
    columns: [
      {
        title: 'Lab',
        links: [
          { label: 'Research', href: '#research' },
          { label: 'Products', href: '#products' },
          { label: 'Fund', href: '#fund' },
        ],
      },
      {
        title: 'Org',
        links: [
          { label: 'Careers', href: 'mailto:careers@basethesis.xyz' },
          { label: 'Press', href: 'mailto:press@basethesis.xyz' },
          { label: 'Residency', href: 'mailto:founders@basethesis.xyz' },
        ],
      },
      {
        title: 'Elsewhere',
        links: [
          { label: 'X', href: 'https://x.com' },
          { label: 'GitHub', href: 'https://github.com' },
          { label: 'arXiv', href: 'https://arxiv.org' },
        ],
      },
    ],
  },
};
