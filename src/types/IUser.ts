import { User } from 'next-auth'
import { IUserGroup } from './IUserGroup'

export type IUser = Omit<
  User,
  | 'createdAt'
  | 'updatedAt'
  | 'emailVerified'
  | 'groups'
> & {
  createdAt: string
  updatedAt: string
  uberRating: number | undefined
  emailVerified: string | null
  groups: IUserGroup[]
}
