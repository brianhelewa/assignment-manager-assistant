'use client'
import { useEffect, useState } from 'react'
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { KanbanColumn } from '@/components/KanbanBoard'
import { safeJson } from '@/lib/safeJson'

type Task = { id: string; title: string; status: string }

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [err, setErr] = useState<string | null>(null)
  const statuses = ['inbox','next_up','in_progress','review','done']
  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    safeJson<Task[]>('/api/tasks')
      .then(setTasks)
      .catch((e) => { console.error(e); setErr('Failed to load tasks'); setTasks([]) })
  }, [])

  async function onMove(taskId: string, newStatus: string) {
    setTasks(t => t.map(x => x.id === taskId ? { ...x, status: newStatus } : x))
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
    } catch (e) {
      console.error(e)
      setErr('Failed to update task')
    }
  }

  return (
    <>
      {err && <div className="mb-2 rounded bg-red-100 text-red-700 p-2 text-sm">{err}</div>}
      <DndContext sensors={sensors}>
        <div className="grid grid-cols-5 gap-4">
          {statuses.map(s => (
            <KanbanColumn key={s} status={s} tasks={tasks.filter(t => t.status === s)} onMove={onMove} />
          ))}
        </div>
      </DndContext>
    </>
  )
}
