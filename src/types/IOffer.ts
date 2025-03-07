import { Offer } from '@prisma/client'
import { IProduct } from './IProduct'
import { IQuote } from './IQuote'
import { IUser } from './IUser'

export type IOffer = Omit<Offer, 'createdAt' | 'startDate' | 'expiresAt' | 'product' | 'quote' | 'user'> & {
  createdAt: string
  updatedAt: string
  expiresAt: string
  product: IProduct
  user: IUser
  quote: IQuote
}
