import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json(tasks)
  } catch (e: any) {
    console.error('GET /api/tasks error:', e?.message, e?.stack)
    return NextResponse.json({ error: 'Failed to load tasks' }, { status: 500 })
  }
}


export async function POST(req: Request) {
  try {
    const data = await req.json()
    const edge = await prisma.edge.create({ data })
    return NextResponse.json(edge, { status: 201 })
  } catch (e) {
    console.error('POST /api/edges error:', e)
    return NextResponse.json({ error: 'Failed to create edge' }, { status: 500 })
  }
}
