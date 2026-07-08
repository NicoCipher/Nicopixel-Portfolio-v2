import {
  Playfair_Display,
  DM_Sans,
  Inter,
  Fraunces,
  Lora,
  Source_Sans_3,
  Space_Grotesk,
} from 'next/font/google'

// Self-hosted equivalents of the site's font-pairing system.
// Previously all 7 families loaded on every request via a render-blocking
// `@import url('https://fonts.googleapis.com/...')` in globals.css — a
// third-party round trip (fonts.googleapis.com -> fonts.gstatic.com) that
// blocked CSSOM construction before any text could paint in the correct
// font, on every single page view regardless of which pairing was active.
//
// next/font self-hosts the font files (served from the same origin,
// no third-party request, automatic font-display:swap + fallback metric
// matching to reduce layout shift). Only the default "editorial" pairing
// is preloaded — the other four are still self-hosted (so no third-party
// request either way) but not eagerly fetched, since they're only used
// when an admin explicitly switches the pairing.

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dmsans',
  display: 'swap',
  preload: true,
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: false,
})

export const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
  preload: false,
})

export const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sourcesans',
  display: 'swap',
  preload: false,
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-spacegrotesk',
  display: 'swap',
  preload: false,
})

export const allFontVariables = [
  playfairDisplay.variable,
  dmSans.variable,
  inter.variable,
  fraunces.variable,
  lora.variable,
  sourceSans3.variable,
  spaceGrotesk.variable,
].join(' ')

// Maps each font-pairing key to the self-hosted CSS variable names,
// mirroring lib/fontPairings.ts but pointing at next/font's generated
// (locally-hosted) font-family names instead of literal Google Fonts names.
export const FONT_PAIRING_VARS: Record<string, { heading: string; body: string }> = {
  editorial: { heading: 'var(--font-playfair), Georgia, serif', body: 'var(--font-dmsans), system-ui, sans-serif' },
  minimal: { heading: 'var(--font-inter), system-ui, sans-serif', body: 'var(--font-inter), system-ui, sans-serif' },
  contemporary: { heading: 'var(--font-fraunces), Georgia, serif', body: 'var(--font-inter), system-ui, sans-serif' },
  warm: { heading: 'var(--font-lora), Georgia, serif', body: 'var(--font-sourcesans), system-ui, sans-serif' },
  sharp: { heading: 'var(--font-spacegrotesk), system-ui, sans-serif', body: 'var(--font-inter), system-ui, sans-serif' },
}
