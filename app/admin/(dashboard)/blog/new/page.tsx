import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>
          New Post
        </h1>
        <p style={{ fontSize: 13, color: '#555' }}>Write a new Insights post.</p>
      </div>
      <BlogPostForm />
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px 16px !important; } }`}</style>
    </div>
  )
}
