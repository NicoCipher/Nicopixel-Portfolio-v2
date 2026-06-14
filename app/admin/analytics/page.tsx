import { createClient } from '@/lib/supabase/server'
import { ClearAnalyticsButton } from '@/components/admin/ClearAnalyticsButton'

async function getAnalytics() {
  const supabase = await createClient()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const last7  = new Date(Date.now() - 7  * 86400000).toISOString()
  const last30 = new Date(Date.now() - 30 * 86400000).toISOString()

  const [
    { count: totalViews },
    { count: todayViews },
    { count: weekViews },
    { count: monthViews },
    { data: last30Data },
    { data: allData },
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', last7),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', last30),
    supabase.from('page_views').select('path, visitor_id, device_type, created_at').gte('created_at', last30),
    supabase.from('page_views').select('visitor_id, device_type').gte('created_at', last30),
  ])

  // Unique visitors (last 30 days)
  const uniqueVisitors = new Set(allData?.filter(v => v.visitor_id).map((v: { visitor_id: string }) => v.visitor_id)).size

  // Device breakdown
  const devices: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0, unknown: 0 }
  allData?.forEach((v: { device_type: string | null }) => {
    const d = v.device_type || 'unknown'
    devices[d] = (devices[d] || 0) + 1
  })

  // Top pages
  const pathCounts: Record<string, number> = {}
  last30Data?.forEach((v: { path: string }) => { pathCounts[v.path] = (pathCounts[v.path] || 0) + 1 })
  const topPages = Object.entries(pathCounts).sort(([,a],[,b]) => b - a).slice(0, 8)

  // Daily views (last 14 days)
  const daily: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    daily[key] = 0
  }
  last30Data?.forEach((v: { created_at: string }) => {
    const key = new Date(v.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    if (key in daily) daily[key]++
  })

  // Top referrers
  const refCounts: Record<string, number> = {}
  last30Data?.forEach((v: { path?: string; visitor_id?: string; device_type?: string | null; created_at?: string } & { referrer?: string }) => {
    const ref = (v as Record<string,string>).referrer
    if (ref && ref !== '' && !ref.includes('nicopixel.vercel.app')) {
      try {
        const domain = new URL(ref).hostname
        refCounts[domain] = (refCounts[domain] || 0) + 1
      } catch { /* ignore */ }
    }
  })
  const topReferrers = Object.entries(refCounts).sort(([,a],[,b]) => b - a).slice(0, 5)

  return { totalViews, todayViews, weekViews, monthViews, uniqueVisitors, devices, topPages, daily, topReferrers }
}

export default async function AnalyticsPage() {
  const { totalViews, todayViews, weekViews, monthViews, uniqueVisitors, devices, topPages, daily, topReferrers } = await getAnalytics()

  const dailyEntries = Object.entries(daily)
  const maxDay = Math.max(...Object.values(daily), 1)
  const totalDevices = Object.values(devices).reduce((a, b) => a + b, 0) || 1

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Analytics</h1>
          <p style={{ fontSize: 13, color: '#555' }}>Real-time data from your Supabase database.</p>
        </div>
        <ClearAnalyticsButton />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'Today', value: todayViews ?? 0 },
          { label: 'Last 7 days', value: weekViews ?? 0 },
          { label: 'Last 30 days', value: monthViews ?? 0 },
          { label: 'All time views', value: totalViews ?? 0 },
          { label: 'Unique visitors (30d)', value: uniqueVisitors, accent: true },
        ].map(s => (
          <div key={s.label} style={{ background: '#0A0A0A', border: `1px solid ${s.accent ? '#C41E3A33' : '#1F1F1F'}`, padding: '20px 16px' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 400, color: s.accent ? '#C41E3A' : '#FAFAF9', lineHeight: 1, marginBottom: 8 }}>
              {s.value.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Bar chart */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, color: '#FAFAF9', marginBottom: 24, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Daily Views — Last 14 Days
          </h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
            {dailyEntries.map(([date, count]) => (
              <div key={date} title={`${date}: ${count} views`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 4 }}>
                <div style={{
                  width: '100%', borderRadius: '2px 2px 0 0',
                  height: `${Math.max((count / maxDay) * 100, count > 0 ? 4 : 0)}%`,
                  minHeight: count > 0 ? 3 : 0,
                  background: count > 0 ? '#C41E3A' : '#1A1A1A',
                  transition: 'height 0.3s',
                }} />
                <span style={{ fontSize: 8, color: '#444', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', lineHeight: 1 }}>
                  {date.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device breakdown */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, color: '#FAFAF9', marginBottom: 24, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Devices (30d)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { key: 'desktop', label: 'Desktop', color: '#C41E3A' },
              { key: 'mobile', label: 'Mobile', color: '#4CAF50' },
              { key: 'tablet', label: 'Tablet', color: '#2196F3' },
            ].map(d => {
              const count = devices[d.key] || 0
              const pct = Math.round((count / totalDevices) * 100)
              return (
                <div key={d.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#999' }}>{d.label}</span>
                    <span style={{ fontSize: 12, color: '#FAFAF9', fontWeight: 600 }}>{pct}% <span style={{ color: '#444', fontWeight: 400 }}>({count})</span></span>
                  </div>
                  <div style={{ height: 4, background: '#1F1F1F', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: d.color, borderRadius: 2, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top pages */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, color: '#FAFAF9', marginBottom: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Top Pages (30d)
          </h2>
          {topPages.length === 0
            ? <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>No data yet.</p>
            : <div style={{ display: 'flex', flexDirection: 'column' }}>
                {topPages.map(([path, count], i) => {
                  const pct = Math.round((count / (topPages[0]?.[1] || 1)) * 100)
                  return (
                    <div key={path} style={{ padding: '10px 0', borderBottom: i < topPages.length - 1 ? '1px solid #1A1A1A' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: '#FAFAF9', fontFamily: 'monospace' }}>{path || '/'}</span>
                        <span style={{ fontSize: 11, color: '#C41E3A', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>{count}</span>
                      </div>
                      <div style={{ height: 2, background: '#1F1F1F', borderRadius: 1, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#C41E3A', borderRadius: 1 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
          }
        </div>

        {/* Top referrers */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, color: '#FAFAF9', marginBottom: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Top Referrers (30d)
          </h2>
          {topReferrers.length === 0
            ? <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>No referrer data yet.</p>
            : <div style={{ display: 'flex', flexDirection: 'column' }}>
                {topReferrers.map(([domain, count], i) => (
                  <div key={domain} style={{ padding: '12px 0', borderBottom: i < topReferrers.length - 1 ? '1px solid #1A1A1A' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#999' }}>{domain}</span>
                    <span style={{ fontSize: 12, color: '#FAFAF9', fontWeight: 600 }}>{count}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          div[style*="padding: 40px 48px"] { padding: 24px 16px !important; }
          div[style*="repeat(5, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="2fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="1fr 1fr"][style*="gap: 16px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
