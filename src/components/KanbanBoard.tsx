
'use client'
import { useDroppable, useDraggable, DragEndEvent } from '@dnd-kit/core'
import { TaskCard } from './TaskCard'

type Task = { id: string, title: string, status: string }
export function KanbanColumn({ status, tasks, onMove }:{ status:string, tasks:Task[], onMove:(id:string,s:string)=>void }) {
  const { setNodeRef } = useDroppable({ id: status })
  function handleDrop(e: DragEndEvent) {
    const id = String(e.active.id)
    if (e.over?.id === status) onMove(id, status)
  }
  return (
    <div ref={setNodeRef} onDragEnd={handleDrop as any} className="bg-gray-100 rounded p-2 min-h-[60vh]">
      <h3 className="font-semibold capitalize mb-2">{status.replace('_',' ')}</h3>
      <div className="space-y-2">
        {tasks.map(t => <DraggableTask key={t.id} task={t} />)}
      </div>
    </div>
  )
}

function DraggableTask({ task }:{ task:Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style} className={(isDragging?'opacity-70 ':'')+''}>
      <TaskCard task={task} />
    </div>
  )
}
