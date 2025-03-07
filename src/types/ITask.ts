import { Task } from '@prisma/client'
import { IApplication } from './IApplication'
import { IApplicationChecklist } from './IApplicationChecklist'
import { ILead } from './ILead'
import { ILeasing } from './ILeasing'
import { IOffer } from './IOffer'
import { IProduct } from './IProduct'
import { IQuote } from './IQuote'
import { ITaskGroup } from './ITaskGroup'
import { ITaskType } from './ITaskType'
import { IUser } from './IUser'
import { IVehicle } from './IVehicle'

export type ITask = Omit<
  Task,
  | 'createdAt'
  | 'updatedAt'
  | 'dismissedAt'
  | 'expiresAt'
  | 'flaggedAt'
  | 'acceptedAt'
  | 'declinedAt'
  | 'assignedUser'
  | 'offer'
  | 'quote'
  | 'application'
  | 'leasing'
  | 'vehicle'
  | 'product'
  | 'assignedGroups'
  | 'offers'
  | 'taskType'
  | 'applicationChecklist'
  | 'lead'
> & {
  createdAt: string
  updatedAt: string
  acceptedAt: string
  declinedAt: string
  dismissedAt: string
  expiresAt: string
  flaggedAt: string

  taskType: ITaskType
  assignedUser: IUser
  lead: ILead
  offer: IOffer
  quote: IQuote
  application: IApplication
  leasing: ILeasing
  vehicle: IVehicle
  product: IProduct
  applicationChecklist: IApplicationChecklist[]
  assignedGroups: ITaskGroup[]
}
