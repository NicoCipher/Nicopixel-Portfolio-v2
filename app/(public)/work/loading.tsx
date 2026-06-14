export default function WorkLoading() {
  return (
    <div>
      {/* Filter bar skeleton */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 48px', height: 56,
        display: 'flex', alignItems: 'center', gap: 32,
      }}>
        {['All', 'Brand', 'Events', 'Print'].map(l => (
          <div key={l} style={{ width: 60, height: 12, borderRadius: 2, background: 'var(--border)', opacity: 0.5 }} />
        ))}
      </div>

      <div style={{ padding: '48px 48px 80px' }}>
        {/* Featured skeleton */}
        <div style={{
          width: '100%', aspectRatio: '21/9',
          background: 'var(--bg-secondary)',
          backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)',
          backgroundSize: '200% 100%',
          animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
          marginBottom: 3,
        }} />

        {/* Grid skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
          {Array(6).fill(null).map((_, i) => (
            <div key={i} style={{
              aspectRatio: '4/3',
              background: 'var(--bg-secondary)',
              backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)',
              backgroundSize: '200% 100%',
              animation: `skeleton-shimmer 1.4s ease-in-out ${i * 0.1}s infinite`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width: 767px) {
          div[style*="padding: 48px 48px"] { padding: 16px !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="padding: 0 48px"] { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  )
}
