import { getServerSession } from 'next-auth/next'
import prisma from '@client/providers/PrismaClient'
import { nextAuthOptions } from '@infrastructure/auth/nextAuth/NextAuth'

export async function getSession() {
  return await getServerSession(nextAuthOptions)
}

export default async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session?.user?.email) {
      return null
    }

    // REMOVE AFTER FIX USER UPSERT
    //if(session?.user?.email){
    //  return {...session.user}
    //}

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser,
      uberRating: currentUser.uberRating?.toNumber(),
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      dob: currentUser.dob?.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
      groups: [],
      assignedTasks: [],
      quotes: [],
      applications: [],
      slotsAsHost: [],
      slotsAsGuest: [],
      leasings: [],
    }
  } catch (error: any) {
    return null
  }
}
