import Image from 'next/image'

/**
 * The Experimenter — stretches, tilts, and re-colors the logo into
 * something deliberately ugly, then immediately hits undo several times
 * in rapid succession back to the refined version. Faster and more
 * exaggerated than Happy Accident — this one is meant to be funny, not
 * contemplative.
 */
export function Experimenter({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <div className="hv-stage">
      <div className="ex-object">
        {logoUrl
          ? <Image src={logoUrl} alt="" fill style={{ objectFit: 'contain' }} />
          : (
            <svg viewBox="0 0 200 200" className="ex-fallback-mark">
              <circle cx="100" cy="100" r="52" />
              <line x1="100" y1="8" x2="100" y2="192" />
              <line x1="8" y1="100" x2="192" y2="100" />
            </svg>
          )
        }
        <div className="ex-selection hv-chrome" />
      </div>

      <div className="ex-undo-toast ex-undo-toast-1 hv-chrome"><span>⌘</span><span>Z</span></div>
      <div className="ex-undo-toast ex-undo-toast-2 hv-chrome"><span>⌘</span><span>Z</span></div>
      <div className="ex-undo-toast ex-undo-toast-3 hv-chrome"><span>⌘</span><span>Z</span></div>

      <div className="ex-cursor hv-chrome">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 2L4 19.5L8.5 15.5L11.5 22L14.5 20.5L11.5 14L17.5 14L4 2Z" fill="white" stroke="#0A0A0A" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        .ex-object {
          position: absolute; top: 50%; left: 50%;
          width: 38%; height: 38%;
          transform-origin: center;
          animation: ex-transform 9s linear infinite;
        }
        .ex-fallback-mark { width: 100%; height: 100%; fill: none; stroke: var(--fg-subtle); stroke-width: 1.5; }

        /* rest -> wild, ugly experiment -> three rapid undos back to normal */
        @keyframes ex-transform {
          0%, 11%  { transform: translate(-50%, -50%) rotate(0deg) skewY(0deg) scale(1); filter: hue-rotate(0deg) saturate(1); }
          24%      { transform: translate(-50%, -50%) rotate(35deg) skewY(-18deg) scale(1.3); filter: hue-rotate(160deg) saturate(3.5); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
          30%      { transform: translate(-50%, -50%) rotate(35deg) skewY(-18deg) scale(1.3); filter: hue-rotate(160deg) saturate(3.5); animation-timing-function: linear; }
          33%      { transform: translate(-50%, -50%) rotate(20deg) skewY(-10deg) scale(1.15); filter: hue-rotate(90deg) saturate(2.2); }
          36%      { transform: translate(-50%, -50%) rotate(8deg) skewY(-3deg) scale(1.05); filter: hue-rotate(30deg) saturate(1.4); }
          39%      { transform: translate(-50%, -50%) rotate(0deg) skewY(0deg) scale(1); filter: hue-rotate(0deg) saturate(1); }
          100%     { transform: translate(-50%, -50%) rotate(0deg) skewY(0deg) scale(1); filter: hue-rotate(0deg) saturate(1); }
        }

        .ex-selection {
          position: absolute; inset: -12%;
          border: 2px dashed var(--fg);
          opacity: 0;
          animation: ex-selection-life 9s linear infinite;
          pointer-events: none;
        }
        @keyframes ex-selection-life {
          0%, 9%    { opacity: 0; border-color: var(--fg); }
          12%, 29%  { opacity: 0.85; border-color: var(--fg); }
          30%       { opacity: 0.85; border-color: var(--accent); }
          39%       { opacity: 0.85; border-color: var(--fg); }
          45%, 100% { opacity: 0; }
        }

        .ex-undo-toast {
          position: absolute; top: 6%; right: 6%;
          display: flex; gap: 4px; align-items: center;
          padding: 7px 11px;
          background: var(--fg); color: var(--bg);
          font-family: var(--font-body); font-size: 12px; font-weight: 600;
          border-radius: 4px;
          opacity: 0; transform: translateY(4px) scale(0.94);
        }
        .ex-undo-toast-1 { animation: ex-undo-1-life 9s linear infinite; }
        .ex-undo-toast-2 { animation: ex-undo-2-life 9s linear infinite; }
        .ex-undo-toast-3 { animation: ex-undo-3-life 9s linear infinite; }
        @keyframes ex-undo-1-life { 0%, 29% { opacity: 0; } 31%, 32.5% { opacity: 1; transform: translateY(0) scale(1); } 34% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes ex-undo-2-life { 0%, 32% { opacity: 0; } 34%, 35.5% { opacity: 1; transform: translateY(0) scale(1); } 37% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes ex-undo-3-life { 0%, 35% { opacity: 0; } 37%, 39%   { opacity: 1; transform: translateY(0) scale(1); } 41% { opacity: 0; } 100% { opacity: 0; } }

        .ex-cursor {
          position: absolute; width: 28px; height: 28px;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.45));
          animation: ex-cursor-move 9s linear infinite;
        }
        .ex-cursor svg { width: 100%; height: 100%; }
        @keyframes ex-cursor-move {
          0%   { top: 92%; left: 6%;  opacity: 0; }
          8%   { top: 50%; left: 47%; opacity: 1; }
          11%  { top: 50%; left: 47%; opacity: 1; }
          24%  { top: 30%; left: 70%; opacity: 1; }
          39%  { top: 30%; left: 70%; opacity: 1; }
          46%  { top: 50%; left: 50%; opacity: 1; }
          52%  { top: 50%; left: 50%; opacity: 0; }
          100% { top: 92%; left: 6%;  opacity: 0; }
        }
      `}</style>
    </div>
  )
}
