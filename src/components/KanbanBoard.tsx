'use client'
import { useEffect, useMemo, useState } from 'react'
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskEditor from './TaskEditor'
import TaskCard from './TaskCard'

type Task = { id: string; title: string; status: string; dueAt?: string | null }

const COLUMNS = [
  { key: 'inbox', title: 'Inbox' },
  { key: 'next_up', title: 'Next Up' },
  { key: 'in_progress', title: 'In Progress' },
  { key: 'review', title: 'Review' },
  { key: 'done', title: 'Done' },
] as const

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)

  useEffect(() => {
    fetch('/api/tasks')
      .then((r) => r.json())
      .then((ts) => setTasks(Array.isArray(ts) ? ts : []))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false))
  }, [])

  const sensors = useSensors(useSensor(PointerSensor))

  const grouped = useMemo(() => {
    const g: Record<string, Task[]> = {}
    for (const c of COLUMNS) g[c.key] = []
    for (const t of tasks) (g[t.status] ??= []).push(t)
    return g
  }, [tasks])

  function openNew(status: string) {
    setEditing({ title: '', status, id: '' } as any)
    setEditorOpen(true)
  }
  function openEdit(t: Task) {
    setEditing(t)
    setEditorOpen(true)
  }
  function onSaved(t: Task) {
    setTasks((prev) => {
      const i = prev.findIndex((x) => x.id === t.id)
      if (i === -1) return [t, ...prev]
      const copy = prev.slice()
      copy[i] = t
      return copy
    })
  }
  function onDeleted(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  async function handleDrop(e: any) {
    const taskId = e.active?.id as string
    const destCol = e.over?.id as string // we set droppable id = column key
    if (!taskId || !destCol) return
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === destCol) return
    // optimistic
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: destCol } : t)))
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: destCol }),
    })
  }

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading…</div>
  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>

  return (
    <div className="grid grid-cols-5 gap-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDrop}>
        {COLUMNS.map((c) => (
          <div key={c.key} className="rounded-xl bg-gray-50 p-3" id={c.key}>
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">{c.title}</div>
              <button
                onClick={() => openNew(c.key)}
                className="rounded-lg bg-black/80 px-2 py-1 text-xs text-white hover:bg-black"
              >
                + Add
              </button>
            </div>

            <SortableContext
              items={(grouped[c.key] ?? []).map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div
                className="min-h-[520px] rounded-lg border border-dashed bg-white/40 p-2"
                // make the column a drop target
                data-droppable-id={c.key}
                id={c.key}
              >
                {(grouped[c.key] ?? []).map((t) => (
                  <TaskCard key={t.id} task={t} onClick={() => openEdit(t)} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </DndContext>

      <TaskEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        initial={editing && editing.id ? editing : null}
        onSaved={onSaved}
        onDeleted={onDeleted}
      />
    </div>
  )
}
