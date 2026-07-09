'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Masonry from 'react-masonry-css'

const BREAKPOINTS = { default: 4, 1800: 3, 900: 2, 600: 2 }

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setActiveIndex(null)
    // Return focus to whichever thumbnail opened the modal, rather than
    // leaving keyboard focus stranded on a now-removed element.
    lastTriggerRef.current?.focus()
  }, [])
  const next = useCallback(() => {
    setActiveIndex(i => (i === null ? null : (i + 1) % images.length))
  }, [images.length])
  const prev = useCallback(() => {
    setActiveIndex(i => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])

  const openAt = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    lastTriggerRef.current = e.currentTarget
    setActiveIndex(i)
  }

  useEffect(() => {
    if (activeIndex === null) return

    // Move focus into the modal as soon as it opens, so keyboard users
    // land on its controls instead of staying on the now-hidden thumbnail.
    closeBtnRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'Tab') {
        // Simple focus trap: cycle Tab/Shift+Tab within the modal's own
        // focusable controls instead of letting it escape to the page
        // content sitting behind the overlay.
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeIndex, close, next, prev])

  return (
    <>
      {/* Masonry — each image at its own natural proportions, every image
          visible at once, nothing hidden or requiring scroll-to-discover. */}
      <Masonry breakpointCols={BREAKPOINTS} className="pg-masonry" columnClassName="pg-masonry-col">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={e => openAt(i, e)}
            className="pg-thumb"
            aria-label={`View ${title} image ${i + 1} of ${images.length} full size`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`${title} ${i + 1}`} className="pg-thumb-img" loading="lazy" />
          </button>
        ))}
      </Masonry>

      {activeIndex !== null && (
        <div ref={overlayRef} className="pg-overlay" role="dialog" aria-modal="true" aria-label={`${title} image viewer`} onClick={close}>
          <button ref={closeBtnRef} type="button" onClick={close} className="pg-close" aria-label="Close">×</button>

          {images.length > 1 && (
            <>
              <button type="button" onClick={e => { e.stopPropagation(); prev() }} className="pg-nav pg-nav-prev" aria-label="Previous image">‹</button>
              <button type="button" onClick={e => { e.stopPropagation(); next() }} className="pg-nav pg-nav-next" aria-label="Next image">›</button>
            </>
          )}

          <div className="pg-stage" onClick={e => e.stopPropagation()}>
            <div className="pg-stage-img-wrap">
              <Image
                src={images[activeIndex]}
                alt={`${title} ${activeIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="100vw"
                priority
              />
            </div>
            {images.length > 1 && (
              <span className="pg-counter">{activeIndex + 1} / {images.length}</span>
            )}
          </div>
        </div>
      )}

      <style>{`
        .pg-masonry { display: flex; margin-left: -8px; width: auto; }
        .pg-masonry-col { padding-left: 8px; background-clip: padding-box; }
        .pg-masonry-col > button { display: block; margin-bottom: 8px; width: 100%; }

        .pg-thumb {
          position: relative;
          background: var(--bg-secondary);
          border: none; padding: 0; margin: 0;
          cursor: zoom-in; overflow: hidden;
          display: block; width: 100%;
          border-radius: 3px;
        }
        .pg-thumb-img {
          display: block; width: 100%; height: auto;
          max-height: 560px; min-height: 140px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pg-thumb:hover .pg-thumb-img { transform: scale(1.04); }

        .pg-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.95);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: pg-fade-in 0.2s ease;
        }
        @keyframes pg-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .pg-stage {
          position: relative;
          width: 100%; height: 100%;
          max-width: 1300px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 16px;
        }
        .pg-stage-img-wrap { position: relative; width: 100%; height: 100%; }

        .pg-close {
          position: absolute; top: 20px; right: 24px; z-index: 1001;
          background: none; border: none; color: white;
          font-size: 32px; line-height: 1; cursor: pointer;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          opacity: 0.7; transition: opacity 0.2s;
        }
        .pg-close:hover { opacity: 1; }

        .pg-nav {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 1001;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: white;
          font-size: 30px; line-height: 1; cursor: pointer;
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          opacity: 0.85; transition: opacity 0.2s, background 0.2s;
        }
        .pg-nav:hover { opacity: 1; background: rgba(255,255,255,0.2); }
        .pg-nav-prev { left: 20px; }
        .pg-nav-next { right: 20px; }

        .pg-counter { font-size: 12px; letter-spacing: 0.08em; color: rgba(255,255,255,0.6); }

        @media(max-width: 767px) {
          .pg-masonry { margin-left: -6px; }
          .pg-masonry-col { padding-left: 6px; }
          .pg-masonry-col > button { margin-bottom: 6px; }
          .pg-thumb-img { max-height: 380px; }
          .pg-overlay { padding: 12px; }
          .pg-nav { width: 44px; height: 44px; font-size: 24px; }
          .pg-nav-prev { left: 8px; }
          .pg-nav-next { right: 8px; }
          .pg-close { top: 12px; right: 12px; }
        }
      `}</style>
    </>
  )
}
