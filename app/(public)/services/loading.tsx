export default function ServicesLoading() {
  return (
    <div>
      <div className="svc-loading-header px-page">
        <div className="shimmer" style={{ width: 120, height: 11, borderRadius: 2, marginBottom: 20 }} />
        <div className="shimmer" style={{ width: '50%', height: 56, borderRadius: 2, marginBottom: 20 }} />
        <div className="shimmer" style={{ width: 420, height: 16, borderRadius: 2 }} />
      </div>

      {[0, 1, 2].map(i => (
        <div key={i} className="svc-loading-card" style={{ animationDelay: `${i * 0.08}s` }}>
          <div className="svc-loading-card-inner">
            <div>
              <div className="shimmer" style={{ width: 30, height: 11, borderRadius: 2, marginBottom: 16 }} />
              <div className="shimmer" style={{ width: '70%', height: 36, borderRadius: 2, marginBottom: 20 }} />
              <div className="shimmer" style={{ width: '100%', height: 50, borderRadius: 2, marginBottom: 24 }} />
              <div className="shimmer" style={{ width: 140, height: 64, borderRadius: 2 }} />
            </div>
            <div>
              <div className="shimmer" style={{ width: 100, height: 11, borderRadius: 2, marginBottom: 20 }} />
              {[0, 1, 2, 3].map(j => (
                <div key={j} className="shimmer" style={{ width: '100%', height: 14, borderRadius: 2, marginBottom: 14 }} />
              ))}
            </div>
          </div>
        </div>
      ))}

      <style>{`
        .svc-loading-header { padding-top: 80px; padding-bottom: 72px; border-bottom: 1px solid var(--border); }
        .svc-loading-card { padding: 72px 48px; border-bottom: 1px solid var(--border); }
        .svc-loading-card-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; max-width: var(--content-max); margin: 0 auto; }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 900px) {
          .svc-loading-card-inner { grid-template-columns: 1fr; gap: 32px; }
        }
        @media(max-width: 767px) {
          .svc-loading-card { padding: 52px 20px; }
        }
      `}</style>
    </div>
  )
}
