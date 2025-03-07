import { Lead } from '@prisma/client'

export type ILead = Omit<Lead, 'createdAt' | 'startDate' | 'endDate' | 'application' | 'uberRating'> & {
  createdAt: string
  updatedAt: string
  uberRating: number | undefined
}
