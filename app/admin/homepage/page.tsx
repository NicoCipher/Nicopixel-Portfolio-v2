import { createClient } from '@/lib/supabase/server'
import { HomepageForm } from '@/components/admin/HomepageForm'

export default async function AdminHomepagePage() {
  const supabase = await createClient()

  const [
    { data: settingsRows },
    { data: services },
    { data: whyItems },
    { data: testimonials },
  ] = await Promise.all([
    supabase.from('site_settings').select('key, value'),
    supabase.from('services').select('*').order('sort_order'),
    supabase.from('why_items').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').order('sort_order'),
  ])

  const settings: Record<string, string> = {}
  settingsRows?.forEach((r: { key: string; value: string | null }) => { settings[r.key] = r.value ?? '' })

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>
          Homepage
        </h1>
        <p style={{ fontSize: 13, color: '#555' }}>Edit hero, services, why section, and testimonials.</p>
      </div>
      <HomepageForm
        settings={settings}
        services={services || []}
        whyItems={whyItems || []}
        testimonials={testimonials || []}
      />
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px !important; } }`}</style>
    </div>
  )
}
