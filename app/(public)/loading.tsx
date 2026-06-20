export default function HomeLoading() {
  return (
    <div style={{ minHeight: 'calc(100svh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} className="home-loading-hero">
      <div style={{ maxWidth: 760 }}>
        <div className="shimmer" style={{ width: 220, height: 11, borderRadius: 2, marginBottom: 28 }} />
        <div className="shimmer" style={{ width: '65%', height: 80, borderRadius: 2, marginBottom: 12, animationDelay: '0.1s' }} />
        <div className="shimmer" style={{ width: '50%', height: 80, borderRadius: 2, marginBottom: 12, animationDelay: '0.15s' }} />
        <div className="shimmer" style={{ width: '40%', height: 80, borderRadius: 2, marginBottom: 32, animationDelay: '0.2s' }} />
        <div className="shimmer" style={{ width: '55%', height: 15, borderRadius: 2, marginBottom: 10, animationDelay: '0.25s' }} />
        <div className="shimmer" style={{ width: '40%', height: 15, borderRadius: 2, marginBottom: 40, animationDelay: '0.3s' }} />
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="shimmer" style={{ width: 150, height: 48, borderRadius: 2, animationDelay: '0.35s' }} />
          <div className="shimmer" style={{ width: 110, height: 48, borderRadius: 2, animationDelay: '0.4s' }} />
        </div>
      </div>
      <style>{`
        .home-loading-hero { padding: 80px 48px 64px; }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 767px) {
          .home-loading-hero { padding: 0 20px 48px !important; }
        }
      `}</style>
    </div>
  )
}
