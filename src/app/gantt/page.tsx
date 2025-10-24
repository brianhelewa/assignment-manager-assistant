'use client'
import { useEffect, useMemo, useState } from 'react'

export default function GanttPage() {
  const [tasks, setTasks] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/tasks').then((r) => r.json()).then((ts) => setTasks(Array.isArray(ts) ? ts : []))
  }, [])

  const start = useMemo(() => new Date(), [])
  start.setHours(0, 0, 0, 0)
  const days = 14

  async function setDue(t: any, dayIdx: number | null) {
    const dueAt = dayIdx === null ? null : new Date(start.getTime() + dayIdx * 86400000).toISOString()
    const res = await fetch(`/api/tasks/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dueAt }),
    })
    const nt = await res.json()
    setTasks((prev) => prev.map((x) => (x.id === t.id ? nt : x)))
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-4 text-3xl font-semibold">Gantt (simple placeholder)</h1>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-56 border px-2 py-1 text-left">Task</th>
            {Array.from({ length: days }).map((_, i) => (
              <th key={i} className="w-10 border px-1 py-1">{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => {
            const idx = t.dueAt
              ? Math.min(
                  days - 1,
                  Math.max(
                    0,
                    Math.floor((new Date(t.dueAt).getTime() - start.getTime()) / 86400000)
                  )
                )
              : null
            return (
              <tr key={t.id}>
                <td className="border px-2 py-1">{t.title}</td>
                {Array.from({ length: days }).map((_, i) => {
                  const active = idx === i
                  return (
                    <td
                      key={i}
                      onClick={() => setDue(t, active ? null : i)}
                      className={`cursor-pointer border px-1 py-2 ${active ? 'bg-blue-400' : 'hover:bg-blue-50'}`}
                      title={active ? 'Clear due date' : 'Set due date'}
                    />
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
