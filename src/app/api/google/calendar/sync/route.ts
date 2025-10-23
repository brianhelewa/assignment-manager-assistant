
import { NextResponse } from 'next/server'

// Placeholder. Once Google OAuth is configured, exchange tokens here and
// create events for tasks with dueAt values.
export async function POST() {
  return NextResponse.json({ ok: true, message: 'Calendar sync stub' })
}
