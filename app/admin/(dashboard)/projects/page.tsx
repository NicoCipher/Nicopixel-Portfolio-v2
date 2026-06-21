import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DraggableProjects } from '@/components/admin/DraggableProjects'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects').select('id, title, category, featured, published, sort_order')
    .order('sort_order', { ascending: true })

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Projects</h1>
          <p style={{ fontSize: 13, color: '#555' }}>{projects?.length ?? 0} total</p>
        </div>
        <Link href="/admin/projects/new" style={{ padding: '10px 24px', background: '#C41E3A', color: 'white', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          + New Project
        </Link>
      </div>

      {!projects?.length ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic', color: '#444', marginBottom: 20 }}>No projects yet.</p>
          <Link href="/admin/projects/new" style={{ fontSize: 12, color: '#C41E3A', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Add your first project →
          </Link>
        </div>
      ) : (
        <DraggableProjects initialProjects={projects} />
      )}
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px 16px !important; } }`}</style>
    </div>
  )
}
