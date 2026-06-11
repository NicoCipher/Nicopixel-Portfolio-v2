'use client'
import { useState } from 'react'

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

  const inputStyle = {
    width: '100%', padding: '12px 0',
    background: 'transparent', border: 'none',
    borderBottom: '1px solid var(--border)',
    color: 'var(--fg)', fontSize: 15,
    fontFamily: 'var(--font-body)',
    outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <section style={{ minHeight: 'calc(100vh - 64px)', padding: '80px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Contact
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 60, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400, lineHeight: 1.05, marginBottom: 24,
            }}>
              Let&apos;s work<br /><em>together.</em>
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--fg-muted)', marginBottom: 48 }}>
              Have a project in mind? A brand to build, an event to design for, or print to produce? Let&apos;s talk.
            </p>
            {[
              { label: 'Email', value: 'nicopixelll@gmail.com' },
              { label: 'Location', value: 'Lagos, Nigeria' },
              { label: 'Response', value: 'Within 24 hours' },
            ].map(item => (
              <div key={item.label} style={{
                padding: '20px 0', borderBottom: '1px solid var(--border)',
                display: 'flex', gap: 40,
              }}>
                <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-subtle)', width: 80, flexShrink: 0, paddingTop: 2 }}>{item.label}</span>
                <span style={{ fontSize: 14, color: 'var(--fg-muted)' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Right — form */}
          <div>
            {status === 'success' ? (
              <div style={{
                padding: 40, border: '1px solid var(--border)',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-heading)', fontSize: 28,
                  fontStyle: 'italic', marginBottom: 12,
                }}>Message sent.</p>
                <p style={{ fontSize: 14, color: 'var(--fg-muted)' }}>I&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-subtle)', display: 'block', marginBottom: 8 }}>Name</label>
                    <input style={inputStyle} placeholder="Your name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-subtle)', display: 'block', marginBottom: 8 }}>Email</label>
                    <input style={inputStyle} type="email" placeholder="your@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-subtle)', display: 'block', marginBottom: 8 }}>Subject</label>
                  <input style={inputStyle} placeholder="Brand identity project" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-subtle)', display: 'block', marginBottom: 8 }}>Message</label>
                  <textarea style={{ ...inputStyle, resize: 'none' } as React.CSSProperties}
                    rows={6} placeholder="Tell me about your project..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                </div>
                {error && <p style={{ fontSize: 13, color: 'var(--accent)' }}>{error}</p>}
                <button type="submit" disabled={status === 'sending'} style={{
                  alignSelf: 'flex-start',
                  padding: '14px 40px',
                  background: status === 'sending' ? 'var(--fg-subtle)' : 'var(--fg)',
                  color: 'var(--bg)',
                  border: 'none', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  transition: 'background 0.2s',
                }}>
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:767px){ section { padding: 60px 24px !important; } div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
    </section>
  )
}
