import { UserGroup } from '@prisma/client'
import { IGroup } from './IGroup'
import { IUser } from './IUser'

export type IUserGroup = Omit<UserGroup, 'user' | 'group' | 'assignedAt'> & {
  user: IUser
  group: IGroup
  assignedAt: string
}
