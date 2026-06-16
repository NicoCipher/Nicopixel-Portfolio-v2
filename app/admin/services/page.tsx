import { createClient } from '@/lib/supabase/server'
import { ServicesManager } from '@/components/admin/ServicesManager'

export default async function AdminServicesPage() {
  const supabase = await createClient()

  const [
    { data: services },
    { data: steps },
    { data: faqs },
  ] = await Promise.all([
    supabase.from('services').select('*').order('sort_order'),
    supabase.from('process_steps').select('*').order('sort_order'),
    supabase.from('faqs').select('*').order('sort_order'),
  ])

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>
          Services
        </h1>
        <p style={{ fontSize: 13, color: '#555' }}>Manage services, process steps, and FAQs shown on the services page.</p>
      </div>
      <ServicesManager
        initialServices={services || []}
        initialSteps={steps || []}
        initialFaqs={faqs || []}
      />
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px 16px !important; } }`}</style>
    </div>
  )
}
