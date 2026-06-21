import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single()

  if (!post) notFound()

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>
          Edit Post
        </h1>
        <p style={{ fontSize: 13, color: '#555' }}>{post.title}</p>
      </div>
      <BlogPostForm post={post} />
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px 16px !important; } }`}</style>
    </div>
  )
}
