// Curated font pairings — kept as a fixed set (not free-text) so the
// admin can change typography without risking a clashing combination
// breaking the site's design coherence. Add new pairings here only.

export type FontPairing = {
  key: string
  label: string
  description: string
  heading: string
  body: string
  // Exact Google Fonts CSS2 query params for this pairing's fonts.
  // Combined once in globals.css so every option loads up front —
  // switching is then just a CSS variable swap, no extra network cost
  // at runtime.
}

export const FONT_PAIRINGS: FontPairing[] = [
  {
    key: 'editorial',
    label: 'Classic Editorial',
    description: 'Playfair Display + DM Sans — elegant serif, clean sans body. (Default)',
    heading: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
  },
  {
    key: 'minimal',
    label: 'Modern Minimal',
    description: 'Inter throughout — fully sans-serif, ultra-clean and contemporary.',
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
  {
    key: 'contemporary',
    label: 'Bold Contemporary',
    description: 'Fraunces + Inter — a characterful, slightly quirky serif with a crisp sans body.',
    heading: "'Fraunces', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
  },
  {
    key: 'warm',
    label: 'Warm Classic',
    description: 'Lora + Source Sans 3 — a softer, more approachable serif pairing.',
    heading: "'Lora', Georgia, serif",
    body: "'Source Sans 3', system-ui, sans-serif",
  },
  {
    key: 'sharp',
    label: 'Sharp Modern',
    description: 'Space Grotesk + Inter — geometric, distinctive, technical feel.',
    heading: "'Space Grotesk', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
]

export const DEFAULT_FONT_PAIRING = 'editorial'

export function getFontPairing(key: string | null | undefined): FontPairing {
  return FONT_PAIRINGS.find(p => p.key === key) ?? FONT_PAIRINGS[0]
}
