'use client'
import { useEffect, useRef, useState } from 'react'

export function AnimatedStat({ value, label, numClass = 'h-stat-num', labelClass = 'h-stat-label' }: { value: string; label: string; numClass?: string; labelClass?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState('0')
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const numMatch = value.match(/(\d+)/)
    const targetNum = numMatch ? parseInt(numMatch[1]) : null
    const prefix = numMatch ? value.slice(0, numMatch.index) : ''
    const suffix = numMatch ? value.slice((numMatch.index ?? 0) + numMatch[1].length) : ''

    if (targetNum === null) {
      const t = setTimeout(() => setDisplay(value), 0)
      return () => clearTimeout(t)
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            const duration = 1200
            const start = performance.now()

            const tick = (now: number) => {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = Math.round(eased * targetNum)
              setDisplay(`${prefix}${current}${suffix}`)
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <>
      <span ref={ref} className={numClass}>{display}</span>
      <span className={labelClass}>{label}</span>
    </>
  )
}
