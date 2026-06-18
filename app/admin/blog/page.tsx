import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeleteBlogPostButton } from '@/components/admin/DeleteBlogPostButton'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts').select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Blog / Insights</h1>
          <p style={{ fontSize: 13, color: '#555' }}>{posts?.length ?? 0} total post{posts?.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/blog/new" style={{ padding: '10px 24px', background: '#C41E3A', color: 'white', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          + New Post
        </Link>
      </div>

      {!posts?.length ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic', color: '#444', marginBottom: 20 }}>No posts yet.</p>
          <Link href="/admin/blog/new" style={{ fontSize: 12, color: '#C41E3A', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Write your first post →
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="blog-admin-table">
            <div className="blog-admin-row blog-admin-header">
              <span>Title</span><span>Category</span><span>Status</span><span></span>
            </div>
            {posts.map((post: { id: string; title: string; category: string; published: boolean; published_at: string | null }) => (
              <div key={post.id} className="blog-admin-row">
                <Link href={`/admin/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                  <span style={{ fontSize: 14, color: '#FAFAF9' }}>{post.title}</span>
                </Link>
                <span style={{ fontSize: 11, color: '#666', textTransform: 'capitalize' }}>{post.category}</span>
                <span style={{
                  fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: post.published ? '#4CAF50' : '#666',
                  padding: '3px 8px', border: `1px solid ${post.published ? '#4CAF50' : '#333'}`,
                  display: 'inline-block', width: 'fit-content',
                }}>{post.published ? 'Live' : 'Draft'}</span>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <Link href={`/admin/blog/${post.id}`} style={{ fontSize: 11, color: '#555', textDecoration: 'none' }}>Edit</Link>
                  <DeleteBlogPostButton id={post.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="blog-admin-cards">
            {posts.map((post: { id: string; title: string; category: string; published: boolean }) => (
              <div key={post.id} style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 14, color: '#FAFAF9', fontWeight: 500, display: 'block' }}>{post.title}</span>
                    <span style={{ fontSize: 11, color: '#666', textTransform: 'capitalize' }}>{post.category}</span>
                  </div>
                  <span style={{
                    fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: post.published ? '#4CAF50' : '#666',
                    padding: '3px 8px', border: `1px solid ${post.published ? '#4CAF50' : '#333'}`,
                  }}>{post.published ? 'Live' : 'Draft'}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Link href={`/admin/blog/${post.id}`} style={{ padding: '6px 16px', background: '#1A1A1A', color: '#999', fontSize: 11, textDecoration: 'none', border: '1px solid #2A2A2A' }}>Edit</Link>
                  <DeleteBlogPostButton id={post.id} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .blog-admin-table { border: 1px solid #1F1F1F; }
        .blog-admin-row { display: grid; grid-template-columns: 1fr 140px 90px 110px; padding: 14px 20px; border-bottom: 1px solid #1A1A1A; align-items: center; }
        .blog-admin-row:last-child { border-bottom: none; }
        .blog-admin-header { background: #0A0A0A; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #444; }
        .blog-admin-cards { display: none; flex-direction: column; gap: 8px; }
        @media(max-width: 900px) {
          div[style*="padding: 40px 48px"] { padding: 24px 16px !important; }
          .blog-admin-table { display: none; }
          .blog-admin-cards { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
