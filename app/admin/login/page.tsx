'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid credentials.')
      setLoading(false)
      return
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'Georgia, serif', fontSize: 28,
            fontWeight: 400, color: '#FAFAF9', marginBottom: 8,
          }}>Nicopixel</h1>
          <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#555' }}>
            Admin Access
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="you@email.com"
              style={{
                width: '100%', padding: '12px 16px',
                background: '#111', border: '1px solid #1F1F1F',
                color: '#FAFAF9', fontSize: 14,
                outline: 'none', borderRadius: 0,
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#C41E3A')}
              onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
            />
          </div>
          <div>
            <label style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 16px',
                background: '#111', border: '1px solid #1F1F1F',
                color: '#FAFAF9', fontSize: 14,
                outline: 'none', borderRadius: 0,
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#C41E3A')}
              onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: '#C41E3A', textAlign: 'center' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '14px', background: loading ? '#333' : '#C41E3A',
            color: 'white', border: 'none', fontSize: 12,
            fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', fontFamily: 'inherit',
            transition: 'background 0.2s', marginTop: 8,
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
