'use client'
import { useEffect, useRef, useState } from 'react'

export function AnimatedStat({ value, label, numClass = 'h-stat-num', labelClass = 'h-stat-label', startDelay = 0 }: { value: string; label: string; numClass?: string; labelClass?: string; startDelay?: number }) {
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

    let startTimeout: ReturnType<typeof setTimeout> | null = null

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // IntersectionObserver only tracks geometric position, not
          // opacity — it fires as soon as the element is in the viewport
          // bounds, even if a separate fade-in animation is still keeping
          // it invisible. Without startDelay, the count-up would run (and
          // finish) entirely while opacity:0, so by the time the fade
          // reveals the number, it's already sitting at its final value
          // with no visible counting motion.
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true

            const runCountUp = () => {
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

            if (startDelay > 0) {
              startTimeout = setTimeout(runCountUp, startDelay)
            } else {
              runCountUp()
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (startTimeout) clearTimeout(startTimeout)
    }
  }, [value, startDelay])

  return (
    <>
      <span ref={ref} className={numClass}>{display}</span>
      <span className={labelClass}>{label}</span>
    </>
  )
}
