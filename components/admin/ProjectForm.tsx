'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/types'
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

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter()
  const isEdit = !!project

  const [form, setForm] = useState({
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    category: project?.category ?? 'brand',
    description: project?.description ?? '',
    featured: project?.featured ?? false,
    published: project?.published ?? false,
    sort_order: project?.sort_order ?? 0,
    seo_title: (project as unknown as Record<string,string>)?.seo_title ?? '',
    seo_description: (project as unknown as Record<string,string>)?.seo_description ?? '',
  })
  const [coverImage, setCoverImage] = useState<string>(project?.cover_image ?? '')
  const [images, setImages] = useState<string[]>(project?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const uploadImage = async (file: File): Promise<string | null> => {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('nicopixel').upload(path, file, { upsert: true })
    if (error) { console.error(error); return null }
    const { data } = supabase.storage.from('nicopixel').getPublicUrl(path)
    return data.publicUrl
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file)
    if (url) setCoverImage(url)
    setUploading(false)
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    const urls = await Promise.all(files.map(uploadImage))
    setImages(prev => [...prev, ...urls.filter(Boolean) as string[]])
    setUploading(false)
  }

  const handleSave = async () => {
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return }
    setSaving(true)
    setError('')
    const supabase = createClient()
    const payload = { ...form, cover_image: coverImage || null, images }

    const { error } = isEdit
      ? await supabase.from('projects').update(payload).eq('id', project.id)
      : await supabase.from('projects').insert(payload)

    if (error) { setError(error.message); setSaving(false); return }
    router.push('/admin/projects')
    router.refresh()
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Title */}
        <div>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title}
            onChange={e => {
              const title = e.target.value
              setForm(f => ({ ...f, title, slug: isEdit ? f.slug : slugify(title) }))
            }}
            onFocus={e => (e.target.style.borderColor = '#C41E3A')}
            onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
            placeholder="Project title"
          />
        </div>

        {/* Slug */}
        <div>
          <label style={labelStyle}>Slug * <span style={{ color: '#444', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(URL identifier)</span></label>
          <input style={inputStyle} value={form.slug}
            onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
            onFocus={e => (e.target.style.borderColor = '#C41E3A')}
            onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
            placeholder="project-slug"
          />
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>Category *</label>
          <select style={{ ...inputStyle, appearance: 'none' }}
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value as 'brand' | 'events' | 'print' }))}
            onFocus={e => (e.target.style.borderColor = '#C41E3A')}
            onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
          >
            <option value="brand">Brand</option>
            <option value="events">Events</option>
            <option value="print">Print</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = '#C41E3A')}
            onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
            placeholder="Describe the project..."
          />
        </div>

        {/* Cover image */}
        <div>
          <label style={labelStyle}>Cover Image</label>
          {coverImage && (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', marginBottom: 12, background: '#0A0A0A', overflow: 'hidden' }}>
              <Image src={coverImage} alt="Cover" fill style={{ objectFit: 'cover' }} />
              <button onClick={() => setCoverImage('')} style={{
                position: 'absolute', top: 8, right: 8,
                background: '#C41E3A', border: 'none', color: 'white',
                width: 28, height: 28, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>×</button>
            </div>
          )}
          <label style={{
            display: 'inline-block', padding: '10px 20px',
            border: '1px dashed #333', color: '#555',
            fontSize: 12, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>
            {uploading ? 'Uploading...' : '+ Upload Cover'}
            <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Gallery images */}
        <div>
          <label style={labelStyle}>Gallery Images</label>
          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', background: '#0A0A0A', overflow: 'hidden' }}>
                  <Image src={img} alt={`Gallery ${i}`} fill style={{ objectFit: 'cover' }} />
                  <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} style={{
                    position: 'absolute', top: 4, right: 4,
                    background: '#C41E3A', border: 'none', color: 'white',
                    width: 22, height: 22, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>×</button>
                </div>
              ))}
            </div>
          )}
          <label style={{
            display: 'inline-block', padding: '10px 20px',
            border: '1px dashed #333', color: '#555',
            fontSize: 12, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>
            {uploading ? 'Uploading...' : '+ Add Images'}
            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Sort order */}
        <div>
          <label style={labelStyle}>Sort Order <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(lower = first)</span></label>
          <input style={{ ...inputStyle, width: 100 }} type="number"
            value={form.sort_order}
            onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            onFocus={e => (e.target.style.borderColor = '#C41E3A')}
            onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
          />
        </div>

        {/* SEO */}
        <div style={{ paddingTop: 8 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C41E3A', marginBottom: 16 }}>SEO (Search Engine)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>
                SEO Title <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(defaults to project title)</span>
              </label>
              <input style={inputStyle} value={form.seo_title}
                onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))}
                onFocus={e => (e.target.style.borderColor = '#C41E3A')}
                onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
                placeholder={form.title || 'Project title for Google'}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 6 }}>
                SEO Description <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(shown in Google results)</span>
              </label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.seo_description}
                onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))}
                onFocus={e => (e.target.style.borderColor = '#C41E3A')}
                onBlur={e => (e.target.style.borderColor = '#1F1F1F')}
                placeholder="Brief description for search results (150 characters ideal)..."
                maxLength={160}
              />
              <p style={{ fontSize: 10, color: '#444', marginTop: 4 }}>{form.seo_description.length}/160</p>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { key: 'featured', label: 'Featured on homepage' },
            { key: 'published', label: 'Published (live on site)' },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div onClick={() => setForm(f => ({ ...f, [key]: !f[key as keyof typeof f] }))} style={{
                width: 40, height: 22, borderRadius: 11,
                background: form[key as keyof typeof form] ? '#C41E3A' : '#333',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              }}>
                <div style={{
                  position: 'absolute', top: 3,
                  left: form[key as keyof typeof form] ? 21 : 3,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'white', transition: 'left 0.2s',
                }} />
              </div>
              <span style={{ fontSize: 13, color: '#999' }}>{label}</span>
            </label>
          ))}
        </div>

        {error && <p style={{ fontSize: 13, color: '#C41E3A' }}>{error}</p>}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 16, paddingTop: 8 }}>
          <button onClick={handleSave} disabled={saving || uploading} style={{
            padding: '12px 32px', background: saving ? '#333' : '#C41E3A',
            color: 'white', border: 'none', fontSize: 12, fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: 'inherit', transition: 'background 0.2s',
          }}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
          </button>
          <button onClick={() => router.push('/admin/projects')} style={{
            padding: '12px 24px', background: 'transparent',
            color: '#555', border: '1px solid #333',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', fontFamily: 'inherit',
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
