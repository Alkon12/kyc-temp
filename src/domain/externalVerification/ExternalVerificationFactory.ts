import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { JsonValue } from '@domain/shared/JsonValue'
import { ExternalVerificationId } from './models/ExternalVerificationId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { ExternalVerification, ExternalVerificationProps } from './models/ExternalVerification'
import { ExternalVerificationStatus } from './models/ExternalVerificationStatus'
import { ExternalVerificationType } from './models/ExternalVerificationType'
import { ExternalVerificationEntity, ExternalVerificationEntityProps } from './models/ExternalVerificationEntity'
import { KycVerificationEntity } from '@domain/kycVerification/models/KycVerificationEntity'
import { DTO } from '@domain/kernel/DTO'

export type CreateExternalVerificationArgs = {
  id?: string
  verificationId: string
  provider: string
  verificationType: string
  requestData?: string | object
  responseData?: string | object
  status?: string
}

export class ExternalVerificationFactory {
  static fromDTO(dto: DTO<ExternalVerificationEntity>, kycVerification?: KycVerificationEntity): ExternalVerificationEntity {
    const props: ExternalVerificationEntityProps = {
      id: new ExternalVerificationId(dto.id),
      verificationId: new KycVerificationId(dto.verificationId),
      provider: new StringValue(dto.provider),
      verificationType: new ExternalVerificationType(dto.verificationType),
      status: new ExternalVerificationStatus(dto.status || 'pending'),
      createdAt: new DateTimeValue(dto.createdAt || new Date()),
    }

    if (dto.requestData) {
      props.requestData = new JsonValue(dto.requestData)
    }

    if (dto.responseData) {
      props.responseData = new JsonValue(dto.responseData)
    }

    return new ExternalVerificationEntity(props)
  }

  static create(args: CreateExternalVerificationArgs): ExternalVerification {
    const props: ExternalVerificationProps = {
      id: new ExternalVerificationId(args.id),
      verificationId: new KycVerificationId(args.verificationId),
      provider: new StringValue(args.provider),
      verificationType: new ExternalVerificationType(args.verificationType),
      status: args.status ? new ExternalVerificationStatus(args.status) : ExternalVerificationStatus.pending(),
      createdAt: new DateTimeValue(new Date())
    }

    if (args.requestData) {
      props.requestData = new JsonValue(args.requestData)
    }

    if (args.responseData) {
      props.responseData = new JsonValue(args.responseData)
    }

    return new ExternalVerification(props)
  }

  static createEntity(
    args: CreateExternalVerificationArgs & { kycVerification?: KycVerificationEntity }
  ): ExternalVerificationEntity {
    const props: ExternalVerificationEntityProps = {
      id: new ExternalVerificationId(args.id),
      verificationId: new KycVerificationId(args.verificationId),
      provider: new StringValue(args.provider),
      verificationType: new ExternalVerificationType(args.verificationType),
      status: args.status ? new ExternalVerificationStatus(args.status) : ExternalVerificationStatus.pending(),
      createdAt: new DateTimeValue(new Date())
    }

    if (args.requestData) {
      props.requestData = new JsonValue(args.requestData)
    }

    if (args.responseData) {
      props.responseData = new JsonValue(args.responseData)
    }

    if (args.kycVerification) {
      props.kycVerification = args.kycVerification
    }

    return new ExternalVerificationEntity(props)
  }
} 