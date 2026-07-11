import Image from 'next/image'

/**
 * The Precision Test — zooms into a corner of the mark to inspect it,
 * nudges an edge by a single pixel (with a live "+1px" readout, the way
 * Figma shows nudge amounts), holds to show the fix, then zooms back out.
 * Emphasizes obsessive attention to detail.
 */
export function PrecisionTest({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <div className="hv-stage">
      <div className="pt-zoom-wrap">
        <div className="pt-object">
          {logoUrl
            ? <Image src={logoUrl} alt="" fill style={{ objectFit: 'contain' }} />
            : (
              <svg viewBox="0 0 200 200" className="pt-fallback-mark">
                <circle cx="100" cy="100" r="52" />
                <line x1="100" y1="8" x2="100" y2="192" />
                <line x1="8" y1="100" x2="192" y2="100" />
              </svg>
            )
          }
        </div>
        <div className="pt-ruler pt-ruler-h hv-chrome" />
        <div className="pt-ruler pt-ruler-v hv-chrome" />
        <div className="pt-nudge-dot hv-chrome" />
      </div>

      <div className="pt-readout hv-chrome">+1px</div>

      <div className="pt-cursor hv-chrome">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 2L4 19.5L8.5 15.5L11.5 22L14.5 20.5L11.5 14L17.5 14L4 2Z" fill="white" stroke="#0A0A0A" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        .pt-zoom-wrap {
          position: absolute; inset: 22%;
          transform-origin: 78% 78%;
          animation: pt-zoom 10s linear infinite;
        }
        @keyframes pt-zoom {
          0%, 8%   { transform: scale(1); }
          16%      { transform: scale(2.4); animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
          36%      { transform: scale(2.4); animation-timing-function: linear; }
          44%      { transform: scale(1); animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
          48%, 100% { transform: scale(1); animation-timing-function: linear; }
        }

        .pt-object { position: absolute; inset: 0; }
        .pt-fallback-mark { width: 100%; height: 100%; fill: none; stroke: var(--fg-subtle); stroke-width: 1.5; }

        /* Precision ruler/grid — only reads clearly once zoomed in */
        .pt-ruler { position: absolute; background: var(--accent); opacity: 0; animation: pt-ruler-life 10s linear infinite; }
        .pt-ruler-h { left: 0; right: 0; top: 78%; height: 0.5px; }
        .pt-ruler-v { top: 0; bottom: 0; left: 78%; width: 0.5px; }
        @keyframes pt-ruler-life {
          0%, 14%  { opacity: 0; }
          18%, 42% { opacity: 0.5; }
          46%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        /* The "edge" being nudged by a pixel */
        .pt-nudge-dot {
          position: absolute; top: 78%; left: 78%;
          width: 3px; height: 3px; margin: -1.5px 0 0 -1.5px;
          border-radius: 50%; background: var(--accent);
          opacity: 0;
          animation: pt-nudge-life 10s linear infinite;
        }
        @keyframes pt-nudge-life {
          0%, 22%  { opacity: 0; transform: translate(0, 0); }
          26%, 30% { opacity: 1; transform: translate(0, 0); }
          33%      { opacity: 1; transform: translate(1.2px, -1.2px); }
          38%, 42% { opacity: 1; transform: translate(1.2px, -1.2px); }
          46%      { opacity: 0; transform: translate(1.2px, -1.2px); }
          100%     { opacity: 0; }
        }

        .pt-readout {
          position: absolute; top: 12%; left: 60%;
          padding: 4px 8px;
          background: var(--accent); color: white;
          font-family: var(--font-body); font-size: 11px; font-weight: 700;
          border-radius: 3px;
          opacity: 0; transform: scale(0.85);
          animation: pt-readout-life 10s linear infinite;
        }
        @keyframes pt-readout-life {
          0%, 31%  { opacity: 0; transform: scale(0.85); }
          34%, 42% { opacity: 1; transform: scale(1); }
          45%      { opacity: 0; transform: scale(0.85); }
          100%     { opacity: 0; }
        }

        .pt-cursor {
          position: absolute; width: 26px; height: 26px;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.45));
          animation: pt-cursor-move 10s linear infinite;
        }
        .pt-cursor svg { width: 100%; height: 100%; }
        @keyframes pt-cursor-move {
          0%   { top: 90%; left: 6%;  opacity: 0; }
          10%  { top: 60%; left: 45%; opacity: 1; }
          16%  { top: 60%; left: 45%; opacity: 1; }
          24%  { top: 76%; left: 74%; opacity: 1; }
          30%  { top: 78%; left: 78%; opacity: 1; }
          33%  { top: 74%; left: 82%; opacity: 1; }
          42%  { top: 74%; left: 82%; opacity: 1; }
          48%  { top: 90%; left: 6%;  opacity: 0; }
          100% { top: 90%; left: 6%;  opacity: 0; }
        }
      `}</style>
    </div>
  )
}
