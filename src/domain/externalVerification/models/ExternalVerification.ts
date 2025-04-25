import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { JsonValue } from '@domain/shared/JsonValue'
import { ExternalVerificationId } from './ExternalVerificationId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { ExternalVerificationStatus } from './ExternalVerificationStatus'
import { ExternalVerificationType } from './ExternalVerificationType'

export type ExternalVerificationProps = {
  id: ExternalVerificationId
  verificationId: KycVerificationId
  provider: StringValue
  verificationType: ExternalVerificationType
  requestData?: JsonValue
  responseData?: JsonValue
  status: ExternalVerificationStatus
  createdAt: DateTimeValue
}

export class ExternalVerification extends AggregateRoot<'ExternalVerification', ExternalVerificationProps> {
  get props(): ExternalVerificationProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getVerificationId() {
    return this._props.verificationId
  }

  getProvider() {
    return this._props.provider
  }

  getVerificationType() {
    return this._props.verificationType
  }

  getRequestData() {
    return this._props.requestData
  }

  getResponseData() {
    return this._props.responseData
  }

  getStatus() {
    return this._props.status
  }

  getCreatedAt() {
    return this._props.createdAt
  }

  setStatus(status: ExternalVerificationStatus) {
    this._props.status = status
    return this
  }

  setResponseData(responseData: JsonValue) {
    this._props.responseData = responseData
    return this
  }

  setRequestData(requestData: JsonValue) {
    this._props.requestData = requestData
    return this
  }
} 