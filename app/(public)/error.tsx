'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Public site error:', error)
  }, [error])

  return (
    <section className="err-section">
      <div className="err-content">
        <p className="err-eyebrow">
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Something went wrong
        </p>
        <h1 className="err-title">
          A small <em>hiccup.</em>
        </h1>
        <p className="err-sub">
          Something unexpected happened loading this page. It&apos;s not you — try again, or head back home.
        </p>
        <div className="err-links">
          <button onClick={() => reset()} className="btn-accent" style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Try Again →</button>
          <Link href="/" className="btn-ghost">Back to Home</Link>
        </div>
      </div>

      <style>{`
        .err-section {
          min-height: calc(100svh - 64px);
          display: flex; align-items: center;
          padding: 48px;
        }
        .err-content { max-width: 560px; }
        .err-eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; display: flex; align-items: center; gap: 12px; font-weight: 600; }
        .err-title { font-family: var(--font-heading); font-size: clamp(40px, 6vw, 72px); font-weight: 400; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 24px; }
        .err-title em { color: var(--accent); font-style: italic; }
        .err-sub { font-size: 16px; line-height: 1.8; color: var(--fg-muted); margin-bottom: 36px; }
        .err-links { display: flex; gap: 16px; flex-wrap: wrap; }

        .btn-accent { display: inline-block; padding: 14px 32px; background: var(--accent); color: white; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: background 0.2s, transform 0.2s, box-shadow 0.3s; }
        .btn-accent:hover { background: #a01830; transform: translateY(-2px); box-shadow: 0 8px 24px -6px rgba(196, 30, 58, 0.45); }
        .btn-ghost { display: inline-block; padding: 14px 28px; border: 1px solid var(--border); color: var(--fg-muted); font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .btn-ghost:hover { border-color: var(--fg); color: var(--fg); }

        @media(max-width: 767px) {
          .err-section { padding: 24px 20px; }
        }
      `}</style>
    </section>
  )
}
