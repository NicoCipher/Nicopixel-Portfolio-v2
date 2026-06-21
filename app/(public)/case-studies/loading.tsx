export default function CaseStudiesLoading() {
  return (
    <div>
      <div className="cs-loading-header px-page">
        <div className="shimmer" style={{ width: 110, height: 11, borderRadius: 2, marginBottom: 20 }} />
        <div className="shimmer" style={{ width: '55%', height: 60, borderRadius: 2, marginBottom: 12 }} />
        <div className="shimmer" style={{ width: '35%', height: 60, borderRadius: 2, marginBottom: 24 }} />
        <div className="shimmer" style={{ width: 460, height: 16, borderRadius: 2 }} />
      </div>

      {[0, 1].map(i => (
        <div key={i} className="cs-loading-card px-page" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="shimmer cs-loading-img" />
          <div className="cs-loading-body">
            <div className="shimmer" style={{ width: 100, height: 11, borderRadius: 2, marginBottom: 16 }} />
            <div className="shimmer" style={{ width: '80%', height: 36, borderRadius: 2, marginBottom: 16 }} />
            <div className="shimmer" style={{ width: '90%', height: 14, borderRadius: 2, marginBottom: 8 }} />
            <div className="shimmer" style={{ width: '70%', height: 14, borderRadius: 2 }} />
          </div>
        </div>
      ))}

      <style>{`
        .cs-loading-header { padding-top: 80px; padding-bottom: 64px; border-bottom: 1px solid var(--border); }
        .cs-loading-card { display: grid; grid-template-columns: 1fr 1fr; min-height: 440px; border-bottom: 1px solid var(--border); }
        .cs-loading-img { aspect-ratio: auto; }
        .cs-loading-body { padding: 56px; display: flex; flex-direction: column; justify-content: center; }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 900px) {
          .cs-loading-card { grid-template-columns: 1fr; min-height: auto; }
          .cs-loading-img { aspect-ratio: 4/3; }
          .cs-loading-body { padding: 32px; }
        }
      `}</style>
    </div>
  )
}
