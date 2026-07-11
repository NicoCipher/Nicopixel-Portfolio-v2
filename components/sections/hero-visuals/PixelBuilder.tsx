import Image from 'next/image'

const CELL = 100 / 9 // 9x9 grid

const WAVES: [number, number][][] = [
  [[4, 4]],
  [[4, 3], [3, 4], [5, 4], [4, 5]],
  [[3, 3], [5, 3], [3, 5], [5, 5]],
  [[4, 2], [2, 4], [6, 4], [4, 6], [3, 2], [5, 2], [2, 3], [6, 3], [2, 5], [6, 5], [3, 6], [5, 6]],
  [[2, 2], [6, 2], [2, 6], [6, 6]],
  [[4, 1], [1, 4], [7, 4], [4, 7], [3, 1], [5, 1], [1, 3], [7, 3], [1, 5], [7, 5], [3, 7], [5, 7]],
]
const STRAYS: [number, number][] = [[1, 1], [7, 1], [1, 7], [7, 7], [4, 0]]

/**
 * The Pixel Builder — a mark builds up pixel by pixel, ring by ring from
 * the center outward, plus a few stray pixels that get placed and then
 * swept away, before crossfading into the real, finished logo.
 *
 * Waves (not individually-delayed pixels) are used deliberately: with 30+
 * separately-delayed infinite CSS animations there's a real risk of visible
 * phase drift between loops (each pixel's own reset point lands at a
 * different moment relative to the shared clock). Grouping into 6 waves
 * that all share animation-delay: 0 keeps everything on one clock, so the
 * loop reset is guaranteed clean.
 */
export function PixelBuilder({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <div className="hv-stage">
      <div className="pb-grid">
        {WAVES.map((wave, i) => (
          <div key={i} className={`pb-wave pb-wave-${i}`}>
            {wave.map(([x, y]) => (
              <span key={`${x}-${y}`} className="pb-pixel" style={{ left: `${x * CELL}%`, top: `${y * CELL}%`, width: `${CELL * 0.82}%`, height: `${CELL * 0.82}%` }} />
            ))}
          </div>
        ))}
        <div className="pb-wave pb-stray">
          {STRAYS.map(([x, y]) => (
            <span key={`${x}-${y}`} className="pb-pixel pb-pixel-stray" style={{ left: `${x * CELL}%`, top: `${y * CELL}%`, width: `${CELL * 0.82}%`, height: `${CELL * 0.82}%` }} />
          ))}
        </div>
      </div>

      <div className="pb-brush-cursor hv-chrome">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 2L4 19.5L8.5 15.5L11.5 22L14.5 20.5L11.5 14L17.5 14L4 2Z" fill="white" stroke="#0A0A0A" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="pb-cleanup-label hv-chrome">Cleaning up</div>

      <div className="pb-final">
        {logoUrl
          ? <Image src={logoUrl} alt="" fill style={{ objectFit: 'contain' }} />
          : (
            <svg viewBox="0 0 200 200" className="pb-final-svg">
              <circle cx="100" cy="100" r="52" />
              <line x1="100" y1="8" x2="100" y2="192" />
              <line x1="8" y1="100" x2="192" y2="100" />
            </svg>
          )
        }
      </div>

      <style>{`
        .pb-grid { position: absolute; inset: 22%; }
        .pb-pixel {
          position: absolute; background: var(--fg);
          opacity: 0; transform: scale(0);
        }
        .pb-pixel-stray { background: var(--accent); }

        .pb-wave-0 .pb-pixel { animation: pb-pop-0 11s linear infinite; }
        .pb-wave-1 .pb-pixel { animation: pb-pop-1 11s linear infinite; }
        .pb-wave-2 .pb-pixel { animation: pb-pop-2 11s linear infinite; }
        .pb-wave-3 .pb-pixel { animation: pb-pop-3 11s linear infinite; }
        .pb-wave-4 .pb-pixel { animation: pb-pop-4 11s linear infinite; }
        .pb-wave-5 .pb-pixel { animation: pb-pop-5 11s linear infinite; }
        .pb-stray .pb-pixel { animation: pb-pop-stray 11s linear infinite; }

        @keyframes pb-pop-0 { 0%, 3%  { opacity: 0; transform: scale(0); } 6%, 62% { opacity: 1; transform: scale(1); } 68%, 100% { opacity: 0; transform: scale(0.6); } }
        @keyframes pb-pop-1 { 0%, 6%  { opacity: 0; transform: scale(0); } 9%, 62% { opacity: 1; transform: scale(1); } 68%, 100% { opacity: 0; transform: scale(0.6); } }
        @keyframes pb-pop-2 { 0%, 9%  { opacity: 0; transform: scale(0); } 12%, 62% { opacity: 1; transform: scale(1); } 68%, 100% { opacity: 0; transform: scale(0.6); } }
        @keyframes pb-pop-3 { 0%, 13% { opacity: 0; transform: scale(0); } 17%, 62% { opacity: 1; transform: scale(1); } 68%, 100% { opacity: 0; transform: scale(0.6); } }
        @keyframes pb-pop-4 { 0%, 18% { opacity: 0; transform: scale(0); } 21%, 62% { opacity: 1; transform: scale(1); } 68%, 100% { opacity: 0; transform: scale(0.6); } }
        @keyframes pb-pop-5 { 0%, 22% { opacity: 0; transform: scale(0); } 26%, 62% { opacity: 1; transform: scale(1); } 68%, 100% { opacity: 0; transform: scale(0.6); } }

        /* Strays pop in mixed with the later waves, held, then swept away
           slowly enough to actually read as a deliberate cleanup pass */
        @keyframes pb-pop-stray {
          0%, 24%  { opacity: 0; transform: scale(0); }
          28%, 40% { opacity: 1; transform: scale(1); }
          56%      { opacity: 0; transform: scale(0.5); }
          100%     { opacity: 0; }
        }

        .pb-cleanup-label {
          position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
          font-family: var(--font-body); font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent);
          opacity: 0;
          animation: pb-cleanup-label-life 11s linear infinite;
        }
        @keyframes pb-cleanup-label-life {
          0%, 41%  { opacity: 0; }
          43%, 55% { opacity: 1; }
          58%, 100% { opacity: 0; }
        }

        .pb-brush-cursor {
          position: absolute; width: 28px; height: 28px;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.45));
          opacity: 0;
          animation: pb-brush-move 11s linear infinite;
        }
        .pb-brush-cursor svg { width: 100%; height: 100%; }
        /* Two visible sweep passes, not one instant diagonal flick */
        @keyframes pb-brush-move {
          0%, 40%   { top: 22%; left: 18%; opacity: 0; }
          42%       { top: 22%; left: 18%; opacity: 1; }
          47%       { top: 22%; left: 82%; opacity: 1; }
          49%       { top: 82%; left: 82%; opacity: 1; }
          54%       { top: 82%; left: 18%; opacity: 1; }
          57%, 100% { top: 82%; left: 18%; opacity: 0; }
        }

        .pb-final {
          position: absolute; inset: 22%;
          opacity: 0;
          animation: pb-final-life 11s linear infinite;
        }
        .pb-final-svg { width: 100%; height: 100%; fill: none; stroke: var(--fg-subtle); stroke-width: 1.5; }
        @keyframes pb-final-life {
          0%, 64%  { opacity: 0; }
          70%, 92% { opacity: 1; }
          96%      { opacity: 0; }
          100%     { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
