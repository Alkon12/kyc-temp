import { Quote } from '@prisma/client'
import { IApplication } from './IApplication'
import { IOffer } from './IOffer'

export type IQuote = Omit<Quote, 'createdAt' | 'startDate' | 'expiresAt' | 'user' | 'offers' | 'applications'> & {
  createdAt: string
  updatedAt: string
  expiresAt: string
  offers: IOffer[]
  applications: IApplication[]
}
