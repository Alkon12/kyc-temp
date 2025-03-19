import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { KycPersonEntity } from '@domain/kycPerson/models/KycPersonEntity'
import { KycPersonId } from '@domain/kycPerson/models/KycPersonId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { CreateKycPersonArgs } from '@domain/kycPerson/interfaces/CreateKycPersonArgs'
import { KycPersonFactory } from '@domain/kycPerson/KycPersonFactory'
import type KycPersonRepository from '@domain/kycPerson/KycPersonRepository'
import AbstractKycPersonService from '@domain/kycPerson/KycPersonService'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class KycPersonService implements AbstractKycPersonService {
  @inject(DI.KycPersonRepository) private readonly _kycPersonRepository!: KycPersonRepository

  async getById(id: KycPersonId): Promise<KycPersonEntity> {
    return this._kycPersonRepository.getById(id)
  }

  async getByVerificationId(verificationId: KycVerificationId): Promise<KycPersonEntity[]> {
    return this._kycPersonRepository.getByVerificationId(verificationId)
  }

  async create(props: CreateKycPersonArgs): Promise<KycPersonEntity> {
    const person = KycPersonFactory.create(props)
    return this._kycPersonRepository.create(person)
  }

  async update(id: KycPersonId, props: Partial<CreateKycPersonArgs>): Promise<KycPersonEntity> {
    const existingPerson = await this.getById(id)
    const dto = existingPerson.toDTO()
    
    const updatedPerson = KycPersonFactory.create({
      verificationId: props.verificationId || new KycVerificationId(dto.verificationId),
      firstName: props.firstName || (dto.firstName ? new StringValue(dto.firstName) : undefined),
      lastName: props.lastName || (dto.lastName ? new StringValue(dto.lastName) : undefined),
      dateOfBirth: props.dateOfBirth || (dto.dateOfBirth ? new DateTimeValue(dto.dateOfBirth) : undefined),
      nationality: props.nationality || (dto.nationality ? new StringValue(dto.nationality) : undefined),
      documentNumber: props.documentNumber || (dto.documentNumber ? new StringValue(dto.documentNumber) : undefined),
      documentType: props.documentType || (dto.documentType ? new StringValue(dto.documentType) : undefined),
      email: props.email || (dto.email ? new StringValue(dto.email) : undefined),
      phone: props.phone || (dto.phone ? new StringValue(dto.phone) : undefined),
      address: props.address || (dto.address ? new StringValue(dto.address) : undefined),
      id,
    })

    return this._kycPersonRepository.save(updatedPerson)
  }

  async delete(id: KycPersonId): Promise<boolean> {
    return this._kycPersonRepository.delete(id)
  }
} 