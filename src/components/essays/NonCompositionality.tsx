import {
  Aside,
  Callout,
  ChartFigure,
  Code,
  EditorsNote,
  Em,
  Equation,
  EssayLayout,
  H2,
  H3,
  ItalicEm,
  M,
  P,
  Quote,
  Ref,
  ReferenceGroup,
  Strong,
} from './EssayLayout';
import { Fig1AssemblagePremium } from './figures/Fig1AssemblagePremium';
import { Fig2ArcAgi } from './figures/Fig2ArcAgi';
import { Fig3Brittleness } from './figures/Fig3Brittleness';
import { Fig4SotaCompute } from './figures/Fig4SotaCompute';
import { Fig5ThreeAxes } from './figures/Fig5ThreeAxes';
import { Fig6Architecture } from './figures/Fig6Architecture';
import { Fig7LocalityPremium } from './figures/Fig7LocalityPremium';
import { Fig8OrchestrationLadder } from './figures/Fig8OrchestrationLadder';

const BASE = '/essays/non_compositionality_of_ii';

export function NonCompositionality() {
  return (
    <EssayLayout
      meta={{
        index: '001',
        title: 'On the Non-Compositionality of Intelligence',
        italicized: ['Non-Compositionality', 'Intelligence'],
        authors: 'Siddhant Saxena · @sidgraph · Claude Opus 4.7',
        date: 'May 2026',
        reading: '32 min read',
        cover: `${BASE}/cover.png`,
        coverAlt:
          'A painted mosaic in indigo, ochre, and bone, fragmenting into pixels at the right edge.',
        epigraph: {
          quote:
            '“The University is just the way in which all that he has already seen is organized. When they are seen and when their coordination is understood, the University has been seen.”',
          cite: 'Gilbert Ryle, The Concept of Mind, 1949',
        },
      }}
    >
      <P dropCap>
        A quiet structural claim runs underneath much of what we say about
        artificial intelligence: that intelligence composes. Take a capable
        language model, attach an interpreter, a retriever, a filesystem, and
        an orchestration loop, and the result is intelligent in the same sense
        the model alone might be, only more so. The components are well-behaved,
        the composition well-engineered, the benchmarks reward the assemblage.
        We point at the assemblage and call it intelligent.
      </P>

      <P>
        This essay argues that intelligence is{' '}
        <Strong>non-compositional under externalization</Strong>: the property
        we name when we say “intelligent” is not preserved when its
        constitutive operations are distributed across components outside the
        system whose intelligence we are claiming. A model that cannot compute
        without delegating is not a computing system; it is an interface to
        one. A model that cannot reason without delegating the reasoning is not
        a reasoning model; it is a router for one. This is not a claim about
        whether such systems are useful: they are extremely useful. It is a
        claim about whether the words we use to describe them refer to anything
        specific. Most of the time, they don’t.
      </P>

      <P>
        The asymmetry shows up immediately. Ask a frontier model “what is{' '}
        <M>{'847 \\times 392'}</M>?” and either it works through long
        multiplication in its scratchpad and arrives at 332,024 on its own, or
        it emits a tool call, an external interpreter returns 332,024, and the
        model relays the answer. From the outside both responses look like
        correct arithmetic. They are not the same kind of event. The first is
        computation. The second is delegation. Treating them as equivalent (as
        we routinely do when we report a model’s “math accuracy”) is the move
        this essay refuses.
      </P>

      <H2>The compositionality assumption</H2>

      <P>
        Some properties compose: mass, monetary value, deterministic
        correctness when each component is provably correct. Others don’t.
        Formally, a property <M>P</M> of systems is <ItalicEm>compositional</ItalicEm>{' '}
        under a composition operator <M>{'\\odot'}</M> if{' '}
        <M>{'P(A) \\wedge P(B) \\Rightarrow P(A \\odot B)'}</M>. The interesting
        question for intelligence is which <M>{'\\odot'}</M> we have in mind.
        Function composition <M>{'f \\circ g'}</M> preserves type-correctness;
        so does deterministic, infinite-precision arithmetic. Approximate,
        finite-precision, batch-fused floating-point arithmetic does not:
        associativity fails by <M>{'O(\\epsilon \\cdot n)'}</M> in the worst
        case, where <M>{'\\epsilon'}</M> is unit roundoff and <M>n</M> is the
        reduction width.
      </P>

      <P>
        Thinking Machines Lab’s analysis (He, Sep 2025) makes the structural
        case cleanly. The popular story is that GPU floating-point
        non-associativity plus thread concurrency produces nondeterminism; He
        shows the actual culprit is <Strong>batch invariance failure</Strong>.
        Matmul, RMSNorm, and attention reduction kernels change numerical
        output for a given sample as a function of the surrounding batch, and
        batch composition shifts with concurrent load:{' '}
        <Quote>
          “Although the inference server itself can be claimed to be
          ‘deterministic,’ the story is different for an individual user. From
          the perspective of an individual user, the other concurrent users
          are effectively nondeterministic”
        </Quote>{' '}
        (He, 2025). Each component is run-to-run deterministic; the user sees
        nondeterminism. The published <Code>batch_invariant_ops</Code> library
        swaps RMSNorm, matmul, and attention via <Code>torch.Library</Code> and
        integrates with vLLM; one thousand temperature-zero runs collapse to a
        single bit-identical output, at a roughly 60% throughput cost. The
        earlier nondeterminism was real and located nowhere in particular.
      </P>

      <P>
        The same seam reappears inside the training stack. The FlashRL group
        documented in 2025 that the trainer (HuggingFace forward pass) and the
        inference engine (vLLM) produce{' '}
        <ItalicEm>
          different log-probabilities for the same sequence even with identical
          weights
        </ItalicEm>
        , because their kernels differ — and quantization (FP8, INT8) widens
        the gap further. Concretely: let <M>{'\\pi_{\\mathrm{train}}(\\cdot \\mid s)'}</M>{' '}
        and <M>{'\\pi_{\\mathrm{roll}}(\\cdot \\mid s)'}</M> denote the trainer-
        and rollout-engine token distributions at state <M>s</M>. Even with
        identical parameters <M>{'\\theta'}</M>, the kernel differences yield{' '}
        <M>{'\\pi_{\\mathrm{train}} \\neq \\pi_{\\mathrm{roll}}'}</M>, sometimes
        catastrophically:{' '}
        <Quote>
          “for certain tokens, the two policies even yield contradictory
          predictions — <M>{'\\pi_{\\mathrm{vllm}}(a, \\theta) = 1'}</M> and{' '}
          <M>{'\\pi_{\\mathrm{fsdp}}(a, \\theta) = 0'}</M>, which breaks the
          on-policy assumption and secretly makes the RL training become
          off-policy”
        </Quote>{' '}
        (Yao et al., 2025). The standard on-policy PPO/GRPO surrogate is then
        biased; the only correction is a token-level truncated importance
        weight,
      </P>

      <Equation
        number="1"
        math={
          '\\mathcal{L}_{\\mathrm{TIS}}(\\theta) \\;=\\; \\mathbb{E}_{\\tau \\sim \\pi_{\\mathrm{roll}}} \\sum_t \\min\\!\\left(\\bar{\\rho},\\, \\frac{\\pi_\\theta(a_t \\mid s_t)}{\\pi_{\\mathrm{roll}}(a_t \\mid s_t)}\\right) \\cdot \\hat{A}_t \\cdot \\log \\pi_\\theta(a_t \\mid s_t),'
        }
      />

      <P>
        with clip <M>{'\\bar{\\rho} \\in [2, 5]'}</M>. ROLL Flash (Oct 2025)
        systematizes this family — TIS, IcePop, MIS, WTRS — as token-level and
        sequence-level corrections for the same underlying defect. The
        “efficient RL framework” is therefore implicitly off-policy; without
        (1) the gradient estimator silently corrupts. Each component is correct
        against its own specification. The bug exists only in the seam.
      </P>

      <Aside>
        Deterministic components can compose into a nondeterministic system,
        because “deterministic” is not preserved under composition.
      </Aside>

      <P>
        Intelligence fails to compose for analogous reasons. A language model
        is an excellent next-token predictor; an interpreter is a correct
        evaluator; a vector store is a faithful retriever. We compose them and
        call the result intelligent, but “intelligent” is not a property that
        composes the way we are asking it to. The understanding-and-solving is
        the assemblage’s behavior; crediting it to the model is the same
        category error as crediting determinism to a kernel that lacks batch
        invariance.
      </P>

      <P>
        This inverts Ryle’s foreign visitor. The visitor commits a category
        mistake by treating the University as another entity alongside the
        colleges that constitute it. We commit the mirror error: shown the
        model, the tools, the retrieval layer, and the orchestration loop, we
        say “the model is intelligent.” Both are failures of categorization
        with the same origin: an intuition that the property we care about
        lives somewhere it does not.
      </P>

      <P>
        When you say “the model can do X,” the question is what the model is.
        If it is the network weights, doing X means the weights compute X. If
        it includes the interpreter, the retrieval layer, the filesystem, and
        the agent loop, “the model” is shorthand for an engineering
        organization plus a deployment stack. Both senses are coherent in
        isolation; the problem is sliding between them. We report benchmarks
        under sense two and draw conclusions about capabilities under sense
        one. The agent’s contribution — selecting the tool, marshalling
        arguments, parsing results — is what a competent operator with a
        function-calling API does. We would not say the operator can do the
        math. We say the model can.
      </P>

      <H2>Four properties that fail to compose</H2>

      <H3>Verification</H3>
      <P>
        A tool call is auditable; a native computation is opaque. Auditability
        composes; competence does not. A model that calls an interpreter
        correctly tells you nothing about whether the model could compute on
        its own.
      </P>

      <H3>Graceful degradation</H3>
      <P>
        A native system degrades smoothly; a delegating agent collapses
        sharply. By May 2026 the within-model gaps are smaller than at the
        start of the year, but they have not closed. On Humanity’s Last Exam
        (open-domain, contamination-resistant), GPT-5.5 scores 41.4% bare and
        52.2% with tools; Opus 4.7 scores 46.9% / 54.7%; Gemini 3.1 Pro scores
        44.4% / 51.4%; Mythos Preview, Anthropic’s withheld strongest model,
        gains 7.9 points (56.8% → 64.7%) when its full assemblage is brought
        online. CharXiv: Opus 4.7 jumps 82.1% → 91.0% with a single
        image-cropping tool. Anthropic’s own framing flags the no-tools number
        as isolating <Quote>“the vision capability itself.”</Quote> ARC-AGI-2:
        adding the open-source Poetiq harness raises Gemini 3 Pro from 31% to
        54% at a 37× cost increase ($0.81 → $30.57/task). As of May 2026, no
        published frontier model scores higher without its tools than with
        them.
      </P>

      <ChartFigure
        number="1"
        ariaLabel="Slope chart of six frontier model-benchmark pairs evaluated bare vs. with full assemblage; every line slopes upward."
        caption={
          <>
            <Strong>The May 2026 externalization premium.</Strong> Six
            model-benchmark pairs, each evaluated twice. The slope is what the
            assemblage adds. Anthropic flags that the Mythos HLE number{' '}
            <Quote>
              “could indicate some level of memorization”
            </Quote>{' '}
            at low effort. Sources: Opus 4.7 system card (Apr 16, 2026); Mythos
            Preview system card (Apr 7, 2026); GPT-5.5 launch (Apr 23, 2026);
            Gemini 3.1 Pro materials; ARC Prize Foundation Technical Report 2025.
          </>
        }
      >
        <Fig1AssemblagePremium />
      </ChartFigure>

      <P>
        OpenAI’s GPT-5 launch stated the disclaimer plainly:{' '}
        <Quote>
          “AIME results with tools should not be compared directly to the
          performance of models without tool access; they are an example of how
          effectively GPT-5 leverages available tools.”
        </Quote>{' '}
        The same caveat appears verbatim on the o3/o4-mini launch page. The
        vendor knows the property does not compose. The boundary case is{' '}
        <Strong>ARC-AGI-3</Strong> (arXiv:2603.24621), released March 25,
        2026, designed by François Chollet specifically to defeat extended
        chain-of-thought scaffolding. It drops the agent into 135 small
        interactive game environments with no instructions, no goals, and no
        rules disclosed. Crucially, evaluation runs offline on Kaggle: no
        external API calls, no cloud inference during scoring. Untrained
        humans solve every environment. At launch the four leading frontier
        models, run by their own vendors, scored a combined less than one
        percent.
      </P>

      <ChartFigure
        number="2"
        ariaLabel="Horizontal bar chart: untrained humans solve 100% of ARC-AGI-3, the four frontier models all score below 1%."
        caption={
          <>
            <Strong>When the assemblage cannot help.</Strong> ARC-AGI-3 launch
            results, March 25, 2026. Both Opus 4.7 and GPT-5.5 shipped after
            the official evaluation; the public leaderboard remained below 1%
            across all submissions through April 30, 2026. When the benchmark
            defeats the very scaffolding that lifts scores everywhere else,
            the model alone returns nothing.
          </>
        }
      >
        <Fig2ArcAgi />
      </ChartFigure>

      <P>
        When the assemblage cannot help, the bare model has nothing to fall
        back on. This is the cleanest demonstration of non-compositionality
        the field has produced.
      </P>

      <H3>Composition with itself</H3>
      <P>
        A model computing natively can use its own outputs as inputs to its
        own further reasoning with the same numerical and semantic properties
        throughout. A delegating system round-trips through the tool layer,
        where every call is a serialization boundary. The training-stack
        analog is the trainer-versus-sampler numerics disagreement: when two
        components that should express the same model produce different
        log-probabilities for the same sequence, the gradient estimator is
        silently off-policy. The bug went undetected because each component
        was correct against its own specification.
      </P>

      <H3>Specification</H3>
      <P>
        When intelligence is internalized, the spec is the training
        distribution. When externalized, it is the union of the training
        distribution, every tool’s interface, every tool’s behavior, every
        parser, every retry policy, every error-handling branch, and every
        interaction between these. The latter is enormously larger and almost
        none of it is documented. The system works because the team that
        built it has the spec in their heads and unit tests. None of this is
        the model. Calling the resulting artifact “intelligent” credits one
        component for the achievement of an entire engineering organization.
      </P>

      <P>
        These four are projections of the same structural fact: intelligence
        as we use the word is a property of{' '}
        <ItalicEm>where the work happens</ItalicEm>, and externalizing the work
        moves the property out of the artifact we want to claim has it.
      </P>

      <H2>The brittle lesson of external intelligence!</H2>

      <P>
        The tool gap measures how much the assemblage adds; perturbation
        measures what the model itself has: what survives when the problem is
        shifted by something a competent reasoner would not notice. The 2025
        literature is unusually clean and unusually unkind to the standard
        reading of benchmark scores.
      </P>

      <P>
        <Strong>ASyMOB</Strong> (17,092 problems, 35,000 mathematically-
        equivalent variants) reports a frontier-average drop of{' '}
        <M>{'77.0\\% \\to 33.4\\%'}</M>, with 43.6 points lost to substitutions
        a human would not register, with a maximum single-model drop of 70.3
        pp. The most advanced models in the sweep (o4-mini, Gemini 2.5 Flash)
        score 96.8% / 97.6% on the seed and lose only 21.7 / 21.2 points.
        Frontier scale buys partial robustness, not full robustness.{' '}
        <Strong>Putnam-AXIOM</Strong> (variable/constant renaming) drops
        o1-preview from 41.95% to 22.35%, a 19.6-point absolute drop, 46.8%
        relative; ten of the remaining 18 models show non-overlapping 95% CIs.{' '}
        <Strong>MSCR</Strong> (single-word adversarial) reduces OpenAI o3 by
        15.88 pp on GSM8K and GPT-4o by 17.21 pp via transferred substitutions;
        on open-source math models, one adversarial word can erase up to 49.89%
        of GSM8K accuracy. <Strong>RIDE</Strong> (item-response-theory
        difficulty conditioning) reports a <M>{'-21.73'}</M> pp average across
        26 models including GPT-5 and DeepSeek-V3.1.
      </P>

      <P>
        The most controlled result comes from a different direction. Apple’s
        June 2025 study ran Claude 3.7 Sonnet (Thinking), DeepSeek-R1, and
        o3-mini high on Tower of Hanoi. Past a complexity threshold, accuracy
        collapses. Lawsen’s follow-up qualified part of this: some collapse
        past <M>{'N \\approx 10'}</M> is a token-budget artifact, and River
        Crossing includes mathematically impossible instances above{' '}
        <M>{'N = 5'}</M>. But the more arresting finding survived independent
        replication. As problems near the failure threshold, the models{' '}
        <Strong>reduce reasoning tokens despite ample budget remaining</Strong>
        , as if recognizing further effort will not help. The “Rethinking the
        Illusion of Thinking” replication (July 2025) confirmed:{' '}
        <Quote>
          “LRMs reach peak token consumption when the task is complex but still
          solvable. Conversely, when the model implicitly detects that the task
          lies beyond its capabilities, it allocates fewer resources.”
        </Quote>{' '}
        The model gives up its budget before it fails. Not a reasoner pushing
        toward an answer it cannot reach, but a system that has learned to
        recognize the boundary of its own competence and back off, without
        internalizing the procedure that would solve the problem on the other
        side.
      </P>

      <ChartFigure
        number="3"
        ariaLabel="Two panels. A: reasoning-token usage curves for three reasoning models rise with complexity then collapse at the capability boundary. B: grouped bars of seed vs. perturbed accuracy across five benchmarks; ASyMOB and MSCR open-source math show the largest drops."
        caption={
          <>
            <Strong>What survives when the problem is shifted slightly.</Strong>{' '}
            Panel A: three reasoning models on procedural tasks; reasoning-token
            usage rises with complexity then drops sharply despite remaining
            budget. Panel B: seed (lighter) vs. perturbed (full color) across
            five benchmarks; the two largest drops (MSCR open-source math,
            ASyMOB frontier average) highlighted.
          </>
        }
      >
        <Fig3Brittleness />
      </ChartFigure>

      <P>
        What ties the tool gap and the perturbation collapse together is that
        they are projections of the same fact from opposite directions. The
        tool gap shows how much the assemblage adds; the perturbation collapse
        shows how little the bare model has. Either alone would be deniable.
        Together they leave the standard reading of benchmark scores
        indefensible: the model that scored ninety on the original cannot do
        thirty on a variant a competent reasoner would call identical, but it
        can do ninety on the variant if you let it write a Python function.
        The competence is somewhere. It is not where we have been pointing.
      </P>

      <H2>Where the work was, where it goes</H2>

      <P>
        A reading of the brittleness data: of course the bare model fails:
        capability had to be installed somehow, and “calling a tool” is just
        how installation manifests at inference. On this view, externalization
        at inference is the result of a training pipeline that itself
        externalized: a verifier in an RL loop, a teacher in distillation, a
        curated dataset for SFT. The complaint, on this reading, is just about
        timing.
      </P>

      <P>
        The rejoinder has real force, because it points at the only mechanism
        by which the externalization argument could be defused: gradient
        descent. If externalization gets internalized, the property eventually
        lives in weights, and the assemblage at inference is a contingent
        matter of cost. If it does not, externalization is structural and the
        attribution problem is permanent.
      </P>

      <P>
        Three families of recent results bear on whether and how
        internalization is happening.
      </P>

      <P>
        The first is <Strong>RL with verifiable rewards (RLVR)</Strong>.
        Mukherjee et al. (2025) measured this directly across PPO, GRPO,
        ORPO, KTO, DPO, SimPO, PRIME, and ten model families:{' '}
        <Quote>
          “such large gains result from updating only a small subnetwork
          comprising just 5 percent to 30 percent of the parameters, with the
          rest effectively unchanged.”
        </Quote>{' '}
        RL induces parameter sparsity that emerges{' '}
        <ItalicEm>without</ItalicEm> sparsity-inducing regularization; the
        verifier’s signal is absorbed into a small, specific subnetwork; the
        rest of the model is left alone. Behaviorally: DeepSeek-R1 reported
        pure RL on a verifiable math reward took its base from 15.6% to 71.0%
        pass@1 on AIME 2024, 86.7% under majority voting, without SFT priming
        or inference scaffolding (the <ItalicEm>Nature</ItalicEm> update
        reports 77.9% for the pure-RL endpoint). By spring 2026 GPT-5.5 and
        Opus 4.7 reach near-saturation on AIME without tools. Mythos Preview
        reports 97.6% on USAMO 2026, an Olympiad-level set graded on proofs
        (which resist tool shortcuts) whose answers were not in any training
        corpus when scored. Most strikingly: on July 21, 2025, IMO President
        Prof. Dr. Gregor Dolinar officially confirmed an advanced version of
        Gemini Deep Think had earned 35/42 — gold-medal level — solving five
        of six IMO 2025 problems{' '}
        <Quote>
          “in natural language within the 4.5-hour time limit,”
        </Quote>{' '}
        no formal-language scaffold, no manual translation. A clean
        year-over-year improvement from AlphaProof, which had required Lean
        translation for IMO 2024 silver. The reasoning lives in weights.
      </P>

      <P>
        The second is <Strong>distillation</Strong>. On-policy distillation
        (Lu / Thinking Machines Lab, Oct 2025) shows the
        student-on-its-own-rollouts variant{' '}
        <Quote>
          “can learn the RL-trained policy in approximately 7–10× fewer
          gradient steps, which corresponds to a compute efficiency of 50–100×”
        </Quote>{' '}
        — meaning verifier-distilled circuits can be transferred at roughly
        1–2% of the RL cost. But the move is not free. Apple’s{' '}
        <Strong>Distillation Scaling Laws</Strong> (Busbridge et al.,
        arXiv:2502.08606) report a sharp regime split: distillation only beats
        SFT when teachers already exist or when many students share one
        teacher;{' '}
        <Quote>
          “distillation does not improve upon standard fully supervised
          learning for LLMs given sufficient model size and compute budget on
          the student.”
        </Quote>{' '}
        And Kim et al. (arXiv:2603.24472, March 2026),{' '}
        <Quote>
          “Why Does Self-Distillation (Sometimes) Degrade the Reasoning
          Capability of LLMs?,”
        </Quote>{' '}
        document drops <Quote>“of up to 40%”</Quote> on out-of-distribution
        math when self-distillation suppresses epistemic verbalization —
        internalization can corrupt as well as compress.
      </P>

      <P>
        The third is <Strong>mechanistic interpretability</Strong>.
        Anthropic’s circuit-tracing on Claude 3.5 Haiku (March 2025) found
        two-digit addition is performed by two parallel pathways: one
        computing a rough approximation, the other determining the last digit
        precisely. The result is in weights at the circuit level. But the same
        paper documents an unsettling corollary:{' '}
        <Quote>
          “Claude seems to be unaware of the sophisticated ‘mental math’
          strategies that it learned during training. If you ask how it
          figured out that 36+59 is 95, it describes the standard algorithm
          involving carrying the 1.”
        </Quote>{' '}
        The verbal account is not faithful to the computation. This cuts both
        ways: it confirms internalization at the circuit level, but it also
        confirms that the chain-of-thought we point at as evidence of
        “reasoning” can be confabulation grafted over an unrelated internal
        computation. The post-hoc explanation is itself a form of
        externalization: produced for an external interpreter (the user) whose
        relationship to the model’s internal computation is contingent.
      </P>

      <P>
        So the rejoinder has a sharply bounded form.{' '}
        <Strong>
          Externalization can be internalized: for bounded operations, by RL
          against a verifier, given enough compute and a clean reward signal.
        </Strong>{' '}
        This works for two-digit arithmetic, modular addition (Nanda et al.
        fully reverse-engineered the Fourier-circuit algorithm a transformer
        learns for <M>{'a + b \\bmod p'}</M>), competition mathematics, and
        code under unit-test verification. It does not work for unbounded
        compositional reasoning, novel game environments, or
        distribution-shifted procedural execution. The brittleness data are
        exactly what it looks like when the verifier covered some operations
        and not others: operations the verifier saw are robust; operations one
        step outside its distribution collapse. The externalization argument
        is not a claim about an eternal limit; it is a claim about the present
        moment. Right now, in May 2026, the structural pattern holds: the work
        that constitutes the intelligence we are claiming happens in the
        toolchain at least as often as in weights.
      </P>

      <P>
        There is one further reason the rejoinder cannot fully neutralize the
        argument, which has to do with bounded versus unbounded computation.
        The expressivity literature gives this an exact form. Let{' '}
        <M>{'\\mathsf{TF}^{\\log}_d'}</M> denote depth-<M>d</M> log-precision
        decoder-only transformers and let{' '}
        <M>{'\\mathsf{TF}^{\\log}_d[t(n)]'}</M> denote the same with{' '}
        <M>{'t(n)'}</M> chain-of-thought decoding steps. Then under standard
        assumptions:
      </P>

      <Equation
        number="2"
        math={
          '\\begin{aligned} \\mathsf{TF}^{\\log}_d \\;\\subseteq\\; \\mathsf{TC}^0, & \\quad\\quad \\mathsf{TF}^{\\log}_d[O(\\log n)] \\;\\subseteq\\; \\mathsf{TC}^0, \\\\ \\mathsf{TF}^{\\log}_d[\\Theta(n)] \\;=\\; \\mathsf{L}, & \\quad\\quad \\mathsf{TF}^{\\log}_d[\\mathrm{poly}(n)] \\;=\\; \\mathsf{P}. \\end{aligned}'
        }
      />

      <P>
        A fixed-depth transformer without scratchpad cannot decide
        directed-graph connectivity, cannot simulate arbitrary automata,
        cannot solve linear equalities (Merrill &amp; Sabharwal, ICLR 2024).
        With a linear number of intermediate generation steps it can simulate
        automata; with a polynomial number, Turing machines for that many
        steps. Length, not content, extends expressive power. Even padding
        tokens with no informational content extend computational depth
        (Merrill &amp; Sabharwal, NeurIPS 2025; Pfau, Merrill &amp; Bowman,
        ICLR 2025). This is the formal version of “the bare model literally
        cannot do certain things; the scratchpad does computational work.”
      </P>

      <P>
        But the depth can equally well live inside the model via recurrent
        depth iteration. Geiping et al.’s recurrent-depth model (NeurIPS 2025)
        shows a 3.5B-parameter network{' '}
        <Quote>
          “can improve its performance on reasoning benchmarks, sometimes
          dramatically, up to a computation load equivalent to 50 billion
          parameters”
        </Quote>{' '}
        by iterating its hidden state at test time. Internal depth and
        external scratchpad are theoretically interchangeable in the relevant
        sense. The question is not whether intelligence requires depth (it
        does) but whether the depth lives{' '}
        <ItalicEm>
          inside the artifact whose intelligence we are claiming
        </ItalicEm>
        . The <M>{'\\mathsf{TC}^0'}</M> argument supports
        internalization-as-possible; the brittleness data argue it is not yet
        what is happening at frontier scale.
      </P>

      <ChartFigure
        number="4"
        ariaLabel="Three panels. A: memory retention curves vs. context length, GPT-4o NoLiMa drops from 99.3 to 69.7 by 32K tokens, frontier average drops faster, internal-memory architectures hold higher. B: AIME 2024 pass@1 across base, +pure RL, +majority vote, Nature update. C: throughput vs. unique outputs at T=0 for default vs. batch-invariant kernels."
        caption={
          <>
            <Strong>
              Three axes along which the externalization line is currently
              being moved.
            </Strong>{' '}
            <Em>A · Memory:</Em> the gap between nominal and effective context
            length. NoLiMa (Modarressi et al., ICML 2025) reports GPT-4o
            falling from 99.3% to 69.7% by 32K tokens once literal-match cues
            are removed; frontier average degrades faster. Internal-memory
            architectures (Titans/TTT/Huginn) hold retention longer because
            the work happens in the activations, not in the prompt.{' '}
            <Em>B · Capabilities:</Em> DeepSeek-R1’s pure-RL trajectory on
            AIME 2024 (15.6 → 71.0% pass@1, 86.7% with majority voting;{' '}
            <ItalicEm>Nature</ItalicEm> update 77.9%), with Mukherjee’s
            finding that RL across PPO/GRPO/DPO/etc. moves only 5–30% of
            parameters and the inset showing on-policy distillation reaching
            the same endpoint at <M>{'\\approx 1\\text{--}2\\%'}</M> of RL
            compute (Lu/TML, Oct 2025). <Em>C · Determinism:</Em> bit-identical
            inference is achievable but costs roughly 60% of throughput; the
            same kernel swap (TML 2025) collapses 1000 unique outputs at{' '}
            <M>{'T = 0'}</M> to 1.
          </>
        }
      >
        <Fig5ThreeAxes />
      </ChartFigure>

      <H2>What “computing natively” actually requires</H2>

      <P>
        The right bar: the system’s latent state must be the locus of the
        relevant work. Not its outputs — outputs are cheap and any
        orchestration can produce correct outputs. The work has to happen in
        the activations. Whether with explicit reasoning tokens, a hidden
        scratchpad, or pure latent-space reasoning is a second-order
        architectural choice. The first-order requirement is that the work
        happen somewhere inside the system whose intelligence we are claiming.
      </P>

      <P>
        Not a counsel of perfection. No problem with using high-throughput
        external storage for unbounded knowledge (no model can fit the web in
        its weights). No problem with deferring genuinely irreducible
        operations (cryptographic verification, real-time sensor reads,
        communication with other agents) to dedicated systems. The objection
        is to systematic externalization of operations that constitute the
        intelligence we are claiming. Arithmetic is one. State maintenance
        over a long task is one. Stepwise reasoning under verification is one.
        If those leak into the toolchain, the model is not the thing being
        praised when the system performs well.
      </P>

      <P>
        A research program recently active asks where capability has to live.
        On a casual reading it looks like architectural maximalism; the real
        move is austere. Build a system whose latent state simultaneously
        plays the role of compute, memory, and I/O. A maturity target is set
        by four conditions that must hold simultaneously:{' '}
        <Strong>Turing completeness</Strong>;{' '}
        <Strong>universal programmability</Strong> (capabilities installable
        by inputs and callable later); <Strong>behavioral consistency</Strong>{' '}
        under ordinary use; and <Strong>machine-native semantics</Strong>{' '}
        (primitives developed by the system rather than borrowed from a host).
      </P>

      <P>
        Concretely: a system that solves any problem the human-plus-tools
        assemblage can solve, given equivalent compute, without externalizing
        the constitutive operations. A system you can program by handing it
        examples that it converts into circuitry it then calls. A system that
        produces the same answer at temperature zero across runs, replicas,
        and load conditions. A system whose explanations of itself are
        mechanistically faithful to its computations.
      </P>

      <P>
        This is a high bar. Frontier production systems do not meet it: their
        compute is fixed-depth without scratchpad extension, their memory is
        short-context plus retrieval, their I/O is the tool layer. None of
        this is wrong as engineering. It is wrong as the answer to “is the
        model intelligent?” because it changes what “the model” refers to
        mid-sentence. The four-condition test is also what makes the
        externalization argument falsifiable: ship a system that passes it and
        behaves as well as the assemblage-based stacks, and the argument loses
        force.
      </P>

      <H2>An architecture sketch: the Closed-Loop Architecture</H2>

      <P>
        It helps to make the bar concrete. What follows is a single
        architecture, called the <Strong>Closed-Loop Architecture (CLA)</Strong>
        , that by construction satisfies the four-condition test without
        externalizing the constitutive operations. The point is not that any
        production system today implements this; none does at frontier scale.
        The point is to show that the bar is specifiable. The pieces exist in
        the literature; they have not yet been composed into a single
        artifact, and frontier systems compose them with the tool-call layer
        instead.
      </P>

      <H3>Definition</H3>
      <P>
        Let <M>{'x_{1:T}'}</M> be the input. The CLA is the tuple{' '}
        <M>{'(\\mathcal{P}, \\mathcal{R}, \\mathcal{C}, \\mathcal{M}, \\rho)'}</M>{' '}
        with:
      </P>
      <ol className="mt-4 list-decimal space-y-3 pl-5 marker:font-mono marker:text-[12px] marker:text-ink-muted">
        <li>
          <Strong>Prelude</Strong>{' '}
          <M>{'\\mathcal{P}: \\mathbb{R}^{|x| \\times v} \\to \\mathbb{R}^{T \\times d}'}</M>
          , a shallow encoder mapping tokens to per-position embeddings{' '}
          <M>{'e_{1:T} = \\mathcal{P}(x_{1:T})'}</M>.
        </li>
        <li>
          <Strong>Recurrent block</Strong>{' '}
          <M>{'\\mathcal{R}_\\theta: \\mathbb{R}^{T \\times d} \\times \\mathbb{R}^{T \\times d} \\to \\mathbb{R}^{T \\times d}'}</M>
          , a parameter-shared block iterated <M>{'r(x)'}</M> times (defined
          below). Inside <M>{'\\mathcal{R}'}</M>, attention uses a
          non-diagonal, input-dependent state-transition update (§4) so that
          the per-token recurrence can recognize regular languages natively,
          not in token-space but in latent-space.
        </li>
        <li>
          <Strong>Coda</Strong>{' '}
          <M>{'\\mathcal{C}: \\mathbb{R}^{T \\times d} \\to \\mathbb{R}^{T \\times v}'}</M>
          , a shallow decoder.
        </li>
        <li>
          <Strong>Fast-weight memory</Strong>{' '}
          <M>{'\\mathcal{M}_t \\in \\mathbb{R}^{d_M \\times d_M}'}</M>, an
          in-pass learned associative memory, updated by the rule (§5) below.{' '}
          <M>{'\\mathcal{M}'}</M> lives inside the forward pass; it is not a
          KV-cache offered to the user.
        </li>
        <li>
          <Strong>Recurrence policy</Strong>{' '}
          <M>{'\\rho: \\mathbb{R}^d \\to [1, R_{\\max}(n)]'}</M>, a per-token
          learned policy choosing how many recurrence steps each position
          receives, with budget at least{' '}
          <M>{'R_{\\max}(n) = \\Omega(\\log n)'}</M> to clear the relevant
          complexity class (Merrill &amp; Sabharwal, 2025).
        </li>
      </ol>

      <H3>The closed loop</H3>
      <P>
        The forward pass is the fixed point of an iterated map. With{' '}
        <M>{'s^{(0)} \\sim \\mathcal{N}(0, \\sigma^2 I)'}</M>, for each
        position <M>{'i \\in [T]'}</M>:
      </P>

      <Equation
        number="3"
        math={
          's_i^{(k+1)} \\;=\\; \\mathcal{R}_\\theta\\!\\left(e_i \\oplus s_i^{(k)};\\, \\mathcal{M}_t,\\, S_t\\right), \\qquad k = 0, 1, \\ldots, \\rho(e_i) - 1,'
        }
      />

      <P>
        where <M>{'\\oplus'}</M> denotes channel-wise concatenation,{' '}
        <M>S_t</M> is the recurrent attention state defined below, and the
        output is{' '}
        <M>{'\\hat{y} = \\mathcal{C}\\bigl(s^{(\\rho(e))}\\bigr)'}</M>. The
        loop closes inside the activation tensor: each iteration’s output is
        the next iteration’s input, with no token serialization in between.
        This is the architectural translation of “the work has to happen in
        the activations.”
      </P>

      <H3>
        Component 1: non-diagonal state transition (escaping{' '}
        <M>{'\\mathsf{TC}^0'}</M> at the layer level)
      </H3>
      <P>
        Let <M>{'u_t \\in \\mathbb{R}^d'}</M> be the input to a recurrent
        attention head at step <M>t</M>, and let{' '}
        <M>{'S_t \\in \\mathbb{R}^{d_k \\times d_v}'}</M> be its state. We use
        a generalized delta rule (RWKV-7 style) with input-dependent,
        non-diagonal transition:
      </P>

      <Equation
        number="4"
        math={
          'S_t \\;=\\; \\bigl(\\mathrm{diag}(w_t) - \\hat{\\kappa}_t \\hat{\\kappa}_t^\\top a_t\\bigr) S_{t-1} + v_t \\hat{k}_t^\\top,'
        }
      />

      <P>
        where <M>{'\\hat{\\kappa}_t = \\kappa_t / \\|\\kappa_t\\|'}</M>, and{' '}
        <M>{'(w_t, \\kappa_t, v_t, a_t)'}</M> are linear projections of{' '}
        <M>{'u_t'}</M>. The crucial property: the transition matrix{' '}
        <M>{'A_t = \\mathrm{diag}(w_t) - \\hat{\\kappa}_t \\hat{\\kappa}_t^\\top a_t'}</M>{' '}
        has eigenvalues outside the diagonal-only spectrum that confines
        diagonal SSMs (Mamba, S4) to <M>{'\\mathsf{TC}^0'}</M> at finite
        precision (Merrill, Petty &amp; Sabharwal, ICML 2024,{' '}
        <Quote>“Illusion of State”</Quote>). With (4) the per-token recurrence
        provably recognizes all regular languages natively, without buying
        expressivity from a polynomial-length scratch in the token stream.
      </P>

      <H3>Component 2: fast-weight memory (closing the long-tail loop)</H3>
      <P>
        The memory <M>{'\\mathcal{M}_t'}</M> is itself a small parametric
        model whose weights are updated within the forward pass by a
        Titans-style surprise-gated rule. Let <M>{'(k_t, v_t)'}</M> be
        projections of the recurrent state. Define “surprise” as the gradient
        of an associative reconstruction loss with respect to the current
        memory:
      </P>

      <Equation
        number="5"
        math={
          'm_t \\;=\\; \\beta_t\\, m_{t-1} - \\nabla_{\\mathcal{M}}\\, \\ell(\\mathcal{M}_{t-1}; k_t, v_t), \\qquad \\mathcal{M}_t \\;=\\; (1 - \\alpha_t) \\mathcal{M}_{t-1} + \\eta_t\\, m_t,'
        }
      />

      <P>
        with input-dependent gates: <M>{'\\alpha_t'}</M> (forgetting),{' '}
        <M>{'\\beta_t'}</M> (momentum), <M>{'\\eta_t'}</M> (learning rate).
        The associative loss is{' '}
        <M>{'\\ell(\\mathcal{M}; k, v) = \\tfrac{1}{2} \\|\\mathcal{M}k - v\\|^2'}</M>{' '}
        in the linear case, or a deeper MLP variant. The update happens at
        each token, inside the forward pass, with no KV-cache exposed to the
        orchestrator. “Memory” here means: a small network whose weights
        change with the input the network is currently processing.
      </P>

      <H3>Component 3: adaptive recurrence depth (work where work is needed)</H3>
      <P>
        Tokens that demand multi-step composition get more iterations; tokens
        that don’t, don’t. The Mixture-of-Recursions policy <M>{'\\rho'}</M>{' '}
        is trained jointly, with a budget regularizer:
      </P>

      <Equation
        number="6"
        math={
          '\\mathcal{L}_\\rho \\;=\\; \\mathcal{L}_{\\mathrm{task}} + \\lambda \\cdot \\mathbb{E}_{i, x}[\\rho(e_i)],'
        }
      />

      <P>
        which selects the smallest depth that suffices per token. This is the
        architectural form of “think harder when you need to,” implemented in
        the layer count rather than in token count.
      </P>

      <H3>Component 4: single-stack numerics (closing the seam)</H3>
      <P>
        Training and inference share one numerical pipeline: batch-invariant
        kernels for matmul / RMSNorm / attention reductions (Thinking Machines
        Lab, 2025), unified FP8 for both the trainer forward pass and the
        rollout engine, and identical attention-mask conventions on both
        sides. Concretely, this enforces{' '}
        <M>{'\\pi_\\theta = \\pi_{\\mathrm{train}} = \\pi_{\\mathrm{roll}}'}</M>{' '}
        at the per-token level, eliminating the need for the truncated-IS
        correction (1). The system is on-policy by construction, not by patch.
      </P>

      <H3>Component 5: verifier-distilled training, verifier-free inference</H3>
      <P>
        RL with verifiable rewards (DeepSeek-R1-style) is used during training
        only; the verifier is removed from the inference path. Mukherjee et
        al. (2025) provide the empirical handle: across PPO/GRPO/DPO/etc.,
        5–30% of parameters move under RL, and the moving subnetwork is
        consistent across seeds. The verifier signal is therefore localizable:
        after training, what the verifier taught is circuitry, not call sites.
      </P>

      <H3>The four conditions, checked</H3>
      <P>
        <Strong>Turing completeness.</Strong> With{' '}
        <M>{'R_{\\max}(n) = \\Omega(n)'}</M> and unbounded scratch in the
        latent state (the per-iteration <M>{'s^{(k)}'}</M> tensor), the looped
        architecture simulates Turing machines for <M>{'\\mathrm{poly}(n)'}</M>{' '}
        steps (Giannou et al., ICML 2023; Merrill &amp; Sabharwal, NeurIPS
        2025). The scratch is the system’s own activations, not a token
        sequence handed to a sandbox.
      </P>
      <P>
        <Strong>Universal programmability.</Strong> The fast-weight memory{' '}
        <M>{'\\mathcal{M}_t'}</M> is provably equivalent to a step of online
        gradient descent on an associative regression problem (Sun et al.,
        ICML 2025; von Oswald et al., ICML 2023,{' '}
        <Quote>“in-context learning is gradient descent”</Quote>). Programs
        handed in via context become, mechanically, weights the system writes
        to a small in-pass network and calls later. “Programmability” is
        achieved without a tool registry.
      </P>
      <P>
        <Strong>Behavioral consistency.</Strong> Single-stack numerics enforce
        bit-identical inference at <M>{'T = 0'}</M> and bit-identical{' '}
        <M>{'\\pi_\\theta'}</M> between rollout and update. The system has a
        determinable behavior, not an emergent one.
      </P>
      <P>
        <Strong>Machine-native semantics.</Strong> The verifier-distilled
        circuits live in the 5–30% subnetwork that RL moves; mechanistic
        interpretability tools (sparse autoencoders, attribution graphs)
        operate on these weights, not on a tool-call log. The semantics are
        the system’s, not the host’s.
      </P>

      <H3>What CLA does not do</H3>
      <P>
        It is not the web. Long-tail factual recall still wants high-throughput
        external storage; CLA keeps that; it just does not call the database
        the model. It is not a sandbox. Cryptographic verification, real-time
        sensor I/O, and inter-agent communication still go to systems designed
        for them. The objection is to systematic externalization of operations
        that constitute the intelligence we are claiming: arithmetic, state
        maintenance, stepwise reasoning, length-extrapolating composition.
        Those go inside.
      </P>

      <H2>
        On RL, Distillation, Interpretability and Internalization of
        capabilities!
      </H2>

      <P>
        Recent research is converging from two directions that need to be kept
        apart.
      </P>

      <ChartFigure
        number="5"
        ariaLabel="Architecture diagram. Tokens enter a Prelude block, then a recurrent block + fast-weight memory inside a closed loop in latent space, with state and policy boxes attached, then exit through a Coda. A separate dashed box below labels what CLA replaces."
        caption={
          <>
            <Strong>The Closed-Loop Architecture.</Strong> Five components:
            prelude <M>{'\\mathcal{P}'}</M>, recurrent block{' '}
            <M>{'\\mathcal{R}_\\theta'}</M> with non-diagonal state transition{' '}
            <M>S_t</M>, in-pass fast-weight memory <M>{'\\mathcal{M}_t'}</M>,
            per-token depth policy <M>{'\\rho'}</M>, and coda{' '}
            <M>{'\\mathcal{C}'}</M>. The loop closes in the activation tensor:
            iteration <M>{'k \\to k + 1'}</M> does not pass through the token
            stream. Below: the externalized assemblage that CLA replaces;
            every arrow that crosses out of the latent state is a
            serialization boundary.
          </>
        }
      >
        <Fig6Architecture />
      </ChartFigure>

      <P>
        <Strong>On the internalization side of the line.</Strong>{' '}
        Test-time-learning architectures collapse the controller-versus-memory
        distinction: Sun et al.’s TTT-layers (ICML 2025) make{' '}
        <Quote>
          “the hidden state a machine learning model itself, and the update
          rule a step of self-supervised learning”
        </Quote>{' '}
        — exactly (5) with linear <M>{'\\mathcal{M}'}</M> — and{' '}
        <Quote>
          “can keep reducing perplexity by conditioning on more tokens, while
          Mamba cannot after 16k context.”
        </Quote>{' '}
        Behrouz et al.’s Titans (Dec 2024) extends this to long-term neural
        memory with surprise-driven update gates and outperforms much larger
        models on the BABILong reasoning benchmark; the MIRAS follow-up
        (Behrouz, Razaviyayn &amp; Mirrokni, 2025) recasts the design space as
        four components — architecture, attentional bias, retention gate,
        algorithm. RWKV-7 (Peng et al., March 2025) deploys (4) at 7B scale
        and proves regular-language recognition in Appendix D, the cleanest
        published architectural break of the <M>{'\\mathsf{TC}^0'}</M>{' '}
        ceiling. Mixture-of-Recursions (Bae et al., NeurIPS 2025) implements
        (6) with per-token adaptive depth and reports Pareto-better perplexity
        at matched FLOPs with 2× inference throughput. Geiping et al.’s
        Huginn-3.5B (NeurIPS 2025) trains the recurrent-depth template at
        800B tokens and achieves{' '}
        <Quote>
          “computation load equivalent to 50 billion parameters”
        </Quote>{' '}
        by iterating its hidden state at test time. None of these systems
        composes all five CLA components simultaneously, and none has been
        pretrained at frontier scale; the architecture sketch is a
        specification of what such a composition would have to look like.
      </P>

      <ChartFigure
        number="6"
        ariaLabel="Two panels. A: SOTA trajectories on MATH-500, AIME 2024, USAMO/IMO, GPQA-Diamond from Q2 2024 through Q2 2026 with four annotated milestones. B: AIME 2024 pass@1 vs. training compute on log scale, eight numbered checkpoints across SFT, RL with verifiable rewards, and on-policy distillation."
        caption={
          <>
            <Strong>Scaling on hard reasoning, 2024–2026.</Strong>{' '}
            <Em>Panel A:</Em> AIME 2024 SOTA ascends through three
            post-training eras — test-time RL (o1-preview, Sep 2024),
            verifier-based RL (DeepSeek-R1, Jan 2025), on-policy distillation
            (Qwen3-8B, May 2025), and the frontier stack (Opus 4.7, Apr 2026).
            MATH-500 saturated by mid-2025; the same frontier models score
            below 1% on ARC-AGI-3 (Mar 2026). <Em>Panel B:</Em> Qwen3-8B
            same-checkpoint comparison. OPD reaches 74.4% AIME 2024 at 1,800
            GPU-hours, strictly dominating RL’s 67.6% at 17,920 GPU-hours.
            Sources: model release scores from each lab; ARC Prize Foundation;
            Qwen3 Technical Report (May 2025); Thinking Machines Lab,
            On-Policy Distillation (Oct 2025).
          </>
        }
      >
        <Fig4SotaCompute />
      </ChartFigure>

      <P>
        <Strong>On the externalization side.</Strong> The dominant production
        paradigm is what Letta (the MemGPT successor) explicitly calls{' '}
        <Quote>“LLM-as-an-Operating-System”</Quote>: the LLM is like the CPU,
        and its context window is like the RAM, serving as the model’s working
        memory. Memory is external by design, accessed through tool calls
        (<Code>memory_replace</Code>, <Code>memory_insert</Code>,{' '}
        <Code>archival_memory_search</Code>). The benchmark situation is
        illustrative: Mem0 (Chhikara et al., arXiv:2504.19413) reports a 26%
        relative win over OpenAI on LoCoMo at <M>{'< 7\\text{K}'}</M> tokens
        per retrieval; the original Zep paper claimed 84% on the same
        benchmark; Mem0’s reproduction corrected this to{' '}
        <M>{'58.44 \\pm 0.20\\%'}</M>; Zep’s counter-claim is 75.14%. Three
        numbers, one benchmark, the same harness ostensibly running. The
        point is not which framework is best — it is that a 25-point swing
        across vendor harnesses for the same memory operation is itself the
        externalization argument. Capability is not located at any one of the
        components.
      </P>

      <P>
        The naming has caught up with the structure. By mid-2025 the field
        had renamed prompt engineering as <Strong>context engineering</Strong>{' '}
        — Karpathy, June 2025:{' '}
        <Quote>
          “the delicate art and science of filling the context window with
          just the right information for the next step”
        </Quote>
        ; Tobi Lütke (Shopify), early summer 2025:{' '}
        <Quote>
          “the art of providing all the context for the task to be plausibly
          solvable by the LLM”
        </Quote>
        ; Gartner, October 2025:{' '}
        <Quote>
          “context engineering is in, and prompt engineering is out.”
        </Quote>{' '}
        The renaming is itself an admission. We have stopped pretending the
        model is doing the work alone.
      </P>

      <P>
        The same gap shows up in long-context evaluation.{' '}
        <Strong>NoLiMa</Strong> (Modarressi et al., ICML 2025) defines
        “effective length” as the longest context where a model maintains{' '}
        <M>{'\\geq 85\\%'}</M> of its base score and finds that{' '}
        <Quote>
          “even GPT-4o, one of the top-performing exceptions, experiences a
          reduction from an almost-perfect baseline of 99.3% to 69.7% [at 32K].”
        </Quote>{' '}
        At 32K tokens, eleven of the evaluated models drop below 50% of their
        short-context performance. Chroma’s <Strong>Context Rot</Strong> study
        (Hong et al., July 2025) extends this across 18 frontier models
        including GPT-4.1, Claude Opus 4, Gemini 2.5, and Qwen3:{' '}
        <Quote>
          “even under these minimal conditions, model performance degrades as
          input length increases, often in surprising and non-uniform ways.”
        </Quote>{' '}
        Effective context length is roughly 65–70% of nominal across the
        frontier as of mid-2026. The scaling curve in Fig. 4A is what this
        looks like as a structural fact: doubling the advertised window does
        not double the usable one, and the difference is exactly the
        externalization premium re-priced.
      </P>

      <P>
        The latent-reasoning rebuttal has a sharper version worth
        pre-empting. Continuous-thought architectures (Coconut, Hao et al.,
        Dec 2024) feed the model’s hidden state back as the next embedding
        rather than decoding to words, on the hypothesis that reasoning can
        occur in continuous representational space below the token level.
        Modest gains on small benchmarks. But a December 2025 causal/
        adversarial analysis (<Quote>“Do Latent Tokens Think?”</Quote>) found{' '}
        <Quote>
          “latent tokens in COCONUT showed minimal sensitivity to
          perturbations and displayed a clustered embedding pattern, further
          confirming that these tokens act as placeholders rather than
          meaningful representations of reasoning.”
        </Quote>{' '}
        The architecture is not yet a substitute for verbalized
        chain-of-thought at frontier scale: depth lives somewhere, but
        probably not in the latent tokens themselves, which is exactly the
        case for putting depth in (3) instead, where it is causally active by
        construction.
      </P>

      <P>
        Verifiable-reward training applied beyond mathematics is the second
        front: theorem proving with proof checkers, code with unit tests,
        robotic manipulation with privileged-state physics simulators —
        domains where the verifier is an oracle at training and absent at
        inference. The DeepSeek-R1 trajectory ({'15.6 → 71.0%'} AIME via pure
        RL on a verifiable reward, with 5–30% of parameters moved per
        Mukherjee) is the proof of concept for the “verifier removed at
        inference” clause of CLA.
      </P>

      <H2>The honest cost</H2>

      <P>
        Frontier prototypes that try to internalize symbolic computation in a
        single architecture currently report something like four percent
        accuracy on two-digit arithmetic, with reprompting (system-level
        conditioning) lifting this to the eighties, consistent with
        theoretical bounds on what a fixed-depth transformer can compute
        without scratchpad. But where the operation is reasoning rather than
        raw arithmetic, internalization has come further than pessimistic
        accounts allow. RL on a fixed pre-trained base with verifiable rewards
        and no learned reward proxy climbed from 15.6% to 71.0% pass@1 on
        AIME 2024, 86.7% with majority voting. The same paradigm with a proof
        checker reached IMO silver in 2024 and gold in 2025 with end-to-end
        natural-language reasoning. By spring 2026 GPT-5.5 and Opus 4.7 reach
        near-saturation on AIME without tools; Mythos hits 97.6% on USAMO
        2026. None of these are orchestration wins.
      </P>

      <P>
        CLA-style architectures pay in three currencies. The fast-weight
        update (5) requires a gradient step inside the forward pass; current
        TTT-Linear / TTT-MLP implementations run at <M>{'\\sim 5\\%'}</M> of
        peak FLOPS on H100s versus <M>{'\\sim 50\\%'}</M> for vanilla
        attention (<Quote>“Test-Time Training Done Right,”</Quote>{' '}
        arXiv:2505.23884). Recurrent depth (3) costs a multiplicative factor
        in latency proportional to <M>{'\\mathbb{E}[\\rho(e)]'}</M>.
        Single-stack numerics (Component 4) constrains kernel choice and
        forecloses some of the throughput optimizations production stacks
        rely on — concretely, the <M>{'\\sim 60\\%'}</M> throughput cost of
        batch-invariant kernels in Fig. 4C. These are real costs. They are
        also costs of specifying what the system <ItalicEm>is</ItalicEm>,
        which is the sole charge of the four-condition test.
      </P>

      <P>
        Externalization continues to win in production: it ships, it composes
        with existing infrastructure, it is what every frontier agent is
        built on. But the question is not “what works in production”; it is
        “what are we claiming when we talk about intelligence.” Conflating
        the two is the move I’m refusing. Imagine a chess engine that, asked
        for the best move, dispatches the position to a far stronger engine
        over an RPC and returns that engine’s answer. The wrapper is correct;
        by any benchmark it plays grandmaster-level chess. We would not, on
        this evidence, say the wrapper plays grandmaster-level chess. We
        would say it is good at calling the external engine. To know how good
        it is at chess, you would disable the tool layer and watch what
        happened.
      </P>

      <P>
        The current state of frontier AI is, in many evaluations, closer to
        this analogy than is comfortable. Not in the trivial sense that
        models cannot function without tools, but in the deep sense that the
        reasoning, persistence, and calculation we point at when we say
        “intelligent” are happening, in the systems we deploy, on the far
        side of the tool boundary.
      </P>

      <H2>Generally intelligent systems and their internalization</H2>

      <P>
        A general intelligence is a system whose latent state is the locus of
        its computation, its memory, and its semantics — not a context window
        into which an engineering organization has loaded those things on its
        behalf. This is not a stylistic preference. It is a structural
        condition, and it is one the field has spent the last eighteen months
        independently arriving at from several different directions.
      </P>

      <P>
        The clearest articulation is from outside this essay. In April 2026,
        Zhuge, Tian, Schmidhuber and colleagues (arXiv:2604.06425) proposed
        what they call a <Strong>Neural Computer</Strong> —{' '}
        <Quote>
          “a machine form that unifies computation, memory, and I/O in a
          learned runtime state”
        </Quote>{' '}
        — and gave a maturity test that is, line for line, the same four
        conditions this essay arrived at: Turing completeness, universal
        programmability, behavioral consistency unless explicitly
        reprogrammed, and machine-native semantics rather than
        borrowed-from-host primitives. They call the mature target a{' '}
        <ItalicEm>Completely Neural Computer</ItalicEm>; the essay calls it
        the Closed-Loop Architecture; the underlying claim is identical. The
        move under critique here has an older name in philosophy of mind.
        Adams and Aizawa, in <ItalicEm>The Bounds of Cognition</ItalicEm>{' '}
        (2008), called it the{' '}
        <Strong>coupling-constitution fallacy</Strong>: the slide from “X is
        causally coupled to Y during operation” to “X is part of Y, and Y has
        the cognitive properties of the whole.” To call an
        LLM-plus-orchestrator-plus-interpreter-plus-retriever a single
        intelligent system is to commit it. Two independent formulations of
        architecture converging on the same four conditions, with a
        thirty-year-old philosophical diagnosis sitting waiting for them, is
        evidence that the bar is not idiosyncratic. It is what{' '}
        <ItalicEm>intelligent system</ItalicEm>, as a term, has to mean if it
        is to mean anything.
      </P>

      <P>
        What is genuinely new in 2025–2026 is that every CLA component now
        has a published, working instantiation; what does not yet exist is
        the composition. <Em>Recurrent-depth scaling:</Em> Geiping et al.’s
        Huginn-3.5B (arXiv:2502.05171, NeurIPS 2025 spotlight) trains a
        Prelude/Recurrent/Coda transformer at 800B tokens and shows that
        iterating the recurrent block 132 times at test time yields{' '}
        <Quote>“computation load equivalent to 50 billion parameters,”</Quote>{' '}
        with reasoning happening entirely inside the activation tensor rather
        than in emitted CoT tokens. <Em>Per-token adaptive depth:</Em> Bae et
        al.’s Mixture-of-Recursions (arXiv:2507.10524, NeurIPS 2025)
        implements the per-token policy <M>{'\\rho'}</M> directly, with
        Pareto-better perplexity at matched FLOPs and 2× throughput.{' '}
        <Em>Non-diagonal state transitions:</Em> Peng et al.’s RWKV-7 “Goose”
        (arXiv:2503.14456, March 2025) replaces the diagonal SSM transition
        with a generalized delta rule whose negative-eigenvalue spectrum
        provably exits the <M>{'\\mathsf{TC}^0'}</M> ceiling Mamba and S4 are
        confined to (Merrill, Petty &amp; Sabharwal, ICML 2024) — the paper
        proves <M>{'\\mathsf{NC}^1'}</M>-completeness in a single layer and
        regular-language recognition in four. <Em>Fast-weight memory:</Em>{' '}
        Behrouz et al.’s ATLAS (arXiv:2505.23735, May 2025) extends Titans’
        surprise-gated update with a generalized Omega rule and reports +80%
        on 10M-context BABILong, demonstrating that long-context retention
        through in-pass weight updates beats both attention and prior linear
        recurrents at the multi-million-token scale where they collapse.{' '}
        <Em>Behavioral consistency:</Em> Thinking Machines Lab’s
        batch-invariant kernels (He, Sep 2025), now upstreamed into vLLM and
        SGLang, collapse 1000 temperature-zero generations to 1000
        bit-identical outputs at roughly 60% of throughput.{' '}
        <Em>Verifier-distilled training:</Em> Mukherjee et al.
        (arXiv:2505.11711) show across PPO, GRPO, ORPO, KTO, DPO, SimPO, and
        PRIME that RL fine-tuning consistently moves only 5–30% of parameters
        and that re-training the identified subnetwork alone reproduces the
        full effect — meaning the verifier-installed circuitry is
        localizable, separable, and lives in weights once the verifier is
        removed. The DeepSeek-R1 trajectory is the existence proof at scale:
        15.6% → 77.9% pass@1 on AIME 2024, pure RL on a verifiable reward,
        no SFT priming, no inference scaffolding (
        <ItalicEm>Nature</ItalicEm> 645:633, Sept 2025). And on July 21,
        2025, IMO President Gregor Dolinar formally confirmed Gemini Deep
        Think had earned 35/42 at IMO 2025{' '}
        <Quote>
          “in natural language within the 4.5-hour time limit,”
        </Quote>{' '}
        no Lean, no AlphaProof translation, no external tools. A clean
        year-over-year improvement from AlphaProof’s 2024 silver.
        Mathematical reasoning at the limit of human competition is, at
        present, lived inside the weights.
      </P>

      <P>
        The pieces are there. The composition is not. Sakana AI’s Continuous
        Thought Machine (Darlow et al., arXiv:2505.05522, NeurIPS 2025) is
        the most architecturally adventurous attempt at machine-native
        semantics: neuron-level temporal dynamics and neural synchronization
        as primitives the system develops itself, rather than borrowing
        token-by-token autoregression from the host language paradigm. It
        has not yet been demonstrated at frontier language scale. Nothing
        has composed all five CLA components at frontier scale. The
        architecture sketch in this essay is a specification of what such a
        composition would have to look like, and the empirical work has
        reached the point where that specification is no longer
        aspirational — it is what the field is, in pieces, already building.
      </P>

      <H3>An engineering analogue</H3>

      <P>
        The locality argument has a hardware version the chip-design
        community has been making for thirty years. Wulf and McKee’s 1995
        note <Quote>“Hitting the Memory Wall”</Quote> observed that
        processor performance was improving ~60% per year while DRAM latency
        was improving ~7%; once the gap widens enough, system performance{' '}
        <Quote>“is totally determined by memory speed.”</Quote> Horowitz’s
        ISSCC 2014 plenary supplied the cost: on a 45 nm process, an 8-bit
        add costs ~0.03 pJ, a small SRAM read ~5 pJ, a DRAM access 640–2,600
        pJ. Arithmetic is essentially free; data movement is not. Every
        tool call, every retrieval, every vector-store read pays the
        Horowitz tax in a regime where the operations themselves are
        trivially cheap.
      </P>

      <P>
        The hardware response has been a research program built on the
        observation that the dense linear algebra approximating intelligence
        in current architectures is non-compositional under externalization.
        Sebastian, Le Gallo, Khaddam-Aljameh and Eleftheriou (
        <ItalicEm>Nat. Nanotechnol.</ItalicEm> 15:529, 2020) framed the bet
        directly: data-centric AI workloads{' '}
        <Quote>“call for a radical departure from the traditional systems.”</Quote>{' '}
        IBM’s HERMES chip (Le Gallo et al.,{' '}
        <ItalicEm>Nat. Electron.</ItalicEm> 6:680, 2023) is the existence
        proof — weights stored as phase-change-memory conductances,
        matrix-vector products performed by Kirchhoff and Ohm at 12.4 TOPS/W
        in 14 nm. NorthPole (Modha et al., <ItalicEm>Science</ItalicEm>{' '}
        382:329, 2023) reports roughly 5× the energy efficiency of an H100
        on ResNet-50; the design principle, in Modha’s framing,{' '}
        <Quote>“merges the boundaries between compute and memory.”</Quote>
      </P>

      <P>
        Fig. 7 plots the result. Each step closer to “compute and memory
        share a substrate” recovers an order of magnitude, and the cortex
        sits roughly 500× above the best published silicon — not because
        biology has solved a hard search problem we have not, but because a
        single cortical pyramidal neuron is itself the input–output map of
        a seven-layer temporally convolutional network (Beniaguev, Segev
        &amp; London, <ItalicEm>Neuron</ItalicEm> 109:2727, 2021): the
        closed loop closes inside the dendritic tree, with no scratchpad
        and no tool call. There is no synapse-level coprocessor. The
        non-compositionality argument this essay is making about LLMs is
        the argument hardware engineers have been making about von Neumann
        systems since 1995, with thirty years more empirical support and
        far less ambiguity about where the work happens.
      </P>

      <ChartFigure
        number="7"
        ariaLabel="Horizontal log-scale bar chart of inference efficiency in TOPS/W. Server CPU at 0.05, NVIDIA H100 at 3, IBM HERMES at 12.4, IBM NorthPole at 22, human cortex at ~10,000."
        caption={
          <>
            <Strong>The locality premium.</Strong> Inference efficiency on a
            common task (TOPS/W, log scale). The two coral bars share an
            architectural commitment the two grey bars do not: weights and
            arithmetic occupy the same physical substrate, so a
            matrix-vector product is a property of where charge sits, not of
            what travels across a bus. The cortex is not a target; it is the
            asymptote that fixes the slope. Sources: Horowitz, ISSCC 2014
            (energy of arithmetic vs DRAM); Wulf &amp; McKee, ACM SIGARCH
            1995 (the memory wall); Le Gallo et al.,{' '}
            <ItalicEm>Nat. Electron.</ItalicEm> 6:680, 2023 (HERMES, 12.4
            TOPS/W in 14 nm); Modha et al., <ItalicEm>Science</ItalicEm>{' '}
            382:329, 2023 (NorthPole, ~5× H100 on ResNet-50 inference);
            cortex an order-of-magnitude estimate from{' '}
            <M>{'\\sim 10^{15}'}</M> synaptic operations s
            <tspan dy={-4} fontSize="0.7em">−1</tspan> at ~20 W.
          </>
        }
      >
        <Fig7LocalityPremium />
      </ChartFigure>

      <H3>The honest counterargument</H3>

      <P>
        The honest counterargument runs in the other direction, and it has
        to be engaged. Edwin Hutchins’{' '}
        <ItalicEm>Cognition in the Wild</ItalicEm> (1995) shows in granular
        ethnographic detail that a navy ship’s bridge or an airliner cockpit{' '}
        <ItalicEm>collectively</ItalicEm> executes cognitive operations no
        individual member performs.{' '}
        <Quote>
          “Speed bugs do not help pilots remember speeds; rather, they are
          part of the process by which the cockpit system remembers speeds.”
        </Quote>{' '}
        The cognitive property is genuinely predicable of the distributed
        system. But Hutchins’s cockpit and an LLM-plus-tools stack differ
        in two structural ways. First, every component of the cockpit is
        itself a closed-loop system: pilots have brains, speed bugs are in
        continuous perceptual contact with airspeed indicators, the
        integrating mechanism is the pilot’s visual cortex comparing needle
        to bug at every cycle. Second, the integration is dense, recurrent,
        and in-substrate (visual coupling, manual control, voice loopback)
        rather than serialized through narrow textual function calls.
        Hutchins demonstrates that distribution is compatible with cognitive
        predication when the components are closed-loop and the coupling is
        constitutive. The LLM-plus-tools stack inherits neither property.
        The orchestrated assemblage is not Hutchins’ cockpit; it is the
        negative case the comparison is set up to refute.
      </P>

      <P>
        The empirical counterweight to the internalization thesis is that
        orchestrated systems still win on raw benchmark capability today.
        Letta’s recent filesystem agent reaches 74% on LoCoMo by storing
        conversation history in a text file and giving the LLM{' '}
        <Code>grep</Code> — beating both Mem0 and Zep, the dedicated memory
        libraries. Sakana’s own AB-MCTS work (Inoue et al., arXiv:2503.04412)
        shows that no single frontier model exceeds 23% on ARC-AGI-2 under
        repeated sampling, but Multi-LLM AB-MCTS reaching across o4-mini,
        Gemini 2.5 Pro, and DeepSeek-R1 hits ~30%; even the strongest
        published scaffolding (Gemini 3 Pro + Poetiq harness) reaches 54%
        only at a 37× cost premium, while untrained humans solve every
        problem in the set. Test-time training layers, before LaCT’s
        chunked fix (arXiv:2505.23884), ran at under 5% of peak FLOPS
        against attention’s ~50%. These are real numbers (Fig. 8). The
        position they support is not that internalization has won; it is
        that internalization is the path on which winning would mean
        something. AB-MCTS is doing externally what a future CLA system
        would do internally: parallel hypothesis exploration with adaptive
        branching. The architectural question is whether to keep that loop
        external — where each step is a serialization boundary, each model
        a black box to the others, each result an act of routing rather
        than reasoning — or to fold it into a substrate where the same
        exploration happens in activations.
      </P>

      <ChartFigure
        number="8"
        ariaLabel="Horizontal bar chart of ARC-AGI-2 pass rates: untrained humans ~100%, Gemini 3 Pro + Poetiq harness 54%, Gemini 3 Pro alone 31%, Multi-LLM AB-MCTS 30%, AB-MCTS single-model 27.5%, best single frontier model 23%."
        caption={
          <>
            <Strong>The orchestration ladder on ARC-AGI-2.</Strong> Frontier
            results, May 2026. Single-model repeated sampling on a strong
            base sits at ~23%; tree-search orchestration over that base
            reaches ~30%; the strongest published scaffolding (Gemini 3 Pro
            + Poetiq harness) reaches 54% at a 37× cost multiplier over
            single-call use ($0.81 → $30.57/task). Untrained humans solve
            every problem. Orchestration genuinely adds capability today,
            but at sharply rising cost and on a path that still leaves a
            humans-shaped hole; the internalization route is the one on
            which closing that gap would mean reasoning rather than routing
            better. Sources: Sakana AI / Inoue et al., AB-MCTS,
            arXiv:2503.04412 (March 2025); ARC Prize Foundation 2025
            Technical Report.
          </>
        }
      >
        <Fig8OrchestrationLadder />
      </ChartFigure>

      <P>
        A general intelligence is what you get when that fold succeeds. Not
        a model with tools. Not an orchestration loop over models. A system
        that, given a problem, computes inside itself; that, given a piece
        of information, integrates it inside itself; that, given a
        procedure, installs it inside itself and calls it later. The four
        conditions are not aspirational targets. They are what the word{' '}
        <ItalicEm>intelligent</ItalicEm> refers to when it refers to
        anything specific. Without them, the word is doing the work of
        pointing at an engineering organization plus a deployment stack and
        saying “this thinks.”
      </P>

      <Callout>
        A system that cannot compute without delegating to a filesystem is
        not a computing system; it is an interface to one. A model that
        cannot reason without delegating the reasoning is not a reasoning
        model; it is a router for one. The frontier today is full of
        useful, impressive, sometimes startling routers. We should be more
        careful about what we call them, because the systems that will
        actually be intelligent — in the strict, structural sense the four
        conditions name — are being built right now, in pieces, and we
        will need the word for them.
      </Callout>

      {/* References */}
      <section className="mt-24 border-t border-ink-border pt-12">
        <div className="micro-label">References</div>
        <h2 className="mt-4 font-sans text-2xl font-medium tracking-tight text-ink-text">
          Sources
        </h2>

        <ReferenceGroup title="Compositionality, nondeterminism, and the seam">
          <Ref>
            He, H. <ItalicEm>Defeating Nondeterminism in LLM Inference.</ItalicEm>{' '}
            Thinking Machines Lab, Sep 10, 2025.
          </Ref>
          <Ref>
            Yao, Y. et al.{' '}
            <ItalicEm>
              On the Rollout-Training Mismatch in Modern RL Systems.
            </ItalicEm>{' '}
            opt-ml.org/papers/2025/paper116, 2025.
          </Ref>
          <Ref>
            Fu, Y. et al.{' '}
            <ItalicEm>
              Your Efficient RL Framework Secretly Brings You Off-Policy.
            </ItalicEm>{' '}
            FlashRL, Aug 2025.
          </Ref>
          <Ref>
            ROLL Flash. arXiv:2510.11345, October 2025.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Frontier model assemblage premium (Figure 1)">
          <Ref>
            Anthropic. <ItalicEm>Claude Opus 4.7 System Card.</ItalicEm> April
            16, 2026.
          </Ref>
          <Ref>
            Anthropic.{' '}
            <ItalicEm>Claude Mythos Preview System Card.</ItalicEm> April 7,
            2026.
          </Ref>
          <Ref>
            OpenAI. <ItalicEm>Introducing GPT-5.5.</ItalicEm> April 23, 2026.
          </Ref>
          <Ref>
            Google.{' '}
            <ItalicEm>Gemini 3.1 Pro launch materials.</ItalicEm> April 2026.
          </Ref>
          <Ref>
            ARC Prize Foundation.{' '}
            <ItalicEm>2025 Technical Report.</ItalicEm>
          </Ref>
          <Ref>
            OpenAI. <ItalicEm>Introducing GPT-5.</ItalicEm> August 2025.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="ARC-AGI-3 (Figure 2)">
          <Ref>
            ARC Prize Foundation.{' '}
            <ItalicEm>
              ARC-AGI-3: A New Challenge for Frontier Agentic Intelligence.
            </ItalicEm>{' '}
            arXiv:2603.24621, March 27, 2026.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Perturbation collapse (Figure 3)">
          <Ref>
            Shalyt, M. et al.{' '}
            <ItalicEm>
              ASyMOB: Algebraic-Symbolic Mathematics Benchmark.
            </ItalicEm>{' '}
            NeurIPS 2025. arXiv:2505.23851.
          </Ref>
          <Ref>
            Gulati, A. et al.{' '}
            <ItalicEm>
              Putnam-AXIOM: A Functional and Static Benchmark.
            </ItalicEm>{' '}
            ICML 2025. arXiv:2508.08292.
          </Ref>
          <Ref>
            Yao, Y. et al.{' '}
            <ItalicEm>MSCR: Minimal Single-Character Replacements.</ItalicEm>{' '}
            arXiv:2511.08055, Nov 2025.
          </Ref>
          <Ref>
            Mirzadeh, I. et al.{' '}
            <ItalicEm>GSM-Symbolic / GSM-NoOp.</ItalicEm> ICLR 2025.
            arXiv:2410.05229.
          </Ref>
          <Ref>
            Shojaee, P. et al. <ItalicEm>The Illusion of Thinking.</ItalicEm>{' '}
            Apple ML Research. arXiv:2506.06941, June 2025.
          </Ref>
          <Ref>
            Lawsen, A. <ItalicEm>Comment on the Illusion of Thinking.</ItalicEm>{' '}
            arXiv:2506.09250, June 2025.
          </Ref>
          <Ref>
            Liang, J. et al.{' '}
            <ItalicEm>Rethinking the Illusion of Thinking.</ItalicEm>{' '}
            arXiv:2507.01231, July 2025.
          </Ref>
          <Ref>
            <ItalicEm>
              RIDE: Item-Response-Theory Difficulty Conditioning.
            </ItalicEm>{' '}
            arXiv:2511.04120, Feb 2026.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Internalization at the circuit level">
          <Ref>
            Mukherjee, S. et al.{' '}
            <ItalicEm>
              Reinforcement Learning Finetunes Small Subnetworks in Large
              Language Models.
            </ItalicEm>{' '}
            arXiv:2505.11711, May 2025.
          </Ref>
          <Ref>
            DeepSeek-AI.{' '}
            <ItalicEm>
              DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL.
            </ItalicEm>{' '}
            arXiv:2501.12948, Jan 2025; <ItalicEm>Nature</ItalicEm>{' '}
            s41586-025-09422-z, 2025.
          </Ref>
          <Ref>
            Google DeepMind.{' '}
            <ItalicEm>
              Advanced version of Gemini with Deep Think achieves gold-medal
              standard at the IMO.
            </ItalicEm>{' '}
            July 21, 2025.
          </Ref>
          <Ref>
            Lindsey, J. et al.{' '}
            <ItalicEm>On the Biology of a Large Language Model.</ItalicEm>{' '}
            Anthropic, transformer-circuits.pub, March 2025.
          </Ref>
          <Ref>
            Nanda, N. et al.{' '}
            <ItalicEm>
              Progress measures for grokking via mechanistic
              interpretability.
            </ItalicEm>{' '}
            arXiv:2301.05217, 2023.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Scaling laws for post-training (Figure 4B)">
          <Ref>
            Lu, K. et al. <ItalicEm>On-Policy Distillation.</ItalicEm>{' '}
            Thinking Machines Lab, Oct 27, 2025.
          </Ref>
          <Ref>
            Busbridge, D. et al.{' '}
            <ItalicEm>Distillation Scaling Laws.</ItalicEm>{' '}
            arXiv:2502.08606, Feb 2025; updated July 2025.
          </Ref>
          <Ref>
            Kim, J. et al.{' '}
            <ItalicEm>
              Why Does Self-Distillation (Sometimes) Degrade the Reasoning
              Capability of LLMs?
            </ItalicEm>{' '}
            arXiv:2603.24472, March 25, 2026.
          </Ref>
          <Ref>
            Brown, W.{' '}
            <ItalicEm>
              Why the SFT–RL pipeline works, where on-policy distillation fits,
              and how self-distillation goes wrong.
            </ItalicEm>{' '}
            April 2026.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Memory and context scaling (Figure 4A)">
          <Ref>
            Behrouz, A., Zhong, P. &amp; Mirrokni, V.{' '}
            <ItalicEm>
              Titans: Learning to Memorize at Test Time.
            </ItalicEm>{' '}
            arXiv:2501.00663, Dec 2024.
          </Ref>
          <Ref>
            Behrouz, A., Razaviyayn, M. &amp; Mirrokni, V.{' '}
            <ItalicEm>
              Titans + MIRAS: Helping AI have long-term memory.
            </ItalicEm>{' '}
            Google Research, 2025.
          </Ref>
          <Ref>
            Sun, Y. et al.{' '}
            <ItalicEm>
              Learning to (Learn at Test Time): RNNs with Expressive Hidden
              States.
            </ItalicEm>{' '}
            ICML 2025. arXiv:2407.04620.
          </Ref>
          <Ref>
            <ItalicEm>Test-Time Training Done Right.</ItalicEm>{' '}
            arXiv:2505.23884, May 2025.
          </Ref>
          <Ref>
            Geiping, J. et al.{' '}
            <ItalicEm>
              Scaling up Test-Time Compute with Latent Reasoning: A Recurrent
              Depth Approach.
            </ItalicEm>{' '}
            NeurIPS 2025. arXiv:2502.05171.
          </Ref>
          <Ref>
            Modarressi, A. et al.{' '}
            <ItalicEm>
              NoLiMa: Long-Context Evaluation Beyond Literal Matching.
            </ItalicEm>{' '}
            ICML 2025. arXiv:2502.05167.
          </Ref>
          <Ref>
            Hong, K., Troynikov, A. &amp; Huber, J.{' '}
            <ItalicEm>
              Context Rot: How Increasing Input Tokens Impacts LLM Performance.
            </ItalicEm>{' '}
            Chroma Research, July 2025.
          </Ref>
          <Ref>
            Packer, C. et al.{' '}
            <ItalicEm>MemGPT: Towards LLMs as Operating Systems.</ItalicEm>{' '}
            arXiv:2310.08560.
          </Ref>
          <Ref>
            Chhikara, P. et al.{' '}
            <ItalicEm>
              Mem0: Building Production-Ready AI Agents with Scalable
              Long-Term Memory.
            </ItalicEm>{' '}
            arXiv:2504.19413, 2025.
          </Ref>
          <Ref>
            Karpathy, A.{' '}
            <ItalicEm>Context engineering.</ItalicEm> X / June 2025; Gartner,
            October 2025.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Theoretical bounds and architecture (§An architecture sketch, equations 2–6)">
          <Ref>
            Merrill, W. &amp; Sabharwal, A.{' '}
            <ItalicEm>
              The Expressive Power of Transformers with Chain of Thought.
            </ItalicEm>{' '}
            ICLR 2024. arXiv:2310.07923.
          </Ref>
          <Ref>
            Merrill, W. &amp; Sabharwal, A.{' '}
            <ItalicEm>
              Exact Expressive Power of Transformers with Padding.
            </ItalicEm>{' '}
            NeurIPS 2025. arXiv:2505.18948.
          </Ref>
          <Ref>
            Pfau, J., Merrill, W. &amp; Bowman, S.{' '}
            <ItalicEm>Let’s Think Dot by Dot.</ItalicEm> ICLR 2025.
            arXiv:2404.15758.
          </Ref>
          <Ref>
            London, A. &amp; Kanade, V.{' '}
            <ItalicEm>
              Pause Tokens Strictly Increase the Expressivity of
              Constant-Depth Transformers.
            </ItalicEm>{' '}
            NeurIPS 2025. arXiv:2505.21024.
          </Ref>
          <Ref>
            Merrill, W., Petty, J. &amp; Sabharwal, A.{' '}
            <ItalicEm>The Illusion of State in State-Space Models.</ItalicEm>{' '}
            ICML 2024. arXiv:2404.08819.
          </Ref>
          <Ref>
            Peng, B. et al.{' '}
            <ItalicEm>RWKV-7 “Goose” with Expressive Dynamic State Evolution.</ItalicEm>{' '}
            arXiv:2503.14456, March 2025.
          </Ref>
          <Ref>
            Bae, S. et al. <ItalicEm>Mixture-of-Recursions.</ItalicEm>{' '}
            NeurIPS 2025. arXiv:2507.10524.
          </Ref>
          <Ref>
            Giannou, A. et al.{' '}
            <ItalicEm>
              Looped Transformers as Programmable Computers.
            </ItalicEm>{' '}
            ICML 2023. arXiv:2301.13196.
          </Ref>
          <Ref>
            von Oswald, J. et al.{' '}
            <ItalicEm>
              Transformers learn in-context by gradient descent.
            </ItalicEm>{' '}
            ICML 2023.
          </Ref>
          <Ref>
            Hao, S. et al.{' '}
            <ItalicEm>
              Coconut: Training LLMs to Reason in a Continuous Latent Space.
            </ItalicEm>{' '}
            arXiv:2412.06769, Dec 2024.
          </Ref>
          <Ref>
            Zhang et al.{' '}
            <ItalicEm>
              Do Latent Tokens Think? A Causal and Adversarial Analysis of
              Chain-of-Continuous-Thought.
            </ItalicEm>{' '}
            arXiv:2512.21711, Dec 2025.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Generally intelligent systems and their internalization">
          <Ref>
            Zhuge, M., Tian, Y., Schmidhuber, J. et al.{' '}
            <ItalicEm>Neural Computers.</ItalicEm> arXiv:2604.06425, April
            2026.
          </Ref>
          <Ref>
            Behrouz, A. et al.{' '}
            <ItalicEm>
              ATLAS: Learning to Optimally Memorize Context at Test Time.
            </ItalicEm>{' '}
            arXiv:2505.23735, May 2025.
          </Ref>
          <Ref>
            Darlow, L. et al. (Sakana AI).{' '}
            <ItalicEm>Continuous Thought Machines.</ItalicEm> NeurIPS 2025
            Spotlight. arXiv:2505.05522, May 2025.
          </Ref>
          <Ref>
            Inoue, Y., Misaki, K. et al. (Sakana AI).{' '}
            <ItalicEm>
              Wider or Deeper? Scaling LLM Inference-Time Compute with
              Adaptive Branching Tree Search.
            </ItalicEm>{' '}
            arXiv:2503.04412, March 2025.
          </Ref>
          <Ref>
            DeepSeek-AI. <ItalicEm>Nature</ItalicEm> 645:633–639, Sept 2025
            (DeepSeek-R1 peer-reviewed update; AIME 2024 pass@1 reported as
            77.9%).
          </Ref>
          <Ref>
            Letta.{' '}
            <ItalicEm>
              Benchmarking AI Agent Memory: Is a Filesystem All You Need?
            </ItalicEm>{' '}
            letta.com blog, 2025.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Engineering precedent: the memory wall and in-memory computing">
          <Ref>
            Wulf, W. A. &amp; McKee, S. A.{' '}
            <ItalicEm>
              Hitting the Memory Wall: Implications of the Obvious.
            </ItalicEm>{' '}
            ACM SIGARCH Computer Architecture News 23(1):20–24, 1995.
          </Ref>
          <Ref>
            Horowitz, M.{' '}
            <ItalicEm>
              Computing’s Energy Problem (and What We Can Do About It).
            </ItalicEm>{' '}
            ISSCC 2014 plenary, pp. 10–14.
          </Ref>
          <Ref>
            Sebastian, A., Le Gallo, M., Khaddam-Aljameh, R. &amp;
            Eleftheriou, E.{' '}
            <ItalicEm>
              Memory Devices and Applications for In-Memory Computing.
            </ItalicEm>{' '}
            <ItalicEm>Nature Nanotechnology</ItalicEm> 15:529–544, 2020.
          </Ref>
          <Ref>
            Le Gallo, M. et al.{' '}
            <ItalicEm>
              A 64-Core Mixed-Signal In-Memory Compute Chip Based on
              Phase-Change Memory for Deep Neural Network Inference.
            </ItalicEm>{' '}
            <ItalicEm>Nature Electronics</ItalicEm> 6:680–693, 2023.
          </Ref>
          <Ref>
            Modha, D. S. et al.{' '}
            <ItalicEm>
              Neural Inference at the Frontier of Energy, Space, and Time.
            </ItalicEm>{' '}
            <ItalicEm>Science</ItalicEm> 382(6668):329–335, 2023 (NorthPole).
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Biological and philosophical precedent">
          <Ref>
            Beniaguev, D., Segev, I. &amp; London, M.{' '}
            <ItalicEm>
              Single Cortical Neurons as Deep Artificial Neural Networks.
            </ItalicEm>{' '}
            <ItalicEm>Neuron</ItalicEm> 109(17):2727–2739, 2021.
          </Ref>
          <Ref>
            Adams, F. &amp; Aizawa, K.{' '}
            <ItalicEm>The Bounds of Cognition.</ItalicEm> Wiley-Blackwell,
            2008.
          </Ref>
          <Ref>
            Hutchins, E. <ItalicEm>Cognition in the Wild.</ItalicEm> MIT
            Press, 1995.
          </Ref>
        </ReferenceGroup>

        <ReferenceGroup title="Adjacent works referenced in the body">
          <Ref>
            Ryle, G. <ItalicEm>The Concept of Mind.</ItalicEm> Hutchinson, 1949.
          </Ref>
        </ReferenceGroup>
      </section>

      <EditorsNote>
        Arguments are mine, writing is Claude’s. This is partially an
        experiment in getting Claude to help speed-write and structure
        technical research blogs, drafted as artifacts and refined via
        “debate.” I have too many blog ideas I never get around to writing
        up; the models finally feel good enough to help out (hopefully; let
        me know what you think).
      </EditorsNote>
    </EssayLayout>
  );
}
