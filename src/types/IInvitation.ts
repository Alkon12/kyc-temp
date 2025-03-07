import { Invitation } from '@prisma/client'
import { IUser } from './IUser'
import { IProduct } from './IProduct'

export type IInvitation = Omit<Invitation, 'createdAt' | 'updatedAt' | 'referrer' | 'product'> & {
  createdAt: string
  updatedAt: string
  referrer: IUser
  product: IProduct
}
