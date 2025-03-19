import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { CompanyEntity, CompanyEntityProps } from './models/CompanyEntity'
import { StringValue } from '@domain/shared/StringValue'
import { CompanyId } from './models/CompanyId'
import { DateTimeValue } from '@domain/shared/DateTime'

export type CompanyArgs = Merge<
  Omit<CompanyEntityProps, 'userRoles' | 'kycVerifications' | 'verificationSettings'>,
  {
    id?: CompanyId
    createdAt?: DateTimeValue
    updatedAt?: DateTimeValue
  }
>

export class CompanyFactory {
  static fromDTO(dto: DTO<CompanyEntity>): CompanyEntity {
    return new CompanyEntity({
      id: new CompanyId(dto.id),
      companyName: new StringValue(dto.companyName),
      apiKey: new StringValue(dto.apiKey),
      status: new StringValue(dto.status),
      callbackUrl: dto.callbackUrl ? new StringValue(dto.callbackUrl) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
    })
  }

  static create(args: CompanyArgs): CompanyEntity {
    return new CompanyEntity({
      ...args,
      id: args.id || new CompanyId(),
      status: args.status || new StringValue('active'),
      createdAt: args.createdAt || new DateTimeValue(new Date()),
      updatedAt: args.updatedAt || new DateTimeValue(new Date()),
    })
  }
}