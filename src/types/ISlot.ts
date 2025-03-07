import { Slot } from '@prisma/client'
import { IUser } from './IUser'

export type ISlot = Omit<Slot, 'startsAr' | 'endsAt' | 'hostUser' | 'guestUser'> & {
  startsAr: string
  endsAt: string
  hostUser: IUser
  guestUser: IUser
}
