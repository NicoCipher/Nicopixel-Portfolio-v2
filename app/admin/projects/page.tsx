import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeleteProjectButton } from '@/components/admin/DeleteProjectButton'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects').select('*')
    .order('sort_order', { ascending: true })

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Projects</h1>
          <p style={{ fontSize: 13, color: '#555' }}>{projects?.length ?? 0} total</p>
        </div>
        <Link href="/admin/projects/new" style={{
          padding: '10px 24px', background: '#C41E3A', color: 'white',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', textDecoration: 'none',
          transition: 'background 0.2s',
        }}>+ New Project</Link>
      </div>

      {!projects?.length ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic', color: '#444', marginBottom: 20 }}>No projects yet.</p>
          <Link href="/admin/projects/new" style={{ fontSize: 12, color: '#C41E3A', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Add your first project →
          </Link>
        </div>
      ) : (
        <div style={{ border: '1px solid #1F1F1F' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 80px 80px 100px',
            padding: '12px 20px', borderBottom: '1px solid #1F1F1F',
            background: '#0A0A0A',
          }}>
            {['Title', 'Category', 'Featured', 'Status', ''].map(h => (
              <span key={h} style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#444' }}>{h}</span>
            ))}
          </div>
          {projects.map((p: { id: string; title: string; category: string; featured: boolean; published: boolean }) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 80px 80px 100px',
              padding: '16px 20px', borderBottom: '1px solid #1A1A1A',
              alignItems: 'center', transition: 'background 0.2s',
            }} className="project-row">
              <Link href={`/admin/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                <span style={{ fontSize: 14, color: '#FAFAF9', display: 'block' }}>{p.title}</span>
              </Link>
              <span style={{ fontSize: 11, color: '#666', textTransform: 'capitalize' }}>{p.category}</span>
              <span style={{ fontSize: 11, color: p.featured ? '#C41E3A' : '#444' }}>{p.featured ? '★ Yes' : '—'}</span>
              <span style={{
                fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: p.published ? '#4CAF50' : '#666',
                padding: '3px 8px', border: `1px solid ${p.published ? '#4CAF50' : '#333'}`,
                display: 'inline-block',
              }}>{p.published ? 'Live' : 'Draft'}</span>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <Link href={`/admin/projects/${p.id}`} style={{ fontSize: 11, color: '#555', textDecoration: 'none' }}>Edit</Link>
                <DeleteProjectButton id={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .project-row:hover { background: #0F0F0F !important; }
        @media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px !important; } }
      `}</style>
    </div>
  )
}
