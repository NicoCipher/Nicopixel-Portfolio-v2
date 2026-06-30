import { createClient } from '@/lib/supabase/server'
import { AboutForm } from '@/components/admin/AboutForm'
import { MilestonesManager } from '@/components/admin/MilestonesManager'

export default async function AdminAboutPage() {
  const supabase = await createClient()
  const { data: about } = await supabase.from('about_content').select('*').single()
  const { data: milestones } = await supabase
    .from('career_milestones').select('*')
    .order('sort_year', { ascending: false })
    .order('sort_order', { ascending: true })

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>About</h1>
        <p style={{ fontSize: 13, color: '#555' }}>Edit your bio, photo, and tools.</p>
      </div>
      <AboutForm about={about} />

      <div style={{ marginTop: 56, marginBottom: 36 }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Career Milestones</h2>
        <p style={{ fontSize: 13, color: '#555' }}>The journey timeline shown on your About page. Sort Year controls order — most recent first.</p>
      </div>
      <MilestonesManager initialMilestones={milestones ?? []} />

      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px !important; } }`}</style>
    </div>
  )
}
