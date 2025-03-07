import { Address } from '@prisma/client'

export type IAddress = Omit<Address, 'date'> & {
  date: string
}
