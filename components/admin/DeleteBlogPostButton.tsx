'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DeleteBlogPostButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    const supabase = createClient()
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) { alert(`Couldn't delete: ${error.message}`); return }
    router.refresh()
  }

  return (
    <button onClick={handleDelete} style={{
      fontSize: 11, color: '#C41E3A', background: 'none',
      border: 'none', fontFamily: 'inherit',
      transition: 'opacity 0.2s', cursor: 'pointer',
    }}>
      Delete
    </button>
  )
}
