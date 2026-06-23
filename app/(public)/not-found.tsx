import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="nf-section">
      <span className="nf-bg-letter">N</span>
      <svg className="reg-mark reg-mark-tl" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="7" /><line x1="16" y1="0" x2="16" y2="32" /><line x1="0" y1="16" x2="32" y2="16" />
      </svg>

      <div className="nf-content">
        <p className="nf-eyebrow">
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          404
        </p>
        <h1 className="nf-title">
          Page not<br /><em>found.</em>
        </h1>
        <p className="nf-sub">
          The page you&apos;re looking for doesn&apos;t exist, or may have moved.
        </p>
        <div className="nf-links">
          <Link href="/" className="btn-accent">Back to Home →</Link>
          <Link href="/work" className="btn-ghost">See My Work</Link>
        </div>
      </div>

      <style>{`
        .nf-section {
          min-height: calc(100svh - 64px);
          display: flex; align-items: center;
          padding: 48px;
          position: relative; overflow: hidden;
        }
        .nf-bg-letter {
          position: absolute; bottom: -60px; right: -20px;
          font-family: var(--font-heading); font-style: italic; font-weight: 700;
          font-size: clamp(200px, 35vw, 500px); color: var(--border); line-height: 1;
          user-select: none; pointer-events: none;
        }
        .reg-mark { position: absolute; width: 26px; height: 26px; stroke: var(--accent); stroke-width: 1; fill: none; opacity: 0.4; }
        .reg-mark-tl { top: 28px; left: 28px; }

        .nf-content { position: relative; z-index: 1; max-width: 560px; }
        .nf-eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; display: flex; align-items: center; gap: 12px; font-weight: 600; }
        .nf-title { font-family: var(--font-heading); font-size: clamp(48px, 8vw, 100px); font-weight: 400; line-height: 1.0; letter-spacing: -0.02em; margin-bottom: 24px; }
        .nf-title em { color: var(--accent); font-style: italic; }
        .nf-sub { font-size: 16px; line-height: 1.8; color: var(--fg-muted); margin-bottom: 36px; }
        .nf-links { display: flex; gap: 16px; flex-wrap: wrap; }

        .btn-accent { display: inline-block; padding: 14px 32px; background: var(--accent); color: white; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: background 0.2s, transform 0.2s, box-shadow 0.3s; }
        .btn-accent:hover { background: #a01830; transform: translateY(-2px); box-shadow: 0 8px 24px -6px rgba(196, 30, 58, 0.45); }
        .btn-ghost { display: inline-block; padding: 14px 28px; border: 1px solid var(--border); color: var(--fg-muted); font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .btn-ghost:hover { border-color: var(--fg); color: var(--fg); }

        @media(max-width: 767px) {
          .nf-section { padding: 24px 20px; }
          .reg-mark-tl { top: 16px; left: 16px; width: 20px; height: 20px; }
        }
      `}</style>
    </section>
  )
}
