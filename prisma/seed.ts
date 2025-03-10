import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'crypto'

const prisma = new PrismaClient()

export const GROUPS = [
  {
    id: 'MANAGER',
    title: 'Manager',
  },
  {
    id: 'BACKOFFICE',
    title: 'Backoffice',
  },
  {
    id: 'DRIVER',
    title: 'Driver',
  },
]

async function main() {
  await prisma.userGroup.deleteMany()
  await prisma.user.deleteMany()
  await prisma.group.deleteMany()

  await prisma.group.createMany({
    data: GROUPS,
  })

  const USER_BO1 = 'c387646e-4ff6-4267-b7c2-8e1283040240'

  const hashedPassword = hashPassword('1234')

  const userBo1 = await prisma.user.create({
    data: {
      id: USER_BO1,
      email: 'bo1@grupoautofin.com',
      firstName: 'BO1',
      lastName: 'BO 1',
      emailVerified: new Date(),
      hashedPassword
    },
  })

  await prisma.userGroup.create({
    data: {
      groupId: 'BACKOFFICE',
      userId: userBo1.id,
      assignedBy: userBo1.id,
      assignedAt: new Date(),
    },
  })

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


  const hashPassword = (password: string): string => {
    // Any random string here (ideally should be at least 16 bytes)
    const salt = randomBytes(16).toString('hex')
    return encryptPassword(password, salt) + salt
  }

  const encryptPassword = (password: string, salt: string) => {
    return scryptSync(password, salt, 32).toString('hex')
  }