import type { Metadata } from 'next'
import { BookingEmbed } from '@/components/sections/BookingEmbed'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Book a Call',
  description: 'Book a free 20-minute discovery call with Nicopixel to talk through your brand, events, or print project.',
}

export default function BookACallPage() {
  return (
    <section className="book-page">
      <div className="book-header">
        <p className="book-eyebrow">
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Book a Call
        </p>
        <h1 className="book-title">
          Let&apos;s talk about<br /><em>your project.</em>
        </h1>
        <p className="book-subtitle">
          A free 20-minute discovery call — no pressure, no commitment. Just a conversation about
          what you need and whether we&apos;re a good fit to work together.
        </p>

        <div className="book-points">
          <div className="book-point">
            <span className="book-point-num">01</span>
            <span className="book-point-text">Tell me about your business and goals</span>
          </div>
          <div className="book-point">
            <span className="book-point-num">02</span>
            <span className="book-point-text">I&apos;ll ask questions to understand the real challenge</span>
          </div>
          <div className="book-point">
            <span className="book-point-num">03</span>
            <span className="book-point-text">You&apos;ll leave with clarity on next steps — pricing, timeline, scope</span>
          </div>
        </div>

        <p className="book-alt">
          Prefer to write instead? <Link href="/contact">Send a message</Link>.
        </p>
      </div>

      <div className="book-embed-wrap">
        <BookingEmbed />
      </div>

      <style>{`
        .book-page {
          display: grid;
          grid-template-columns: 420px 1fr;
          min-height: calc(100vh - 64px);
        }
        .book-header {
          padding: 72px 48px;
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column; justify-content: center;
        }
        .book-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .book-title { font-family: var(--font-heading); font-size: clamp(34px, 4.5vw, 56px); font-weight: 400; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 20px; }
        .book-title em { color: var(--accent); font-style: italic; }
        .book-subtitle { font-size: 15px; line-height: 1.8; color: var(--fg-muted); margin-bottom: 40px; }
        .book-points { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
        .book-point { display: flex; align-items: flex-start; gap: 14px; }
        .book-point-num { font-family: var(--font-heading); font-size: 11px; color: var(--accent); letter-spacing: 0.14em; flex-shrink: 0; padding-top: 2px; }
        .book-point-text { font-size: 13px; line-height: 1.6; color: var(--fg-muted); }
        .book-alt { font-size: 13px; color: var(--fg-subtle); }
        .book-alt a { color: var(--accent); text-decoration: underline; }

        .book-embed-wrap {
          padding: 48px;
          display: flex; align-items: stretch;
          min-height: 600px;
        }

        @media(max-width: 1024px) {
          .book-page { grid-template-columns: 1fr; }
          .book-header { border-right: none; border-bottom: 1px solid var(--border); padding: 56px 40px; }
        }
        @media(max-width: 767px) {
          .book-header { padding: 48px 20px 40px; }
          .book-embed-wrap { padding: 24px 16px 56px; min-height: 500px; }
        }
      `}</style>
    </section>
  )
}
