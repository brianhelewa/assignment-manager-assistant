
'use client'
import useSWR from 'swr'

const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function GanttPage() {
  const { data: tasks } = useSWR('/api/tasks', fetcher)
  const days = 14
  const start = new Date()

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Gantt (simple placeholder)</h2>
      <div className="overflow-auto border rounded">
        <table className="min-w-[800px] text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left w-64">Task</th>
              {[...Array(days)].map((_, i) => (
                <th key={i} className="border px-2 py-1">{i+1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks?.map((t: any) => {
              const idx = t.dueAt ? Math.min(days-1, Math.max(0, Math.floor((new Date(t.dueAt) - +start)/86400000))) : null
              return (
                <tr key={t.id}>
                  <td className="border px-2 py-1">{t.title}</td>
                  {[...Array(days)].map((_, i) => (
                    <td key={i} className={"border h-6 " + (idx === i ? "bg-blue-400" : "")}></td>
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
