'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  category: string
  seo_title: string | null
  seo_description: string | null
  published: boolean
  published_at: string | null
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#0A0A0A', border: '1px solid #1F1F1F',
  color: '#FAFAF9', fontSize: 13, outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.2s',
}
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#C41E3A')
const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#1F1F1F')
const label: React.CSSProperties = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 7 }
const field: React.CSSProperties = { display: 'flex', flexDirection: 'column', marginBottom: 20 }

const CATEGORIES = ['branding', 'design', 'events', 'print', 'business']

function slugify(text: string) {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    category: post?.category ?? 'branding',
    seo_title: post?.seo_title ?? '',
    seo_description: post?.seo_description ?? '',
    published: post?.published ?? false,
  })
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugTouched, setSlugTouched] = useState(!!post)

  const uploadCover = async (file: File) => {
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: upErr } = await supabase.storage.from('nicopixel').upload(path, file, { upsert: true })
    if (upErr) {
      alert(`Couldn't upload image: ${upErr.message}`)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('nicopixel').getPublicUrl(path)
    setCoverImage(data.publicUrl)
    setUploading(false)
  }

  const handleTitleChange = (value: string) => {
    setForm(f => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError('Title, slug, and content are required.')
      setSaving(false)
      return
    }

    const supabase = createClient()
    const payload = {
      ...form,
      cover_image: coverImage || null,
      published_at: form.published && !post?.published_at ? new Date().toISOString() : post?.published_at,
    }

    const result = post
      ? await supabase.from('blog_posts').update(payload).eq('id', post.id)
      : await supabase.from('blog_posts').insert(payload)

    if (result.error) {
      setError(result.error.message.includes('duplicate') ? 'A post with this slug already exists.' : result.error.message)
      setSaving(false)
      return
    }

    router.push('/admin/blog')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 760 }}>
      <div style={field}>
        <label style={label}>Title</label>
        <input style={inputStyle} value={form.title} onChange={e => handleTitleChange(e.target.value)} onFocus={focus} onBlur={blur} required />
      </div>

      <div style={field}>
        <label style={label}>Slug <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(used in URL: /blog/...)</span></label>
        <input style={inputStyle} value={form.slug} onChange={e => { setSlugTouched(true); setForm(f => ({ ...f, slug: slugify(e.target.value) })) }} onFocus={focus} onBlur={blur} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 16, marginBottom: 4 }}>
        <div style={field}>
          <label style={label}>Excerpt <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(shown in listing)</span></label>
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} onFocus={focus} onBlur={blur} />
        </div>
        <div style={field}>
          <label style={label}>Category</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Cover image */}
      <div style={field}>
        <label style={label}>Cover Image</label>
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          {coverImage ? (
            <div style={{ position: 'relative', width: 100, height: 70, flexShrink: 0 }}>
              <Image src={coverImage} alt="Cover" fill style={{ objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ width: 100, height: 70, background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 10, color: '#444' }}>No image</span>
            </div>
          )}
          <label style={{ fontSize: 11, color: '#999', border: '1px dashed #333', padding: '8px 18px', cursor: 'pointer' }}>
            {uploading ? 'Uploading...' : coverImage ? 'Replace' : '+ Upload Cover'}
            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])} style={{ display: 'none' }} />
          </label>
          {coverImage && (
            <button type="button" onClick={() => setCoverImage('')} style={{ fontSize: 11, color: '#C41E3A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={field}>
        <label style={label}>Content <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(Markdown — use ## for headings, **bold**, - for lists)</span></label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7 }}
          rows={20}
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          onFocus={focus} onBlur={blur}
          required
          placeholder={'Write your post here using Markdown.\n\n## A heading\n\nA paragraph of text.\n\n- A list item\n- Another item\n\n**Bold text** for emphasis.'}
        />
      </div>

      {/* SEO */}
      <div style={{ paddingTop: 8, marginBottom: 24 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C41E3A', marginBottom: 16 }}>SEO (Search Engine)</p>
        <div style={field}>
          <label style={label}>SEO Title <span style={{ color: '#444', textTransform: 'none', letterSpacing: 0 }}>(defaults to post title)</span></label>
          <input style={inputStyle} value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} onFocus={focus} onBlur={blur} placeholder={form.title} />
        </div>
        <div style={field}>
          <label style={label}>SEO Description</label>
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} maxLength={160} value={form.seo_description} onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} onFocus={focus} onBlur={blur} placeholder="Brief description for search results..." />
          <p style={{ fontSize: 10, color: '#444', marginTop: 4 }}>{form.seo_description.length}/160</p>
        </div>
      </div>

      {/* Published toggle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 28 }}>
        <div onClick={() => setForm(f => ({ ...f, published: !f.published }))} style={{ width: 36, height: 20, borderRadius: 10, background: form.published ? '#C41E3A' : '#333', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 2, left: form.published ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
        </div>
        <span style={{ fontSize: 12, color: '#999' }}>{form.published ? 'Published — visible on site' : 'Draft — hidden from site'}</span>
      </label>

      {error && <p style={{ fontSize: 13, color: '#C41E3A', marginBottom: 16 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={saving} style={{ padding: '12px 32px', background: saving ? '#333' : '#C41E3A', color: 'white', border: 'none', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
          {saving ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
        <button type="button" onClick={() => router.push('/admin/blog')} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #333', color: '#999', fontSize: 12, fontFamily: 'inherit' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}
