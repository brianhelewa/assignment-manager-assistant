export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      select: { id: true, title: true, status: true, dueAt: true }
    })
    return NextResponse.json(tasks)
  } catch (e) {
    console.error('GET /api/tasks error:', e)
    return NextResponse.json({ error: 'Failed to load tasks' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const task = await prisma.task.create({ data })
    return NextResponse.json(task, { status: 201 })
  } catch (e) {
    console.error('POST /api/tasks error:', e)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
