// API: PATCH update, DELETE (also deletes related edges)
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  try {
    const body = await _.json()
    const data: any = {}
    if (typeof body.title === 'string') data.title = body.title
    if (typeof body.status === 'string') data.status = body.status
    if (body.dueAt === null) data.dueAt = null
    else if (body.dueAt) data.dueAt = new Date(body.dueAt)

    const task = await prisma.task.update({ where: { id: params.id }, data })
    return NextResponse.json(task)
  } catch (e: any) {
    console.error(`PATCH /api/tasks/${params.id} error:`, e)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    // remove edges first so graph stays consistent
    await prisma.edge.deleteMany({
      where: { OR: [{ sourceId: params.id }, { targetId: params.id }] },
    })
    await prisma.task.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error(`DELETE /api/tasks/${params.id} error:`, e)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
