
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const task = await prisma.task.findUnique({ where: { id: params.id } })
  return NextResponse.json(task)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const task = await prisma.task.update({ where: { id: params.id }, data: body })
  return NextResponse.json(task)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.task.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
