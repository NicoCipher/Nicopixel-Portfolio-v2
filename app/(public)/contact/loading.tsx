export default function ContactLoading() {
  return (
    <div className="contact-loading px-page">
      <div className="contact-loading-grid">
        <div>
          <div className="shimmer" style={{ width: '70%', height: 48, borderRadius: 2, marginBottom: 20 }} />
          <div className="shimmer" style={{ width: '100%', height: 16, borderRadius: 2, marginBottom: 10 }} />
          <div className="shimmer" style={{ width: '80%', height: 16, borderRadius: 2, marginBottom: 32 }} />
          <div className="shimmer" style={{ width: 160, height: 14, borderRadius: 2, marginBottom: 14 }} />
          <div className="shimmer" style={{ width: 200, height: 14, borderRadius: 2 }} />
        </div>
        <div>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="shimmer" style={{ width: '100%', height: i === 3 ? 100 : 48, borderRadius: 2, marginBottom: 18, animationDelay: `${i * 0.06}s` }} />
          ))}
          <div className="shimmer" style={{ width: 160, height: 48, borderRadius: 2 }} />
        </div>
      </div>

      <style>{`
        .contact-loading { padding-top: 80px; padding-bottom: 100px; }
        .contact-loading-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; max-width: var(--content-max); margin: 0 auto; }
        .shimmer {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
        @media(max-width: 900px) {
          .contact-loading-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </div>
  )
}
