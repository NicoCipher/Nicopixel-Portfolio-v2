'use client'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    Cal?: {
      (...args: unknown[]): void
      ns?: Record<string, unknown>
      loaded?: boolean
      q?: unknown[]
    }
  }
}

const CAL_USERNAME = 'nicopixel'
const CAL_EVENT = 'discovery-call' // update this if your event slug differs

export function BookingEmbed() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Detect current theme from document class
    const updateTheme = () => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }
    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Load Cal.com embed script once
    if (window.Cal) {
      const t0 = setTimeout(() => setLoaded(true), 0)
      return () => clearTimeout(t0)
    }

    const script = document.createElement('script')
    script.innerHTML = `
      (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
      Cal("init", { origin: "https://cal.com" });
    `
    document.body.appendChild(script)
    script.onload = () => setLoaded(true)

    // Fallback in case inline script executes synchronously
    const t = setTimeout(() => setLoaded(true), 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!loaded || !window.Cal || !containerRef.current) return

    window.Cal('inline', {
      elementOrSelector: containerRef.current,
      calLink: `${CAL_USERNAME}/${CAL_EVENT}`,
      config: {
        theme,
        layout: 'month_view',
      },
    })

    window.Cal('ui', {
      theme,
      cssVarsPerTheme: {
        light: { 'cal-brand': '#C41E3A' },
        dark: { 'cal-brand': '#C41E3A' },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    })
  }, [loaded, theme])

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 600, position: 'relative' }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 12, color: 'var(--fg-subtle)', letterSpacing: '0.06em' }}>Loading calendar...</span>
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 600 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
