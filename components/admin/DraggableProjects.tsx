'use client'
import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { DeleteProjectButton } from './DeleteProjectButton'

type Project = { id: string; title: string; category: string; featured: boolean; published: boolean; sort_order: number }

function SortableRow({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })

  return (
    <div ref={setNodeRef} style={{
      display: 'grid',
      gridTemplateColumns: '32px 1fr 120px 80px 80px 100px',
      padding: '14px 20px',
      borderBottom: '1px solid #1A1A1A',
      alignItems: 'center',
      background: isDragging ? '#1A1A1A' : '#0A0A0A',
      opacity: isDragging ? 0.8 : 1,
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: isDragging ? 'grabbing' : 'default',
    }}>
      {/* Drag handle */}
      <div {...attributes} {...listeners} style={{
        display: 'flex', flexDirection: 'column', gap: 3,
        padding: '4px 6px', cursor: 'grab', opacity: 0.3,
        transition: 'opacity 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.3')}
      >
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 14, height: 1.5, background: '#FAFAF9', borderRadius: 1 }} />
        ))}
      </div>

      <Link href={`/admin/projects/${project.id}`} style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: 14, color: '#FAFAF9' }}>{project.title}</span>
      </Link>
      <span style={{ fontSize: 11, color: '#666', textTransform: 'capitalize' }}>{project.category}</span>
      <span style={{ fontSize: 11, color: project.featured ? '#C41E3A' : '#444' }}>{project.featured ? '★ Yes' : '—'}</span>
      <span style={{
        fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: project.published ? '#4CAF50' : '#666',
        padding: '3px 8px', border: `1px solid ${project.published ? '#4CAF50' : '#333'}`,
        display: 'inline-block',
      }}>{project.published ? 'Live' : 'Draft'}</span>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Link href={`/admin/projects/${project.id}`} style={{ fontSize: 11, color: '#555', textDecoration: 'none' }}>Edit</Link>
        <DeleteProjectButton id={project.id} />
      </div>
    </div>
  )
}

function SortableCard({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })
  return (
    <div ref={setNodeRef} style={{
      background: isDragging ? '#1A1A1A' : '#0A0A0A',
      border: '1px solid #1F1F1F',
      padding: 16,
      transform: CSS.Transform.toString(transform),
      transition, opacity: isDragging ? 0.8 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div {...attributes} {...listeners} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 4px', cursor: 'grab', opacity: 0.4 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 12, height: 1.5, background: '#FAFAF9', borderRadius: 1 }} />)}
          </div>
          <div>
            <span style={{ fontSize: 14, color: '#FAFAF9', fontWeight: 500, display: 'block' }}>{project.title}</span>
            <span style={{ fontSize: 11, color: '#666', textTransform: 'capitalize' }}>{project.category}</span>
          </div>
        </div>
        <span style={{
          fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: project.published ? '#4CAF50' : '#666',
          padding: '3px 8px', border: `1px solid ${project.published ? '#4CAF50' : '#333'}`,
        }}>{project.published ? 'Live' : 'Draft'}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link href={`/admin/projects/${project.id}`} style={{ padding: '6px 16px', background: '#1A1A1A', color: '#999', fontSize: 11, textDecoration: 'none', border: '1px solid #2A2A2A' }}>Edit</Link>
        <DeleteProjectButton id={project.id} />
      </div>
    </div>
  )
}

export function DraggableProjects({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = projects.findIndex(p => p.id === active.id)
    const newIndex = projects.findIndex(p => p.id === over.id)
    const reordered = arrayMove(projects, oldIndex, newIndex)

    setProjects(reordered)
    setSaving(true)

    const supabase = createClient()
    await Promise.all(
      reordered.map((p, i) =>
        supabase.from('projects').update({ sort_order: i + 1 }).eq('id', p.id)
      )
    )

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: '#555', letterSpacing: '0.08em' }}>
          Drag <span style={{ color: '#FAFAF9' }}>≡</span> to reorder
        </p>
        {saving && <span style={{ fontSize: 11, color: '#999' }}>Saving order...</span>}
        {saved && <span style={{ fontSize: 11, color: '#4CAF50' }}>✓ Order saved</span>}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {/* Desktop table */}
          <div className="drag-table">
            <div style={{
              display: 'grid', gridTemplateColumns: '32px 1fr 120px 80px 80px 100px',
              padding: '12px 20px', background: '#060606', borderBottom: '1px solid #1F1F1F',
            }}>
              {['', 'Title', 'Category', 'Featured', 'Status', ''].map((h, i) => (
                <span key={i} style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#444' }}>{h}</span>
              ))}
            </div>
            {projects.map(p => <SortableRow key={p.id} project={p} />)}
          </div>

          {/* Mobile cards */}
          <div className="drag-cards" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {projects.map(p => <SortableCard key={p.id} project={p} />)}
          </div>
        </SortableContext>
      </DndContext>

      <style>{`
        .drag-table { border: 1px solid #1F1F1F; }
        .drag-cards { display: none; }
        @media(max-width: 900px) {
          .drag-table { display: none; }
          .drag-cards { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
