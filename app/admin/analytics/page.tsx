import { createClient } from '@/lib/supabase/server'

async function getAnalytics() {
  const supabase = await createClient()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const last7 = new Date(Date.now() - 7 * 86400000).toISOString()
  const last30 = new Date(Date.now() - 30 * 86400000).toISOString()

  const [
    { count: totalViews },
    { count: todayViews },
    { count: weekViews },
    { count: monthViews },
    { data: recentViews },
    { data: topPages },
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', last7),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', last30),
    supabase.from('page_views').select('path, created_at').order('created_at', { ascending: false }).limit(100),
    supabase.from('page_views').select('path').gte('created_at', last30),
  ])

  // Count per path
  const pathCounts: Record<string, number> = {}
  topPages?.forEach((v: { path: string }) => {
    pathCounts[v.path] = (pathCounts[v.path] || 0) + 1
  })
  const sortedPages = Object.entries(pathCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)

  // Daily breakdown (last 14 days)
  const daily: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    daily[key] = 0
  }
  recentViews?.forEach((v: { created_at: string }) => {
    const d = new Date(v.created_at)
    const key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    if (key in daily) daily[key]++
  })

  return { totalViews, todayViews, weekViews, monthViews, sortedPages, daily }
}

export default async function AnalyticsPage() {
  const { totalViews, todayViews, weekViews, monthViews, sortedPages, daily } = await getAnalytics()

  const dailyEntries = Object.entries(daily)
  const maxDay = Math.max(...Object.values(daily), 1)

  const stats = [
    { label: 'Today', value: todayViews ?? 0 },
    { label: 'Last 7 days', value: weekViews ?? 0 },
    { label: 'Last 30 days', value: monthViews ?? 0 },
    { label: 'All time', value: totalViews ?? 0 },
  ]

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: '#555' }}>Page views tracked directly in your database.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '24px 20px' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 400, color: '#FAFAF9', lineHeight: 1, marginBottom: 8 }}>
              {s.value.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Bar chart */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF9', marginBottom: 24, letterSpacing: '0.06em' }}>
            Daily Views — Last 14 Days
          </h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
            {dailyEntries.map(([date, count]) => (
              <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '100%',
                  height: `${Math.max((count / maxDay) * 100, count > 0 ? 4 : 0)}%`,
                  background: count > 0 ? '#C41E3A' : '#1F1F1F',
                  borderRadius: '2px 2px 0 0',
                  minHeight: count > 0 ? 3 : 0,
                  transition: 'height 0.3s ease',
                  position: 'relative',
                }} title={`${count} views`} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 9, color: '#444' }}>{dailyEntries[0]?.[0]}</span>
            <span style={{ fontSize: 9, color: '#444' }}>{dailyEntries[dailyEntries.length - 1]?.[0]}</span>
          </div>
        </div>

        {/* Top pages */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF9', marginBottom: 20, letterSpacing: '0.06em' }}>
            Top Pages — Last 30 Days
          </h2>
          {sortedPages.length === 0 ? (
            <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>No data yet. Pages are tracked after 2 seconds of viewing.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {sortedPages.map(([path, count], i) => {
                const pct = Math.round((count / (sortedPages[0]?.[1] || 1)) * 100)
                return (
                  <div key={path} style={{ padding: '10px 0', borderBottom: i < sortedPages.length - 1 ? '1px solid #1A1A1A' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#FAFAF9', fontFamily: 'monospace' }}>{path || '/'}</span>
                      <span style={{ fontSize: 11, color: '#C41E3A', fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>{count}</span>
                    </div>
                    <div style={{ height: 2, background: '#1F1F1F', borderRadius: 1, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#C41E3A', borderRadius: 1 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          div[style*="padding: 40px 48px"] { padding: 24px 16px !important; }
          div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="1fr 1fr"][style*="gap: 24px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
