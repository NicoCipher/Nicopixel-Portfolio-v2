'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  background: '#0A0A0A', border: '1px solid #1F1F1F',
  color: '#FAFAF9', fontSize: 14, outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.2s',
}
const labelStyle: React.CSSProperties = {
  fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
  color: '#555', display: 'block', marginBottom: 8,
}
const sectionTitle: React.CSSProperties = {
  fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
  color: '#C41E3A', marginBottom: 20, paddingBottom: 12,
  borderBottom: '1px solid #1F1F1F',
}

const FIELDS = [
  {
    section: 'Hero',
    fields: [
      { key: 'hero_title', label: 'Hero Title', placeholder: 'Nicopixel' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', placeholder: 'Graphic Designer · Lagos' },
    ]
  },
  {
    section: 'Contact',
    fields: [
      { key: 'email', label: 'Email Address', placeholder: 'nicopixelll@gmail.com' },
    ]
  },
  {
    section: 'Social Links',
    fields: [
      { key: 'behance', label: 'Behance URL', placeholder: 'https://behance.net/nicopixel' },
      { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/nicopixel' },
      { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
      { key: 'twitter', label: 'Twitter / X URL', placeholder: 'https://x.com/nicopixel' },
    ]
  },
  {
    section: 'Typography',
    fields: [
      { key: 'font_heading', label: 'Heading Font', placeholder: 'Playfair Display' },
      { key: 'font_body', label: 'Body Font', placeholder: 'DM Sans' },
    ]
  },
]

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    await Promise.all(
      Object.entries(values).map(([key, value]) =>
        supabase.from('site_settings')
          .upsert({ key, value }, { onConflict: 'key' })
      )
    )

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 40 }}>
      {FIELDS.map(section => (
        <div key={section.section}>
          <p style={sectionTitle}>{section.section}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {section.fields.map(field => (
              <div key={field.key}>
                <label style={labelStyle}>{field.label}</label>
                <input
                  style={inputStyle}
                  value={values[field.key] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = '#C41E3A')}
                  onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '12px 32px', background: saving ? '#333' : '#C41E3A',
          color: 'white', border: 'none', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'inherit',
        }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && <span style={{ fontSize: 12, color: '#4CAF50' }}>✓ Saved successfully</span>}
      </div>
    </div>
  )
}
