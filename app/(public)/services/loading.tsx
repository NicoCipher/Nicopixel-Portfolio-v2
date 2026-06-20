export default function ServicesLoading() {
  return (
    <div>
      <div className="svc-loading-header px-page">
        <div className="shimmer" style={{ width: 120, height: 11, borderRadius: 2, marginBottom: 20 }} />
        <div className="shimmer" style={{ width: '50%', height: 56, borderRadius: 2, marginBottom: 20 }} />
        <div className="shimmer" style={{ width: 420, height: 16, borderRadius: 2 }} />
      </div>

      <div className="svc-loading-cards px-page">
        {[0, 1, 2].map(i => (
          <div key={i} className="svc-loading-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="shimmer" style={{ width: 30, height: 11, borderRadius: 2, marginBottom: 16 }} />
            <div className="shimmer" style={{ width: '70%', height: 28, borderRadius: 2, marginBottom: 24 }} />
            <div className="shimmer" style={{ width: '100%', height: 60, borderRadius: 2 }} />
          </div>
        ))}
      </div>

      <style>{`
        .svc-loading-header { padding-top: 80px; padding-bottom: 72px; border-bottom: 1px solid var(--border); }
        .svc-loading-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; padding-top: 64px; padding-bottom: 64px; }
        .svc-loading-card { display: flex; flex-direction: column; }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 900px) {
          .svc-loading-cards { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </div>
  )
}
