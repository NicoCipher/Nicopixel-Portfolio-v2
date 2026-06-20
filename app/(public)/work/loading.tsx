export default function WorkLoading() {
  return (
    <div>
      {/* Header */}
      <div className="work-loading-header">
        <div className="shimmer" style={{ width: 140, height: 11, borderRadius: 2, marginBottom: 16 }} />
        <div className="shimmer" style={{ width: 280, height: 48, borderRadius: 2 }} />
      </div>

      {/* Filter bar */}
      <div className="work-loading-filterbar">
        <div className="work-loading-filterbar-inner">
          {['All', 'Brand', 'Events', 'Print'].map((l, i) => (
            <div key={l} style={{ width: 60, height: 10, borderRadius: 2, background: 'var(--border)', opacity: 0.6, animationDelay: `${i * 0.1}s` }} className="shimmer" />
          ))}
        </div>
      </div>

      <div className="work-loading-gallery">
        {/* Featured */}
        <div className="shimmer" style={{ width: '100%', aspectRatio: '21/9', maxHeight: 620, marginBottom: 3, borderRadius: 2 }} />
        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 56, gap: 3 }} className="work-loading-grid">
          <div className="shimmer" style={{ gridColumn: 'span 7', gridRow: 'span 6', borderRadius: 2 }} />
          <div className="shimmer" style={{ gridColumn: 'span 5', gridRow: 'span 6', borderRadius: 2, animationDelay: '0.1s' }} />
          <div className="shimmer" style={{ gridColumn: 'span 4', gridRow: 'span 6', borderRadius: 2, animationDelay: '0.15s' }} />
          <div className="shimmer" style={{ gridColumn: 'span 5', gridRow: 'span 6', borderRadius: 2, animationDelay: '0.2s' }} />
          <div className="shimmer" style={{ gridColumn: 'span 3', gridRow: 'span 6', borderRadius: 2, animationDelay: '0.25s' }} />
        </div>
      </div>

      <style>{`
        .work-loading-header { padding: 60px 48px 40px; border-bottom: 1px solid var(--border); }
        .work-loading-filterbar { border-bottom: 1px solid var(--border); height: 57px; display: flex; align-items: center; }
        .work-loading-filterbar-inner { display: flex; align-items: center; gap: 8px; padding: 0 48px; max-width: 1400px; margin: 0 auto; width: 100%; }
        .work-loading-gallery { padding: 32px 48px 80px; max-width: 1400px; margin: 0 auto; }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 767px) {
          .work-loading-header { padding: 40px 20px 28px; }
          .work-loading-filterbar-inner { padding: 0 20px; }
          .work-loading-gallery { padding: 16px; }
          .work-loading-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}
