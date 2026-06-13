import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeleteProjectButton } from '@/components/admin/DeleteProjectButton'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects').select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-sub">{projects?.length ?? 0} total</p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn-primary">+ New Project</Link>
      </div>

      {!projects?.length ? (
        <div className="admin-empty">
          <p>No projects yet.</p>
          <Link href="/admin/projects/new" className="admin-link-accent">Add your first project →</Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="admin-table">
            <div className="admin-table-header">
              {['Title', 'Category', 'Featured', 'Status', ''].map(h => (
                <span key={h} className="admin-table-th">{h}</span>
              ))}
            </div>
            {projects.map((p: { id: string; title: string; category: string; featured: boolean; published: boolean }) => (
              <div key={p.id} className="admin-table-row">
                <Link href={`/admin/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                  <span className="admin-table-name">{p.title}</span>
                </Link>
                <span className="admin-table-cat">{p.category}</span>
                <span style={{ fontSize: 11, color: p.featured ? '#C41E3A' : '#444' }}>{p.featured ? '★ Yes' : '—'}</span>
                <span className={`admin-status-badge ${p.published ? 'admin-status-live' : 'admin-status-draft'}`}>{p.published ? 'Live' : 'Draft'}</span>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <Link href={`/admin/projects/${p.id}`} className="admin-link-muted">Edit</Link>
                  <DeleteProjectButton id={p.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="admin-cards">
            {projects.map((p: { id: string; title: string; category: string; featured: boolean; published: boolean }) => (
              <div key={p.id} className="admin-card">
                <div className="admin-card-top">
                  <div>
                    <span className="admin-table-name">{p.title}</span>
                    <span className="admin-table-cat" style={{ marginLeft: 8 }}>{p.category}</span>
                  </div>
                  <span className={`admin-status-badge ${p.published ? 'admin-status-live' : 'admin-status-draft'}`}>{p.published ? 'Live' : 'Draft'}</span>
                </div>
                <div className="admin-card-actions">
                  <Link href={`/admin/projects/${p.id}`} className="admin-btn-sm">Edit</Link>
                  <DeleteProjectButton id={p.id} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .admin-page { padding: 40px 48px; }
        .admin-page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; flex-wrap: wrap; gap: 16px; }
        .admin-page-title { font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: #FAFAF9; margin-bottom: 4px; }
        .admin-page-sub { font-size: 13px; color: #555; }
        .admin-btn-primary { padding: 10px 24px; background: #C41E3A; color: white; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; white-space: nowrap; }
        .admin-btn-sm { padding: 6px 16px; background: #1A1A1A; color: #999; font-size: 11px; text-decoration: none; border: 1px solid #2A2A2A; }
        .admin-empty { text-align: center; padding: 80px 0; }
        .admin-empty p { font-family: Georgia, serif; font-size: 20px; font-style: italic; color: #444; margin-bottom: 16px; }
        .admin-link-accent { font-size: 12px; color: #C41E3A; text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; }
        .admin-link-muted { font-size: 11px; color: #555; text-decoration: none; }
        .admin-table { border: 1px solid #1F1F1F; }
        .admin-table-header { display: grid; grid-template-columns: 1fr 120px 80px 80px 100px; padding: 12px 20px; background: #0A0A0A; border-bottom: 1px solid #1F1F1F; }
        .admin-table-th { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #444; }
        .admin-table-row { display: grid; grid-template-columns: 1fr 120px 80px 80px 100px; padding: 16px 20px; border-bottom: 1px solid #1A1A1A; align-items: center; transition: background 0.2s; }
        .admin-table-row:hover { background: #0F0F0F; }
        .admin-table-row:last-child { border-bottom: none; }
        .admin-table-name { font-size: 14px; color: #FAFAF9; display: block; }
        .admin-table-cat { font-size: 11px; color: #666; text-transform: capitalize; }
        .admin-status-badge { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; display: inline-block; }
        .admin-status-live { color: #4CAF50; border: 1px solid #4CAF50; }
        .admin-status-draft { color: #666; border: 1px solid #333; }
        .admin-cards { display: none; flex-direction: column; gap: 8px; }
        .admin-card { background: #0A0A0A; border: 1px solid #1F1F1F; padding: 16px; }
        .admin-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .admin-card-actions { display: flex; gap: 10px; align-items: center; }

        @media(max-width: 900px) {
          .admin-page { padding: 24px 16px; }
          .admin-table { display: none; }
          .admin-cards { display: flex; }
        }
      `}</style>
    </div>
  )
}
