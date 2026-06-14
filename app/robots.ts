import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://nicopixel.vercel.app/sitemap.xml',
    host: 'https://nicopixel.vercel.app',
  }
}
