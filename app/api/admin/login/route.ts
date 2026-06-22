import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required.' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  // Check recent failed attempts
  const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .eq('success', false)
    .gte('attempted_at', since)

  if ((count ?? 0) >= MAX_ATTEMPTS) {
    const { error: logErr } = await supabase.from('activity_log').insert({
      action: 'LOGIN_BLOCKED',
      detail: `Account locked — too many failed attempts from IP ${ip}`,
      ip,
    })
    if (logErr) console.error('activity_log insert failed:', logErr.message)
    return NextResponse.json({
      error: `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.`
    }, { status: 429 })
  }

  // Attempt login with user's Supabase client
  const userSupabase = await createClient()
  const { data, error } = await userSupabase.auth.signInWithPassword({ email, password })

  // Log attempt
  const { error: attemptLogErr } = await supabase.from('login_attempts').insert({
    email,
    ip,
    success: !error,
  })
  if (attemptLogErr) console.error('login_attempts insert failed:', attemptLogErr.message)

  if (error) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
  }

  // Log successful login
  const { error: successLogErr } = await supabase.from('activity_log').insert({
    user_id: data.user.id,
    action: 'LOGIN_SUCCESS',
    detail: `Signed in from IP ${ip}`,
    ip,
  })
  if (successLogErr) console.error('activity_log insert failed:', successLogErr.message)

  return NextResponse.json({ success: true })
}
