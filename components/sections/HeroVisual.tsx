'use client'
import { useEffect, useRef, useState } from 'react'
import { HappyAccident } from './hero-visuals/HappyAccident'
import { DesignProcess } from './hero-visuals/DesignProcess'
import { PixelBuilder } from './hero-visuals/PixelBuilder'
import { PrecisionTest } from './hero-visuals/PrecisionTest'
import { Experimenter } from './hero-visuals/Experimenter'
import { Speedrun } from './hero-visuals/Speedrun'
import { SmartGuides } from './hero-visuals/SmartGuides'

/**
 * The animated composition that fills the right side of the homepage hero.
 * Rotates through 7 "a designer is at work" concepts, one per day of the
 * week, or a manual override from Admin -> Settings -> Homepage Hero
 * Animation. See lib/heroVisualVariants.ts for the variant list.
 *
 * Every variant shares this wrapper for sizing, the IntersectionObserver
 * pause (animations stop when scrolled out of view — real CPU/GPU/battery
 * cost otherwise, for zero visual payoff), and reduced-motion handling, so
 * each variant file only needs to define its own animation content.
 *
 * Convention each variant follows: wrap any decorative/transient element
 * (cursor, toasts, guides, handles — anything that isn't the persistent
 * logo/mark itself) in className="hv-chrome" so the shared reduced-motion
 * rule below can hide it generically without every variant redefining it.
 */
export function HeroVisual({ logoUrl, variantOverride }: { logoUrl?: string | null; variantOverride?: string | null }) {
  const dayVariant = new Date().getDay() // 0 (Sun) – 6 (Sat), used when override is 'auto' or unset
  const variant = variantOverride && variantOverride !== 'auto' ? parseInt(variantOverride, 10) : dayVariant

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

  let Variant = HappyAccident
  switch (variant) {
    case 1: Variant = DesignProcess; break
    case 2: Variant = PixelBuilder; break
    case 3: Variant = PrecisionTest; break
    case 4: Variant = Experimenter; break
    case 5: Variant = Speedrun; break
    case 6: Variant = SmartGuides; break
    default: Variant = HappyAccident
  }

  return (
    <div className={`hero-visual ${inView ? '' : 'hv-paused'}`} aria-hidden="true" ref={stageRef}>
      <Variant logoUrl={logoUrl} />

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
           invisibly in the background. Generic — covers every variant. */
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
