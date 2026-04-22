import { Footer } from './Footer';
import { Nav } from './Nav';

export function Terms() {
  return (
    <div className="relative">
      <Nav />
      <main className="relative z-10 pt-32 pb-24">
        <article className="container-x max-w-3xl">
          <div className="micro-label">Legal / Terms of Service</div>
          <h1 className="mt-6 font-sans text-4xl font-medium leading-[1.05] tracking-tight text-ink-text md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-micro text-ink-muted">
            Effective 22 April 2026 · Last updated 22 April 2026
          </p>

          <div className="mt-12 space-y-6 font-sans text-[15px] leading-[1.7] text-ink-dim">
            <p>
              These Terms of Service ("Terms") form a binding agreement between{' '}
              <Strong>BaseThesis</Strong> ("BaseThesis", "we", "us", "our") and you, the user ("you",
              "your"), governing your access to and use of <Strong>Synth</Strong> — the AI operations
              assistant available at <Link href="https://getsynth.io">getsynth.io</Link> and through
              messaging channels we operate (the "Service").
            </p>
            <p>
              By creating a Synth account, connecting a Google or Microsoft account, or using the Service
              in any way, you agree to these Terms and to our <Link href="/privacy">Privacy Policy</Link>.
              If you do not agree, do not use the Service.
            </p>
          </div>

          <Section n="01" title="The Service">
            <p>
              Synth is an AI-powered operations assistant. You can interact with Synth through a web chat
              and through messaging channels (for example, Telegram). With your authorisation, Synth
              connects to third-party productivity services — such as Google Workspace and Microsoft 365
              — to perform tasks you direct it to perform, such as reading and drafting emails, managing
              calendar events, and working with documents and spreadsheets.
            </p>
            <p>
              Synth is software that uses large language models. Its outputs are generated and may
              contain errors. <Strong>You are responsible for reviewing Synth's outputs and actions
              before relying on them for any consequential decision.</Strong>
            </p>
          </Section>

          <Section n="02" title="Eligibility and account">
            <Ul>
              <li>You must be at least 18 years old, or the age of majority in your jurisdiction, to use Synth.</li>
              <li>You must provide accurate information and keep your account credentials confidential. You are solely responsible for all activity under your account.</li>
              <li>We may suspend or terminate your access with or without notice if you violate these Terms, if your activity creates risk or liability, or for any lawful reason in our reasonable discretion.</li>
              <li>If you use Synth on behalf of an organisation, you represent that you are authorised to bind that organisation to these Terms.</li>
            </Ul>
          </Section>

          <Section n="03" title="Third-party connected accounts">
            <p>
              When you connect a Google or Microsoft account to Synth, you authorise Synth to access
              specific data and perform specific actions on your behalf, strictly within the scopes you
              grant. The data we access, and the purposes for which we use it, are described in our{' '}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
            <p>You may revoke Synth's access to any connected account at any time:</p>
            <Ul>
              <li>Google: <Link href="https://myaccount.google.com/permissions">https://myaccount.google.com/permissions</Link></li>
              <li>Microsoft: <Link href="https://account.live.com/consent/Manage">https://account.live.com/consent/Manage</Link></li>
            </Ul>
            <p>
              Your use of connected services remains subject to the terms and policies of those services.
              BaseThesis is not responsible for the availability, content, or practices of any third-party
              service you connect to Synth.
            </p>
          </Section>

          <Section n="04" title="Acceptable use">
            <p>You agree not to use Synth to:</p>
            <Ul>
              <li>violate any law, regulation, or third-party right, including intellectual-property rights;</li>
              <li>send spam, unsolicited commercial messages, or bulk mail that your recipients have not consented to receive;</li>
              <li>impersonate any person or entity, or misrepresent your affiliation with a person or entity;</li>
              <li>probe, scan, or test the vulnerability of the Service, or breach security or authentication measures;</li>
              <li>reverse engineer, decompile, or attempt to extract the source code of the Service, except as applicable law expressly permits;</li>
              <li>generate or transmit content that is unlawful, defamatory, harassing, discriminatory, sexually explicit involving minors, or that facilitates violence or self-harm;</li>
              <li>use Synth to develop a competing product or service, or to benchmark or train machine-learning models based on the Service or its outputs;</li>
              <li>abuse, overload, or disrupt the Service, or circumvent rate limits or usage controls;</li>
              <li>scrape or harvest data from the Service by automated means; or</li>
              <li>use Synth in connection with any high-risk activity where failure could result in death, personal injury, or severe environmental or property damage.</li>
            </Ul>
          </Section>

          <Section n="05" title="Sensitive Information — scope of the Service">
            <Callout accent>
              <div className="micro-label text-accent">Scope notice</div>
              <p className="mt-3">
                Synth is a general-purpose productivity assistant. It is{' '}
                <Strong>not designed, certified, or offered</Strong> as a platform for the storage or
                processing of the following categories of sensitive information (collectively,{' '}
                <Strong>"Sensitive Information"</Strong>):
              </p>
              <Ul>
                <li>Protected health information as defined under HIPAA or equivalent health-data laws;</li>
                <li>Special categories of personal data under Article 9 of the EU GDPR (including racial or ethnic origin, political opinions, religious or philosophical beliefs, trade-union membership, genetic or biometric data, health, or data concerning sex life or sexual orientation);</li>
                <li>Government identifiers such as Aadhaar, PAN, Social Security, driver's-licence, or passport numbers;</li>
                <li>Full payment-card numbers, bank-account credentials, or other data regulated under PCI DSS or the Gramm-Leach-Bliley Act;</li>
                <li>Information from users under 13 (or the minimum age in your jurisdiction), regulated under COPPA or equivalent laws;</li>
                <li>Data subject to attorney-client privilege, third-party trade secrets, or classified government information.</li>
              </Ul>
              <p className="mt-4">
                You agree not to upload, submit, transmit, or instruct Synth to process Sensitive
                Information, and you acknowledge that BaseThesis is not a HIPAA business associate and
                that the Service is not offered under any compliance regime specific to Sensitive
                Information. If you nevertheless require Synth to process such data (for example, because
                it is present in an email Synth reads on your behalf), you do so at your own risk and you
                indemnify BaseThesis for all resulting claims.
              </p>
            </Callout>
          </Section>

          <Section n="06" title="Your content and rights">
            <p>
              <Strong>6.1 Your Content.</Strong> As between you and BaseThesis, you retain all rights in
              the content you provide to Synth and in the content Synth generates for you (together,
              "Your Content"). BaseThesis does not claim ownership of Your Content.
            </p>
            <p>
              <Strong>6.2 Licence to operate the Service.</Strong> You grant BaseThesis a worldwide,
              non-exclusive, royalty-free licence to host, store, reproduce, transmit, display, and
              create derivative works of Your Content solely as needed to provide, secure, and improve
              the Service for you. This licence ends when you delete the content or your account, subject
              to the retention periods in the Privacy Policy.
            </p>
            <p>
              <Strong>6.3 No training on Your Content or Google/Microsoft user data.</Strong> We do not
              use Your Content, and we do not use any data obtained from your connected Google or
              Microsoft account, to train, fine-tune, or improve generalised artificial-intelligence or
              machine-learning models — our own or any third party's.
            </p>
            <p>
              <Strong>6.4 Synth Output.</Strong> Subject to your compliance with these Terms, you may use
              the output Synth generates for you ("Output") for any lawful purpose. You acknowledge and
              agree that:
            </p>
            <Ul>
              <li>your use of the Service and the Output does not transfer to you any intellectual-property rights in the Service itself;</li>
              <li>Output is generated by machine-learning models and may be inaccurate, incomplete, or otherwise unsuited to your purpose — Output can contain "hallucinations" and you are responsible for evaluating accuracy and fitness for your use case, including by human review;</li>
              <li>because Output is generated probabilistically, the same or similar Output may be produced for other users, and Output is not guaranteed to be unique;</li>
              <li>you will not represent that Output was authored by a human when it was not; and</li>
              <li>you will not use Output to train, fine-tune, or benchmark any machine-learning model, or to develop a product that competes with Synth.</li>
            </Ul>
            <p>
              <Strong>6.5 Usage Data.</Strong> We may collect diagnostic, technical, performance, and
              usage information about your use of the Service (collectively, "Usage Data"). As between
              you and BaseThesis, Usage Data belongs to BaseThesis, and to the extent any rights in Usage
              Data vest in you, you irrevocably assign those rights to BaseThesis. We may use Usage Data
              to provide, secure, improve, and analyse the Service, and to publish aggregated or
              de-identified metrics that do not identify you.
            </p>
            <p>
              <Strong>6.6 Feedback.</Strong> If you provide us any suggestions, ideas, or feedback about
              the Service ("Feedback"), you grant BaseThesis a perpetual, irrevocable, worldwide,
              royalty-free licence to use the Feedback for any purpose, and you waive any claim to
              attribution or compensation.
            </p>
          </Section>

          <Section n="07" title="Plans, payment, and billing">
            <p>
              Synth is offered on paid subscription plans, and may also offer a limited free or trial
              tier. Plan pricing and included features are displayed at the point of purchase and may be
              updated from time to time on at least 30 days' prior notice.
            </p>
            <Ul>
              <li>
                <Strong>Billing cycle.</Strong> Subscriptions renew automatically at the end of each
                billing period (monthly or quarterly, as applicable) unless cancelled beforehand.{' '}
                <span className="text-ink-text">
                  Unless you cancel, your subscription and the corresponding fee will automatically renew
                  at the end of each billing period, and you authorise us and our payment processor to
                  charge your payment method the then-current fee and any applicable taxes.
                </span>
              </li>
              <li><Strong>Payment processor.</Strong> Payments are processed by third-party processors such as Razorpay. By subscribing, you agree to the processor's terms as well as ours.</li>
              <li><Strong>Taxes.</Strong> Prices are exclusive of GST, VAT, and other applicable taxes, which will be added where required by law.</li>
              <li><Strong>Refunds.</Strong> Except where required by law, fees paid are non-refundable. If you believe you have been charged in error, contact <Link href="mailto:engg@basethesis.com">engg@basethesis.com</Link> within 14 days.</li>
              <li><Strong>Usage-based charges.</Strong> If your plan includes usage-based components (for example, AI credits), you agree to pay the applicable charges as they accrue. We will notify you when you approach plan limits.</li>
              <li><Strong>Cancellation.</Strong> You may cancel at any time through your account settings or by writing to <Link href="mailto:engg@basethesis.com">engg@basethesis.com</Link>. Cancellation takes effect at the end of the current billing period; prior charges are non-refundable except as required by law.</li>
            </Ul>
          </Section>

          <Section n="08" title="Suspension and termination">
            <p>
              We may suspend or terminate your access to the Service, immediately and without refund, if
              you (a) breach these Terms, (b) use Synth in a way that creates risk or liability for us or
              for other users, (c) fail to pay amounts when due, or (d) the Service is discontinued. On
              termination, your right to access the Service ends. We will delete your data in accordance
              with the retention periods in the Privacy Policy.
            </p>
          </Section>

          <Section n="09" title="Availability, changes, and beta features">
            <p>
              We work hard to keep Synth reliable, but we do not guarantee uninterrupted or error-free
              operation. We may change, add, or remove features, and may introduce beta or experimental
              features. Beta features are offered "as-is", may be unstable, and may be changed or
              withdrawn at any time.
            </p>
          </Section>

          <Section n="10" title="Intellectual property">
            <p>
              The Service, including its software, content, logos, and trademarks (other than Your
              Content), is owned by BaseThesis or its licensors and is protected by intellectual-property
              laws. Except for the limited rights granted in these Terms, we do not grant you any rights
              in the Service.
            </p>
          </Section>

          <Section n="11" title="Publicity">
            <p>
              We may identify you as a Synth user or customer in our promotional materials, including by
              displaying your name or logo. If you do not want us to do so, email{' '}
              <Link href="mailto:engg@basethesis.com">engg@basethesis.com</Link> and we will
              promptly stop.
            </p>
          </Section>

          <Section n="12" title="Third-party services">
            <p>
              Synth integrates with third-party services (for example, Google Workspace, Microsoft 365,
              Telegram, Razorpay, and AI model providers). Those services are subject to their own terms.
              BaseThesis is not responsible for third-party services, and you expressly release
              BaseThesis from any liability arising from your use of, or inability to use, any
              third-party service in connection with Synth.
            </p>
          </Section>

          <Section n="13" title="Export controls and sanctions">
            <p>
              You agree to comply with all applicable export-control and sanctions laws, including those
              administered by India, the United States (the Export Administration Regulations and the
              U.S. Treasury Office of Foreign Assets Control), and the European Union. You represent and
              warrant that you are not located in, or a national or resident of, any country or territory
              subject to comprehensive sanctions, and that you are not listed on any list of sanctioned
              or restricted parties. You will not use the Service for any purpose prohibited by
              applicable export-control or sanctions law.
            </p>
          </Section>

          <Section n="14" title="Disclaimers">
            <Callout accent>
              <p>
                To the maximum extent permitted by law, the Service is provided{' '}
                <Strong>"as is" and "as available"</Strong>, without warranties of any kind, whether
                express, implied, or statutory, including warranties of merchantability, fitness for a
                particular purpose, non-infringement, and accuracy of AI-generated outputs. BaseThesis
                does not warrant that the Service will be uninterrupted, secure, or error-free, that
                defects will be corrected, or that the Service is free of viruses or other harmful
                components. You use Synth at your own risk. You are responsible for reviewing Synth's
                outputs before acting on them, especially where the stakes are significant — for example,
                sending emails on your behalf, modifying calendar events, or editing documents.
              </p>
            </Callout>
          </Section>

          <Section n="15" title="Limitation of liability">
            <p>
              To the maximum extent permitted by law, BaseThesis and its affiliates, officers, employees,
              contractors, and agents will not be liable for any indirect, incidental, special,
              consequential, exemplary, or punitive damages, including loss of profits, revenue, data,
              goodwill, or business opportunity, arising out of or related to the Service, even if we
              have been advised of the possibility of such damages.
            </p>
            <p>
              Our total cumulative liability for all claims relating to the Service in any 12-month
              period is limited to the greater of <Strong>(a) the fees you paid to BaseThesis for the
              Service in the 12 months preceding the event giving rise to the claim, and (b) INR
              10,000</Strong>.
            </p>
            <p>
              Nothing in these Terms excludes or limits liability that cannot be excluded or limited
              under applicable law (including, where applicable, liability for gross negligence, wilful
              misconduct, fraud, or personal injury).
            </p>
          </Section>

          <Section n="16" title="Indemnity">
            <p>
              You will defend, indemnify, and hold harmless BaseThesis and its affiliates, officers,
              employees, contractors, and agents from any claim, demand, loss, or damages, including
              reasonable legal fees, arising out of or related to: (a) your access to or use of the
              Service; (b) your violation of these Terms; (c) your violation of any third-party right,
              including any privacy or intellectual-property right; (d) your violation of any applicable
              law, including export-control and sanctions laws; (e) Your Content; (f) your submission or
              processing of Sensitive Information via the Service; or (g) any third party's access to the
              Service using your credentials.
            </p>
          </Section>

          <Section n="17" title="Governing law and dispute resolution">
            <p>
              These Terms are governed by the laws of India, without regard to conflict-of-laws
              principles. The courts located in Bengaluru, Karnataka, India, will have exclusive
              jurisdiction over any dispute arising out of or relating to these Terms or the Service,
              except that either party may seek injunctive relief in any court of competent jurisdiction
              to protect its intellectual-property or confidential-information rights. The application of
              the United Nations Convention on Contracts for the International Sale of Goods is expressly
              excluded.
            </p>
          </Section>

          <Section n="18" title="Changes to these Terms">
            <p>
              We may update these Terms from time to time. If we make material changes, we will notify
              you by email or through the Service at least 14 days before the changes take effect. Your
              continued use of the Service after the effective date constitutes acceptance of the updated
              Terms. If you do not agree, stop using the Service before the effective date.
            </p>
          </Section>

          <Section n="19" title="Miscellaneous">
            <Ul>
              <li><Strong>Entire agreement.</Strong> These Terms and the Privacy Policy constitute the entire agreement between you and BaseThesis regarding the Service and supersede any prior agreements.</li>
              <li><Strong>Severability.</Strong> If any provision of these Terms is found unenforceable, the remaining provisions will remain in effect.</li>
              <li><Strong>No waiver.</Strong> Our failure to enforce any right or provision is not a waiver of that right or provision.</li>
              <li><Strong>Assignment.</Strong> You may not assign these Terms without our prior written consent. We may assign them in connection with a merger, acquisition, or sale of assets.</li>
              <li><Strong>Notices.</Strong> We may provide notices to you by email or through the Service. You may send notices to us at <Link href="mailto:engg@basethesis.com">engg@basethesis.com</Link>.</li>
              <li><Strong>Language.</Strong> These Terms are drafted in English, which is the governing language in the event of any translation.</li>
            </Ul>
          </Section>

          <Section n="20" title="Contact">
            <p>
              Questions about these Terms? Email{' '}
              <Link href="mailto:engg@basethesis.com">engg@basethesis.com</Link>.
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
