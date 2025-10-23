
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: { params: { access_type: 'offline', prompt: 'consent' } }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) (session.user as any).id = user.id
      return session
    }
  },
  pages: {},
  secret: process.env.NEXTAUTH_SECRET
}
