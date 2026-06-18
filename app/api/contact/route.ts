import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const rateMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 3
const WINDOW_MS = 60 * 60 * 1000

export async function POST(req: NextRequest) {
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
  const { name, email, subject, message, website } = body

  // Honeypot check — if filled, it's a bot. Pretend success so bots don't learn.
  if (website && website.trim() !== '') {
    return NextResponse.json({ success: true })
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  try {
    const supabase = await createAdminClient()
    await supabase.from('messages').insert({ name, email, subject, message })

    await resend.emails.send({
      from: 'Nicopixel <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL!],
      replyTo: email,
      subject: subject ? `[Nicopixel] ${subject}` : `[Nicopixel] New message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 0;">
          <div style="border-bottom:2px solid #C41E3A;padding-bottom:20px;margin-bottom:28px;">
            <h2 style="margin:0;font-size:22px;color:#0A0A0A;">New message via Nicopixel</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
            <tr><td style="padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;width:100px;">From</td><td style="padding:8px 0;font-size:14px;color:#0A0A0A;">${name}</td></tr>
            <tr><td style="padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}" style="color:#C41E3A;">${email}</a></td></tr>
            ${subject ? `<tr><td style="padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Subject</td><td style="padding:8px 0;font-size:14px;color:#0A0A0A;">${subject}</td></tr>` : ''}
          </table>
          <div style="background:#f9f9f9;border-left:3px solid #C41E3A;padding:20px 24px;margin-bottom:28px;">
            <p style="margin:0;font-size:15px;line-height:1.8;color:#333;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="font-size:11px;color:#bbb;margin:0;">Sent via nicopixel.vercel.app contact form</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
