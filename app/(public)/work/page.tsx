import { createClient } from '@/lib/supabase/server'
import { WorkGallery } from '@/components/sections/WorkGallery'

export const metadata = { title: 'Work — Nicopixel' }

export default async function WorkPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects').select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  return (
    <>
      <div style={{
        padding: '60px 48px 0',
        borderBottom: '1px solid var(--border)',
      }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Selected Work
        </p>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 400, marginBottom: 40,
        }}>
          All Projects
        </h1>
      </div>
      <WorkGallery projects={projects || []} />
      <style>{`@media(max-width:767px){ div[style*="padding: 60px 48px"] { padding: 48px 24px 0 !important; } }`}</style>
    </>
  )
}
