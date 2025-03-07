import { User } from 'next-auth'
import { IApplication } from './IApplication'
import { ILeasing } from './ILeasing'
import { IQuote } from './IQuote'
import { ITask } from './ITask'
import { IUserGroup } from './IUserGroup'
import { ISlot } from './ISlot'

export type IUser = Omit<
  User,
  | 'createdAt'
  | 'updatedAt'
  | 'emailVerified'
  | 'uberRating'
  | 'groups'
  | 'assignedTasks'
  | 'quotes'
  | 'applications'
  | 'dob'
  | 'slotsAsHost'
  | 'slotsAsGuest'
  | 'leasings'
> & {
  createdAt: string
  updatedAt: string
  uberRating: number | undefined
  emailVerified: string | null
  groups: IUserGroup[]
  assignedTasks: ITask[]
  quotes: IQuote[]
  slotsAsHost: ISlot[]
  slotsAsGuest: ISlot[]
  applications: IApplication[]
  leasings: ILeasing[]
  dob?: string
}
