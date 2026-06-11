import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <AdminSidebar />
      <main style={{ flex: 1, marginLeft: 240, background: '#111111', minHeight: '100vh' }}>
        {children}
      </main>
      <style>{`@media(max-width:900px){ main { margin-left: 0 !important; } }`}</style>
    </div>
  )
}
