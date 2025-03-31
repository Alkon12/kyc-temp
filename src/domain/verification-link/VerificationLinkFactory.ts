import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { VerificationLinkEntity, VerificationLinkEntityProps } from './models/VerificationLinkEntity'
import { StringValue } from '@domain/shared/StringValue'
import { VerificationLinkId } from './models/VerificationLinkId'

type VerificationLinkCreateArgs = {
  verificationId: UUID
  token: StringValue
  status?: StringValue
  expiresAt?: StringValue
  lastAccessedAt?: StringValue
  accessCount?: StringValue
  createdAt?: StringValue
  updatedAt?: StringValue
  id?: UUID
}

export class VerificationLinkFactory {
  static fromDTO(dto: DTO<VerificationLinkEntity>): VerificationLinkEntity {
    return new VerificationLinkEntity({
      id: new VerificationLinkId(dto.id),
      verificationId: new UUID(dto.verificationId),
      token: new StringValue(dto.token),
      status: new StringValue(dto.status),
      expiresAt: dto.expiresAt ? new StringValue(dto.expiresAt) : undefined,
      lastAccessedAt: dto.lastAccessedAt ? new StringValue(dto.lastAccessedAt) : undefined,
      accessCount: new StringValue(dto.accessCount.toString()),
      createdAt: new StringValue(dto.createdAt),
      updatedAt: new StringValue(dto.updatedAt),
      
      kycVerification: dto.kycVerification
    })
  }

  static create(args: VerificationLinkCreateArgs): VerificationLinkEntity {
    const now = new Date().toISOString()
    
    return new VerificationLinkEntity({
      ...args,
      id: args.id ? new VerificationLinkId(args.id._value) : new VerificationLinkId(),
      status: args.status || new StringValue('active'),
      accessCount: args.accessCount || new StringValue('0'),
      createdAt: args.createdAt || new StringValue(now),
      updatedAt: args.updatedAt || new StringValue(now)
    })
  }
} 