import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '../../shared/DateTime'
import { KycVerificationId } from './KycVerificationId'
import { UserId } from '@domain/user/models/UserId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { NumberValue } from '@domain/shared/NumberValue'

export type KycVerificationStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'requires-review'

export type KycVerificationProps = {
  id: KycVerificationId
  externalReferenceId?: StringValue
  companyId: StringValue
  status: StringValue
  riskLevel?: StringValue
  priority: NumberValue
  verificationType: StringValue
  assignedTo?: UserId
  notes?: StringValue
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
  completedAt?: DateTimeValue
}

export class KycVerification extends AggregateRoot<'KycVerification', KycVerificationProps> {
  get props(): KycVerificationProps {
    return this._props
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

  setStatus(status: StringValue) {
    this._props.status = status
    this._props.updatedAt = new DateTimeValue(new Date())
    
    if (status.toDTO() === 'approved' || status.toDTO() === 'rejected') {
      this._props.completedAt = new DateTimeValue(new Date())
    }
    
    return this
  }

  setAssignedTo(userId: UserId) {
    this._props.assignedTo = userId
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setNotes(notes: StringValue) {
    this._props.notes = notes
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setPriority(priority: NumberValue) {
    this._props.priority = priority
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setRiskLevel(riskLevel: StringValue) {
    this._props.riskLevel = riskLevel
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }
}
