'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setStatus('error'); return }
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="contact-section">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Contact
        </p>

        <div className="contact-grid">
          {/* Left — info */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400, lineHeight: 1.05, marginBottom: 24,
            }}>
              Let&apos;s work<br /><em>together.</em>
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--fg-muted)', marginBottom: 28 }}>
              Have a project in mind? A brand to build, an event to design for, or print to produce? Let&apos;s talk.
            </p>
            <Link href="/book-a-call" className="contact-book-link">
              Prefer to talk it through? <span className="contact-book-arrow">Book a free call →</span>
            </Link>
            <div style={{ marginTop: 40 }}>
            {[
              { label: 'Email', value: 'nicopixelll@gmail.com' },
              { label: 'Location', value: 'Lagos, Nigeria' },
              { label: 'Response', value: 'Within 24 hours' },
            ].map(item => (
              <div key={item.label} style={{
                padding: '18px 0', borderBottom: '1px solid var(--border)',
                display: 'flex', gap: 32, alignItems: 'baseline',
              }}>
                <span style={{
                  fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--fg-subtle)', width: 72, flexShrink: 0,
                }}>{item.label}</span>
                <span style={{ fontSize: 14, color: 'var(--fg-muted)' }}>{item.value}</span>
              </div>
            ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {status === 'success' ? (
              <div style={{
                padding: '48px 40px', border: '1px solid var(--border)',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-heading)', fontSize: 28,
                  fontStyle: 'italic', marginBottom: 12,
                }}>Message sent.</p>
                <p style={{ fontSize: 14, color: 'var(--fg-muted)' }}>
                  I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" placeholder="Your name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="your@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" placeholder="Brand identity project" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-input form-textarea"
                    rows={6} placeholder="Tell me about your project..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                </div>

                {error && <p style={{ fontSize: 13, color: 'var(--accent)' }}>{error}</p>}

                <button type="submit" disabled={status === 'sending'} className="form-submit">
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-book-link {
          display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap;
          font-size: 13px; color: var(--fg-muted); text-decoration: none;
          padding: 14px 18px; border: 1px solid var(--border);
          transition: border-color 0.2s, background 0.2s;
        }
        .contact-book-link:hover { border-color: var(--accent); background: var(--bg-secondary); }
        .contact-book-arrow { color: var(--accent); font-weight: 600; letter-spacing: 0.02em; }
        .contact-section {
          min-height: calc(100vh - 64px);
          padding: 80px 48px;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          margin-top: 60px;
          align-items: start;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--fg-subtle);
          margin-bottom: 8px;
        }
        .form-input {
          width: 100%;
          padding: 12px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border);
          color: var(--fg);
          font-size: 15px;
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.2s;
          -webkit-appearance: none;
        }
        .form-input:focus { border-bottom-color: var(--accent); }
        .form-input::placeholder { color: var(--fg-subtle); }
        .form-textarea { resize: none; }
        .form-submit {
          align-self: flex-start;
          padding: 14px 40px;
          background: var(--fg);
          color: var(--bg);
          border: none;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-family: var(--font-body);
          transition: background 0.2s;
        }
        .form-submit:hover { background: var(--accent); }
        .form-submit:disabled { background: var(--fg-subtle); }

        @media (max-width: 767px) {
          .contact-section { padding: 60px 24px; }
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 52px;
            margin-top: 40px;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .form-submit { width: 100%; text-align: center; }
        }
      `}</style>
    </section>
  )
}
