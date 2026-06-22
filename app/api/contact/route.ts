import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const RATE_LIMIT = 3
const WINDOW_MS = 60 * 60 * 1000

const MAX_NAME_LEN = 100
const MAX_SUBJECT_LEN = 150
const MAX_MESSAGE_LEN = 5000

// Escape HTML special characters so message content can never break out
// of the email's HTML structure or inject markup/scripts.
function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

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

  if (name.length > MAX_NAME_LEN || (subject && subject.length > MAX_SUBJECT_LEN) || message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json({ error: 'One or more fields exceed the maximum length.' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  const { data: emailSetting } = await supabase.from('site_settings').select('value').eq('key', 'email').maybeSingle()
  const destinationEmail = emailSetting?.value || process.env.CONTACT_EMAIL!

  // Database-backed rate limit — checks recent submissions from this IP.
  // An in-memory counter would not work reliably across serverless
  // function instances, so this queries persistent storage instead.
  const since = new Date(Date.now() - WINDOW_MS).toISOString()
  const { count: recentCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', since)

  if ((recentCount ?? 0) >= RATE_LIMIT) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  try {
    await supabase.from('messages').insert({ name, email, subject, message, ip })

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeSubject = subject ? escapeHtml(subject) : ''
    const safeMessage = escapeHtml(message)

    await resend.emails.send({
      from: 'Nicopixel <onboarding@resend.dev>',
      to: [destinationEmail],
      replyTo: email,
      subject: subject ? `[Nicopixel] ${safeSubject}` : `[Nicopixel] New message from ${safeName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 0;">
          <div style="border-bottom:2px solid #C41E3A;padding-bottom:20px;margin-bottom:28px;">
            <h2 style="margin:0;font-size:22px;color:#0A0A0A;">New message via Nicopixel</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
            <tr><td style="padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;width:100px;">From</td><td style="padding:8px 0;font-size:14px;color:#0A0A0A;">${safeName}</td></tr>
            <tr><td style="padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${safeEmail}" style="color:#C41E3A;">${safeEmail}</a></td></tr>
            ${subject ? `<tr><td style="padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Subject</td><td style="padding:8px 0;font-size:14px;color:#0A0A0A;">${safeSubject}</td></tr>` : ''}
          </table>
          <div style="background:#f9f9f9;border-left:3px solid #C41E3A;padding:20px 24px;margin-bottom:28px;">
            <p style="margin:0;font-size:15px;line-height:1.8;color:#333;white-space:pre-wrap;">${safeMessage}</p>
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
