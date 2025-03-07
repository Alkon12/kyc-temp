import { Leasing } from '@prisma/client'
import { IApplication } from './IApplication'

export type ILeasing = Omit<Leasing, 'createdAt' | 'startDate' | 'endDate' | 'application'> & {
  createdAt: string
  startDate: string
  endDate: string
  application: IApplication
}
