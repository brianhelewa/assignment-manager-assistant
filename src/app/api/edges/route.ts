export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const edges = await prisma.edge.findMany({
      select: { id: true, fromId: true, toId: true, type: true }
    })
    return NextResponse.json(edges)
  } catch (e) {
    console.error('GET /api/edges error:', e)
    return NextResponse.json({ error: 'Failed to load edges' }, { status: 500 })
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
