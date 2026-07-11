import Image from 'next/image'

/**
 * Designer's Speedrun — draws a shape, duplicates it, aligns the two,
 * groups them, centers the group, and saves — fast, confident, no
 * hesitation. Crossfades into the real logo at the finish.
 */
export function Speedrun({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <div className="hv-stage">
      <div className="sr-group">
        <svg viewBox="0 0 200 200" className="sr-shape sr-shape-a">
          <circle cx="100" cy="100" r="48" />
          <line x1="100" y1="12" x2="100" y2="188" />
          <line x1="12" y1="100" x2="188" y2="100" />
        </svg>
        <svg viewBox="0 0 200 200" className="sr-shape sr-shape-b">
          <circle cx="100" cy="100" r="48" />
          <line x1="100" y1="12" x2="100" y2="188" />
          <line x1="12" y1="100" x2="188" y2="100" />
        </svg>
        <div className="sr-group-box hv-chrome" />
      </div>

      <div className="sr-final">
        {logoUrl
          ? <Image src={logoUrl} alt="" fill style={{ objectFit: 'contain' }} />
          : (
            <svg viewBox="0 0 200 200" className="sr-final-svg">
              <circle cx="100" cy="100" r="52" />
              <line x1="100" y1="8" x2="100" y2="192" />
              <line x1="8" y1="100" x2="192" y2="100" />
            </svg>
          )
        }
      </div>

      <div className="sr-saved-toast hv-chrome">
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Saved
      </div>

      {/* Action labels — this is the fastest-paced variant with 6 named
          steps happening in ~6 seconds; without a label naming each one,
          it reads as "some shapes moving fast" rather than a legible
          sequence of specific actions. */}
      <div className="sr-action-label sr-action-label-1 hv-chrome">Draw</div>
      <div className="sr-action-label sr-action-label-2 hv-chrome">Duplicate</div>
      <div className="sr-action-label sr-action-label-3 hv-chrome">Align</div>
      <div className="sr-action-label sr-action-label-4 hv-chrome">Group</div>
      <div className="sr-action-label sr-action-label-5 hv-chrome">Center</div>

      <style>{`
        .sr-group {
          position: absolute; inset: 30%;
          animation: sr-group-move 10s linear infinite;
        }
        @keyframes sr-group-move {
          0%, 46%  { transform: translate(0, 0); }
          58%      { transform: translate(-8%, -6%); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
          64%, 100% { transform: translate(-8%, -6%); animation-timing-function: linear; }
        }

        .sr-shape {
          position: absolute; inset: 0; fill: none; stroke: var(--fg); stroke-width: 2;
          stroke-dasharray: 400; stroke-dashoffset: 400;
        }
        .sr-shape-a { animation: sr-draw-a 10s linear infinite; }
        .sr-shape-b {
          animation: sr-draw-b 10s linear infinite;
          transform: translate(38%, 8%); stroke: var(--fg-subtle);
        }
        @keyframes sr-draw-a {
          0%       { opacity: 1; stroke-dashoffset: 400; }
          13%      { stroke-dashoffset: 0; }
          62%      { opacity: 1; stroke-dashoffset: 0; }
          66%      { opacity: 0; stroke-dashoffset: 0; }
          100%     { opacity: 0; }
        }
        @keyframes sr-draw-b {
          0%, 15%  { opacity: 0; stroke-dashoffset: 400; transform: translate(38%, 8%); }
          17%      { opacity: 1; stroke-dashoffset: 400; transform: translate(38%, 8%); }
          27%      { opacity: 1; stroke-dashoffset: 0; transform: translate(38%, 8%); }
          40%      { opacity: 1; stroke-dashoffset: 0; transform: translate(38%, 8%); }
          46%      { opacity: 1; stroke-dashoffset: 0; transform: translate(4%, 8%); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
          50%, 62% { opacity: 1; stroke-dashoffset: 0; transform: translate(4%, 8%); animation-timing-function: linear; }
          66%      { opacity: 0; stroke-dashoffset: 0; transform: translate(4%, 8%); }
          100%     { opacity: 0; }
        }

        .sr-group-box {
          position: absolute; inset: -6% 30% -6% -6%;
          border: 2px dashed var(--accent);
          opacity: 0;
          animation: sr-group-box-life 10s linear infinite;
        }
        @keyframes sr-group-box-life {
          0%, 47%  { opacity: 0; }
          50%, 62% { opacity: 0.85; }
          65%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        .sr-final {
          position: absolute; inset: 22%;
          opacity: 0;
          animation: sr-final-life 10s linear infinite;
        }
        .sr-final-svg { width: 100%; height: 100%; fill: none; stroke: var(--fg-subtle); stroke-width: 1.5; }
        @keyframes sr-final-life {
          0%, 63%  { opacity: 0; }
          68%, 90% { opacity: 1; }
          95%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        .sr-saved-toast {
          position: absolute; top: 12%; right: 8%;
          display: flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          background: var(--accent); color: white;
          font-family: var(--font-body); font-size: 12px; font-weight: 600;
          border-radius: 4px;
          opacity: 0; transform: translateY(4px) scale(0.94);
          animation: sr-saved-life 10s linear infinite;
        }
        @keyframes sr-saved-life {
          0%, 65%  { opacity: 0; transform: translateY(4px) scale(0.94); }
          68%, 82% { opacity: 1; transform: translateY(0) scale(1); }
          87%      { opacity: 0; transform: translateY(-4px) scale(0.94); }
          100%     { opacity: 0; }
        }

        /* Action labels — one clean window each, no two visible at once */
        .sr-action-label {
          position: absolute; bottom: 10%; left: 50%; transform: translateX(-50%);
          font-family: var(--font-body); font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent);
          opacity: 0;
        }
        .sr-action-label-1 { animation: sr-label-1 10s linear infinite; }
        .sr-action-label-2 { animation: sr-label-2 10s linear infinite; }
        .sr-action-label-3 { animation: sr-label-3 10s linear infinite; }
        .sr-action-label-4 { animation: sr-label-4 10s linear infinite; }
        .sr-action-label-5 { animation: sr-label-5 10s linear infinite; }
        @keyframes sr-label-1 { 0%, 1%   { opacity: 0; } 3%, 12%  { opacity: 1; } 14%, 100% { opacity: 0; } }
        @keyframes sr-label-2 { 0%, 15%  { opacity: 0; } 17%, 25% { opacity: 1; } 27%, 100% { opacity: 0; } }
        @keyframes sr-label-3 { 0%, 28%  { opacity: 0; } 30%, 43% { opacity: 1; } 45%, 100% { opacity: 0; } }
        @keyframes sr-label-4 { 0%, 46%  { opacity: 0; } 48%, 56% { opacity: 1; } 58%, 100% { opacity: 0; } }
        @keyframes sr-label-5 { 0%, 59%  { opacity: 0; } 61%, 64% { opacity: 1; } 66%, 100% { opacity: 0; } }
      `}</style>
    </div>
  )
}
