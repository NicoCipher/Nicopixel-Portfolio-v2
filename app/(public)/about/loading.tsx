export default function AboutLoading() {
  return (
    <div>
      <div className="about-loading-hero">
        <div className="about-loading-hero-text">
          <div className="shimmer" style={{ width: 80, height: 11, borderRadius: 2, marginBottom: 32 }} />
          <div className="shimmer" style={{ width: '85%', height: 64, borderRadius: 2, marginBottom: 12 }} />
          <div className="shimmer" style={{ width: '60%', height: 64, borderRadius: 2 }} />
        </div>
        <div className="shimmer about-loading-hero-img" />
      </div>

      <div className="about-loading-stats">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="about-loading-stat" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="shimmer" style={{ width: 70, height: 48, borderRadius: 2, marginBottom: 10 }} />
            <div className="shimmer" style={{ width: 90, height: 11, borderRadius: 2 }} />
          </div>
        ))}
      </div>

      <style>{`
        .about-loading-hero { display: grid; grid-template-columns: 1.3fr 1fr; min-height: min(680px, 78vh); border-bottom: 1px solid var(--border); }
        .about-loading-hero-text { padding: 80px 60px 64px 48px; display: flex; flex-direction: column; justify-content: flex-end; border-right: 1px solid var(--border); }
        .about-loading-hero-img { background: var(--bg-secondary); }
        .about-loading-stats { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--border); padding: 0 48px; }
        .about-loading-stat { padding: 48px 40px; border-right: 1px solid var(--border); }
        .about-loading-stat:last-child { border-right: none; }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 900px) {
          .about-loading-hero { grid-template-columns: 1fr; min-height: auto; }
          .about-loading-hero-text { border-right: none; padding: 56px 24px; }
          .about-loading-hero-img { min-height: 320px; }
          .about-loading-stats { grid-template-columns: 1fr 1fr; padding: 0 20px; }
        }
      `}</style>
    </div>
  )
}
