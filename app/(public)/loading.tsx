export default function HomeLoading() {
  return (
    <div style={{ minHeight: '100vh', padding: '80px 48px' }}>
      <div style={{ maxWidth: 760 }}>
        <div style={{ width: 200, height: 12, background: 'var(--border)', borderRadius: 2, marginBottom: 28, animation: 'skeleton-shimmer 1.4s ease-in-out infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)' }} />
        <div style={{ width: '70%', height: 72, background: 'var(--border)', borderRadius: 2, marginBottom: 16, animation: 'skeleton-shimmer 1.4s ease-in-out 0.1s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)' }} />
        <div style={{ width: '50%', height: 72, background: 'var(--border)', borderRadius: 2, marginBottom: 32, animation: 'skeleton-shimmer 1.4s ease-in-out 0.2s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)' }} />
        <div style={{ width: '60%', height: 16, background: 'var(--border)', borderRadius: 2, marginBottom: 8, animation: 'skeleton-shimmer 1.4s ease-in-out 0.3s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)' }} />
        <div style={{ width: '40%', height: 16, background: 'var(--border)', borderRadius: 2, marginBottom: 40, animation: 'skeleton-shimmer 1.4s ease-in-out 0.4s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)' }} />
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 140, height: 48, background: 'var(--border)', borderRadius: 2, animation: 'skeleton-shimmer 1.4s ease-in-out 0.5s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)' }} />
          <div style={{ width: 100, height: 48, background: 'var(--border)', borderRadius: 2, animation: 'skeleton-shimmer 1.4s ease-in-out 0.6s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)' }} />
        </div>
      </div>
    </div>
  )
}
