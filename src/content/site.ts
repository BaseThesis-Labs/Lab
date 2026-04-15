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
    sub: 'We pursue a small number of high-conviction bets across intelligence, interface, and emergence — and turn them into products and companies.',
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
    label: '02 / Research',
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
        title: 'Swarm Intelligence',
        body: 'Decentralized agents that coordinate without a center. Emergence, robustness, scale — intelligence as a property of the collective, not the individual.',
      },
    ],
  },

  products: {
    label: '01 / Products',
    intro: 'When research clears the bar, we spin it into a product with a small, obsessive team. Three are underway.',
    items: [
      {
        codename: 'P.01',
        name: 'Synth',
        body: 'We started building Synth because we could not accept intelligence that still needed a human babysitter.',
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

  workWithUs: {
    label: '04 / Join',
    headline: 'Work with us.',
    intro:
      'We sit at the boundary of frontier research and complex systems engineering. The problems we work on require people who can think across both — and who care about shipping the result.',
    pitch:
      'We are assembling a small, world-class team with the expertise needed to build groundbreaking, scalable systems. Our team includes leading researchers, infrastructure engineers, and product builders.',
    cta: 'If you have aligned expertise and are excited by our mission, please get in touch.',
    applyHref: 'mailto:careers@basethesis.xyz',
    applyLabel: 'Get in touch',
    pillars: [
      {
        title: 'Frontier Research',
        body: 'World models, post-transformer architectures, neural interfaces, swarm intelligence. Publish or ship — preferably both.',
      },
      {
        title: 'Systems Engineering',
        body: 'Distributed training infrastructure, real-time inference, compiler-level optimization, custom silicon integration.',
      },
      {
        title: 'Product & Design',
        body: 'Voice interfaces, developer tools, codebase intelligence. End-to-end ownership from research prototype to production.',
      },
      {
        title: 'Infrastructure',
        body: 'Multi-cloud orchestration, petabyte-scale data pipelines, low-latency serving, security and compliance.',
      },
    ],
    team: [
      ['A. Vasquez', 'R. Chen'],
      ['M. Okafor', 'S. Lindqvist'],
      ['J. Tanaka', 'P. Moreau'],
      ['K. Abadi', 'L. Ferretti'],
    ],
    backgrounds: [
      'DeepMind', 'MIT', 'OpenAI', 'Stanford', 'CERN', 'Meta FAIR',
      'Berkeley', 'Apple', 'ETH Zürich', 'Anthropic', 'NASA JPL', 'Stripe',
    ],
    hiring: {
      statement:
        'We need researchers and engineers with depth in: ML systems, distributed computing, compilers, HCI, and applied mathematics.',
      note: 'Remote-first · San Francisco HQ · Visa sponsorship available',
    },
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
