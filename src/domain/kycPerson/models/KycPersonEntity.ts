import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { KycPersonId } from './KycPersonId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { KycVerificationEntity } from '@domain/kycVerification/models/KycVerificationEntity'

export type KycPersonEntityProps = {
  id: KycPersonId
  verificationId: KycVerificationId
  firstName?: StringValue
  lastName?: StringValue
  dateOfBirth?: DateTimeValue
  nationality?: StringValue
  documentNumber?: StringValue
  documentType?: StringValue
  email?: StringValue
  phone?: StringValue
  address?: StringValue
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
  
  kycVerification?: KycVerificationEntity
}

export class KycPersonEntity extends AggregateRoot<'KycPersonEntity', KycPersonEntityProps> {
  get props(): KycPersonEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getVerificationId() {
    return this._props.verificationId
  }

  getFirstName() {
    return this._props.firstName
  }

  getLastName() {
    return this._props.lastName
  }

  getDateOfBirth() {
    return this._props.dateOfBirth
  }

  getNationality() {
    return this._props.nationality
  }

  getDocumentNumber() {
    return this._props.documentNumber
  }

  getDocumentType() {
    return this._props.documentType
  }

  getEmail() {
    return this._props.email
  }

  getPhone() {
    return this._props.phone
  }

  getAddress() {
    return this._props.address
  }

  getCreatedAt() {
    return this._props.createdAt
  }

  getUpdatedAt() {
    return this._props.updatedAt
  }

  getKycVerification() {
    return this._props.kycVerification
  }

  getFullName(): string {
    const firstName = this._props.firstName?.toDTO() || '';
    const lastName = this._props.lastName?.toDTO() || '';
    return `${firstName} ${lastName}`.trim();
  }
  
  updatePersonalInfo(props: {
    firstName?: StringValue
    lastName?: StringValue
    dateOfBirth?: DateTimeValue
    nationality?: StringValue
    documentNumber?: StringValue
    documentType?: StringValue
    email?: StringValue
    phone?: StringValue
    address?: StringValue
  }): void {
    Object.assign(this._props, props)
    this._props.updatedAt = new DateTimeValue(new Date())
  }
}