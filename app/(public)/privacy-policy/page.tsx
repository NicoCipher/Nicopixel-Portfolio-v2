import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Nicopixel collects, uses, and protects your information.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://nicopixel.vercel.app/privacy-policy' },
}

const LAST_UPDATED = 'June 2026'

export default function PrivacyPolicyPage() {
  return (
    <section className="legal-page">
      <div className="legal-header">
        <p className="legal-eyebrow">
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Legal
        </p>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="legal-body">
        <p>
          Nicopixel (&quot;I&quot;, &quot;me&quot;, or &quot;Nicopixel&quot;) operates this website. This Privacy Policy explains
          what information is collected when you visit, how it is used, and the choices you have.
          By using this site, you agree to the practices described below.
        </p>

        <h2>1. Information I Collect</h2>
        <p>I collect information in the following ways:</p>
        <ul>
          <li>
            <strong>Information you provide directly.</strong> When you use the contact form, I collect
            your name, email address, and any message or project details you choose to share. This
            information is used solely to respond to your enquiry.
          </li>
          <li>
            <strong>Usage data.</strong> Like most websites, this site automatically collects limited
            technical information when you visit — such as the page viewed, referring website, and
            general device type (e.g. mobile or desktop). This data is anonymous and is used only to
            understand which pages are useful and how the site is performing. It is not used to
            identify you personally.
          </li>
          <li>
            <strong>Analytics.</strong> This site uses analytics tools, including Vercel Analytics, to
            measure traffic and site performance in aggregate. These tools do not use invasive
            tracking cookies and do not sell or share data with third parties for advertising
            purposes.
          </li>
        </ul>

        <h2>2. How I Use Your Information</h2>
        <p>Information collected is used to:</p>
        <ul>
          <li>Respond to enquiries submitted through the contact form</li>
          <li>Communicate with you about a potential or ongoing project</li>
          <li>Understand how visitors use the site, so it can be improved over time</li>
          <li>Maintain the security and proper functioning of the site</li>
        </ul>
        <p>
          I do not sell, rent, or trade your personal information to third parties. I do not use your
          information for unsolicited marketing.
        </p>

        <h2>3. How Your Information Is Stored</h2>
        <p>
          Contact form submissions are stored securely using Supabase, a third-party database
          provider, and are only accessible to me as the site administrator. Reasonable technical and
          organisational measures are in place to protect your information, including encrypted
          connections (HTTPS) and access controls on the admin panel.
        </p>

        <h2>4. Third-Party Services</h2>
        <p>
          This site relies on a small number of trusted third-party services to operate, including
          hosting (Vercel), database and storage (Supabase), and transactional email delivery
          (Resend) for forwarding contact form submissions. These providers may process data on my
          behalf strictly to provide their service, and are bound by their own privacy and security
          practices.
        </p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Ask what information is held about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information, where reasonably possible</li>
        </ul>
        <p>
          To exercise any of these rights, contact me directly using the details on the{' '}
          <a href="/contact">Contact page</a>.
        </p>

        <h2>6. Children&apos;s Privacy</h2>
        <p>
          This site is not directed at children under the age of 16, and personal information is not
          knowingly collected from children.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          This Privacy Policy may be updated occasionally to reflect changes to how the site operates
          or for legal reasons. The &quot;Last updated&quot; date at the top of this page will always reflect
          the most recent revision.
        </p>

        <h2>8. Contact</h2>
        <p>
          If you have questions about this Privacy Policy or how your information is handled, please
          get in touch via the <a href="/contact">Contact page</a>.
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
