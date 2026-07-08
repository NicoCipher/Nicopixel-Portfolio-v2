import type { Metadata } from 'next'
import { ContactPageClient } from '@/components/sections/ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Nicopixel for brand identity, events design, and print collateral projects in Lagos and beyond. Send a message or book a free discovery call.',
  alternates: { canonical: 'https://nicopixel.vercel.app/contact' },
  openGraph: {
    title: 'Contact Nicopixel',
    description: 'Get in touch for brand identity, events design, and print collateral projects.',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
