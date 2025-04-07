import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { DocumentId } from './DocumentId'
import { StringValue } from '@domain/shared/StringValue'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { JsonValue } from '@domain/shared/JsonValue'
import { UserId } from '@domain/user/models/UserId'
import { KycVerificationEntity } from '@domain/kycVerification/models/KycVerificationEntity'
import { UserEntity } from '@domain/user/models/UserEntity'

export type DocumentEntityProps = {
  id: DocumentId
  verificationId: KycVerificationId
  documentType: StringValue
  filePath: StringValue
  fileName: StringValue
  fileSize?: NumberValue
  mimeType?: StringValue
  verificationStatus: StringValue
  ocrData?: JsonValue
  reviewerId?: UserId
  reviewNotes?: StringValue
  createdAt: DateTimeValue
  updatedAt: DateTimeValue
  imageData?: StringValue

  kycVerification?: KycVerificationEntity
  reviewer?: UserEntity
}

export class DocumentEntity extends AggregateRoot<'DocumentEntity', DocumentEntityProps> {
  get props(): DocumentEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getVerificationId() {
    return this._props.verificationId
  }

  getDocumentType() {
    return this._props.documentType
  }

  getFilePath() {
    return this._props.filePath
  }

  getFileName() {
    return this._props.fileName
  }

  getFileSize() {
    return this._props.fileSize
  }

  getMimeType() {
    return this._props.mimeType
  }

  getVerificationStatus() {
    return this._props.verificationStatus
  }

  getOcrData() {
    return this._props.ocrData
  }

  getReviewerId() {
    return this._props.reviewerId
  }

  getReviewNotes() {
    return this._props.reviewNotes
  }

  getCreatedAt() {
    return this._props.createdAt
  }

  getUpdatedAt() {
    return this._props.updatedAt
  }

  getImageData() {
    return this._props.imageData
  }

  getKycVerification() {
    return this._props.kycVerification
  }

  getReviewer() {
    return this._props.reviewer
  }

  updateVerificationStatus(status: string) {
    this._props.verificationStatus = new StringValue(status)
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  updateFilePath(filePath: StringValue) {
    this._props.filePath = filePath
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  updateFileName(fileName: StringValue) {
    this._props.fileName = fileName
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setReviewer(reviewerId: UserId, notes?: string) {
    this._props.reviewerId = reviewerId
    if (notes) {
      this._props.reviewNotes = new StringValue(notes)
    }
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  updateOcrData(data: any) {
    this._props.ocrData = new JsonValue(data)
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }
} 