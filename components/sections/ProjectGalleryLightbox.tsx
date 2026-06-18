'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export function ProjectGalleryLightbox({ images, title }: { images: string[]; title: string }) {
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
      <div className="proj-gallery-grid">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="lightbox-trigger"
            style={{
              position: 'relative', overflow: 'hidden',
              aspectRatio: i === 0 ? '16/9' : '4/3',
              gridColumn: i === 0 ? 'span 2' : 'span 1',
              background: 'var(--bg-secondary)',
              border: 'none', padding: 0, cursor: 'zoom-in',
              display: 'block', width: '100%',
            }}
            aria-label={`View ${title} image ${i + 1} full size`}
          >
            <Image src={img} alt={`${title} ${i + 1}`} fill style={{ objectFit: 'cover' }} className="lightbox-img" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image viewer`}
        >
          <button onClick={close} className="lightbox-close" aria-label="Close">×</button>

          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev() }} className="lightbox-nav lightbox-nav-prev" aria-label="Previous image">‹</button>
              <button onClick={e => { e.stopPropagation(); next() }} className="lightbox-nav lightbox-nav-next" aria-label="Next image">›</button>
            </>
          )}

          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <div className="lightbox-img-wrap">
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
              <span className="lightbox-counter">{activeIndex + 1} / {images.length}</span>
            )}
          </div>
        </div>
      )}

      <style>{`
        .lightbox-trigger { transition: opacity 0.2s; }
        .lightbox-trigger:hover { opacity: 0.92; }
        .lightbox-img { transition: transform 0.4s ease; }
        .lightbox-trigger:hover .lightbox-img { transform: scale(1.02); }

        .lightbox-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.95);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: lightbox-fade-in 0.2s ease;
        }
        @keyframes lightbox-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .lightbox-content {
          position: relative;
          width: 100%; height: 100%;
          max-width: 1400px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 16px;
        }
        .lightbox-img-wrap { position: relative; width: 100%; height: 100%; }

        .lightbox-close {
          position: absolute; top: 20px; right: 24px; z-index: 1001;
          background: none; border: none; color: white;
          font-size: 32px; line-height: 1; cursor: pointer;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          opacity: 0.7; transition: opacity 0.2s;
        }
        .lightbox-close:hover { opacity: 1; }

        .lightbox-nav {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 1001;
          background: rgba(255,255,255,0.08); border: none; color: white;
          font-size: 32px; line-height: 1; cursor: pointer;
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          opacity: 0.7; transition: opacity 0.2s, background 0.2s;
        }
        .lightbox-nav:hover { opacity: 1; background: rgba(255,255,255,0.15); }
        .lightbox-nav-prev { left: 20px; }
        .lightbox-nav-next { right: 20px; }

        .lightbox-counter {
          font-size: 12px; letter-spacing: 0.08em; color: rgba(255,255,255,0.6);
        }

        @media(max-width: 767px) {
          .lightbox-overlay { padding: 12px; }
          .lightbox-nav { width: 40px; height: 40px; font-size: 24px; }
          .lightbox-nav-prev { left: 8px; }
          .lightbox-nav-next { right: 8px; }
          .lightbox-close { top: 12px; right: 12px; }
        }
      `}</style>
    </>
  )
}
