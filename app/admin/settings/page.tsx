import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase.from('site_settings').select('key, value')
  const settings: Record<string, string> = {}
  rows?.forEach((r: { key: string; value: string | null }) => { settings[r.key] = r.value ?? '' })

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 13, color: '#555' }}>Manage site content and social links.</p>
      </div>
      <SettingsForm settings={settings} />
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px !important; } }`}</style>
    </div>
  )
}
