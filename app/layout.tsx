import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Cursor } from '@/components/ui/Cursor'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Nicopixel — Graphic Designer',
  description: 'Lagos-based graphic designer. Brand identity, events design, and print.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: settingsRows } = await supabase.from('site_settings').select('key, value')
  const settings: Record<string, string | null> = {}
  settingsRows?.forEach((r: { key: string; value: string | null }) => { settings[r.key] = r.value })

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Cursor />
          <Navbar settings={settings} />
          <main style={{ paddingTop: 64 }}>
            {children}
          </main>
          <Footer settings={settings} />
        </ThemeProvider>
      </body>
    </html>
  )
}
