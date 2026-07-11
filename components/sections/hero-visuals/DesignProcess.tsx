import Image from 'next/image'

/**
 * The Design Process — the same mark cross-fades through six stages of
 * getting made: a rough sketch, laid onto a grid, cleaned into a vector
 * with visible anchor points, checked for spacing, filled with color, and
 * finally the real logo. About 1.5s per stage.
 */
export function DesignProcess({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <div className="hv-stage">
      {/* 1. Sketch — rough, doubled, slightly offset strokes */}
      <div className="dp-layer dp-layer-1">
        <svg viewBox="0 0 200 200" className="dp-sketch">
          <g>
            <circle cx="100" cy="100" r="53" transform="rotate(-1.5 100 100)" />
            <line x1="99" y1="7" x2="101" y2="193" />
            <line x1="7" y1="99" x2="193" y2="101" />
          </g>
          <g className="dp-sketch-ghost">
            <circle cx="101" cy="99" r="51" transform="rotate(2 100 100)" />
            <line x1="102" y1="9" x2="99" y2="191" />
            <line x1="9" y1="101" x2="191" y2="98" />
          </g>
        </svg>
      </div>

      {/* 2. Grid — laid onto a construction grid */}
      <div className="dp-layer dp-layer-2">
        <svg viewBox="0 0 200 200" className="dp-grid-svg">
          <g className="dp-grid-lines">
            <line x1="50" y1="0" x2="50" y2="200" /><line x1="100" y1="0" x2="100" y2="200" /><line x1="150" y1="0" x2="150" y2="200" />
            <line x1="0" y1="50" x2="200" y2="50" /><line x1="0" y1="100" x2="200" y2="100" /><line x1="0" y1="150" x2="200" y2="150" />
          </g>
          <circle cx="100" cy="100" r="52" />
          <line x1="100" y1="8" x2="100" y2="192" />
          <line x1="8" y1="100" x2="192" y2="100" />
        </svg>
      </div>

      {/* 3. Vector — clean path with visible anchor points */}
      <div className="dp-layer dp-layer-3">
        <svg viewBox="0 0 200 200" className="dp-vector-svg">
          <circle cx="100" cy="100" r="52" />
          <line x1="100" y1="8" x2="100" y2="192" />
          <line x1="8" y1="100" x2="192" y2="100" />
          <circle className="dp-anchor" cx="100" cy="48" r="4" />
          <circle className="dp-anchor" cx="100" cy="152" r="4" />
          <circle className="dp-anchor" cx="48" cy="100" r="4" />
          <circle className="dp-anchor" cx="152" cy="100" r="4" />
          <circle className="dp-anchor" cx="100" cy="100" r="4" />
        </svg>
      </div>

      {/* 4. Spacing — dimension guides */}
      <div className="dp-layer dp-layer-4">
        <svg viewBox="0 0 200 200" className="dp-spacing-svg">
          <circle cx="100" cy="100" r="52" />
          <line x1="100" y1="8" x2="100" y2="192" />
          <line x1="8" y1="100" x2="192" y2="100" />
          <line className="dp-dim-line" x1="100" y1="100" x2="152" y2="100" />
          <line className="dp-dim-tick" x1="152" y1="94" x2="152" y2="106" />
        </svg>
        <span className="dp-dim-label">52px</span>
      </div>

      {/* 5. Color — filled solid */}
      <div className="dp-layer dp-layer-5">
        <svg viewBox="0 0 200 200" className="dp-color-svg">
          <circle cx="100" cy="100" r="52" />
          <line x1="100" y1="8" x2="100" y2="192" />
          <line x1="8" y1="100" x2="192" y2="100" />
        </svg>
      </div>

      {/* 6. Finished — the real logo or the same clean mark */}
      <div className="dp-layer dp-layer-6">
        {logoUrl
          ? <Image src={logoUrl} alt="" fill style={{ objectFit: 'contain' }} />
          : (
            <svg viewBox="0 0 200 200" className="dp-final-svg">
              <circle cx="100" cy="100" r="52" />
              <line x1="100" y1="8" x2="100" y2="192" />
              <line x1="8" y1="100" x2="192" y2="100" />
            </svg>
          )
        }
      </div>

      {/* Stage labels — the six stages look visually similar at a glance
          (sketch vs. grid vs. vector isn't self-evident from line art
          alone); naming each one directly is what actually communicates
          "this is a process," not just "some shapes changing." */}
      <div className="dp-stage-label dp-stage-label-1 hv-chrome">Sketch</div>
      <div className="dp-stage-label dp-stage-label-2 hv-chrome">Grid</div>
      <div className="dp-stage-label dp-stage-label-3 hv-chrome">Vector</div>
      <div className="dp-stage-label dp-stage-label-4 hv-chrome">Spacing</div>
      <div className="dp-stage-label dp-stage-label-5 hv-chrome">Color</div>
      <div className="dp-stage-label dp-stage-label-6 hv-chrome">Logo</div>

      {/* Progress dots — reinforce that this is one sequence with six
          steps, not six unrelated cuts */}
      <div className="dp-progress hv-chrome">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <span key={n} className={`dp-progress-dot dp-progress-dot-${n}`} />
        ))}
      </div>

      <style>{`
        .dp-layer {
          position: absolute; inset: 22%;
          opacity: 0;
        }
        .dp-layer-1 { animation: dp-l1 11s linear infinite; }
        .dp-layer-2 { animation: dp-l2 11s linear infinite; }
        .dp-layer-3 { animation: dp-l3 11s linear infinite; }
        .dp-layer-4 { animation: dp-l4 11s linear infinite; }
        .dp-layer-5 { animation: dp-l5 11s linear infinite; }
        .dp-layer-6 { animation: dp-l6 11s linear infinite; }

        @keyframes dp-l1 { 0%, 1% { opacity: 0; } 3%, 11% { opacity: 1; } 14% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes dp-l2 { 0%, 13% { opacity: 0; } 15%, 23% { opacity: 1; } 26% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes dp-l3 { 0%, 25% { opacity: 0; } 27%, 35% { opacity: 1; } 38% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes dp-l4 { 0%, 37% { opacity: 0; } 39%, 47% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes dp-l5 { 0%, 49% { opacity: 0; } 51%, 59% { opacity: 1; } 62% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes dp-l6 { 0%, 61% { opacity: 0; } 64%, 90% { opacity: 1; } 94% { opacity: 0; } 100% { opacity: 0; } }

        /* Stage labels — identical timing to their matching dp-layer-N so
           the name and the visual always appear/disappear together */
        .dp-stage-label {
          position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
          font-family: var(--font-body); font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent);
          opacity: 0;
        }
        .dp-stage-label-1 { animation: dp-l1 11s linear infinite; }
        .dp-stage-label-2 { animation: dp-l2 11s linear infinite; }
        .dp-stage-label-3 { animation: dp-l3 11s linear infinite; }
        .dp-stage-label-4 { animation: dp-l4 11s linear infinite; }
        .dp-stage-label-5 { animation: dp-l5 11s linear infinite; }
        .dp-stage-label-6 { animation: dp-l6 11s linear infinite; color: var(--fg); }

        /* Progress dots — reinforce "one sequence, six steps" */
        .dp-progress { position: absolute; top: 8%; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
        .dp-progress-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border); transition: none; }
        .dp-progress-dot-1 { animation: dp-dot-1 11s linear infinite; }
        .dp-progress-dot-2 { animation: dp-dot-2 11s linear infinite; }
        .dp-progress-dot-3 { animation: dp-dot-3 11s linear infinite; }
        .dp-progress-dot-4 { animation: dp-dot-4 11s linear infinite; }
        .dp-progress-dot-5 { animation: dp-dot-5 11s linear infinite; }
        .dp-progress-dot-6 { animation: dp-dot-6 11s linear infinite; }
        @keyframes dp-dot-1 { 0%, 1% { background: var(--border); } 3%, 13% { background: var(--accent); } 15%, 100% { background: var(--border); } }
        @keyframes dp-dot-2 { 0%, 14% { background: var(--border); } 16%, 25% { background: var(--accent); } 27%, 100% { background: var(--border); } }
        @keyframes dp-dot-3 { 0%, 26% { background: var(--border); } 28%, 37% { background: var(--accent); } 39%, 100% { background: var(--border); } }
        @keyframes dp-dot-4 { 0%, 38% { background: var(--border); } 40%, 49% { background: var(--accent); } 51%, 100% { background: var(--border); } }
        @keyframes dp-dot-5 { 0%, 50% { background: var(--border); } 52%, 61% { background: var(--accent); } 63%, 100% { background: var(--border); } }
        @keyframes dp-dot-6 { 0%, 62% { background: var(--border); } 65%, 92% { background: var(--accent); } 95%, 100% { background: var(--border); } }

        .dp-layer svg { width: 100%; height: 100%; fill: none; }

        /* 1. Sketch — rough double-line, hand-drawn feel */
        .dp-sketch g { stroke: var(--fg); stroke-width: 1.4; stroke-linecap: round; }
        .dp-sketch-ghost { opacity: 0.4; }

        /* 2. Grid */
        .dp-grid-lines line { stroke: var(--border); stroke-width: 1; }
        .dp-grid-svg circle, .dp-grid-svg > line { stroke: var(--fg); stroke-width: 1.5; }

        /* 3. Vector, with anchor points */
        .dp-vector-svg circle:first-of-type, .dp-vector-svg > line { stroke: var(--fg); stroke-width: 1.25; }
        .dp-anchor { fill: var(--bg); stroke: var(--accent); stroke-width: 1.5; }

        /* 4. Spacing guides */
        .dp-spacing-svg circle, .dp-spacing-svg > line:not(.dp-dim-line):not(.dp-dim-tick) { stroke: var(--fg-subtle); stroke-width: 1.25; }
        .dp-dim-line, .dp-dim-tick { stroke: var(--accent); stroke-width: 1.5; }
        .dp-dim-label {
          position: absolute; top: 44%; left: 82%;
          font-family: var(--font-body); font-size: 11px; font-weight: 700;
          color: var(--accent);
        }

        /* 5. Color fill */
        .dp-color-svg circle { fill: var(--accent); stroke: none; }
        .dp-color-svg line { stroke: var(--accent); stroke-width: 6; stroke-linecap: round; }

        /* 6. Finished mark */
        .dp-final-svg circle, .dp-final-svg line { stroke: var(--fg-subtle); stroke-width: 1.5; }
      `}</style>
    </div>
  )
}
