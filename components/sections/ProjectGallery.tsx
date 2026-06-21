'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = useCallback(() => setActiveIndex(null), [])
  const next = useCallback(() => {
    setActiveIndex(i => (i === null ? null : (i + 1) % images.length))
  }, [images.length])
  const prev = useCallback(() => {
    setActiveIndex(i => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
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
      {/* All images shown at once, in a clean uniform grid — nothing hidden, nothing to scroll within */}
      <div className="pg-grid">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="pg-thumb"
            aria-label={`View ${title} image ${i + 1} of ${images.length} full size`}
          >
            <Image
              src={img}
              alt={`${title} ${i + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              className="pg-thumb-img"
              sizes="(max-width: 767px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="pg-overlay" role="dialog" aria-modal="true" aria-label={`${title} image viewer`} onClick={close}>
          <button type="button" onClick={close} className="pg-close" aria-label="Close">×</button>

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
        .pg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }
        .pg-thumb {
          position: relative;
          aspect-ratio: 4/3;
          background: var(--bg-secondary);
          border: none; padding: 0; margin: 0;
          cursor: zoom-in; overflow: hidden;
          display: block; width: 100%;
        }
        .pg-thumb-img { transition: transform 0.4s ease; }
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
          .pg-grid { grid-template-columns: 1fr 1fr; }
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
