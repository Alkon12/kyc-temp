import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { JsonValue } from '@domain/shared/JsonValue'
import { SignedDocumentId } from './SignedDocumentId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'
import { KycVerificationEntity } from '@domain/kycVerification/models/KycVerificationEntity'
import { DocusealTemplateEntity } from '@domain/docuseal/models/DocusealTemplateEntity'

export type SignedDocumentStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export type SignedDocumentEntityProps = {
  id: SignedDocumentId
  verificationId: KycVerificationId
  templateId: DocusealTemplateId
  docusealSubmissionId?: StringValue
  status: StringValue
  signerEmail?: StringValue
  signerPhone?: StringValue
  documentUrl?: StringValue
  additionalData?: JsonValue
  createdAt: DateTimeValue
  updatedAt: DateTimeValue
  completedAt?: DateTimeValue

  kycVerification?: KycVerificationEntity
  template?: DocusealTemplateEntity
}

export class SignedDocumentEntity extends AggregateRoot<'SignedDocumentEntity', SignedDocumentEntityProps> {
  get props(): SignedDocumentEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getVerificationId() {
    return this._props.verificationId
  }

  getTemplateId() {
    return this._props.templateId
  }

  getDocusealSubmissionId() {
    return this._props.docusealSubmissionId
  }

  getStatus() {
    return this._props.status
  }

  getSignerEmail() {
    return this._props.signerEmail
  }

  getSignerPhone() {
    return this._props.signerPhone
  }

  getDocumentUrl() {
    return this._props.documentUrl
  }

  getAdditionalData() {
    return this._props.additionalData
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

  getKycVerification() {
    return this._props.kycVerification
  }

  getTemplate() {
    return this._props.template
  }

  setStatus(status: StringValue) {
    this._props.status = status
    this._props.updatedAt = new DateTimeValue(new Date())
    
    if (status.toDTO() === 'completed') {
      this._props.completedAt = new DateTimeValue(new Date())
    }
    
    return this
  }

  setDocusealSubmissionId(submissionId: StringValue) {
    this._props.docusealSubmissionId = submissionId
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setDocumentUrl(url: StringValue) {
    this._props.documentUrl = url
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setAdditionalData(data: JsonValue) {
    this._props.additionalData = data
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }
} 