'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { FONT_PAIRINGS, DEFAULT_FONT_PAIRING } from '@/lib/fontPairings'
import { FONT_PAIRING_VARS } from '@/lib/fonts'

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
]

const SOCIAL_PLATFORMS = [
  { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/nicopixel' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/nicopixel' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@nicopixel' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/nicopixel' },
]

const SESSION_TIMEOUT_OPTIONS = [
  { value: '10', label: '10 minutes — strictest' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes — recommended' },
  { value: '60', label: '60 minutes — most relaxed' },
]

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(settings)
  const [uploading, setUploading] = useState<string | null>(null)

  const uploadAsset = async (file: File, key: string) => {
    const supabase = createClient()
    setUploading(key)
    const ext = file.name.split('.').pop()
    const path = `assets/${key}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('nicopixel').upload(path, file, { upsert: true })
    if (uploadError) {
      alert(`Couldn't upload image: ${uploadError.message}`)
      setUploading(null)
      return
    }
    const { data } = supabase.storage.from('nicopixel').getPublicUrl(path)
    const { error: saveError } = await supabase.from('site_settings').upsert({ key, value: data.publicUrl }, { onConflict: 'key' })
    if (saveError) {
      alert(`Image uploaded, but saving it failed: ${saveError.message}. Try again.`)
      setUploading(null)
      return
    }
    setValues(v => ({ ...v, [key]: data.publicUrl }))
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

      {/* Social Links — URL + show/hide toggle per platform */}
      <div>
        <p style={sectionTitle}>Social Links</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SOCIAL_PLATFORMS.map(platform => {
            const enabled = values[`${platform.key}_enabled`] !== 'false'
            return (
              <div key={platform.key} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>{platform.label}</label>
                  <input
                    style={{ ...inputStyle, opacity: enabled ? 1 : 0.5 }}
                    value={values[platform.key] ?? ''}
                    onChange={e => setValues(v => ({ ...v, [platform.key]: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = '#C41E3A')}
                    onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
                    placeholder={platform.placeholder}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, cursor: 'pointer', flexShrink: 0 }}>
                  <div
                    onClick={() => setValues(v => ({ ...v, [`${platform.key}_enabled`]: enabled ? 'false' : 'true' }))}
                    style={{ width: 36, height: 20, borderRadius: 10, background: enabled ? '#C41E3A' : '#333', position: 'relative', transition: 'background 0.2s' }}
                  >
                    <div style={{ position: 'absolute', top: 2, left: enabled ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#666', width: 38 }}>{enabled ? 'Shown' : 'Hidden'}</span>
                </label>
              </div>
            )
          })}
        </div>
        <p style={{ fontSize: 11, color: '#444', marginTop: 10 }}>Toggle off to hide a link from the site without losing the saved URL.</p>
      </div>

      {/* Typography — curated pairings only, to keep the site's design coherent */}
      <div>
        <p style={sectionTitle}>Typography</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FONT_PAIRINGS.map(pairing => {
            const isActive = (values.font_pairing || DEFAULT_FONT_PAIRING) === pairing.key
            return (
              <label key={pairing.key} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 18px', cursor: 'pointer',
                background: isActive ? '#1A0A0C' : '#0A0A0A',
                border: `1px solid ${isActive ? '#C41E3A' : '#1F1F1F'}`,
                transition: 'border-color 0.2s, background 0.2s',
              }}>
                <input
                  type="radio"
                  name="font_pairing"
                  checked={isActive}
                  onChange={() => setValues(v => ({ ...v, font_pairing: pairing.key }))}
                  style={{ marginTop: 4, accentColor: '#C41E3A', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontFamily: FONT_PAIRING_VARS[pairing.key]?.heading ?? pairing.heading, fontSize: 19, color: '#FAFAF9', marginBottom: 4 }}>{pairing.label}</div>
                  <p style={{ fontSize: 12, color: '#666', margin: 0, fontFamily: FONT_PAIRING_VARS[pairing.key]?.body ?? pairing.body }}>{pairing.description}</p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Session & Security */}
      <div>
        <p style={sectionTitle}>Session &amp; Security</p>
        <div>
          <label style={labelStyle}>Inactivity Timeout</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={values.session_timeout_minutes || '30'}
            onChange={e => setValues(v => ({ ...v, session_timeout_minutes: e.target.value }))}
          >
            {SESSION_TIMEOUT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p style={{ fontSize: 11, color: '#444', marginTop: 8, lineHeight: 1.6 }}>
            You&apos;ll be automatically signed out of the admin panel after this much time with no activity.
            30 minutes is a reasonable, commonly-used default for a site like this — tighten it to 10–15 minutes
            if you often use shared or public computers; relax it to 60 if you&apos;re always on a private device.
            There&apos;s also a fixed 8-hour absolute session limit regardless of activity.
          </p>
        </div>
      </div>

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
