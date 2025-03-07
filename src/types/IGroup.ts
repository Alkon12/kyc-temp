import { Group } from '@prisma/client'
import { IUserGroup } from './IUserGroup'

export type IGroup = Omit<Group, 'users'> & {
  users: IUserGroup[]
}
