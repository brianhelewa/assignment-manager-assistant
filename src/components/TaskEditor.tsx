'use client'
import { useState, useEffect } from 'react'

type Task = {
  id?: string
  title: string
  status: string
  dueAt?: string | null
}

const STATUSES = ['inbox', 'next_up', 'in_progress', 'review', 'done'] as const

export default function TaskEditor({
  open,
  onClose,
  initial,
  onSaved,
  onDeleted,
}: {
  open: boolean
  onClose: () => void
  initial?: Task | null
  onSaved: (t: any) => void
  onDeleted?: (id: string) => void
}) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<Task['status']>('inbox')
  const [dueAt, setDueAt] = useState<string | ''>('')

  useEffect(() => {
    if (initial) {
      setTitle(initial.title ?? '')
      setStatus((initial.status as any) ?? 'inbox')
      setDueAt(initial.dueAt ? initial.dueAt.slice(0, 10) : '')
    } else {
      setTitle('')
      setStatus('inbox')
      setDueAt('')
    }
  }, [initial, open])

  async function save() {
    const payload: any = { title, status }
    payload.dueAt = dueAt ? new Date(dueAt).toISOString() : null

    if (initial?.id) {
      const res = await fetch(`/api/tasks/${initial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const t = await res.json()
      onSaved(t)
    } else {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const t = await res.json()
      onSaved(t)
    }
    onClose()
  }

  async function remove() {
    if (!initial?.id) return
    if (!confirm('Delete this task?')) return
    await fetch(`/api/tasks/${initial.id}`, { method: 'DELETE' })
    onDeleted?.(initial.id)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-3 text-lg font-semibold">
          {initial?.id ? 'Edit Task' : 'New Task'}
        </div>
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Task title"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm">Due Date</span>
              <input
                type="date"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 flex gap-2 justify-end">
          {initial?.id && (
            <button
              onClick={remove}
              className="rounded-lg bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="rounded-lg bg-black px-3 py-2 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
