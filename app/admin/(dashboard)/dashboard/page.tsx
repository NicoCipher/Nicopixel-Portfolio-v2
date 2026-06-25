import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getDashboardData() {
  const supabase = await createClient()
  const dayAgo = new Date(Date.now() - 86400000).toISOString()

  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: unreadMessages },
    { count: publishedPosts },
    { count: draftPosts },
    { count: failedLogins24h },
    { count: failedEmails },
    { data: recentMessages },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', false),
    supabase.from('login_attempts').select('*', { count: 'exact', head: true }).eq('success', false).gte('attempted_at', dayAgo),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('email_sent', false),
    supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return { totalProjects, publishedProjects, unreadMessages, publishedPosts, draftPosts, failedLogins24h, failedEmails, recentMessages, recentProjects }
}

export default async function DashboardPage() {
  const { totalProjects, publishedProjects, unreadMessages, publishedPosts, draftPosts, failedLogins24h, failedEmails, recentMessages, recentProjects } = await getDashboardData()

  const stats = [
    { label: 'Total Projects', value: totalProjects ?? 0, href: '/admin/projects' },
    { label: 'Published', value: publishedProjects ?? 0, href: '/admin/projects' },
    { label: 'Unread Messages', value: unreadMessages ?? 0, href: '/admin/messages', accent: (unreadMessages ?? 0) > 0 },
    { label: 'Blog Posts Live', value: publishedPosts ?? 0, href: '/admin/blog' },
  ]

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#555' }}>Welcome back.</p>
      </div>

      {/* Security alert banner */}
      {(failedLogins24h ?? 0) > 3 && (
        <Link href="/admin/security" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'rgba(196,30,58,0.08)', border: '1px solid #C41E3A',
            padding: '16px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, color: '#FF6B81' }}>
              ⚠ {failedLogins24h} failed login attempt{failedLogins24h !== 1 ? 's' : ''} in the last 24 hours
            </span>
            <span style={{ fontSize: 11, color: '#C41E3A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>View Security →</span>
          </div>
        </Link>
      )}

      {/* Email notification failure banner */}
      {(failedEmails ?? 0) > 0 && (
        <Link href="/admin/messages" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'rgba(224,160,48,0.08)', border: '1px solid #5A4520',
            padding: '16px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ fontSize: 13, color: '#E0A030' }}>
              ⚠ {failedEmails} message{failedEmails !== 1 ? 's' : ''} didn&apos;t notify you by email — check your Resend setup
            </span>
            <span style={{ fontSize: 11, color: '#E0A030', letterSpacing: '0.08em', textTransform: 'uppercase' }}>View Messages →</span>
          </div>
        </Link>
      )}

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <Link href="/admin/projects/new" className="quick-action">+ New Project</Link>
        <Link href="/admin/blog/new" className="quick-action">+ New Blog Post</Link>
        <Link href="/" target="_blank" className="quick-action quick-action-ghost">View Live Site ↗</Link>
        {(draftPosts ?? 0) > 0 && (
          <Link href="/admin/blog" className="quick-action quick-action-ghost">{draftPosts} draft{draftPosts !== 1 ? 's' : ''} waiting</Link>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
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
        .quick-action {
          padding: 11px 22px; background: #C41E3A; color: white;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; transition: background 0.2s;
        }
        .quick-action:hover { background: #A01830; }
        .quick-action-ghost {
          background: transparent; border: 1px solid #2A2A2A; color: #888;
        }
        .quick-action-ghost:hover { background: #111; border-color: #444; color: #aaa; }
        @media(max-width:900px){ 
          div[style*="padding: 40px 48px"] { padding: 24px !important; }
          div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
