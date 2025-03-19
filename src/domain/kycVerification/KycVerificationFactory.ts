import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { KycVerificationEntity, KycVerificationEntityProps } from './models/KycVerificationEntity'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { KycVerificationId } from './models/KycVerificationId'
import { DateTimeValue } from '@domain/shared/DateTime'
import { KycVerificationStatus } from './models/KycVerificationStatus'
import { KycVerificationType } from './models/KycVerificationType'
import { CompanyId } from '@domain/company/models/CompanyId'
import { UserId } from '@domain/user/models/UserId'
import { UserFactory } from '@domain/user/UserFactory'
import { CompanyFactory } from '@domain/company/CompanyFactory'

export type KycVerificationArgs = Merge<
  Omit<KycVerificationEntityProps, 'company' | 'assignedUser' | 'kycPersons' | 'facetecResults' | 'documents' | 'activityLogs' | 'externalVerifications' | 'verificationWorkflows'>,
  {
    id?: UUID
    createdAt?: DateTimeValue
    updatedAt?: DateTimeValue
  }
>

export class KycVerificationFactory {
  static fromDTO(dto: DTO<KycVerificationEntity>): KycVerificationEntity {
    return new KycVerificationEntity({
      id: new KycVerificationId(dto.id),
      externalReferenceId: dto.externalReferenceId ? new StringValue(dto.externalReferenceId) : undefined,
      companyId: new CompanyId(dto.companyId),
      status: new KycVerificationStatus(dto.status),
      riskLevel: dto.riskLevel ? new StringValue(dto.riskLevel) : undefined,
      priority: new NumberValue(dto.priority),
      verificationType: new KycVerificationType(dto.verificationType),
      assignedTo: dto.assignedTo ? new UserId(dto.assignedTo) : undefined,
      notes: dto.notes ? new StringValue(dto.notes) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      completedAt: dto.completedAt ? new DateTimeValue(dto.completedAt) : undefined,
      
      company: dto.company ? CompanyFactory.fromDTO(dto.company) : undefined,
      assignedUser: dto.assignedUser ? UserFactory.fromDTO(dto.assignedUser) : undefined,
    })
  }

  static create(args: KycVerificationArgs): KycVerificationEntity {
    return new KycVerificationEntity({
      ...args,
      id: args.id ? new KycVerificationId(args.id) : new KycVerificationId(),
      status: args.status || new KycVerificationStatus('pending'),
      priority: args.priority || new NumberValue(0),
      createdAt: args.createdAt || new DateTimeValue(new Date()),
      updatedAt: args.updatedAt || new DateTimeValue(new Date()),
    })
  }
}