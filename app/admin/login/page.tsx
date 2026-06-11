'use client'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { LoginTimeoutBanner } from '@/components/admin/SessionGuard'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setAttempts(a => a + 1)
        setError(data.error || 'Invalid credentials.')
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const remaining = Math.max(0, 5 - attempts)
  const isLocked = attempts >= 5

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <LoginTimeoutBanner />

        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 8 }}>
            Nicopixel
          </h1>
          <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#555' }}>
            Admin Access
          </p>
        </div>

        {isLocked ? (
          <div style={{ padding: 24, border: '1px solid #C41E3A', textAlign: 'center' }}>
            <p style={{ color: '#C41E3A', fontSize: 14, lineHeight: 1.6 }}>
              Account temporarily locked after 5 failed attempts.<br />
              Please wait 15 minutes before trying again.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required autoComplete="email"
                placeholder="you@email.com"
                style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1px solid #1F1F1F', color: '#FAFAF9', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#C41E3A')}
                onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1px solid #1F1F1F', color: '#FAFAF9', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#C41E3A')}
                onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
              />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: '#1A0A0A', border: '1px solid #3A1A1A' }}>
                <p style={{ fontSize: 13, color: '#C41E3A', margin: 0 }}>{error}</p>
                {attempts > 0 && attempts < 5 && (
                  <p style={{ fontSize: 11, color: '#666', margin: '4px 0 0' }}>
                    {remaining} attempt{remaining !== 1 ? 's' : ''} remaining before lockout.
                  </p>
                )}
              </div>
            )}

            <button type="submit" disabled={loading || isLocked} style={{
              padding: 14, background: loading ? '#333' : '#C41E3A',
              color: 'white', border: 'none', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontFamily: 'inherit', marginTop: 8,
              transition: 'background 0.2s',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p style={{ fontSize: 11, color: '#444', textAlign: 'center', marginTop: 4 }}>
              Session auto-expires after 30 minutes of inactivity.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
