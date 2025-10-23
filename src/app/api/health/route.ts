import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // simple DB probe
    const rows = await prisma.$queryRaw<{ ok: number }[]>`select 1 as ok`
    return NextResponse.json({
      ok: true,
      env: {
        DATABASE_URL: Boolean(process.env.DATABASE_URL),
        DIRECT_URL: Boolean(process.env.DIRECT_URL),
        NODE_ENV: process.env.NODE_ENV,
      },
      db: rows?.[0]?.ok === 1 ? 'connected' : 'unknown',
    })
  } catch (e: any) {
    console.error('HEALTH error:', e?.message, e?.code, e)
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}
