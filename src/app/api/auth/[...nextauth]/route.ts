import NextAuth from 'next-auth'
import { nextAuthOptions } from '@infrastructure/auth/nextAuth/NextAuth'

const nextAuth = NextAuth(nextAuthOptions)

export { nextAuth as GET, nextAuth as POST }
