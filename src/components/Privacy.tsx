import { Footer } from './Footer';
import { Nav } from './Nav';

export function Privacy() {
  return (
    <div className="relative">
      <Nav />
      <main className="relative z-10 pt-32 pb-24">
        <article className="container-x max-w-3xl">
          <div className="micro-label">Legal / Privacy Policy</div>
          <h1 className="mt-6 font-sans text-4xl font-medium leading-[1.05] tracking-tight text-ink-text md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-micro text-ink-muted">
            Effective 22 April 2026 · Last updated 22 April 2026
          </p>

          <div className="mt-12 space-y-6 font-sans text-[15px] leading-[1.7] text-ink-dim">
            <p>
              This Privacy Policy explains how <span className="text-ink-text">BaseThesis</span> ("BaseThesis",
              "we", "us", "our") collects, uses, stores, shares, and protects your information when you
              use <span className="text-ink-text">Synth</span> (the "Service"), available at{' '}
              <a className="text-accent underline decoration-ink-border underline-offset-4 hover:decoration-accent" href="https://getsynth.io">https://getsynth.io</a>{' '}
              and through the Synth messaging channels we operate (including Telegram and, where enabled,
              WhatsApp and web chat). Synth is an AI operations assistant that connects to your productivity
              tools — such as Google Workspace and Microsoft 365 — and acts on your behalf, within the
              limits you authorise.
            </p>
            <p>
              We have written this policy to be direct and specific. If anything is unclear, email us at{' '}
              <a className="text-accent underline decoration-ink-border underline-offset-4 hover:decoration-accent" href="mailto:privacy@basethesis.com">
                privacy@basethesis.com
              </a>
              .
            </p>
          </div>

          <Section n="01" title="Who we are and how to contact us">
            <p>
              The Service is operated by <span className="text-ink-text">BaseThesis</span>, registered in
              India. For any privacy matter — including data access, correction, export, or deletion
              requests — contact us at:
            </p>
            <Ul>
              <li>Email: <Link href="mailto:privacy@basethesis.com">privacy@basethesis.com</Link></li>
              <li>General support: <Link href="mailto:engg@basethesis.com">engg@basethesis.com</Link></li>
              <li>Website: <Link href="https://getsynth.io">https://getsynth.io</Link></li>
            </Ul>
          </Section>

          <Section n="02" title="Information we collect">
            <H3>2.1 Account information you provide</H3>
            <Ul>
              <li>Your email address and display name.</li>
              <li>A password (stored as a salted bcrypt hash; we never store or transmit your plaintext password).</li>
              <li>Messaging-channel identifiers if you link Synth to Telegram or WhatsApp (for example, your Telegram user ID), so that we can route messages to you.</li>
              <li>Payment identifiers when you subscribe to a paid plan. Payments are processed by third-party payment processors (for example, Razorpay). We do not store full card or bank details on our servers.</li>
            </Ul>

            <H3>2.2 Google user data you authorise Synth to access</H3>
            <p>
              When you sign in with Google and grant consent, Synth accesses the Google user data listed
              below <em className="text-ink-text not-italic">solely</em> to provide the features you are
              using in the Synth user interface. The scopes we request, and why, are:
            </p>

            <div className="mt-6 overflow-x-auto rounded-sm border border-ink-border">
              <table className="w-full border-collapse font-sans text-[13px] text-ink-dim">
                <thead>
                  <tr className="border-b border-ink-border bg-ink-surface/60">
                    <th className="p-3 text-left font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                      Google OAuth scope
                    </th>
                    <th className="p-3 text-left font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                      Why Synth needs it
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ScopeRow
                    scope={<><Code>openid</Code>, <Code>userinfo.email</Code>, <Code>userinfo.profile</Code></>}
                    why="To create and sign you into your Synth account, and to display your name and email in the app."
                  />
                  <ScopeRow
                    scope={<Code>calendar</Code>}
                    why="To read your schedule so that Synth can answer questions about your calendar, and to create, move, or cancel events when you ask it to."
                  />
                  <ScopeRow
                    scope={<Code>spreadsheets</Code>}
                    why="To read and update the specific Google Sheets you reference in a request (for example, updating a pipeline tracker, reading a portfolio spreadsheet)."
                  />
                  <ScopeRow
                    scope={<><Code>drive.file</Code> (or, where enabled, <Code>drive</Code>)</>}
                    why="To open files you select, and to upload documents Synth generates on your behalf (for example, saving a draft report to a folder you name). The broader drive scope is used only where listing or searching across your Drive is required to fulfil a request you made."
                  />
                  <ScopeRow
                    scope={<><Code>gmail.send</Code> (and, where enabled, <Code>gmail.modify</Code>)</>}
                    why="To send replies and new emails on your explicit instruction, and — where you enable inbox features — to read and organise messages so Synth can summarise threads, draft replies, and surface action items for you."
                    last
                  />
                </tbody>
              </table>
            </div>

            <H3>2.3 Information generated through use</H3>
            <Ul>
              <li><Strong>Your conversations with Synth</Strong> — the messages you send and the responses Synth produces.</li>
              <li><Strong>Derived memory</Strong> — summaries, preferences, and facts Synth extracts from your conversations to personalise future replies. You can view, correct, or delete items in your memory on request.</li>
              <li><Strong>Operational telemetry</Strong> — timestamps, request counts, error traces, model usage, approximate cost per session, and similar data used to operate the Service, detect abuse, and improve reliability.</li>
              <li><Strong>IP address and device/browser information</Strong> collected automatically for security and rate-limiting.</li>
            </Ul>
          </Section>

          <Section n="03" title="How we use Google user data — our Limited Use commitment">
            <Callout accent>
              <div className="micro-label text-accent">Google API Services · Limited Use</div>
              <p className="mt-3">
                Synth's use and transfer to any other app of information received from Google APIs will
                adhere to the{' '}
                <Link href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes">
                  Google API Services User Data Policy
                </Link>
                , including the <Strong>Limited Use requirements</Strong>.
              </p>
              <p className="mt-3">
                Specifically, we commit that Google user data obtained through Google APIs, and any data
                derived from it, is used <Strong>only</Strong> to provide or improve user-facing features
                that are prominent in the Synth interface. We <Strong>do not</Strong>:
              </p>
              <Ul>
                <li>use or transfer Google user data for serving advertising, including retargeting, personalised, or interest-based advertising;</li>
                <li>sell Google user data, or transfer it to data brokers or information resellers;</li>
                <li>use Google user data to train, fine-tune, or improve generalised or third-party AI or machine-learning models; and</li>
                <li>allow humans to read your Google user data, except (a) with your affirmative consent for specific content, (b) for security purposes such as investigating abuse, (c) to comply with applicable law, or (d) where the data is aggregated and anonymised and used for internal operations in line with applicable law.</li>
              </Ul>
            </Callout>

            <H3>3.1 Specific user-facing features that use Google data</H3>
            <p>Within the limits above, we use Google user data to:</p>
            <Ul>
              <li>Answer your questions about your calendar, email, and documents.</li>
              <li>Draft, send, and reply to emails on your instruction.</li>
              <li>Create, move, and cancel calendar events on your instruction.</li>
              <li>Read, summarise, and edit specific Drive files and Sheets you reference.</li>
              <li>Detect and surface action items, scheduling conflicts, and follow-ups you asked Synth to track.</li>
              <li>Personalise future responses using a memory layer that you control.</li>
            </Ul>

            <H3>3.2 Use of AI models</H3>
            <p>
              Synth uses large language models provided by third-party AI providers (for example, Anthropic)
              to process your requests and generate responses. Google user data is sent to these providers{' '}
              <em className="text-ink-text not-italic">only</em> to fulfil the specific request you made,
              under contractual terms that prohibit the provider from using that data to train their
              models. We do not use your Google user data to train our own models or any third party's
              models.
            </p>
          </Section>

          <Section n="04" title="How we share, transfer, or disclose data">
            <p>
              We do not sell your data. We do not transfer or disclose your information to third parties
              for any purpose other than the ones described below.
            </p>
            <Ul>
              <li><Strong>Service providers (sub-processors)</Strong> who operate on our behalf under confidentiality and data-protection obligations: cloud infrastructure (for example, AWS or GCP), AI model providers (for example, Anthropic), payment processors (for example, Razorpay), transactional email and messaging providers, and error-monitoring tools. A current list is available on request at <Link href="mailto:privacy@basethesis.com">privacy@basethesis.com</Link>.</li>
              <li><Strong>Legal and safety</Strong> — where we have a good-faith belief that disclosure is required to comply with law, legal process, or a lawful government request, or to protect the rights, property, or safety of our users, BaseThesis, or the public.</li>
              <li><Strong>Business transfer</Strong> — if BaseThesis is involved in a merger, acquisition, or sale of assets, we will obtain your explicit prior consent before any transfer of your Google user data.</li>
            </Ul>
          </Section>

          <Section n="05" title="How we store and protect your data">
            <Ul>
              <li><Strong>Encryption in transit.</Strong> All connections to Synth and to third-party APIs use TLS 1.2 or higher.</li>
              <li><Strong>Encryption at rest.</Strong> Production databases and file storage are encrypted at rest.</li>
              <li><Strong>Container isolation.</Strong> Each Synth user's agent runs in an isolated Linux container with its own filesystem. One user's agent cannot read another user's data.</li>
              <li><Strong>OAuth tokens</Strong> are stored on our host systems, never placed inside per-user agent containers, and are encrypted at rest. Tokens are scoped to the minimum permissions needed.</li>
              <li><Strong>Access controls.</Strong> Only a small number of BaseThesis personnel have production access, subject to multi-factor authentication and audit logging. Human access to user data is limited to the narrow circumstances described in Section 3 (Limited Use).</li>
              <li><Strong>Secure development.</Strong> We follow reasonable industry practices for secure software development, dependency monitoring, and incident response.</li>
            </Ul>
            <p>
              No system is perfectly secure. If we become aware of a security incident that materially
              affects your personal data, we will notify you and, where required, regulators without
              undue delay.
            </p>
          </Section>

          <Section n="06" title="Data retention and deletion">
            <p>
              We retain personal information only for as long as is reasonably necessary to provide the
              Service and to comply with legal, accounting, and reporting obligations.
            </p>
            <Ul>
              <li><Strong>Account data</Strong> — retained for the life of your account.</li>
              <li><Strong>Google OAuth tokens</Strong> — retained while your Google integration is connected. When you disconnect, we revoke and delete the refresh token within 7 days.</li>
              <li><Strong>Conversation history and derived memory</Strong> — retained for the life of your account. You can delete specific items, clear memory, or request full deletion at any time.</li>
              <li><Strong>Operational logs and telemetry</Strong> — retained for up to 90 days, after which they are deleted or fully anonymised.</li>
              <li><Strong>Backups</Strong> — encrypted backups are retained for up to 30 days and then purged.</li>
            </Ul>
            <p>
              <Strong>Right to deletion.</Strong> You can delete your account and all associated data at
              any time by emailing <Link href="mailto:privacy@basethesis.com">privacy@basethesis.com</Link>{' '}
              or via the in-product account settings. We will complete deletion of live data within 30
              days of your request, and of backups within the backup retention window above, except where
              we are required by law to retain specific records (for example, tax invoices).
            </p>
            <p>
              <Strong>Revoking Google access.</Strong> You can revoke Synth's access to your Google
              account at any time from{' '}
              <Link href="https://myaccount.google.com/permissions">https://myaccount.google.com/permissions</Link>.
              Revocation is immediate on the Google side; our servers will stop receiving new data on the
              next API call and will delete cached tokens within 7 days.
            </p>
          </Section>

          <Section n="07" title="Your rights">
            <p>
              Depending on where you live, you have the following rights in relation to your personal data:
            </p>
            <Ul>
              <li><Strong>Access</Strong> — obtain confirmation of, and a copy of, the personal data we hold about you.</li>
              <li><Strong>Correction</Strong> — have inaccurate data corrected.</li>
              <li><Strong>Deletion</Strong> — have your data deleted, subject to legal exceptions.</li>
              <li><Strong>Portability</Strong> — receive your data in a structured, machine-readable format.</li>
              <li><Strong>Objection and restriction</Strong> — object to, or restrict, certain processing.</li>
              <li><Strong>Withdrawal of consent</Strong> — where processing is based on consent, withdraw it at any time.</li>
              <li><Strong>Complaint</Strong> — lodge a complaint with your local data protection authority.</li>
            </Ul>
            <p>
              Indian users have additional rights under the <Strong>Digital Personal Data Protection Act,
              2023</Strong>, including the right to grievance redressal and nomination. EEA/UK users have
              rights under the <Strong>GDPR/UK GDPR</Strong>. California users have rights under the{' '}
              <Strong>CCPA/CPRA</Strong>; we do not sell personal information.
            </p>
            <p>
              To exercise any of these rights, email{' '}
              <Link href="mailto:privacy@basethesis.com">privacy@basethesis.com</Link>. We will respond
              within 30 days.
            </p>
          </Section>

          <Section n="08" title="International data transfers">
            <p>
              BaseThesis operates from India. Depending on the infrastructure region you are served from,
              your personal data may be processed in India, the European Economic Area, the United States,
              or other countries where our service providers operate. Where required by law, we implement
              appropriate safeguards (for example, Standard Contractual Clauses) for international
              transfers of personal data.
            </p>
          </Section>

          <Section n="09" title="Children">
            <p>
              Synth is not directed to children under 13 (or the minimum age in your jurisdiction). We do
              not knowingly collect personal data from children. If you believe a child has provided us
              data, contact <Link href="mailto:privacy@basethesis.com">privacy@basethesis.com</Link> and
              we will delete it.
            </p>
          </Section>

          <Section n="10" title="Cookies and similar technologies">
            <p>
              The Synth website and web chat use strictly necessary cookies to keep you signed in and to
              secure sessions. We may also use limited analytics cookies to understand aggregate product
              usage. We do not use advertising cookies. You can control cookies through your browser
              settings.
            </p>
          </Section>

          <Section n="11" title="Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. If we make material changes —
              particularly to how we handle Google user data — we will notify you by email and, where
              required, prompt you to consent to the updated policy before the new practices take effect.
              The "Last updated" date at the top reflects the most recent revision.
            </p>
          </Section>

          <Section n="12" title="Contact">
            <p>
              For any privacy question or request, contact{' '}
              <Link href="mailto:privacy@basethesis.com">privacy@basethesis.com</Link>. For general
              support, <Link href="mailto:engg@basethesis.com">engg@basethesis.com</Link>.
            </p>
          </Section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-20 border-t border-ink-border pt-12">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">{n}</span>
        <h2 className="font-sans text-2xl font-medium tracking-tight text-ink-text md:text-[28px]">
          {title}
        </h2>
      </div>
      <div className="mt-6 space-y-5 font-sans text-[15px] leading-[1.7] text-ink-dim">{children}</div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-8 font-sans text-[17px] font-medium text-ink-text">{children}</h3>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 marker:text-ink-muted">{children}</ul>;
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="text-accent underline decoration-ink-border underline-offset-4 transition-colors hover:decoration-accent"
    >
      {children}
    </a>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="text-ink-text">{children}</span>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-sm border border-ink-border bg-ink-surface px-1.5 py-0.5 font-mono text-[12px] text-ink-text">
      {children}
    </code>
  );
}

function Callout({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className={`mt-2 rounded-sm border ${
        accent ? 'border-accent/40 bg-accent/[0.04]' : 'border-ink-border bg-ink-surface/60'
      } border-l-2 ${accent ? 'border-l-accent' : 'border-l-ink-dim'} p-6`}
    >
      {children}
    </div>
  );
}

function ScopeRow({
  scope,
  why,
  last,
}: {
  scope: React.ReactNode;
  why: string;
  last?: boolean;
}) {
  return (
    <tr className={last ? '' : 'border-b border-ink-border'}>
      <td className="w-2/5 p-3 align-top">{scope}</td>
      <td className="p-3 align-top">{why}</td>
    </tr>
  );
}
