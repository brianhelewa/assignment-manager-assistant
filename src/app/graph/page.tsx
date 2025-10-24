'use client'
import { useEffect, useState, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge as RFEdge,
  Node as RFNode,
} from 'reactflow'
import 'reactflow/dist/style.css'
import TaskEditor from '@/components/TaskEditor'

type Task = { id: string; title: string; status: string; dueAt?: string | null }

export default function GraphPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [edges, setEdges] = useState<RFEdge[]>([])
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([])

  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)

  useEffect(() => {
    Promise.all([fetch('/api/tasks').then((r) => r.json()), fetch('/api/edges').then((r) => r.json())]).then(
      ([ts, es]) => {
        setTasks(ts)
        setEdges(es)
      }
    )
  }, [])

  useEffect(() => {
    setNodes(
      tasks.map((t, i) => ({
        id: t.id,
        data: { label: t.title },
        position: { x: 200 + 280 * (i % 4), y: 150 + 160 * Math.floor(i / 4) },
        style: { borderRadius: 12 },
      }))
    )
  }, [tasks, setNodes])

  useEffect(() => {
    setRfEdges(
      edges.map((e: any) => ({
        id: e.id,
        source: e.sourceId,
        target: e.targetId,
        animated: true,
      }))
    )
  }, [edges, setRfEdges])

  const onConnect = useCallback(async (conn: Connection) => {
    if (!conn.source || !conn.target) return
    const res = await fetch('/api/edges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId: conn.source, targetId: conn.target }),
    })
    const e = await res.json()
    setRfEdges((eds) => addEdge({ id: e.id, source: e.sourceId, target: e.targetId }, eds))
  }, [setRfEdges])

  function onNodeDoubleClick(_: any, node: RFNode) {
    const t = tasks.find((x) => x.id === node.id)
    if (t) {
      setEditing(t)
      setEditorOpen(true)
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Delete' && (window as any).__rf?.getNodes) {
        const selected = (window as any).__rf.getNodes().find((n: any) => n.selected)
        if (selected) {
          fetch(`/api/tasks/${selected.id}`, { method: 'DELETE' })
          setTasks((prev) => prev.filter((t) => t.id !== selected.id))
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function onSaved(t: Task) {
    setTasks((prev) => prev.map((x) => (x.id === t.id ? t : x)))
    setEditorOpen(false)
  }

  return (
    <div className="h-[calc(100vh-100px)]">
      <ReactFlow
        nodes={nodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>

      <TaskEditor
        open={editorOpen}
        initial={editing}
        onClose={() => setEditorOpen(false)}
        onSaved={onSaved}
      />
    </div>
  )
}
