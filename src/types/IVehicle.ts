import { Vehicle } from '@prisma/client'

export type IVehicle = Omit<Vehicle, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}
