'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-5 h-5" />

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      style={{
        width: 20, height: 20,
        borderRadius: '50%',
        border: '1.5px solid var(--fg)',
        background: isDark ? 'var(--fg)' : 'transparent',
        transition: 'background 0.3s, border-color 0.3s',
        flexShrink: 0,
      }}
    />
  )
}
