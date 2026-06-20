import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: unreadMessages },
    { data: recentMessages },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false),
    supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Total Projects', value: totalProjects ?? 0, href: '/admin/projects' },
    { label: 'Published', value: publishedProjects ?? 0, href: '/admin/projects' },
    { label: 'Unread Messages', value: unreadMessages ?? 0, href: '/admin/messages', accent: (unreadMessages ?? 0) > 0 },
  ]

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#555' }}>Welcome back.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#0A0A0A', border: '1px solid #1F1F1F',
              borderLeft: stat.accent ? '3px solid #C41E3A' : '3px solid #1F1F1F',
              padding: '28px 24px',
              transition: 'border-color 0.2s',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            }} className="stat-card">
              <div>
                <div style={{
                  fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12,
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: 42, fontFamily: 'Georgia, serif', fontWeight: 400,
                  color: stat.accent ? '#C41E3A' : '#FAFAF9', lineHeight: 1,
                }}>{stat.value}</div>
              </div>
              <span style={{ fontSize: 11, color: '#444', letterSpacing: '0.04em' }}>→</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent projects */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF9', letterSpacing: '0.06em' }}>Recent Projects</h2>
            <Link href="/admin/projects/new" style={{
              fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#C41E3A', textDecoration: 'none',
            }}>+ Add New</Link>
          </div>
          {!recentProjects?.length ? (
            <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>No projects yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recentProjects.map((p: { id: string; title: string; category: string; published: boolean }) => (
                <Link key={p.id} href={`/admin/projects/${p.id}`} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid #1A1A1A',
                  textDecoration: 'none',
                }}>
                  <div>
                    <span style={{ fontSize: 13, color: '#FAFAF9' }}>{p.title}</span>
                    <span style={{ fontSize: 10, color: '#444', marginLeft: 10, textTransform: 'capitalize' }}>{p.category}</span>
                  </div>
                  <span style={{
                    fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: p.published ? '#4CAF50' : '#666',
                    padding: '3px 8px', border: `1px solid ${p.published ? '#4CAF50' : '#333'}`,
                  }}>{p.published ? 'Live' : 'Draft'}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF9', letterSpacing: '0.06em' }}>Recent Messages</h2>
            <Link href="/admin/messages" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', textDecoration: 'none' }}>View All</Link>
          </div>
          {!recentMessages?.length ? (
            <p style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>No messages yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recentMessages.map((m: { id: string; name: string; subject: string | null; message: string; read: boolean; created_at: string }) => (
                <Link key={m.id} href="/admin/messages" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '12px 0', borderBottom: '1px solid #1A1A1A',
                  textDecoration: 'none',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      {!m.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C41E3A', flexShrink: 0 }} />}
                      <span style={{ fontSize: 13, color: '#FAFAF9', fontWeight: m.read ? 400 : 600 }}>{m.name}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.subject || m.message.slice(0, 50)}
                    </p>
                  </div>
                  <span style={{ fontSize: 10, color: '#444', flexShrink: 0, marginLeft: 12 }}>
                    {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .stat-card:hover { border-color: #333 !important; }
        @media(max-width:900px){ 
          div[style*="padding: 40px 48px"] { padding: 24px !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
