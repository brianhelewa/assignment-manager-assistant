
'use client'
type Task = { id: string, title: string, status: string }
export function TaskCard({ task }:{ task: Task }) {
  return (
    <div className="rounded border bg-white p-2 shadow-sm">
      <div className="text-sm font-medium">{task.title}</div>
      <div className="text-xs text-gray-500">{task.status}</div>
    </div>
  )
}
