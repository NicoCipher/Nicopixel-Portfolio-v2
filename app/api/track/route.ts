import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

function getDeviceType(ua: string | null): string {
  if (!ua) return 'unknown'
  if (/mobile|android|iphone|ipad|tablet/i.test(ua)) return 'mobile'
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  return 'desktop'
}

export async function POST(req: NextRequest) {
  try {
    const { path, referrer, visitor_id } = await req.json()
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const ua = req.headers.get('user-agent')
    const supabase = await createAdminClient()

    await supabase.from('page_views').insert({
      path: path.slice(0, 500),
      referrer: referrer ? String(referrer).slice(0, 500) : null,
      visitor_id: visitor_id ? String(visitor_id).slice(0, 100) : null,
      device_type: getDeviceType(ua),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
