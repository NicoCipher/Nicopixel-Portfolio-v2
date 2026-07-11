import Image from 'next/image'

/**
 * Smart Guides — cursor drags the logo across the stage. As it crosses
 * horizontal then vertical center, alignment guides flash in (just like
 * Figma/Illustrator) and the object gives a small snap-bounce, landing
 * dead-center. Immediately recognizable to anyone who's used a design tool.
 */
export function SmartGuides({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <div className="hv-stage">
      <div className="sg-guide sg-guide-v hv-chrome" />
      <div className="sg-guide sg-guide-h hv-chrome" />

      <div className="sg-object">
        {logoUrl
          ? <Image src={logoUrl} alt="" fill style={{ objectFit: 'contain' }} />
          : (
            <svg viewBox="0 0 200 200" className="sg-fallback-mark">
              <circle cx="100" cy="100" r="52" />
              <line x1="100" y1="8" x2="100" y2="192" />
              <line x1="8" y1="100" x2="192" y2="100" />
            </svg>
          )
        }
      </div>

      <div className="sg-click-ripple hv-chrome" />

      <div className="sg-centered-label hv-chrome">Centered</div>

      <div className="sg-cursor hv-chrome">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 2L4 19.5L8.5 15.5L11.5 22L14.5 20.5L11.5 14L17.5 14L4 2Z" fill="white" stroke="#0A0A0A" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        .sg-fallback-mark { width: 100%; height: 100%; fill: none; stroke: var(--fg-subtle); stroke-width: 1.5; }

        /* ── Alignment guides — thin full-stage lines that flash at each
           snap moment, exactly like Figma/Illustrator's smart guides ── */
        .sg-guide {
          position: absolute; background: var(--accent);
          opacity: 0;
          animation: sg-guide-life 10s linear infinite;
        }
        .sg-guide-v { top: 0; bottom: 0; left: 50%; width: 1px; }
        .sg-guide-h { left: 0; right: 0; top: 50%; height: 1px; }
        @keyframes sg-guide-life {
          0%, 24%  { opacity: 0; }
          26%, 30% { opacity: 0.9; }
          33%      { opacity: 0; }
          43%, 48% { opacity: 0.9; }
          51%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        /* ── The object being dragged — moves right to X-align (first
           snap), then up to Y-align (final snap, dead center) ── */
        .sg-object {
          position: absolute; width: 34%; height: 34%;
          margin: -17% 0 0 -17%; /* center the box on its top/left point */
          animation: sg-object-move 10s linear infinite;
        }
        @keyframes sg-object-move {
          0%, 10%  { top: 70%; left: 25%; opacity: 1; transform: scale(1); }
          26%      { top: 70%; left: 50%; opacity: 1; transform: scale(1); }
          28%      { top: 70%; left: 50%; opacity: 1; transform: scale(1.06); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
          31%      { top: 70%; left: 50%; opacity: 1; transform: scale(1); animation-timing-function: linear; }
          43%      { top: 50%; left: 50%; opacity: 1; transform: scale(1); }
          45%      { top: 50%; left: 50%; opacity: 1; transform: scale(1.06); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
          48%      { top: 50%; left: 50%; opacity: 1; transform: scale(1); animation-timing-function: linear; }
          90%      { top: 50%; left: 50%; opacity: 1; transform: scale(1); }
          93%      { top: 50%; left: 50%; opacity: 0; transform: scale(1); }
          94%      { top: 70%; left: 25%; opacity: 0; transform: scale(1); }
          97%, 100% { top: 70%; left: 25%; opacity: 1; transform: scale(1); }
        }

        .sg-click-ripple {
          position: absolute; top: 70%; left: 25%;
          width: 12px; height: 12px; margin: -6px 0 0 -6px;
          border-radius: 50%; border: 2px solid var(--accent);
          opacity: 0; transform: scale(0.4);
          animation: sg-ripple-life 10s linear infinite;
        }
        @keyframes sg-ripple-life {
          0%, 8.5% { opacity: 0; transform: scale(0.4); }
          10%      { opacity: 0.9; transform: scale(1); }
          13%      { opacity: 0; transform: scale(1.8); }
          100%     { opacity: 0; }
        }

        .sg-centered-label {
          position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%);
          font-family: var(--font-body); font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent);
          opacity: 0;
          animation: sg-centered-life 10s linear infinite;
        }
        @keyframes sg-centered-life {
          0%, 51%  { opacity: 0; transform: translateX(-50%) translateY(4px); }
          54%, 84% { opacity: 1; transform: translateX(-50%) translateY(0); }
          88%      { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          100%     { opacity: 0; }
        }

        /* ── Cursor — grabs the object just below-right of it, follows
           the same L-shaped path ── */
        .sg-cursor {
          position: absolute; width: 30px; height: 30px;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.45));
          animation: sg-cursor-move 10s linear infinite;
        }
        .sg-cursor svg { width: 100%; height: 100%; }
        @keyframes sg-cursor-move {
          0%   { top: 92%; left: 6%;  opacity: 0; }
          6%   { top: 78%; left: 33%; opacity: 1; }
          10%  { top: 78%; left: 33%; opacity: 1; }
          26%  { top: 78%; left: 58%; opacity: 1; }
          31%  { top: 78%; left: 58%; opacity: 1; }
          43%  { top: 58%; left: 58%; opacity: 1; }
          48%  { top: 58%; left: 58%; opacity: 1; }
          54%  { top: 58%; left: 58%; opacity: 0; }
          100% { top: 92%; left: 6%;  opacity: 0; }
        }
      `}</style>
    </div>
  )
}
