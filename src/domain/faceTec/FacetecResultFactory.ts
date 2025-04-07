import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { FacetecResultEntity, FacetecResultEntityProps } from './models/FacetecResultEntity'
import { StringValue } from '@domain/shared/StringValue'
import { FacetecResultId } from './models/FacetecResultId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { JsonValue } from '@domain/shared/JsonValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { KycVerificationFactory } from '@domain/kycVerification/KycVerificationFactory'
import { FaceTecSessionId } from './models/FaceTecSessionId'

export type FacetecResultArgs = Merge<
  Omit<FacetecResultEntityProps, 'kycVerification'>,
  {
    id?: string
  }
>

export class FacetecResultFactory {
  static fromDTO(dto: DTO<FacetecResultEntity>): FacetecResultEntity {
    return new FacetecResultEntity({
      id: new FacetecResultId(dto.id),
      verificationId: new KycVerificationId(dto.verificationId),
      sessionId: new FaceTecSessionId(dto.sessionId),
      livenessStatus: new StringValue(dto.livenessStatus),
      enrollmentStatus: new StringValue(dto.enrollmentStatus),
      matchLevel: dto.matchLevel ? new NumberValue(dto.matchLevel) : undefined,
      fullResponse: dto.fullResponse ? new JsonValue(dto.fullResponse) : undefined,
      manualReviewRequired: new BooleanValue(dto.manualReviewRequired),
      createdAt: new DateTimeValue(dto.createdAt),

      kycVerification: dto.kycVerification ? KycVerificationFactory.fromDTO(dto.kycVerification) : undefined,
    })
  }

  static create(args: FacetecResultArgs): FacetecResultEntity {
    return new FacetecResultEntity({
      ...args,
      id: args.id ? new FacetecResultId(args.id) : new FacetecResultId(),
    })
  }
} 