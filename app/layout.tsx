import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Analytics } from '@vercel/analytics/next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://nicopixel.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Nicopixel — Graphic Designer Lagos',
    template: '%s | Nicopixel',
  },
  description: 'Nicopixel is a Lagos-based graphic designer specialising in brand identity, events design, and print collateral. Available for projects across Nigeria and globally.',
  keywords: [
    'nicopixel',
    'graphic designer lagos',
    'graphic designer nigeria',
    'brand identity designer lagos',
    'brand identity nigeria',
    'events design lagos',
    'print design nigeria',
    'logo designer lagos',
    'creative designer lagos',
    'Taiwo Olumide',
  ],
  authors: [{ name: 'Taiwo Olumide', url: BASE_URL }],
  creator: 'Taiwo Olumide',
  publisher: 'Nicopixel',
  category: 'Design',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: BASE_URL,
    siteName: 'Nicopixel',
    title: 'Nicopixel — Graphic Designer Lagos',
    description: 'Lagos-based graphic designer. Brand identity, events design, and print collateral.',
    images: [{
      url: '/og-image.png',
      width: 1200, height: 630,
      alt: 'Nicopixel — Graphic Designer Lagos',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nicopixel — Graphic Designer Lagos',
    description: 'Lagos-based graphic designer. Brand identity, events design, and print collateral.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true, follow: true,
    googleBot: {
      index: true, follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: BASE_URL },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch favicon and logo from settings
  const supabase = await createClient()
  const { data: rows } = await supabase.from('site_settings').select('key, value').in('key', ['favicon_url', 'logo_url'])
  const siteAssets: Record<string, string> = {}
  rows?.forEach((r: { key: string; value: string | null }) => { if (r.value) siteAssets[r.key] = r.value })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Taiwo Olumide',
    alternateName: 'Nicopixel',
    url: BASE_URL,
    jobTitle: 'Graphic Designer',
    worksFor: { '@type': 'Organization', name: 'Nicopixel' },
    address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
    knowsAbout: ['Brand Identity', 'Graphic Design', 'Events Design', 'Print Design', 'Logo Design'],
    sameAs: ['https://behance.net/nicopixel', 'https://instagram.com/nicopixel'],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {siteAssets.favicon_url && (
          <>
            <link rel="icon" type="image/png" href={siteAssets.favicon_url} />
            <link rel="shortcut icon" href={siteAssets.favicon_url} />
            <link rel="apple-touch-icon" href={siteAssets.favicon_url} />
          </>
        )}
        <meta name="theme-color" content="#0A0A0A" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
