'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AboutContent } from '@/types'
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

export function AboutForm({ about }: { about?: AboutContent | null }) {
  const [form, setForm] = useState({
    headline: about?.headline ?? '',
    subheadline: about?.subheadline ?? '',
    bio: about?.bio ?? '',
  })
  const [profileImage, setProfileImage] = useState(about?.profile_image ?? '')
  const [tools, setTools] = useState<string[]>(about?.tools ?? [])
  const [newTool, setNewTool] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const uploadImage = async (file: File): Promise<string | null> => {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `about/profile-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('nicopixel').upload(path, file, { upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('nicopixel').getPublicUrl(path)
    return data.publicUrl
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file)
    if (url) setProfileImage(url)
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const payload = { ...form, profile_image: profileImage || null, tools }

    if (about?.id) {
      await supabase.from('about_content').update(payload).eq('id', about.id)
    } else {
      await supabase.from('about_content').insert(payload)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Profile image */}
      <div>
        <label style={labelStyle}>Profile Photo</label>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ width: 120, height: 160, background: '#0A0A0A', border: '1px solid #1F1F1F', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
            {profileImage
              ? <Image src={profileImage} alt="Profile" fill style={{ objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Georgia', fontSize: 40, fontStyle: 'italic', color: '#333' }}>N</span>
                </div>
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{
              display: 'inline-block', padding: '10px 20px',
              border: '1px dashed #333', color: '#555',
              fontSize: 12, letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}>
              {uploading ? 'Uploading...' : '+ Upload Photo'}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            {profileImage && (
              <button onClick={() => setProfileImage('')} style={{ fontSize: 11, color: '#C41E3A', background: 'none', border: 'none', textAlign: 'left', fontFamily: 'inherit' }}>
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Headline */}
      <div>
        <label style={labelStyle}>Headline</label>
        <input style={inputStyle} value={form.headline}
          onChange={e => setForm(f => ({ ...f, headline: e.target.value }))}
          onFocus={e => (e.target.style.borderColor = '#C41E3A')}
          onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
          placeholder="Design that earns attention."
        />
      </div>

      {/* Subheadline */}
      <div>
        <label style={labelStyle}>Subheadline</label>
        <input style={inputStyle} value={form.subheadline}
          onChange={e => setForm(f => ({ ...f, subheadline: e.target.value }))}
          onFocus={e => (e.target.style.borderColor = '#C41E3A')}
          onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
          placeholder="Brand · Events · Print"
        />
      </div>

      {/* Bio */}
      <div>
        <label style={labelStyle}>Bio</label>
        <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5}
          value={form.bio}
          onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
          onFocus={e => (e.target.style.borderColor = '#C41E3A')}
          onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
          placeholder="Tell your story..."
        />
      </div>

      {/* Tools */}
      <div>
        <label style={labelStyle}>Tools</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {tools.map((tool, i) => (
            <span key={i} style={{
              padding: '6px 12px', background: '#1A1A1A',
              border: '1px solid #333', fontSize: 12, color: '#999',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {tool}
              <button onClick={() => setTools(t => t.filter((_, j) => j !== i))} style={{
                background: 'none', border: 'none', color: '#555', fontSize: 14, cursor: 'pointer', lineHeight: 1,
              }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }}
            value={newTool} onChange={e => setNewTool(e.target.value)}
            onFocus={e => (e.target.style.borderColor = '#C41E3A')}
            onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
            onKeyDown={e => {
              if (e.key === 'Enter' && newTool.trim()) {
                setTools(t => [...t, newTool.trim()])
                setNewTool('')
              }
            }}
            placeholder="Add a tool and press Enter"
          />
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 8 }}>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '12px 32px', background: saving ? '#333' : '#C41E3A',
          color: 'white', border: 'none', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'inherit',
        }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <span style={{ fontSize: 12, color: '#4CAF50' }}>✓ Saved</span>}
      </div>
    </div>
  )
}
