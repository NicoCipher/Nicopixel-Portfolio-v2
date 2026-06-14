export default function WorkLoading() {
  return (
    <div>
      {/* Filter bar */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '0 48px', height: 57, display: 'flex', alignItems: 'center', gap: 8 }}>
        {['All', 'Brand', 'Events', 'Print'].map((l, i) => (
          <div key={l} style={{ width: 60, height: 10, borderRadius: 2, background: 'var(--border)', opacity: 0.6, animationDelay: `${i * 0.1}s` }} className="shimmer" />
        ))}
      </div>

      <div style={{ padding: '32px 48px 80px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Featured */}
        <div className="shimmer" style={{ width: '100%', aspectRatio: '21/9', maxHeight: 620, marginBottom: 3, borderRadius: 2 }} />
        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 56, gap: 3 }}>
          <div className="shimmer" style={{ gridColumn: 'span 7', gridRow: 'span 6', borderRadius: 2 }} />
          <div className="shimmer" style={{ gridColumn: 'span 5', gridRow: 'span 6', borderRadius: 2, animationDelay: '0.1s' }} />
          <div className="shimmer" style={{ gridColumn: 'span 4', gridRow: 'span 6', borderRadius: 2, animationDelay: '0.15s' }} />
          <div className="shimmer" style={{ gridColumn: 'span 5', gridRow: 'span 6', borderRadius: 2, animationDelay: '0.2s' }} />
          <div className="shimmer" style={{ gridColumn: 'span 3', gridRow: 'span 6', borderRadius: 2, animationDelay: '0.25s' }} />
        </div>
      </div>

      <style>{`
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 767px) {
          div[style*="padding: 32px 48px"] { padding: 16px !important; }
          div[style*="repeat(12, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
