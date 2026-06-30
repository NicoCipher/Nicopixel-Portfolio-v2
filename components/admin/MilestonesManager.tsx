'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#0A0A0A', border: '1px solid #1F1F1F',
  color: '#FAFAF9', fontSize: 13, outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.2s',
}
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#C41E3A')
const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#1F1F1F')
const label: React.CSSProperties = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 7 }
const field: React.CSSProperties = { display: 'flex', flexDirection: 'column', marginBottom: 16 }

type Milestone = {
  id: string; date_range: string; sort_year: number;
  title: string; subtitle: string | null; description: string | null;
  sort_order: number; active: boolean
}

export function MilestonesManager({ initialMilestones }: { initialMilestones: Milestone[] }) {
  const [milestones, setMilestones] = useState(initialMilestones)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const saveMilestone = async (m: Milestone) => {
    const supabase = createClient()
    const { id, ...rest } = m
    if (id.startsWith('new-')) {
      const { data, error } = await supabase.from('career_milestones').insert(rest).select().single()
      if (error) { alert(`Couldn't save: ${error.message}`); return }
      if (data) setMilestones(ms => ms.map(x => x.id === id ? data : x))
    } else {
      const { error } = await supabase.from('career_milestones').update(rest).eq('id', id)
      if (error) { alert(`Couldn't save: ${error.message}`); return }
    }
    flash(); router.refresh()
  }

  const deleteMilestone = async (id: string) => {
    if (!confirm('Delete this milestone?')) return
    const supabase = createClient()
    if (!id.startsWith('new-')) {
      const { error } = await supabase.from('career_milestones').delete().eq('id', id)
      if (error) { alert(`Couldn't delete: ${error.message}`); return }
    }
    setMilestones(ms => ms.filter(x => x.id !== id))
  }

  return (
    <div style={{ maxWidth: 740 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
        {milestones.map(m => (
          <MilestoneEditor key={m.id} milestone={m} onSave={saveMilestone} onDelete={deleteMilestone}
            onChange={u => setMilestones(ms => ms.map(x => x.id === m.id ? u : x))} />
        ))}
      </div>
      <button
        onClick={() => setMilestones(ms => [...ms, {
          id: `new-${Date.now()}`, date_range: '', sort_year: new Date().getFullYear(),
          title: '', subtitle: '', description: '', sort_order: ms.length + 1, active: true,
        }])}
        style={{ padding: '10px 24px', background: 'transparent', border: '1px dashed #333', color: '#555', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}
      >+ Add Milestone</button>

      {saved && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: '#1A2A1A', border: '1px solid #4CAF50', padding: '12px 20px', fontSize: 13, color: '#4CAF50', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          ✓ Saved
        </div>
      )}
    </div>
  )
}

function MilestoneEditor({ milestone, onSave, onDelete, onChange }: {
  milestone: Milestone
  onSave: (m: Milestone) => void
  onDelete: (id: string) => void
  onChange: (m: Milestone) => void
}) {
  const [open, setOpen] = useState(milestone.id.startsWith('new-'))

  return (
    <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ fontSize: 14, color: '#FAFAF9', fontWeight: 500 }}>
          {milestone.title || 'New Milestone'} {milestone.date_range && <span style={{ color: '#555', fontWeight: 400 }}>· {milestone.date_range}</span>}
        </span>
        <span style={{ color: '#555', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1A1A1A', paddingTop: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={field}>
              <label style={label}>Date Range <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(displayed as-is)</span></label>
              <input style={inputStyle} value={milestone.date_range} onChange={e => onChange({ ...milestone, date_range: e.target.value })} placeholder="2024 — Present" onFocus={focus} onBlur={blur} />
            </div>
            <div style={field}>
              <label style={label}>Sort Year <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(controls order, most recent first)</span></label>
              <input type="number" style={inputStyle} value={milestone.sort_year} onChange={e => onChange({ ...milestone, sort_year: parseInt(e.target.value) || new Date().getFullYear() })} onFocus={focus} onBlur={blur} />
            </div>
          </div>
          <div style={field}>
            <label style={label}>Title <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(role or achievement)</span></label>
            <input style={inputStyle} value={milestone.title} onChange={e => onChange({ ...milestone, title: e.target.value })} placeholder="Creative Director" onFocus={focus} onBlur={blur} />
          </div>
          <div style={field}>
            <label style={label}>Subtitle <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(company or context)</span></label>
            <input style={inputStyle} value={milestone.subtitle || ''} onChange={e => onChange({ ...milestone, subtitle: e.target.value })} placeholder="Nicopixel · Freelance, Lagos" onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ ...field, marginBottom: 16 }}>
            <label style={label}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={milestone.description || ''} onChange={e => onChange({ ...milestone, description: e.target.value })} onFocus={focus} onBlur={blur} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16 }}>
            <div onClick={() => onChange({ ...milestone, active: !milestone.active })} style={{ width: 36, height: 20, borderRadius: 10, background: milestone.active ? '#C41E3A' : '#333', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: milestone.active ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
            </div>
            <span style={{ fontSize: 12, color: '#999' }}>Show on About page</span>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => onSave(milestone)} style={{ padding: '9px 24px', background: '#C41E3A', color: 'white', border: 'none', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>Save</button>
            <button onClick={() => onDelete(milestone.id)} style={{ padding: '9px 14px', background: 'transparent', border: '1px solid #333', color: '#C41E3A', fontSize: 11, fontFamily: 'inherit' }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}
