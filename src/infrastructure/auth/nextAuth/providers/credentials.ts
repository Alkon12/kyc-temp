import { RequestInternal } from 'next-auth'
import prisma from '@client/providers/PrismaClient'

export const credentials = {
  email: { label: 'email', type: 'text' },
  password: { label: 'password', type: 'password' },
}

export async function authCredentialsAuthorize(
  credentials: Record<'email' | 'password', string> | undefined,
  req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>,
) {
  console.log('88888 NEXTAUTH PROVIDER CREDENTIALS')

  if (!credentials?.email || !credentials?.password) {
    throw new Error('Invalid credentials')
  }

  const user = await prisma.user.findUnique({
    where: {
      email: credentials.email,
    },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  return user
}
