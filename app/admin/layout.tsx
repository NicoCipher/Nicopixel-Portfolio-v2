import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SessionGuard } from '@/components/admin/SessionGuard'
import { Suspense } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, background: '#111111', minHeight: '100vh' }}>
        <Suspense>
          <SessionGuard>
            {children}
          </SessionGuard>
        </Suspense>
      </main>
      <style>{`
        @media(max-width: 900px) {
          main { margin-left: 0 !important; padding-top: 56px; }
        }
      `}</style>
    </div>
  )
}
