type Milestone = {
  id: string
  date_range: string
  title: string
  subtitle: string | null
  description: string | null
}

export function CareerMilestones({ milestones }: { milestones: Milestone[] }) {
  if (!milestones || milestones.length === 0) return null

  return (
    <div className="cm-timeline">
      <div className="cm-line" aria-hidden="true" />
      {milestones.map((m, i) => (
        <div key={m.id} className={`cm-item ${i % 2 === 0 ? 'cm-item-left' : 'cm-item-right'}`}>
          <div className="cm-dot" aria-hidden="true" />
          <div className="cm-card">
            <span className="cm-date">{m.date_range}</span>
            <h3 className="cm-title">{m.title}</h3>
            {m.subtitle && <span className="cm-subtitle">{m.subtitle}</span>}
            {m.description && <p className="cm-desc">{m.description}</p>}
          </div>
        </div>
      ))}

      <style>{`
        .cm-timeline {
          position: relative;
          display: flex; flex-direction: column;
          gap: 0;
        }
        .cm-line {
          position: absolute; top: 0; bottom: 0; left: 50%;
          width: 1px; background: var(--border);
          transform: translateX(-50%);
        }
        .cm-item {
          position: relative;
          display: grid; grid-template-columns: 1fr 1fr;
          padding: 36px 0;
        }
        .cm-dot {
          position: absolute; top: 40px; left: 50%;
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--accent);
          transform: translateX(-50%);
          box-shadow: 0 0 0 4px var(--bg);
          z-index: 1;
        }
        .cm-card { max-width: 420px; }
        .cm-item-left .cm-card { grid-column: 1; justify-self: end; text-align: right; padding-right: 48px; }
        .cm-item-right .cm-card { grid-column: 2; justify-self: start; text-align: left; padding-left: 48px; }

        .cm-date {
          display: block;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--accent); font-weight: 600; margin-bottom: 10px;
        }
        .cm-title {
          font-family: var(--font-heading); font-size: clamp(19px, 2.2vw, 24px);
          font-weight: 500; color: var(--fg); line-height: 1.25; margin-bottom: 4px;
        }
        .cm-subtitle {
          display: block;
          font-size: 12.5px; letter-spacing: 0.04em; color: var(--fg-subtle);
          margin-bottom: 10px;
        }
        .cm-desc { font-size: 14px; line-height: 1.75; color: var(--fg-muted); }

        @media(max-width: 767px) {
          .cm-line { left: 14px; }
          .cm-item { grid-template-columns: 1fr; padding: 0 0 32px 40px; }
          .cm-item:last-child { padding-bottom: 0; }
          .cm-dot { top: 6px; left: 14px; }
          .cm-item-left .cm-card, .cm-item-right .cm-card {
            grid-column: 1; justify-self: start; text-align: left;
            padding-left: 0; padding-right: 0; max-width: none;
          }
        }
      `}</style>
    </div>
  )
}
