import Image from 'next/image'

/**
 * Happy Accident — cursor tries an idea (rotate 45°), hesitates, undoes it,
 * tries another (shrink + rotate the other way), hesitates, undoes that
 * too, and settles back on the correct version. Subtly communicates that
 * good design comes from exploration, not just landing on the first idea.
 */
export function HappyAccident({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <div className="hv-stage">
      <div className="dc-object">
        {logoUrl
          ? <Image src={logoUrl} alt="" fill style={{ objectFit: 'contain' }} />
          : (
            <svg viewBox="0 0 200 200" className="dc-fallback-mark">
              <circle cx="100" cy="100" r="52" />
              <line x1="100" y1="8" x2="100" y2="192" />
              <line x1="8" y1="100" x2="192" y2="100" />
            </svg>
          )
        }
        <div className="dc-selection hv-chrome">
          <span className="dc-handle dc-handle-tl" />
          <span className="dc-handle dc-handle-tr" />
          <span className="dc-handle dc-handle-bl" />
          <span className="dc-handle dc-handle-br" />
          <span className="dc-rotate-stem" />
          <span className="dc-rotate-handle" />
        </div>
      </div>

      <div className="dc-click-ripple dc-click-ripple-1 hv-chrome" />
      <div className="dc-click-ripple dc-click-ripple-2 hv-chrome" />

      <div className="dc-think-toast dc-think-toast-1 hv-chrome">
        <span className="dc-dot" /><span className="dc-dot" /><span className="dc-dot" />
      </div>
      <div className="dc-think-toast dc-think-toast-2 hv-chrome">
        <span className="dc-dot" /><span className="dc-dot" /><span className="dc-dot" />
      </div>

      <div className="dc-undo-toast dc-undo-toast-1 hv-chrome">
        <span className="dc-undo-key">⌘</span><span className="dc-undo-key">Z</span>
      </div>
      <div className="dc-undo-toast dc-undo-toast-2 hv-chrome">
        <span className="dc-undo-key">⌘</span><span className="dc-undo-key">Z</span>
      </div>

      <div className="dc-readout dc-readout-1 hv-chrome">45°</div>
      <div className="dc-readout dc-readout-2 hv-chrome">82%</div>

      <div className="dc-cursor hv-chrome">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 2L4 19.5L8.5 15.5L11.5 22L14.5 20.5L11.5 14L17.5 14L4 2Z" fill="white" stroke="#0A0A0A" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        .dc-object {
          position: absolute; top: 50%; left: 50%;
          width: 40%; height: 40%;
          transform-origin: center;
          animation: dc-object-transform 13s linear infinite;
        }
        .dc-fallback-mark { width: 100%; height: 100%; fill: none; stroke: var(--fg-subtle); stroke-width: 1.5; }

        /* rest -> try #1: rotate 45 (wrong) -> undo -> try #2: rotate -25
           + shrink (also wrong) -> undo -> back to the correct rest state */
        @keyframes dc-object-transform {
          0%, 11%  { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          27%      { transform: translate(-50%, -50%) rotate(45deg) scale(1); }
          35%      { transform: translate(-50%, -50%) rotate(45deg) scale(1); }
          39%      { transform: translate(-50%, -50%) rotate(0deg) scale(1); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
          43%      { transform: translate(-50%, -50%) rotate(0deg) scale(1); animation-timing-function: linear; }
          59%      { transform: translate(-50%, -50%) rotate(-25deg) scale(0.82); }
          67%      { transform: translate(-50%, -50%) rotate(-25deg) scale(0.82); }
          71%      { transform: translate(-50%, -50%) rotate(0deg) scale(1); animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
          100%     { transform: translate(-50%, -50%) rotate(0deg) scale(1); animation-timing-function: linear; }
        }

        .dc-selection {
          position: absolute; inset: -12%;
          border: 2px dashed var(--fg);
          opacity: 0;
          animation: dc-selection-life 13s ease infinite;
          pointer-events: none;
        }
        @keyframes dc-selection-life {
          0%, 8%    { opacity: 0; }
          11%, 86%  { opacity: 0.85; }
          90%, 100% { opacity: 0; }
        }
        .dc-handle {
          position: absolute; width: 11px; height: 11px;
          background: var(--bg); border: 2px solid var(--fg);
        }
        .dc-handle-tl { top: -5.5px; left: -5.5px; }
        .dc-handle-tr { top: -5.5px; right: -5.5px; }
        .dc-handle-bl { bottom: -5.5px; left: -5.5px; animation: dc-handle-bl-glow 13s linear infinite; }
        .dc-handle-br { bottom: -5.5px; right: -5.5px; }
        .dc-rotate-stem { position: absolute; top: -34px; left: 50%; width: 2px; height: 17px; background: var(--fg); opacity: 0.7; }
        .dc-rotate-handle {
          position: absolute; top: -42px; left: 50%; width: 12px; height: 12px;
          border-radius: 50%; background: var(--accent); transform: translateX(-50%);
          animation: dc-rotate-handle-glow 13s linear infinite;
        }
        @keyframes dc-rotate-handle-glow {
          0%, 13%  { box-shadow: none; }
          16%, 38% { box-shadow: 0 0 0 5px rgba(196, 30, 58, 0.35); }
          41%      { box-shadow: none; }
          100%     { box-shadow: none; }
        }
        @keyframes dc-handle-bl-glow {
          0%, 41%  { box-shadow: none; }
          44%, 70% { box-shadow: 0 0 0 5px rgba(196, 30, 58, 0.35); }
          73%      { box-shadow: none; }
          100%     { box-shadow: none; }
        }

        .dc-click-ripple {
          position: absolute; top: 50%; left: 50%;
          width: 12px; height: 12px; margin: -6px 0 0 -6px;
          border-radius: 50%; border: 2px solid var(--accent);
          opacity: 0; transform: scale(0.4);
        }
        .dc-click-ripple-1 { animation: dc-ripple-1 13s ease infinite; }
        .dc-click-ripple-2 { animation: dc-ripple-2 13s ease infinite; }
        @keyframes dc-ripple-1 {
          0%, 8.5% { opacity: 0; transform: scale(0.4); }
          10%      { opacity: 0.9; transform: scale(1); }
          13%      { opacity: 0; transform: scale(1.8); }
          100%     { opacity: 0; }
        }
        @keyframes dc-ripple-2 {
          0%, 77%  { opacity: 0; transform: scale(0.4); }
          79%      { opacity: 0.9; transform: scale(1); }
          82%      { opacity: 0; transform: scale(1.8); }
          100%     { opacity: 0; }
        }

        .dc-think-toast {
          position: absolute; top: 6%; left: 6%;
          display: flex; gap: 4px; align-items: center;
          padding: 8px 12px;
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 20px;
          opacity: 0; transform: translateY(4px) scale(0.94);
        }
        .dc-think-toast-1 { animation: dc-think-1 13s ease infinite; }
        .dc-think-toast-2 { animation: dc-think-2 13s ease infinite; }
        .dc-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--fg-subtle); animation: dc-dot-pulse 1.1s ease-in-out infinite; }
        .dc-dot:nth-child(2) { animation-delay: 0.15s; }
        .dc-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dc-dot-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes dc-think-1 {
          0%, 28%  { opacity: 0; transform: translateY(4px) scale(0.94); }
          30%, 34% { opacity: 1; transform: translateY(0) scale(1); }
          37%      { opacity: 0; transform: translateY(-4px) scale(0.94); }
          100%     { opacity: 0; }
        }
        @keyframes dc-think-2 {
          0%, 60%  { opacity: 0; transform: translateY(4px) scale(0.94); }
          62%, 66% { opacity: 1; transform: translateY(0) scale(1); }
          69%      { opacity: 0; transform: translateY(-4px) scale(0.94); }
          100%     { opacity: 0; }
        }

        .dc-undo-toast {
          position: absolute; top: 6%; right: 6%;
          display: flex; gap: 4px; align-items: center;
          padding: 7px 11px;
          background: var(--fg); color: var(--bg);
          font-family: var(--font-body); font-size: 12px; font-weight: 600;
          border-radius: 4px;
          opacity: 0; transform: translateY(4px) scale(0.94);
        }
        .dc-undo-toast-1 { animation: dc-undo-1 13s ease infinite; }
        .dc-undo-toast-2 { animation: dc-undo-2 13s ease infinite; }
        @keyframes dc-undo-1 {
          0%, 36%  { opacity: 0; transform: translateY(4px) scale(0.94); }
          38%, 40% { opacity: 1; transform: translateY(0) scale(1); }
          43%      { opacity: 0; transform: translateY(-4px) scale(0.94); }
          100%     { opacity: 0; }
        }
        @keyframes dc-undo-2 {
          0%, 68%  { opacity: 0; transform: translateY(4px) scale(0.94); }
          70%, 72% { opacity: 1; transform: translateY(0) scale(1); }
          75%      { opacity: 0; transform: translateY(-4px) scale(0.94); }
          100%     { opacity: 0; }
        }

        .dc-readout {
          position: absolute;
          padding: 4px 8px;
          background: var(--accent); color: white;
          font-family: var(--font-body); font-size: 11px; font-weight: 700;
          border-radius: 3px;
          opacity: 0; transform: scale(0.85);
          pointer-events: none;
        }
        .dc-readout-1 { top: 22%; left: 78%; animation: dc-readout-1-life 13s linear infinite; }
        .dc-readout-2 { top: 80%; left: 44%; animation: dc-readout-2-life 13s linear infinite; }
        @keyframes dc-readout-1-life {
          0%, 26%  { opacity: 0; transform: scale(0.85); }
          28%, 38% { opacity: 1; transform: scale(1); }
          40%      { opacity: 0; transform: scale(0.85); }
          100%     { opacity: 0; }
        }
        @keyframes dc-readout-2-life {
          0%, 58%  { opacity: 0; transform: scale(0.85); }
          60%, 70% { opacity: 1; transform: scale(1); }
          72%      { opacity: 0; transform: scale(0.85); }
          100%     { opacity: 0; }
        }

        .dc-cursor {
          position: absolute; width: 30px; height: 30px;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.45));
          animation: dc-cursor-move 13s linear infinite;
        }
        .dc-cursor svg { width: 100%; height: 100%; }

        @keyframes dc-cursor-move {
          0%   { top: 90%;   left: 4%; }
          9%   { top: 50%;   left: 47%; }
          11%  { top: 50%;   left: 47%; }
          15%  { top: 15.7%; left: 50%; }
          19%  { top: 16.8%; left: 58.9%; }
          23%  { top: 20.3%; left: 67.2%; }
          27%  { top: 25.7%; left: 74.3%; }
          35%  { top: 25.7%; left: 74.3%; }
          39%  { top: 25.7%; left: 74.3%; }
          43%  { top: 74.8%; left: 25.2%; }
          50%  { top: 76.4%; left: 30.3%; }
          55%  { top: 77.2%; left: 35.3%; }
          59%  { top: 77%;   left: 40.2%; }
          67%  { top: 77%;   left: 40.2%; }
          71%  { top: 77%;   left: 40.2%; }
          75%  { top: 50%;   left: 50%; }
          82%  { top: 50%;   left: 50%; }
          90%  { top: 78%;   left: 20%; }
          100% { top: 90%;   left: 4%; }
        }
      `}</style>
    </div>
  )
}
