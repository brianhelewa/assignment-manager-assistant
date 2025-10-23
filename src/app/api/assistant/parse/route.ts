
import { NextResponse } from 'next/server'

// Minimal stub that echoes a structured intent
export async function POST(req: Request) {
  const { text } = await req.json()
  // Very naive parsing – replace with your LLM call later
  const m = /move (.+) to (inbox|next_up|in_progress|review|done)/i.exec(text || '')
  if (m) {
    return NextResponse.json({
      intent: 'update',
      targets: [{ type: 'task', idOrName: m[1].trim() }],
      fields: { status: m[2] }
    })
  }
  return NextResponse.json({ intent: 'unknown' })
}
