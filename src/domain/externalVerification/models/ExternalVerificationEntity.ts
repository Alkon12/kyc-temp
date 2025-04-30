import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { JsonValue } from '@domain/shared/JsonValue'
import { ExternalVerificationId } from './ExternalVerificationId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { ExternalVerificationStatus } from './ExternalVerificationStatus'
import { ExternalVerificationType } from './ExternalVerificationType'
import { KycVerificationEntity } from '@domain/kycVerification/models/KycVerificationEntity'
import { DTO, serialize } from '@domain/kernel/DTO'

export type ExternalVerificationEntityProps = {
  id: ExternalVerificationId
  verificationId: KycVerificationId
  provider: StringValue
  verificationType: ExternalVerificationType
  requestData?: JsonValue
  responseData?: JsonValue
  status: ExternalVerificationStatus
  createdAt: DateTimeValue
  
  // Relationship
  kycVerification?: KycVerificationEntity
}

export class ExternalVerificationEntity extends AggregateRoot<'ExternalVerificationEntity', ExternalVerificationEntityProps> {
  get props(): ExternalVerificationEntityProps {
    return this._props
  }

  // Sobreescribir el método toDTO para evitar la recursión circular
  toDTO(): DTO<this> {
    // Clonar las propiedades para no modificar el objeto original
    const props = { ...this._props }
    
    // Eliminar la referencia al kycVerification para evitar recursión
    delete props.kycVerification
    
    // Serializar sin la referencia circular
    return serialize(props) as DTO<this>
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

  getKycVerification() {
    return this._props.kycVerification
  }

  updateStatus(status: ExternalVerificationStatus): void {
    this._props.status = status
  }

  updateResponseData(responseData: JsonValue): void {
    this._props.responseData = responseData
  }

  updateRequestData(requestData: JsonValue): void {
    this._props.requestData = requestData
  }
} 