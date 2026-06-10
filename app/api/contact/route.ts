import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limiter per IP
const rateMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 3
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (entry) {
    if (now < entry.reset) {
      if (entry.count >= RATE_LIMIT) {
        return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
      }
      entry.count++
    } else {
      rateMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    }
  } else {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS })
  }

  const body = await req.json()
  const { name, email, subject, message } = body

  // Basic validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  try {
    // Save to database
    const supabase = await createAdminClient()
    await supabase.from('messages').insert({ name, email, subject, message })

    // Forward to Gmail
    await resend.emails.send({
      from: 'Nicopixel Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: subject ? `[Nicopixel] ${subject}` : `[Nicopixel] New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0A0A0A; border-bottom: 1px solid #eee; padding-bottom: 16px;">New Message</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <div style="margin-top: 24px; padding: 20px; background: #f9f9f9; border-left: 3px solid #C41E3A;">
            <p style="white-space: pre-wrap; line-height: 1.7;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">Sent via Nicopixel contact form</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
