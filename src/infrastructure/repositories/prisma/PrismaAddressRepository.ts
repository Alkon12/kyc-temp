import prisma from '@client/providers/PrismaClient'
import { injectable } from 'inversify'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import AddressRepository from '@domain/address/AddressRepository'
import { AddressEntity } from '@domain/address/AddressEntity'
import { AddressFactory } from '@domain/address/AddressFactory'
@injectable()
export class PrismaAddressRepository implements AddressRepository {
  async create(address: AddressEntity): Promise<AddressEntity> {
    const createdAddress = await prisma.address.create({
      data: {
        ...address.toDTO(),
      },
    })

    return AddressFactory.fromDTO(convertPrismaToDTO<AddressEntity>(createdAddress))
  }
}
