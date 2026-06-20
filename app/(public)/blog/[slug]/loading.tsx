export default function BlogPostLoading() {
  return (
    <div>
      <div className="post-loading-header">
        <div className="shimmer" style={{ width: 130, height: 11, borderRadius: 2, marginBottom: 32 }} />
        <div className="shimmer" style={{ width: 70, height: 11, borderRadius: 2, marginBottom: 16 }} />
        <div className="shimmer" style={{ width: '90%', height: 48, borderRadius: 2, marginBottom: 12 }} />
        <div className="shimmer" style={{ width: '60%', height: 48, borderRadius: 2, marginBottom: 24 }} />
        <div className="shimmer" style={{ width: 220, height: 13, borderRadius: 2 }} />
      </div>

      <div className="shimmer post-loading-cover" />

      <div className="post-loading-content">
        <div className="shimmer" style={{ width: '100%', height: 16, borderRadius: 2, marginBottom: 12 }} />
        <div className="shimmer" style={{ width: '95%', height: 16, borderRadius: 2, marginBottom: 12 }} />
        <div className="shimmer" style={{ width: '88%', height: 16, borderRadius: 2, marginBottom: 30 }} />
        <div className="shimmer" style={{ width: '60%', height: 28, borderRadius: 2, marginBottom: 18 }} />
        <div className="shimmer" style={{ width: '100%', height: 16, borderRadius: 2, marginBottom: 12 }} />
        <div className="shimmer" style={{ width: '92%', height: 16, borderRadius: 2 }} />
      </div>

      <style>{`
        .post-loading-header { padding: 60px 48px 0; max-width: 760px; margin: 0 auto; }
        .post-loading-cover { width: 100%; aspect-ratio: 16/8; margin: 40px 0 56px; }
        .post-loading-content { max-width: 700px; margin: 0 auto; padding: 0 48px; }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 767px) {
          .post-loading-header { padding: 40px 20px 0; }
          .post-loading-content { padding: 0 20px; }
        }
      `}</style>
    </div>
  )
}
