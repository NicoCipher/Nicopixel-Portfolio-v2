import { createClient } from '@/lib/supabase/server'
import { WorkGallery } from '@/components/sections/WorkGallery'
import { Reveal } from '@/components/ui/Reveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected brand identity, events design, and print collateral projects by Nicopixel — a Lagos-based graphic design studio.',
  alternates: { canonical: 'https://nicopixel.vercel.app/work' },
}

export default async function WorkPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects').select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  return (
    <>
      <Reveal as="div" className="work-header">
        <p style={{
          fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--accent-text)', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Selected Work
        </p>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(32px, 5vw, 64px)',
          fontWeight: 400, marginBottom: 0,
        }}>
          All Projects
        </h1>
      </Reveal>
      <WorkGallery projects={projects || []} />
      <style>{`
        .work-header {
          padding: 60px 48px 40px;
          border-bottom: 1px solid var(--border);
        }
        @media(max-width: 767px) {
          .work-header { padding: 40px 20px 28px; }
        }
      `}</style>
    </>
  )
}
