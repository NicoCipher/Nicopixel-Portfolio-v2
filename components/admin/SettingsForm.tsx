'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

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
  const [uploading, setUploading] = useState<string | null>(null)

  const uploadAsset = async (file: File, key: string) => {
    const supabase = createClient()
    setUploading(key)
    const ext = file.name.split('.').pop()
    const path = `assets/${key}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('nicopixel').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('nicopixel').getPublicUrl(path)
      setValues(v => ({ ...v, [key]: data.publicUrl }))
      await supabase.from('site_settings').upsert({ key, value: data.publicUrl }, { onConflict: 'key' })
    }
    setUploading(null)
  }
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

      {/* Logo & Favicon */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C41E3A', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #1F1F1F' }}>Branding</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Logo */}
          <div>
            <label style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 12 }}>Site Logo</label>
            <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', minHeight: 100, justifyContent: 'center' }}>
              {values.logo_url
                ? <><div style={{ position: 'relative', width: 120, height: 48 }}><Image src={values.logo_url} alt="Logo" fill style={{ objectFit: 'contain' }} /></div>
                    <button onClick={() => setValues(v => ({ ...v, logo_url: '' }))} style={{ fontSize: 11, color: '#C41E3A', background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>Remove</button></>
                : <span style={{ fontSize: 12, color: '#444', textAlign: 'center' }}>No logo uploaded</span>
              }
              <label style={{ fontSize: 11, color: '#555', border: '1px dashed #333', padding: '6px 16px', cursor: 'pointer', textAlign: 'center' }}>
                {uploading === 'logo_url' ? 'Uploading...' : '+ Upload Logo'}
                <input type="file" accept="image/*,image/svg+xml" onChange={e => e.target.files?.[0] && uploadAsset(e.target.files[0], 'logo_url')} style={{ display: 'none' }} />
              </label>
            </div>
            <p style={{ fontSize: 10, color: '#444', marginTop: 6 }}>PNG, SVG recommended. Will appear in navbar and admin panel.</p>
          </div>

          {/* Favicon */}
          <div>
            <label style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 12 }}>Favicon</label>
            <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', minHeight: 100, justifyContent: 'center' }}>
              {values.favicon_url
                ? <><div style={{ position: 'relative', width: 48, height: 48 }}><Image src={values.favicon_url} alt="Favicon" fill style={{ objectFit: 'contain' }} /></div>
                    <button onClick={() => setValues(v => ({ ...v, favicon_url: '' }))} style={{ fontSize: 11, color: '#C41E3A', background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>Remove</button></>
                : <span style={{ fontSize: 12, color: '#444', textAlign: 'center' }}>No favicon uploaded</span>
              }
              <label style={{ fontSize: 11, color: '#555', border: '1px dashed #333', padding: '6px 16px', cursor: 'pointer', textAlign: 'center' }}>
                {uploading === 'favicon_url' ? 'Uploading...' : '+ Upload Favicon'}
                <input type="file" accept="image/*,image/svg+xml" onChange={e => e.target.files?.[0] && uploadAsset(e.target.files[0], 'favicon_url')} style={{ display: 'none' }} />
              </label>
            </div>
            <p style={{ fontSize: 10, color: '#444', marginTop: 6 }}>ICO, PNG or SVG. 32×32 or 64×64 ideal.</p>
          </div>
        </div>
      </div>
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
