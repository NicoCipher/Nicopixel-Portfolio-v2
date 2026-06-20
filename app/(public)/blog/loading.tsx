export default function BlogLoading() {
  return (
    <div>
      <div className="blog-loading-header px-page">
        <div className="shimmer" style={{ width: 90, height: 11, borderRadius: 2, marginBottom: 20 }} />
        <div className="shimmer" style={{ width: '45%', height: 56, borderRadius: 2, marginBottom: 12 }} />
        <div className="shimmer" style={{ width: '30%', height: 56, borderRadius: 2, marginBottom: 24 }} />
        <div className="shimmer" style={{ width: 380, height: 16, borderRadius: 2 }} />
      </div>

      <div className="blog-loading-grid px-page">
        {[0, 1, 2].map(i => (
          <div key={i} className="blog-loading-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="shimmer" style={{ aspectRatio: '4/3', borderRadius: 2, marginBottom: 20 }} />
            <div className="shimmer" style={{ width: 100, height: 10, borderRadius: 2, marginBottom: 12 }} />
            <div className="shimmer" style={{ width: '90%', height: 24, borderRadius: 2 }} />
          </div>
        ))}
      </div>

      <style>{`
        .blog-loading-header { padding-top: 80px; padding-bottom: 64px; border-bottom: 1px solid var(--border); }
        .blog-loading-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; padding-top: 56px; padding-bottom: 56px; }
        .blog-loading-card { display: flex; flex-direction: column; }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 900px) {
          .blog-loading-grid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width: 767px) {
          .blog-loading-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
