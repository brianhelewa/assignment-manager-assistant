
import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Assignment Manager Assistant',
  description: 'Kanban + Graph + Gantt with Time-Matrix',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/kanban">Kanban</Link>
            <Link href="/graph">Graph</Link>
            <Link href="/gantt">Gantt</Link>
            <Link href="/calendar">Calendar</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  )
}
