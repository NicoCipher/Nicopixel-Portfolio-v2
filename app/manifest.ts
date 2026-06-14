import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nicopixel — Graphic Designer Lagos',
    short_name: 'Nicopixel',
    description: 'Lagos-based graphic designer. Brand identity, events design, and print collateral.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FAFAF9',
    theme_color: '#0A0A0A',
    categories: ['design', 'portfolio', 'creative'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        label: 'Nicopixel Portfolio',
      },
    ],
  }
}
