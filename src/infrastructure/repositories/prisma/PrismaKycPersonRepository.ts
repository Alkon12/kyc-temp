import prisma from '@client/providers/PrismaClient'
import type KycPersonRepository from '@domain/kycPerson/KycPersonRepository'
import { KycPersonFactory } from '@domain/kycPerson/KycPersonFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { KycPersonEntity } from '@domain/kycPerson/models/KycPersonEntity'
import { injectable } from 'inversify'
import { KycPersonId } from '@domain/kycPerson/models/KycPersonId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { NotFoundError } from '@domain/error'

@injectable()
export class PrismaKycPersonRepository implements KycPersonRepository {
  async getById(id: KycPersonId): Promise<KycPersonEntity> {
    const person = await prisma.kycPerson.findUnique({
      where: {
        id: id.toDTO(),
      },
    })

    if (!person) {
      throw new NotFoundError('KYC Person not found')
    }

    return KycPersonFactory.fromDTO(convertPrismaToDTO<KycPersonEntity>(person))
  }

  async getByVerificationId(verificationId: KycVerificationId): Promise<KycPersonEntity[]> {
    const persons = await prisma.kycPerson.findMany({
      where: {
        verificationId: verificationId.toDTO(),
      },
    })

    return persons.map((p) => KycPersonFactory.fromDTO(convertPrismaToDTO<KycPersonEntity>(p)))
  }

  async create(person: KycPersonEntity): Promise<KycPersonEntity> {
    const personDTO = person.toDTO()
    const { kycVerification, ...personData } = personDTO

    const createdPerson = await prisma.kycPerson.create({
      data: personData,
    })

    return KycPersonFactory.fromDTO(convertPrismaToDTO<KycPersonEntity>(createdPerson))
  }

  async save(person: KycPersonEntity): Promise<KycPersonEntity> {
    const personDTO = person.toDTO()
    const { kycVerification, ...personData } = personDTO

    const updatedPerson = await prisma.kycPerson.update({
      where: {
        id: person.getId().toDTO(),
      },
      data: personData,
    })

    return KycPersonFactory.fromDTO(convertPrismaToDTO<KycPersonEntity>(updatedPerson))
  }

  async delete(id: KycPersonId): Promise<boolean> {
    try {
      await prisma.kycPerson.delete({
        where: {
          id: id.toDTO(),
        },
      })
      return true
    } catch (error) {
      console.error('Error deleting KYC Person:', error)
      return false
    }
  }
} 