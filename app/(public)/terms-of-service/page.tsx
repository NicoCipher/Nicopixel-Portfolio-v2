import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms governing use of the Nicopixel website and design services.',
  robots: { index: false, follow: true },
}

const LAST_UPDATED = 'June 2026'

export default function TermsOfServicePage() {
  return (
    <section className="legal-page">
      <div className="legal-header">
        <p className="legal-eyebrow">
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Legal
        </p>
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="legal-body">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of this website and any design services
          provided by Nicopixel (&quot;I&quot;, &quot;me&quot;, or &quot;Nicopixel&quot;). By using this site or engaging my
          services, you agree to these Terms.
        </p>

        <h2>1. Use of This Website</h2>
        <p>
          This website is provided to showcase design work and allow prospective clients to get in
          touch. You agree to use the site only for lawful purposes and not to attempt to disrupt,
          hack, or misuse it in any way, including any attempt to access the admin panel without
          authorisation.
        </p>

        <h2>2. Intellectual Property</h2>
        <p>
          All content on this website — including but not limited to logos, brand designs, layouts,
          images, and written content — is the intellectual property of Nicopixel or the respective
          clients featured, and is protected by copyright. Nothing on this site may be copied,
          reproduced, or used without prior written permission, except for the purpose of normal
          browsing.
        </p>
        <p>
          Project work displayed in the portfolio remains the property of Nicopixel for showcase
          purposes unless otherwise agreed with the client in writing, separate from these Terms.
        </p>

        <h2>3. Design Services</h2>
        <p>
          Specific terms for individual design projects — including scope, timeline, revisions,
          pricing, and final deliverables — are agreed separately with each client before work
          begins, typically via written communication (email or messaging) or a project agreement.
          These Terms apply generally to the website and do not replace a specific project agreement.
        </p>
        <p>General principles that apply to all engagements:</p>
        <ul>
          <li>
            Project scope, timeline, and pricing are confirmed before work commences, based on the
            brief discussed.
          </li>
          <li>
            Revision rounds are included as agreed for each project. Requests significantly outside
            the original brief may be treated as additional scope.
          </li>
          <li>
            Final files and deliverables are provided upon full completion of the agreed payment
            terms.
          </li>
          <li>
            Ownership of final, delivered design work transfers to the client upon full payment,
            unless otherwise agreed. Working files, drafts, and unused concepts remain the property
            of Nicopixel.
          </li>
        </ul>

        <h2>4. Payments</h2>
        <p>
          Payments for design services are currently handled manually and directly between Nicopixel
          and the client (for example, via bank transfer), as agreed for each individual project.
          This website does not process or store any payment information.
        </p>

        <h2>5. No Guarantee of Results</h2>
        <p>
          While every effort is made to deliver design work that meets a client&apos;s goals, Nicopixel
          does not guarantee specific business outcomes (such as sales increases or audience growth)
          resulting from design work, as these depend on many factors outside of design alone.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          This website and the information on it are provided on an &quot;as is&quot; basis. Nicopixel makes
          reasonable efforts to keep the site accurate and functioning, but does not guarantee
          uninterrupted access or that the site will always be free of errors. To the extent
          permitted by law, Nicopixel is not liable for any indirect or consequential loss arising
          from use of this website.
        </p>

        <h2>7. External Links</h2>
        <p>
          This site may contain links to external platforms (such as Instagram, Behance, or
          LinkedIn). Nicopixel is not responsible for the content or practices of these external
          sites.
        </p>

        <h2>8. Changes to These Terms</h2>
        <p>
          These Terms may be updated from time to time. Continued use of the site after changes are
          posted constitutes acceptance of the revised Terms. The &quot;Last updated&quot; date above
          reflects the most recent revision.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to
          conflict of law principles.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about these Terms can be sent via the <a href="/contact">Contact page</a>.
        </p>
      </div>

      <style>{`
        .legal-page { padding: 80px 48px 100px; max-width: 760px; margin: 0 auto; }
        .legal-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .legal-title { font-family: var(--font-heading); font-size: clamp(36px, 5vw, 64px); font-weight: 400; line-height: 1.05; margin-bottom: 12px; }
        .legal-updated { font-size: 12px; color: var(--fg-subtle); letter-spacing: 0.04em; margin-bottom: 56px; }
        .legal-header { margin-bottom: 0; }
        .legal-body p { font-size: 15px; line-height: 1.85; color: var(--fg-muted); margin-bottom: 20px; }
        .legal-body h2 { font-family: var(--font-heading); font-size: 22px; font-weight: 400; color: var(--fg); margin: 48px 0 16px; }
        .legal-body ul { margin: 0 0 20px; padding-left: 22px; display: flex; flex-direction: column; gap: 10px; }
        .legal-body li { font-size: 15px; line-height: 1.8; color: var(--fg-muted); }
        .legal-body strong { color: var(--fg); font-weight: 600; }
        .legal-body a { color: var(--accent); text-decoration: underline; }

        @media(max-width: 767px) {
          .legal-page { padding: 56px 20px 72px; }
          .legal-updated { margin-bottom: 40px; }
          .legal-body h2 { margin: 36px 0 14px; }
        }
      `}</style>
    </section>
  )
}
