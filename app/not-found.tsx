import Link from 'next/link'

export default function RootNotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: 24, background: '#0A0A0A', color: '#FAFAF9',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <p style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C41E3A', marginBottom: 20, fontWeight: 600 }}>404</p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 400, marginBottom: 16 }}>Page not found.</h1>
      <p style={{ fontSize: 15, color: '#999', marginBottom: 32 }}>This page doesn&apos;t exist.</p>
      <Link href="/" style={{
        padding: '13px 28px', background: '#C41E3A', color: 'white',
        fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
        textDecoration: 'none',
      }}>Back to Home →</Link>
    </div>
  )
}
