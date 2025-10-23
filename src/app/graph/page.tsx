'use client'
import React, { useEffect, useMemo, useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow'
import 'reactflow/dist/style.css'
import { safeJson } from '@/lib/safeJson'

type Task = { id: string, title: string }
type EdgeT = { id: string, fromId: string, toId: string }

export default function GraphPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [edges, setEdges] = useState<EdgeT[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      safeJson<Task[]>('/api/tasks'),
      safeJson<EdgeT[]>('/api/edges')
    ])
      .then(([ts, es]) => { setTasks(ts); setEdges(es) })
      .catch((e) => { console.error(e); setErr('Failed to load graph data'); setTasks([]); setEdges([]) })
  }, [])

  const nodes: Node[] = useMemo(() => tasks.map((t, i) => ({
    id: t.id, data: { label: t.title },
    position: { x: 50 + (i % 5) * 200, y: 50 + Math.floor(i / 5) * 100 }
  })), [tasks])

  const rfEdges: Edge[] = useMemo(() => edges.map(e => ({
    id: e.id, source: e.fromId, target: e.toId, animated: true
  })), [edges])

  return (
    <>
      {err && <div className="mb-2 rounded bg-red-100 text-red-700 p-2 text-sm">{err}</div>}
      <div style={{ width: '100%', height: '70vh' }}>
        <ReactFlow nodes={nodes} edges={rfEdges} fitView>
          <Background /><Controls /><MiniMap />
        </ReactFlow>
      </div>
    </>
  )
}
