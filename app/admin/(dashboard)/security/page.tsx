import { createClient } from '@/lib/supabase/server'
import { ClearSecurityLogsButton } from '@/components/admin/ClearSecurityLogsButton'
import { DeleteLogRowButton } from '@/components/admin/DeleteLogRowButton'

async function getSecurityData() {
  const supabase = await createClient()
  const cutoff = new Date(Date.now() - 86400000).toISOString()

  const [{ data: logs }, { data: attempts }, { count: failedCount }, { count: totalLogs }, { count: totalAttempts }, { data: timeoutSetting }] = await Promise.all([
    supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('login_attempts').select('*').order('attempted_at', { ascending: false }).limit(20),
    supabase.from('login_attempts').select('*', { count: 'exact', head: true }).eq('success', false).gte('attempted_at', cutoff),
    supabase.from('activity_log').select('*', { count: 'exact', head: true }),
    supabase.from('login_attempts').select('*', { count: 'exact', head: true }),
    supabase.from('site_settings').select('value').eq('key', 'session_timeout_minutes').maybeSingle(),
  ])
  const timeoutMinutes = timeoutSetting?.value ? parseInt(timeoutSetting.value, 10) : 30
  return { logs, attempts, failedCount, totalLogs, totalAttempts, timeoutMinutes }
}

export default async function SecurityPage() {
  const { logs, attempts, failedCount, totalLogs, totalAttempts, timeoutMinutes } = await getSecurityData()

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Security</h1>
          <p style={{ fontSize: 13, color: '#555' }}>Login attempts and activity log. Showing latest 20 of each — logs older than 90 days are pruned automatically.</p>
        </div>
        <ClearSecurityLogsButton />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Failed logins (24h)', value: failedCount ?? 0, alert: (failedCount ?? 0) > 3 },
          { label: 'Session timeout', value: `${timeoutMinutes} min` },
          { label: 'Max attempts', value: '5 then lock' },
        ].map(s => (
          <div key={s.label} style={{ background: '#0A0A0A', border: `1px solid ${s.alert ? '#C41E3A' : '#1F1F1F'}`, padding: '24px' }}>
            <div style={{ fontSize: 28, fontFamily: 'Georgia, serif', color: s.alert ? '#C41E3A' : '#FAFAF9', marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF9', marginBottom: 4, letterSpacing: '0.06em' }}>Activity Log</h2>
          <p style={{ fontSize: 11, color: '#444', marginBottom: 16 }}>{totalLogs ?? 0} total entries</p>
          {!logs?.length
            ? <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>No activity yet.</p>
            : <div style={{ display: 'flex', flexDirection: 'column' }}>
                {logs.map((log: { id: string; action: string; detail: string | null; ip: string | null; created_at: string }) => (
                  <div key={log.id} style={{ padding: '10px 0', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: log.action.includes('BLOCK') || log.action.includes('FAIL') ? '#C41E3A' : '#4CAF50' }}>{log.action}</span>
                        <span style={{ fontSize: 10, color: '#444' }}>{new Date(log.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {log.detail && <p style={{ fontSize: 11, color: '#555', margin: 0 }}>{log.detail}</p>}
                      {log.ip && <p style={{ fontSize: 10, color: '#444', margin: '2px 0 0' }}>IP: {log.ip}</p>}
                    </div>
                    <DeleteLogRowButton table="activity_log" id={log.id} />
                  </div>
                ))}
              </div>
          }
        </div>

        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF9', marginBottom: 4, letterSpacing: '0.06em' }}>Login Attempts</h2>
          <p style={{ fontSize: 11, color: '#444', marginBottom: 16 }}>{totalAttempts ?? 0} total entries</p>
          {!attempts?.length
            ? <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>No attempts yet.</p>
            : <div style={{ display: 'flex', flexDirection: 'column' }}>
                {attempts.map((a: { id: string; email: string; ip: string | null; success: boolean; attempted_at: string }) => (
                  <div key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 12, color: '#FAFAF9' }}>{a.email}</span>
                      {a.ip && <span style={{ fontSize: 10, color: '#444', marginLeft: 8 }}>{a.ip}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: a.success ? '#4CAF50' : '#C41E3A', padding: '2px 8px', border: `1px solid ${a.success ? '#4CAF50' : '#C41E3A'}` }}>{a.success ? 'Success' : 'Failed'}</span>
                      <span style={{ fontSize: 10, color: '#444' }}>{new Date(a.attempted_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      <DeleteLogRowButton table="login_attempts" id={a.id} />
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px !important; } div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr 1fr !important; } div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
