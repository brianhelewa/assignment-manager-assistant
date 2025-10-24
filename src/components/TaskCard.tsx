'use client'
import { CSSProperties } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({
  task,
  onClick,
}: {
  task: { id: string; title: string; status: string; dueAt?: string | null }
  onClick?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })
  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition }

  const overdue =
    task.dueAt && task.status !== 'done' && new Date(task.dueAt).getTime() < Date.now()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="mb-2 cursor-pointer rounded-lg border bg-white px-3 py-2 shadow-sm hover:shadow"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{task.title}</div>
        {overdue && <span className="ml-2 rounded-md bg-red-100 px-2 py-0.5 text-xs text-red-700">Overdue</span>}
      </div>
      {task.dueAt && (
        <div className="mt-1 text-xs text-gray-500">
          Due {new Date(task.dueAt).toLocaleDateString()}
        </div>
      )}
      <div className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">{task.status}</div>
    </div>
  )
}
