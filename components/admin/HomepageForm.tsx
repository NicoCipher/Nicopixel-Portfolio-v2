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
const labelStyle: React.CSSProperties = {
  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
  color: '#555', display: 'block', marginBottom: 7,
}
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', marginBottom: 20 }

type Service = { id: string; num: string; title: string; description: string | null; deliverables: string[]; sort_order: number; active: boolean }
type WhyItem = { id: string; title: string; description: string | null; sort_order: number }
type Testimonial = { id: string; quote: string; name: string; role: string | null; active: boolean; sort_order: number }

const TABS = ['Hero', 'Services', 'Why Section', 'Testimonials']

export function HomepageForm({
  settings,
  services,
  whyItems,
  testimonials,
}: {
  settings: Record<string, string>
  services: Service[]
  whyItems: WhyItem[]
  testimonials: Testimonial[]
}) {
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Hero state
  const [hero, setHero] = useState({
    hero_eyebrow: settings.hero_eyebrow || '',
    hero_title: settings.hero_title || '',
    hero_subtitle: settings.hero_subtitle || '',
    hero_sub: settings.hero_sub || '',
    hero_stat_1_num: settings.hero_stat_1_num || '',
    hero_stat_1_label: settings.hero_stat_1_label || '',
    hero_stat_2_num: settings.hero_stat_2_num || '',
    hero_stat_2_label: settings.hero_stat_2_label || '',
    hero_stat_3_num: settings.hero_stat_3_num || '',
    hero_stat_3_label: settings.hero_stat_3_label || '',
    cta_strip_title: settings.cta_strip_title || '',
    cta_strip_sub: settings.cta_strip_sub || '',
  })

  // Services state
  const [svcs, setSvcs] = useState<Service[]>(services)

  // Why state
  const [why, setWhy] = useState({ title: settings.why_title || '', subtitle: settings.why_subtitle || '' })
  const [whyList, setWhyList] = useState<WhyItem[]>(whyItems)

  // Testimonials state
  const [tests, setTests] = useState<Testimonial[]>(testimonials)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  // ── SAVE HERO ──
  const saveHero = async () => {
    setSaving(true)
    const supabase = createClient()
    await Promise.all(
      Object.entries(hero).map(([key, value]) =>
        supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
      )
    )
    // also save why title/subtitle
    await Promise.all([
      supabase.from('site_settings').upsert({ key: 'why_title', value: why.title }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'why_subtitle', value: why.subtitle }, { onConflict: 'key' }),
    ])
    setSaving(false); flash(); router.refresh()
  }

  // ── SAVE SERVICE ──
  const saveService = async (svc: Service) => {
    const supabase = createClient()
    const { id, ...rest } = svc
    if (id.startsWith('new-')) {
      const { data } = await supabase.from('services').insert(rest).select().single()
      if (data) setSvcs(s => s.map(x => x.id === id ? data : x))
    } else {
      await supabase.from('services').update(rest).eq('id', id)
    }
    flash(); router.refresh()
  }

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return
    const supabase = createClient()
    if (!id.startsWith('new-')) await supabase.from('services').delete().eq('id', id)
    setSvcs(s => s.filter(x => x.id !== id))
  }

  // ── SAVE WHY ITEM ──
  const saveWhyItem = async (item: WhyItem) => {
    const supabase = createClient()
    const { id, ...rest } = item
    if (id.startsWith('new-')) {
      const { data } = await supabase.from('why_items').insert(rest).select().single()
      if (data) setWhyList(w => w.map(x => x.id === id ? data : x))
    } else {
      await supabase.from('why_items').update(rest).eq('id', id)
    }
    flash(); router.refresh()
  }

  const deleteWhyItem = async (id: string) => {
    if (!confirm('Delete this item?')) return
    const supabase = createClient()
    if (!id.startsWith('new-')) await supabase.from('why_items').delete().eq('id', id)
    setWhyList(w => w.filter(x => x.id !== id))
  }

  // ── SAVE TESTIMONIAL ──
  const saveTestimonial = async (t: Testimonial) => {
    const supabase = createClient()
    const { id, ...rest } = t
    if (id.startsWith('new-')) {
      const { data } = await supabase.from('testimonials').insert(rest).select().single()
      if (data) setTests(ts => ts.map(x => x.id === id ? data : x))
    } else {
      await supabase.from('testimonials').update(rest).eq('id', id)
    }
    flash(); router.refresh()
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    const supabase = createClient()
    if (!id.startsWith('new-')) await supabase.from('testimonials').delete().eq('id', id)
    setTests(ts => ts.filter(x => x.id !== id))
  }

  return (
    <div>
      {/* Tabs */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid #1F1F1F', marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 0, minWidth: 'max-content' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '12px 24px', background: 'none', border: 'none',
              fontSize: 12, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: tab === i ? '#FAFAF9' : '#555',
              borderBottom: tab === i ? '2px solid #C41E3A' : '2px solid transparent',
              marginBottom: -1, fontFamily: 'inherit', transition: 'color 0.2s', whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Saved toast — fixed bottom right */}
      {saved && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: '#1A2A1A', border: '1px solid #4CAF50',
          padding: '12px 20px', fontSize: 13, color: '#4CAF50',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          <span>✓</span> Saved successfully
        </div>
      )}

      {/* ── HERO TAB ── */}
      {tab === 0 && (
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 4 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Hero Title</label>
              <input style={inputStyle} value={hero.hero_title} onChange={e => setHero(h => ({ ...h, hero_title: e.target.value }))} placeholder="Nicopixel" onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Hero Subtitle (italic)</label>
              <input style={inputStyle} value={hero.hero_subtitle} onChange={e => setHero(h => ({ ...h, hero_subtitle: e.target.value }))} placeholder="Graphic Designer" onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Eyebrow Text</label>
            <input style={inputStyle} value={hero.hero_eyebrow} onChange={e => setHero(h => ({ ...h, hero_eyebrow: e.target.value }))} placeholder="Brand · Events · Print · Lagos" onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Hero Paragraph</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={hero.hero_sub} onChange={e => setHero(h => ({ ...h, hero_sub: e.target.value }))} placeholder="Short paragraph below the headline..." onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
          </div>
          <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C41E3A', marginBottom: 16 }}>Stats</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 16 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Number</label>
                  <input style={inputStyle} value={hero[`hero_stat_${n}_num` as keyof typeof hero]} onChange={e => setHero(h => ({ ...h, [`hero_stat_${n}_num`]: e.target.value }))} placeholder="4+" onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
                </div>
                <div style={{ ...fieldStyle, marginBottom: 0 }}>
                  <label style={labelStyle}>Label</label>
                  <input style={inputStyle} value={hero[`hero_stat_${n}_label` as keyof typeof hero]} onChange={e => setHero(h => ({ ...h, [`hero_stat_${n}_label`]: e.target.value }))} placeholder="Years" onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C41E3A', marginBottom: 16 }}>CTA Strip</p>
          <div style={fieldStyle}>
            <label style={labelStyle}>Strip Title</label>
            <input style={inputStyle} value={hero.cta_strip_title} onChange={e => setHero(h => ({ ...h, cta_strip_title: e.target.value }))} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Strip Subtitle</label>
            <input style={inputStyle} value={hero.cta_strip_sub} onChange={e => setHero(h => ({ ...h, cta_strip_sub: e.target.value }))} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
          </div>
          <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C41E3A', marginBottom: 16, marginTop: 8 }}>Why Section Heading</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={why.title} onChange={e => setWhy(w => ({ ...w, title: e.target.value }))} placeholder="Design that works" onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Subtitle (italic)</label>
              <input style={inputStyle} value={why.subtitle} onChange={e => setWhy(w => ({ ...w, subtitle: e.target.value }))} placeholder="as hard as you do." onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
            </div>
          </div>
          <button onClick={saveHero} disabled={saving} style={{ padding: '12px 32px', background: saving ? '#333' : '#C41E3A', color: 'white', border: 'none', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            {saving ? 'Saving...' : 'Save Hero'}
          </button>
        </div>
      )}

      {/* ── SERVICES TAB ── */}
      {tab === 1 && (
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
            {svcs.map(svc => (
              <ServiceEditor key={svc.id} svc={svc} onSave={saveService} onDelete={deleteService}
                onChange={updated => setSvcs(s => s.map(x => x.id === svc.id ? updated : x))} />
            ))}
          </div>
          <button onClick={() => setSvcs(s => [...s, { id: `new-${Date.now()}`, num: `0${s.length + 1}`, title: '', description: null, deliverables: [], sort_order: s.length + 1, active: true }])}
            style={{ padding: '10px 24px', background: 'transparent', border: '1px dashed #333', color: '#555', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            + Add Service
          </button>
        </div>
      )}

      {/* ── WHY SECTION TAB ── */}
      {tab === 2 && (
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
            {whyList.map(item => (
              <WhyEditor key={item.id} item={item} onSave={saveWhyItem} onDelete={deleteWhyItem}
                onChange={updated => setWhyList(w => w.map(x => x.id === item.id ? updated : x))} />
            ))}
          </div>
          <button onClick={() => setWhyList(w => [...w, { id: `new-${Date.now()}`, title: '', description: null, sort_order: w.length + 1 }])}
            style={{ padding: '10px 24px', background: 'transparent', border: '1px dashed #333', color: '#555', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            + Add Item
          </button>
        </div>
      )}

      {/* ── TESTIMONIALS TAB ── */}
      {tab === 3 && (
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
            {tests.map(t => (
              <TestimonialEditor key={t.id} t={t} onSave={saveTestimonial} onDelete={deleteTestimonial}
                onChange={updated => setTests(ts => ts.map(x => x.id === t.id ? updated : x))} />
            ))}
          </div>
          <button onClick={() => setTests(ts => [...ts, { id: `new-${Date.now()}`, quote: '', name: '', role: null, active: true, sort_order: ts.length + 1 }])}
            style={{ padding: '10px 24px', background: 'transparent', border: '1px dashed #333', color: '#555', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            + Add Testimonial
          </button>
        </div>
      )}
    </div>
  )
}

function ServiceEditor({ svc, onSave, onDelete, onChange }: { svc: Service; onSave: (s: Service) => void; onDelete: (id: string) => void; onChange: (s: Service) => void }) {
  const [open, setOpen] = useState(svc.id.startsWith('new-'))
  const [delivInput, setDelivInput] = useState('')

  return (
    <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ fontSize: 14, color: '#FAFAF9', fontWeight: 500 }}>{svc.title || 'New Service'}</span>
        <span style={{ color: '#555', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1A1A1A', paddingTop: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 12 }}>
            <div><label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>No.</label>
              <input style={{ ...inputStyle, width: '100%' }} value={svc.num} onChange={e => onChange({ ...svc, num: e.target.value })} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} /></div>
            <div><label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>Title</label>
              <input style={{ ...inputStyle, width: '100%' }} value={svc.title} onChange={e => onChange({ ...svc, title: e.target.value })} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} /></div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={svc.description || ''} onChange={e => onChange({ ...svc, description: e.target.value })} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>Deliverables</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {svc.deliverables.map((d, i) => (
                <span key={i} style={{ padding: '4px 12px', background: '#1A1A1A', border: '1px solid #333', fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {d}
                  <button onClick={() => onChange({ ...svc, deliverables: svc.deliverables.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={delivInput} onChange={e => setDelivInput(e.target.value)}
                placeholder="Add deliverable, press Enter"
                onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')}
                onKeyDown={e => { if (e.key === 'Enter' && delivInput.trim()) { onChange({ ...svc, deliverables: [...svc.deliverables, delivInput.trim()] }); setDelivInput('') } }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => onSave(svc)} style={{ padding: '10px 24px', background: '#C41E3A', color: 'white', border: 'none', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>Save</button>
            <button onClick={() => onDelete(svc.id)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #333', color: '#C41E3A', fontSize: 11, fontFamily: 'inherit' }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

function WhyEditor({ item, onSave, onDelete, onChange }: { item: WhyItem; onSave: (i: WhyItem) => void; onDelete: (id: string) => void; onChange: (i: WhyItem) => void }) {
  const [open, setOpen] = useState(item.id.startsWith('new-'))
  return (
    <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ fontSize: 14, color: '#FAFAF9', fontWeight: 500 }}>{item.title || 'New Item'}</span>
        <span style={{ color: '#555', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1A1A1A', paddingTop: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>Title</label>
            <input style={{ ...inputStyle, width: '100%' }} value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={item.description || ''} onChange={e => onChange({ ...item, description: e.target.value })} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => onSave(item)} style={{ padding: '10px 24px', background: '#C41E3A', color: 'white', border: 'none', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>Save</button>
            <button onClick={() => onDelete(item.id)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #333', color: '#C41E3A', fontSize: 11, fontFamily: 'inherit' }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

function TestimonialEditor({ t, onSave, onDelete, onChange }: { t: Testimonial; onSave: (t: Testimonial) => void; onDelete: (id: string) => void; onChange: (t: Testimonial) => void }) {
  const [open, setOpen] = useState(t.id.startsWith('new-'))
  return (
    <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <div>
          <span style={{ fontSize: 14, color: '#FAFAF9', fontWeight: 500 }}>{t.name || 'New Testimonial'}</span>
          {t.role && <span style={{ fontSize: 11, color: '#555', marginLeft: 10 }}>{t.role}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 9, color: t.active ? '#4CAF50' : '#555', letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid ${t.active ? '#4CAF50' : '#333'}`, padding: '2px 8px' }}>{t.active ? 'Visible' : 'Hidden'}</span>
          <span style={{ color: '#555', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1A1A1A', paddingTop: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>Quote</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={t.quote} onChange={e => onChange({ ...t, quote: e.target.value })} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>Name</label>
              <input style={{ ...inputStyle, width: '100%' }} value={t.name} onChange={e => onChange({ ...t, name: e.target.value })} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
            </div>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>Role / Company</label>
              <input style={{ ...inputStyle, width: '100%' }} value={t.role || ''} onChange={e => onChange({ ...t, role: e.target.value })} onFocus={e => (e.target.style.borderColor='#C41E3A')} onBlur={e => (e.target.style.borderColor='#1F1F1F')} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16 }}>
            <div onClick={() => onChange({ ...t, active: !t.active })} style={{ width: 36, height: 20, borderRadius: 10, background: t.active ? '#C41E3A' : '#333', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: t.active ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
            </div>
            <span style={{ fontSize: 12, color: '#999' }}>Show on site</span>
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => onSave(t)} style={{ padding: '10px 24px', background: '#C41E3A', color: 'white', border: 'none', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>Save</button>
            <button onClick={() => onDelete(t.id)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #333', color: '#C41E3A', fontSize: 11, fontFamily: 'inherit' }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}
