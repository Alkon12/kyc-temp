import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { KycVerificationId } from './KycVerificationId'
import { CompanyId } from '@domain/company/models/CompanyId'
import { UserId } from '@domain/user/models/UserId'
import { KycVerificationStatus } from './KycVerificationStatus'
import { KycVerificationType } from './KycVerificationType'
import { UserEntity } from '@domain/user/models/UserEntity'
import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { ExternalVerificationEntity } from '@domain/externalVerification/models/ExternalVerificationEntity'
import { KycPersonEntity } from '@domain/kycPerson/models/KycPersonEntity'
import { DTO, serialize } from '@domain/kernel/DTO'
import { BooleanValue } from '@domain/shared/BooleanValue'

export type KycVerificationEntityProps = {
  id: KycVerificationId
  externalReferenceId?: StringValue
  companyId: CompanyId
  status: KycVerificationStatus
  riskLevel?: StringValue
  priority: NumberValue
  verificationType: KycVerificationType
  assignedTo?: UserId
  notes?: StringValue
  requiresDocumentSigning?: BooleanValue
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
  completedAt?: DateTimeValue
  
  company?: CompanyEntity
  assignedUser?: UserEntity
  kycPersons?: KycPersonEntity[]
  externalVerifications?: ExternalVerificationEntity[]
}

export class KycVerificationEntity extends AggregateRoot<'KycVerificationEntity', KycVerificationEntityProps> {
  get props(): KycVerificationEntityProps {
    return this._props
  }

  toDTO(): DTO<this> {
    const props = { ...this._props }
    
    const externalVerifications = props.externalVerifications
    const kycPersons = props.kycPersons
    
    delete props.externalVerifications
    delete props.kycPersons
    
    const dto = serialize(props) as any
    
    if (externalVerifications && externalVerifications.length > 0) {
      dto.externalVerifications = externalVerifications.map(ev => {
        const evProps = { ...ev.props }
        delete evProps.kycVerification
        return serialize(evProps)
      })
    }
    
    if (kycPersons && kycPersons.length > 0) {
      dto.kycPersons = kycPersons.map(person => {
        const personProps = { ...person.props }
        delete personProps.kycVerification
        return serialize(personProps)
      })
    }
    
    return dto as DTO<this>
  }

  getId() {
    return this._props.id
  }

  getExternalReferenceId() {
    return this._props.externalReferenceId
  }

  getCompanyId() {
    return this._props.companyId
  }

  getStatus() {
    return this._props.status
  }

  getRiskLevel() {
    return this._props.riskLevel
  }

  getPriority() {
    return this._props.priority
  }

  getVerificationType() {
    return this._props.verificationType
  }

  getAssignedTo() {
    return this._props.assignedTo
  }

  getNotes() {
    return this._props.notes
  }

  getRequiresDocumentSigning() {
    return this._props.requiresDocumentSigning
  }

  getCreatedAt() {
    return this._props.createdAt
  }

  getUpdatedAt() {
    return this._props.updatedAt
  }

  getCompletedAt() {
    return this._props.completedAt
  }

  getCompany() {
    return this._props.company
  }

  getAssignedUser() {
    return this._props.assignedUser
  }

  getExternalVerifications() {
    return this._props.externalVerifications
  }

  getKycPersons() {
    return this._props.kycPersons
  }

  updateStatus(status: KycVerificationStatus): void {
    this._props.status = status
    this._props.updatedAt = new DateTimeValue(new Date())
    
    if (status.toDTO() === 'approved' || status.toDTO() === 'rejected') {
      this._props.completedAt = new DateTimeValue(new Date())
    }
  }

  assign(userId: UserId): void {
    this._props.assignedTo = userId
    this._props.updatedAt = new DateTimeValue(new Date())
  }

  unassign(): void {
    this._props.assignedTo = undefined
    this._props.updatedAt = new DateTimeValue(new Date())
  }

  updateNotes(notes: StringValue): void {
    this._props.notes = notes
    this._props.updatedAt = new DateTimeValue(new Date())
  }

  setRequiresDocumentSigning(requiresDocumentSigning: BooleanValue): void {
    this._props.requiresDocumentSigning = requiresDocumentSigning
    this._props.updatedAt = new DateTimeValue(new Date())
  }
}