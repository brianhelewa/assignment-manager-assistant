'use client'
import { useEffect, useState } from 'react'

type Task = { id: string; title: string; dueAt?: string | Date }

export default function GanttPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const days = 14
  const start = new Date()

  useEffect(() => {
    fetch('/api/tasks')
      .then(async (r) => {
        const text = await r.text()
        if (!text) return []
        return JSON.parse(text)
      })
      .then((data) => Array.isArray(data) ? data : [])
      .then(setTasks)
      .catch(() => setTasks([]))
  }, [])

  const list = Array.isArray(tasks) ? tasks : []

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Gantt (simple placeholder)</h2>
      <div className="overflow-auto border rounded">
        <table className="min-w-[800px] text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left w-64">Task</th>
              {[...Array(days)].map((_, i) => (
                <th key={i} className="border px-2 py-1">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((t) => {
              const dueMs = t.dueAt ? new Date(t.dueAt as any).getTime() : null
              const idx = t.dueAt
              ? Math.min(
                  days - 1,
                  Math.max(
                    0,
                    Math.floor( (new Date(t.dueAt).getTime() - start.getTime()) / 86_400_000 )
                  )
                )
              : null            
              return (
                <tr key={t.id}>
                  <td className="border px-2 py-1">{t.title}</td>
                  {[...Array(days)].map((_, i) => (
                    <td key={i} className={'border h-6 ' + (idx === i ? 'bg-blue-400' : '')}></td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
