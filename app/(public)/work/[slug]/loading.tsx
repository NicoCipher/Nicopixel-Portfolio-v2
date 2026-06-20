export default function ProjectLoading() {
  return (
    <div>
      <div className="shimmer proj-loading-cover" />

      <div className="proj-loading-meta">
        <div className="shimmer" style={{ width: 100, height: 11, borderRadius: 2, marginBottom: 16 }} />
        <div className="shimmer" style={{ width: '55%', height: 48, borderRadius: 2, marginBottom: 24 }} />
        <div className="shimmer" style={{ width: '70%', height: 16, borderRadius: 2, marginBottom: 8 }} />
        <div className="shimmer" style={{ width: '50%', height: 16, borderRadius: 2 }} />
      </div>

      <style>{`
        .proj-loading-cover { width: 100%; aspect-ratio: 16/9; }
        .proj-loading-meta { padding: 60px 48px; border-bottom: 1px solid var(--border); }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 767px) {
          .proj-loading-meta { padding: 40px 20px; }
        }
      `}</style>
    </div>
  )
}
