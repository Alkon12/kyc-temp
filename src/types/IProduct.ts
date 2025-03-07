import { Product } from '@prisma/client'

export type IProduct = Omit<Product, 'createdAt' | 'startDate'> & {
  createdAt: string
  updatedAt: string
}
