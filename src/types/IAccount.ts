import { Account } from '@prisma/client'

export type IAccount = Omit<Account, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}
