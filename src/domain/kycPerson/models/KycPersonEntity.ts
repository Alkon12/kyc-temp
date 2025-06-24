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
  secondName?: StringValue
  lastName?: StringValue
  secondLastName?: StringValue
  curp?: StringValue
  dateOfBirth?: DateTimeValue
  nationality?: StringValue
  documentNumber?: StringValue
  documentType?: StringValue
  email?: StringValue
  phone?: StringValue
  street?: StringValue
  colony?: StringValue
  city?: StringValue
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

  getSecondName() {
    return this._props.secondName
  }

  getLastName() {
    return this._props.lastName
  }

  getSecondLastName() {
    return this._props.secondLastName
  }

  getCurp() {
    return this._props.curp
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

  getStreet() {
    return this._props.street
  }

  getColony() {
    return this._props.colony
  }

  getCity() {
    return this._props.city
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
    const secondName = this._props.secondName?.toDTO() || '';
    const lastName = this._props.lastName?.toDTO() || '';
    const secondLastName = this._props.secondLastName?.toDTO() || '';
    return `${firstName} ${secondName} ${lastName} ${secondLastName}`.trim().replace(/\s+/g, ' ');
  }

  getFullAddress(): string {
    const street = this._props.street?.toDTO() || '';
    const colony = this._props.colony?.toDTO() || '';
    const city = this._props.city?.toDTO() || '';
    return `${street}, ${colony}, ${city}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim();
  }
  
  updatePersonalInfo(props: {
    firstName?: StringValue
    secondName?: StringValue
    lastName?: StringValue
    secondLastName?: StringValue
    curp?: StringValue
    dateOfBirth?: DateTimeValue
    nationality?: StringValue
    documentNumber?: StringValue
    documentType?: StringValue
    email?: StringValue
    phone?: StringValue
    street?: StringValue
    colony?: StringValue
    city?: StringValue
  }): void {
    Object.assign(this._props, props)
    this._props.updatedAt = new DateTimeValue(new Date())
  }
}