
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', name: 'Demo User' }
  })

  const project = await prisma.project.create({
    data: { name: 'Demo Project', userId: user.id }
  })

  const topic = await prisma.topic.create({
    data: { name: 'General', color: '#60a5fa', projectId: project.id }
  })

  const now = new Date()
  const due1 = new Date(now.getTime() + 24*3600*1000)
  const due2 = new Date(now.getTime() + 3*24*3600*1000)

  const t1 = await prisma.task.create({
    data: { topicId: topic.id, title: 'Read Chapter 3', status: 'next_up', dueAt: due1, estimateMin: 120, importanceWeight: 0.7 }
  })
  const t2 = await prisma.task.create({
    data: { topicId: topic.id, title: 'Lab Report Draft', status: 'in_progress', dueAt: due2, estimateMin: 180, importanceWeight: 0.9 }
  })
  await prisma.edge.create({ data: { fromId: t1.id, toId: t2.id, type: 'depends_on' } })

  console.log('Seeded 🚀')
}

run().finally(() => prisma.$disconnect())
