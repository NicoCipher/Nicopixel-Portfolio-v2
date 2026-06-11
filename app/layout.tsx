import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Cursor } from '@/components/ui/Cursor'

export const metadata: Metadata = {
  title: 'Nicopixel — Graphic Designer',
  description: 'Lagos-based graphic designer. Brand identity, events design, and print.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Cursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
