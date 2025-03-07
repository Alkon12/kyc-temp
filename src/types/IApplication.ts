import { Application } from '@prisma/client'
import { IApplicationChecklist } from './IApplicationChecklist'
import { IProduct } from './IProduct'
import { IQuote } from './IQuote'
import { IUser } from './IUser'
import { IVehicle } from './IVehicle'

export type IApplication = Omit<
  Application,
  | 'createdAt'
  | 'user'
  | 'product'
  | 'vehicle'
  | 'quote'
  | 'checklist'
  | 'address'
  | 'kycFinishedAt'
  | 'finishedAt'
  | 'kycDriverEngagedAt'
> & {
  createdAt: string
  updatedAt: string
  kycFinishedAt: string
  kycDriverEngagedAt: string
  finishedAt: string
  product?: IProduct
  user?: IUser
  quote?: IQuote
  vehicle?: IVehicle
  checklist?: IApplicationChecklist[]
}
