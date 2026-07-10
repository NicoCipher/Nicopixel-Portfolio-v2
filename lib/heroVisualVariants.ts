export type HeroVisualVariant = {
  key: string
  label: string
  description: string
  built: boolean
}

// key '0'-'6' mirrors the day-of-week index (Date.getDay()) used for auto
// rotation, so a manual override and the auto schedule share one numbering.
export const HERO_VISUAL_VARIANTS: HeroVisualVariant[] = [
  { key: '0', label: 'Happy Accident', description: 'Cursor tries an idea, hesitates, undoes it, tries another, lands on the right one.', built: true },
  { key: '1', label: 'The Design Process', description: 'Sketch → grid → vector → spacing → color → finished logo.', built: false },
  { key: '2', label: 'The Pixel Builder', description: 'Cursor places pixels one by one until they form the logo.', built: false },
  { key: '3', label: 'The Precision Test', description: 'Zooms in, nudges a pixel into alignment, zooms back out.', built: false },
  { key: '4', label: 'The Experimenter', description: 'Wild stretch, tilt, and color — undone in a rapid flurry.', built: false },
  { key: '5', label: "Designer's Speedrun", description: 'Draw, duplicate, align, group, center, save — fast.', built: false },
  { key: '6', label: 'Smart Guides', description: 'Alignment guides flash and snap into place while moving.', built: false },
]

export const DEFAULT_HERO_VISUAL_VARIANT = 'auto'
