import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SessionGuard } from '@/components/admin/SessionGuard'
import { Suspense } from 'react'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, background: '#111111', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          <Suspense>
            <SessionGuard>
              {children}
            </SessionGuard>
          </Suspense>
        </div>
      </main>
      <style>{`
        @media(max-width: 900px) {
          main { margin-left: 0 !important; padding-top: 56px; }
        }
      `}</style>
    </div>
  )
}
