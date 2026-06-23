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

type Service = { id: string; num: string; title: string; description: string | null; deliverables: string[]; timeline: string | null; pricing_from: string | null; pricing_to: string | null; sort_order: number; active: boolean; category: string }
type Step    = { id: string; num: string; title: string; description: string | null; sort_order: number }
type Faq     = { id: string; question: string; answer: string; active: boolean; sort_order: number }

const TABS = ['Services', 'Process Steps', 'FAQs']

export function ServicesManager({ initialServices, initialSteps, initialFaqs }: {
  initialServices: Service[]
  initialSteps: Step[]
  initialFaqs: Faq[]
}) {
  const [tab, setTab] = useState(0)
  const [services, setServices] = useState(initialServices)
  const [steps, setSteps] = useState(initialSteps)
  const [faqs, setFaqs] = useState(initialFaqs)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  // ── SERVICES ──
  const saveService = async (svc: Service) => {
    const supabase = createClient()
    const { id, ...rest } = svc
    if (id.startsWith('new-')) {
      const { data, error } = await supabase.from('services').insert(rest).select().single()
      if (error) { alert(`Couldn't save service: ${error.message}`); return }
      if (data) setServices(s => s.map(x => x.id === id ? data : x))
    } else {
      const { error } = await supabase.from('services').update(rest).eq('id', id)
      if (error) { alert(`Couldn't save service: ${error.message}`); return }
    }
    flash(); router.refresh()
  }

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return
    const supabase = createClient()
    if (!id.startsWith('new-')) {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) { alert(`Couldn't delete: ${error.message}`); return }
    }
    setServices(s => s.filter(x => x.id !== id))
  }

  // ── STEPS ──
  const saveStep = async (step: Step) => {
    const supabase = createClient()
    const { id, ...rest } = step
    if (id.startsWith('new-')) {
      const { data, error } = await supabase.from('process_steps').insert(rest).select().single()
      if (error) { alert(`Couldn't save step: ${error.message}`); return }
      if (data) setSteps(s => s.map(x => x.id === id ? data : x))
    } else {
      const { error } = await supabase.from('process_steps').update(rest).eq('id', id)
      if (error) { alert(`Couldn't save step: ${error.message}`); return }
    }
    flash(); router.refresh()
  }

  const deleteStep = async (id: string) => {
    if (!confirm('Delete this step?')) return
    const supabase = createClient()
    if (!id.startsWith('new-')) {
      const { error } = await supabase.from('process_steps').delete().eq('id', id)
      if (error) { alert(`Couldn't delete: ${error.message}`); return }
    }
    setSteps(s => s.filter(x => x.id !== id))
  }

  // ── FAQS ──
  const saveFaq = async (faq: Faq) => {
    const supabase = createClient()
    const { id, ...rest } = faq
    if (id.startsWith('new-')) {
      const { data, error } = await supabase.from('faqs').insert(rest).select().single()
      if (error) { alert(`Couldn't save FAQ: ${error.message}`); return }
      if (data) setFaqs(f => f.map(x => x.id === id ? data : x))
    } else {
      const { error } = await supabase.from('faqs').update(rest).eq('id', id)
      if (error) { alert(`Couldn't save FAQ: ${error.message}`); return }
    }
    flash(); router.refresh()
  }

  const deleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return
    const supabase = createClient()
    if (!id.startsWith('new-')) {
      const { error } = await supabase.from('faqs').delete().eq('id', id)
      if (error) { alert(`Couldn't delete: ${error.message}`); return }
    }
    setFaqs(f => f.filter(x => x.id !== id))
  }

  return (
    <div>
      {/* Tabs */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid #1F1F1F', marginBottom: 32 }}>
        <div style={{ display: 'flex', minWidth: 'max-content' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '12px 24px', background: 'none', border: 'none',
              fontSize: 12, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: tab === i ? '#FAFAF9' : '#555',
              borderBottom: tab === i ? '2px solid #C41E3A' : '2px solid transparent',
              marginBottom: -1, fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      {tab === 0 && (
        <div style={{ maxWidth: 740 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
            {services.map(svc => <ServiceEditor key={svc.id} svc={svc} onSave={saveService} onDelete={deleteService} onChange={u => setServices(s => s.map(x => x.id === svc.id ? u : x))} />)}
          </div>
          <button onClick={() => setServices(s => [...s, { id: `new-${Date.now()}`, num: `0${s.length + 1}`, title: '', description: null, deliverables: [], timeline: null, pricing_from: null, pricing_to: null, sort_order: s.length + 1, active: true, category: 'brand' }])}
            style={{ padding: '10px 24px', background: 'transparent', border: '1px dashed #333', color: '#555', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            + Add Service
          </button>
        </div>
      )}

      {/* ── PROCESS STEPS ── */}
      {tab === 1 && (
        <div style={{ maxWidth: 740 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
            {steps.map(step => <StepEditor key={step.id} step={step} onSave={saveStep} onDelete={deleteStep} onChange={u => setSteps(s => s.map(x => x.id === step.id ? u : x))} />)}
          </div>
          <button onClick={() => setSteps(s => [...s, { id: `new-${Date.now()}`, num: `0${s.length + 1}`, title: '', description: null, sort_order: s.length + 1 }])}
            style={{ padding: '10px 24px', background: 'transparent', border: '1px dashed #333', color: '#555', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            + Add Step
          </button>
        </div>
      )}

      {/* ── FAQS ── */}
      {tab === 2 && (
        <div style={{ maxWidth: 740 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
            {faqs.map(faq => <FaqEditor key={faq.id} faq={faq} onSave={saveFaq} onDelete={deleteFaq} onChange={u => setFaqs(f => f.map(x => x.id === faq.id ? u : x))} />)}
          </div>
          <button onClick={() => setFaqs(f => [...f, { id: `new-${Date.now()}`, question: '', answer: '', active: true, sort_order: f.length + 1 }])}
            style={{ padding: '10px 24px', background: 'transparent', border: '1px dashed #333', color: '#555', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            + Add FAQ
          </button>
        </div>
      )}

      {/* Toast */}
      {saved && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: '#1A2A1A', border: '1px solid #4CAF50', padding: '12px 20px', fontSize: 13, color: '#4CAF50', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          ✓ Saved
        </div>
      )}
    </div>
  )
}

function SaveBar({ onSave, onDelete, label: lbl = 'Save' }: { onSave: () => void; onDelete: () => void; label?: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
      <button onClick={onSave} style={{ padding: '9px 24px', background: '#C41E3A', color: 'white', border: 'none', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>{lbl}</button>
      <button onClick={onDelete} style={{ padding: '9px 14px', background: 'transparent', border: '1px solid #333', color: '#C41E3A', fontSize: 11, fontFamily: 'inherit' }}>Delete</button>
    </div>
  )
}

function Accordion({ title, children, isNew }: { title: string; children: React.ReactNode; isNew?: boolean }) {
  const [open, setOpen] = useState(!!isNew)
  return (
    <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ fontSize: 14, color: '#FAFAF9', fontWeight: 500 }}>{title}</span>
        <span style={{ color: '#555', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1A1A1A', paddingTop: 20 }}>{children}</div>}
    </div>
  )
}

function ServiceEditor({ svc, onSave, onDelete, onChange }: { svc: Service; onSave: (s: Service) => void; onDelete: (id: string) => void; onChange: (s: Service) => void }) {
  const [delivInput, setDelivInput] = useState('')
  return (
    <Accordion title={svc.title || 'New Service'} isNew={svc.id.startsWith('new-')}>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
        <div><label style={label}>No.</label><input style={inputStyle} value={svc.num} onChange={e => onChange({ ...svc, num: e.target.value })} onFocus={focus} onBlur={blur} /></div>
        <div><label style={label}>Title</label><input style={inputStyle} value={svc.title} onChange={e => onChange({ ...svc, title: e.target.value })} onFocus={focus} onBlur={blur} /></div>
      </div>
      <div style={field}><label style={label}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={svc.description || ''} onChange={e => onChange({ ...svc, description: e.target.value })} onFocus={focus} onBlur={blur} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={field}><label style={label}>Timeline</label><input style={inputStyle} value={svc.timeline || ''} onChange={e => onChange({ ...svc, timeline: e.target.value })} placeholder="2–3 weeks" onFocus={focus} onBlur={blur} /></div>
        <div style={field}>
          <label style={label}>Category <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(links to matching work)</span></label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={svc.category || 'brand'} onChange={e => onChange({ ...svc, category: e.target.value })}>
            <option value="brand">Brand</option>
            <option value="events">Events</option>
            <option value="print">Print</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Deliverables</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {svc.deliverables.map((d, i) => (
            <span key={i} style={{ padding: '4px 12px', background: '#1A1A1A', border: '1px solid #333', fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 8 }}>
              {d}
              <button onClick={() => onChange({ ...svc, deliverables: svc.deliverables.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#555', fontSize: 14, cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
        </div>
        <input style={{ ...inputStyle, width: '100%' }} value={delivInput} onChange={e => setDelivInput(e.target.value)}
          placeholder="Type a deliverable and press Enter"
          onFocus={focus} onBlur={blur}
          onKeyDown={e => { if (e.key === 'Enter' && delivInput.trim()) { onChange({ ...svc, deliverables: [...svc.deliverables, delivInput.trim()] }); setDelivInput('') } }} />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16 }}>
        <div onClick={() => onChange({ ...svc, active: !svc.active })} style={{ width: 36, height: 20, borderRadius: 10, background: svc.active ? '#C41E3A' : '#333', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 2, left: svc.active ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
        </div>
        <span style={{ fontSize: 12, color: '#999' }}>Show on services page</span>
      </label>
      <SaveBar onSave={() => onSave(svc)} onDelete={() => onDelete(svc.id)} />
    </Accordion>
  )
}

function StepEditor({ step, onSave, onDelete, onChange }: { step: Step; onSave: (s: Step) => void; onDelete: (id: string) => void; onChange: (s: Step) => void }) {
  return (
    <Accordion title={step.title || 'New Step'} isNew={step.id.startsWith('new-')}>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
        <div style={field}><label style={label}>Step No.</label><input style={inputStyle} value={step.num} onChange={e => onChange({ ...step, num: e.target.value })} onFocus={focus} onBlur={blur} /></div>
        <div style={field}><label style={label}>Title</label><input style={inputStyle} value={step.title} onChange={e => onChange({ ...step, title: e.target.value })} onFocus={focus} onBlur={blur} /></div>
      </div>
      <div style={{ ...field, marginBottom: 16 }}><label style={label}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={step.description || ''} onChange={e => onChange({ ...step, description: e.target.value })} onFocus={focus} onBlur={blur} /></div>
      <SaveBar onSave={() => onSave(step)} onDelete={() => onDelete(step.id)} />
    </Accordion>
  )
}

function FaqEditor({ faq, onSave, onDelete, onChange }: { faq: Faq; onSave: (f: Faq) => void; onDelete: (id: string) => void; onChange: (f: Faq) => void }) {
  return (
    <Accordion title={faq.question || 'New FAQ'} isNew={faq.id.startsWith('new-')}>
      <div style={{ ...field }}><label style={label}>Question</label><input style={inputStyle} value={faq.question} onChange={e => onChange({ ...faq, question: e.target.value })} onFocus={focus} onBlur={blur} /></div>
      <div style={{ ...field, marginBottom: 12 }}><label style={label}>Answer</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={faq.answer} onChange={e => onChange({ ...faq, answer: e.target.value })} onFocus={focus} onBlur={blur} /></div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16 }}>
        <div onClick={() => onChange({ ...faq, active: !faq.active })} style={{ width: 36, height: 20, borderRadius: 10, background: faq.active ? '#C41E3A' : '#333', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 2, left: faq.active ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
        </div>
        <span style={{ fontSize: 12, color: '#999' }}>Show on services page</span>
      </label>
      <SaveBar onSave={() => onSave(faq)} onDelete={() => onDelete(faq.id)} />
    </Accordion>
  )
}
