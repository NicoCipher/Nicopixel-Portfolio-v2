'use client'
import { useEffect, useRef, useState } from 'react'
import { HappyAccident } from './hero-visuals/HappyAccident'

/**
 * The animated composition that fills the right side of the homepage hero.
 * "Happy Accident": cursor tries an idea, hesitates, undoes it, tries
 * another, lands back on the correct version.
 *
 * Handles sizing, the IntersectionObserver pause (animations stop when
 * scrolled out of view — real CPU/GPU/battery cost otherwise, for zero
 * visual payoff), and reduced-motion handling generically, via an
 * .hv-chrome convention on any decorative/transient element (cursor,
 * toasts, handles — anything that isn't the persistent logo/mark itself).
 */
export function HeroVisual({ logoUrl }: { logoUrl?: string | null }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => setInView(entry.isIntersecting)),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`hero-visual ${inView ? '' : 'hv-paused'}`} aria-hidden="true" ref={stageRef}>
      <HappyAccident logoUrl={logoUrl} />

      <style>{`
        .hero-visual {
          position: absolute; top: 50%; right: 3%;
          width: clamp(320px, 36vw, 560px); height: clamp(320px, 36vw, 560px);
          transform: translateY(-50%);
          opacity: 0;
          animation: hv-fade-in 1s ease 0.3s forwards;
        }
        @keyframes hv-fade-in { to { opacity: 1; } }

        .hv-stage { position: relative; width: 100%; height: 100%; }

        /* Pause every animation on the stage in one shot when scrolled out
           of view, instead of letting a dozen+ infinite animations run
           invisibly in the background. */
        .hv-paused .hv-stage * { animation-play-state: paused !important; }

        @media (prefers-reduced-motion: reduce) {
          .hero-visual { animation: none; opacity: 1; }
          .hv-stage * { animation: none !important; }
          .hv-chrome { opacity: 0 !important; }
        }

        @media(max-width: 1200px) {
          .hero-visual { width: clamp(260px, 30vw, 360px); height: clamp(260px, 30vw, 360px); right: 2%; }
        }
        @media(max-width: 900px) {
          .hero-visual { display: none; }
        }
      `}</style>
    </div>
  )
}
