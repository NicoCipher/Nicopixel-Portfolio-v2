'use client'

export function Skeleton({ width = '100%', height = 20, rounded = false }: {
  width?: string | number
  height?: string | number
  rounded?: boolean
}) {
  return (
    <div style={{
      width, height,
      borderRadius: rounded ? '50%' : 2,
      background: 'var(--bg-secondary)',
      backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--border) 50%, var(--bg-secondary) 100%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
    }} />
  )
}

export function SkeletonCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton height="100%" />
    </div>
  )
}
