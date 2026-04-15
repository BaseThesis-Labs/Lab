export const site = {
  brand: {
    wordmark: 'BASETHESIS',
    suffix: 'LABS',
    year: '2026',
    coords: '37.7749° N / 122.4194° W',
    location: 'San Francisco · Remote',
    email: 'engg@basethesis.com',
  },

  nav: [
    { label: 'Research', href: '#research' },
    { label: 'Products', href: '#products' },
    { label: 'Fund', href: '#fund' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    eyebrow: 'Est. 2026 · Frontier Research',
    headline: 'A frontier lab owning the best companies and deploying intelligence.',
    sub: 'We acquire profitable companies and run them with frontier intelligence. We take ownership and deploy intelligence to operate inside the business end to end. The results are either measurable or the intelligence is worthless.',
    cta: { label: 'Talk to Us', href: 'https://calendar.app.google/HkL3MsDrBJUKhf8h7' },
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
    headline: 'Invest. Transform. Scale.',
    pitch:
      'BaseThesis is an AI-driven value creation company. We invest in profitable, cash-flow generating businesses — often in traditional or under-digitized sectors — and transform them end-to-end using frontier AI.',
    sub: 'While most AI innovation is concentrated in tech-native companies, the biggest value creation opportunity lies in transforming existing businesses. BaseThesis is positioned at this intersection.',
    model: {
      title: 'Our Model',
      steps: [
        { label: 'Identify', body: 'Target profitable mid-sized businesses with strong fundamentals, steady cash flows, and low technological adoption.' },
        { label: 'Invest', body: 'Take a strategic ownership stake and work closely with leadership teams to align on transformation goals.' },
        { label: 'Transform', body: 'Deploy AI operating systems across the business — re-architect workflows, decision-making, and execution.' },
        { label: 'Scale', body: 'Unlock new growth and efficiency levers. Build long-term operating leverage through compounding AI advantage.' },
      ],
    },
    lab: {
      title: 'The Core: AI Research & Labs',
      body: 'At the heart of BaseThesis is a dedicated AI Research & Labs team that tracks frontier AI developments, experiments with new models and architectures, builds reusable AI infrastructure, and designs systems that transform real-world operations.',
      purpose: 'To translate cutting-edge AI into practical, deployable systems that unlock value in businesses we partner with.',
    },
    traction: {
      title: 'Current Traction',
      items: [
        'Built and launched Synth — an AI employee for small businesses, our first expression of AI product capability',
        'Actively investing in a company in the financial services space (accounting and legal)',
        'Deploying AI workflows and systems to unlock operational efficiency and growth',
      ],
    },
    vision:
      'A portfolio of AI-transformed businesses, a shared AI infrastructure layer across companies, and a compounding advantage driven by our Research & Labs engine. AI is not just a tool — it is the core driver of value creation.',
    cta: { label: 'Talk to Us', href: 'https://calendar.app.google/HkL3MsDrBJUKhf8h7' },
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
      ['Raveen Sastry', 'Dhimant Parekh'],
      ['Sarthak Kapil', 'Siddhant Saxena'],
      ['Ria Picardo', 'Manoj Abrahm'],
    ],
    hiring: {
      statement:
        'We need researchers and engineers with depth in: ML systems, distributed computing, compilers, HCI, and applied mathematics.',
      note: 'Bangalore, India',
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
          { label: 'X', href: 'https://x.com/Basethesislabs' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/company/basethesis-labs/' },
        ],
      },
    ],
  },
};
