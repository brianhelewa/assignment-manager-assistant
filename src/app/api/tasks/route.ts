// API: GET list, POST create
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json(tasks)
  } catch (e: any) {
    console.error('GET /api/tasks error:', e)
    return NextResponse.json({ error: 'Failed to load tasks' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const title = String(body?.title ?? '').trim()
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const status = (body?.status as string) ?? 'inbox'
    const dueAt = body?.dueAt ? new Date(body.dueAt) : null

    const task = await prisma.task.create({ data: { title, status, dueAt: dueAt ?? undefined } })
    return NextResponse.json(task, { status: 201 })
  } catch (e: any) {
    console.error('POST /api/tasks error:', e)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
