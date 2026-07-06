'use client'
import { useState } from 'react'

type Faq = { id: string; question: string; answer: string }

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {faqs.map((faq, i) => {
        const isOpen = open === faq.id
        return (
          <div key={faq.id} style={{
            borderBottom: '1px solid var(--border)',
            borderTop: i === 0 ? '1px solid var(--border)' : 'none',
            transition: 'background 0.25s',
          }}>
            <button
              onClick={() => setOpen(isOpen ? null : faq.id)}
              style={{
                width: '100%', padding: '24px 0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'none', border: 'none', textAlign: 'left',
                fontFamily: 'inherit', cursor: 'pointer', gap: 24,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(16px, 1.8vw, 20px)',
                fontWeight: 400,
                color: isOpen ? 'var(--accent)' : 'var(--fg)',
                lineHeight: 1.3,
                transition: 'color 0.25s',
              }}>{faq.question}</span>
              <span style={{
                width: 28, height: 28, flexShrink: 0,
                border: '1px solid var(--border)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isOpen ? 'var(--accent)' : 'var(--fg-muted)',
                borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
                fontSize: 18, lineHeight: 1,
                transition: 'color 0.25s, border-color 0.25s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              }}>+</span>
            </button>
            <div style={{
              overflow: 'hidden',
              maxHeight: isOpen ? 600 : 0,
              opacity: isOpen ? 1 : 0,
              transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
            }}>
              <p style={{
                fontSize: 15, lineHeight: 1.8,
                color: 'var(--fg-muted)',
                paddingBottom: 24,
                maxWidth: 680,
              }}>{faq.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
