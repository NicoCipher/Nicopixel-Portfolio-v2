import { ProjectForm } from '@/components/admin/ProjectForm'
import Link from 'next/link'

export default function NewProjectPage() {
  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 36 }}>
        <Link href="/admin/projects" style={{ fontSize: 12, color: '#555', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>← Back</Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9' }}>New Project</h1>
      </div>
      <ProjectForm />
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px !important; } }`}</style>
    </div>
  )
}
