import { createClient } from '@/lib/supabase/server'
import { AboutForm } from '@/components/admin/AboutForm'

export default async function AdminAboutPage() {
  const supabase = await createClient()
  const { data: about } = await supabase.from('about_content').select('*').single()
  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>About</h1>
        <p style={{ fontSize: 13, color: '#555' }}>Edit your bio, photo, and tools.</p>
      </div>
      <AboutForm about={about} />
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px !important; } }`}</style>
    </div>
  )
}
