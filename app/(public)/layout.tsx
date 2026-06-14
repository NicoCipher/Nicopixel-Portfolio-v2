import { Navbar } from '@/components/layout/Navbar'
import { PageTracker } from '@/components/ui/PageTracker'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: settingsRows } = await supabase.from('site_settings').select('key, value')
  const settings: Record<string, string | null> = {}
  settingsRows?.forEach((r: { key: string; value: string | null }) => { settings[r.key] = r.value })

  return (
    <>
      <Navbar settings={settings} />
      <PageTracker />
      <main style={{ paddingTop: 64, overflowX: 'hidden', maxWidth: '100vw' }}>
        {children}
      </main>
      <Footer settings={settings} />
    </>
  )
}
