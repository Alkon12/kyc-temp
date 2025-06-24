import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { KycPersonEntity, KycPersonEntityProps } from './models/KycPersonEntity'
import { StringValue } from '@domain/shared/StringValue'
import { KycPersonId } from './models/KycPersonId'
import { DateTimeValue } from '@domain/shared/DateTime'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { KycVerificationFactory } from '@domain/kycVerification/KycVerificationFactory'

export type KycPersonArgs = Merge<
  Omit<KycPersonEntityProps, 'kycVerification'>,
  {
    id?: KycPersonId
    createdAt?: DateTimeValue
    updatedAt?: DateTimeValue
  }
>

export class KycPersonFactory {
  static fromDTO(dto: DTO<KycPersonEntity>): KycPersonEntity {
    return new KycPersonEntity({
      id: new KycPersonId(dto.id),
      verificationId: new KycVerificationId(dto.verificationId),
      firstName: dto.firstName ? new StringValue(dto.firstName) : undefined,
      secondName: dto.secondName ? new StringValue(dto.secondName) : undefined,
      lastName: dto.lastName ? new StringValue(dto.lastName) : undefined,
      secondLastName: dto.secondLastName ? new StringValue(dto.secondLastName) : undefined,
      curp: dto.curp ? new StringValue(dto.curp) : undefined,
      dateOfBirth: dto.dateOfBirth ? new DateTimeValue(dto.dateOfBirth) : undefined,
      nationality: dto.nationality ? new StringValue(dto.nationality) : undefined,
      documentNumber: dto.documentNumber ? new StringValue(dto.documentNumber) : undefined,
      documentType: dto.documentType ? new StringValue(dto.documentType) : undefined,
      email: dto.email ? new StringValue(dto.email) : undefined,
      phone: dto.phone ? new StringValue(dto.phone) : undefined,
      street: dto.street ? new StringValue(dto.street) : undefined,
      colony: dto.colony ? new StringValue(dto.colony) : undefined,
      city: dto.city ? new StringValue(dto.city) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      
      kycVerification: dto.kycVerification ? KycVerificationFactory.fromDTO(dto.kycVerification) : undefined,
    })
  }

  static create(args: KycPersonArgs): KycPersonEntity {
    return new KycPersonEntity({
      ...args,
      id: args.id || new KycPersonId(),
      createdAt: args.createdAt || new DateTimeValue(new Date()),
      updatedAt: args.updatedAt || new DateTimeValue(new Date()),
    })
  }
}