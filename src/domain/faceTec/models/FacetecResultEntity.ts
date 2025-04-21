import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { JsonValue } from '@domain/shared/JsonValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { FacetecResultId } from './FacetecResultId'
import { KycVerificationEntity } from '@domain/kycVerification/models/KycVerificationEntity'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { FaceTecSessionId } from './FaceTecSessionId'
import { DateTimeValue } from '@domain/shared/DateTime'

export type FacetecResultEntityProps = {
  id: FacetecResultId
  verificationId: KycVerificationId
  sessionId: FaceTecSessionId
  livenessStatus: StringValue
  enrollmentStatus: StringValue
  matchLevel?: NumberValue
  fullResponse?: JsonValue
  manualReviewRequired: BooleanValue
  createdAt: DateTimeValue

  kycVerification?: KycVerificationEntity
}

export class FacetecResultEntity extends AggregateRoot<'FacetecResultEntity', FacetecResultEntityProps> {
  get props(): FacetecResultEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getVerificationId() {
    return this._props.verificationId
  }

  getSessionId() {
    return this._props.sessionId
  }

  getLivenessStatus() {
    return this._props.livenessStatus
  }

  getEnrollmentStatus() {
    return this._props.enrollmentStatus
  }

  getMatchLevel() {
    return this._props.matchLevel
  }

  getFullResponse() {
    return this._props.fullResponse
  }

  isManualReviewRequired() {
    return this._props.manualReviewRequired
  }

  getCreatedAt() {
    return this._props.createdAt
  }

  getKycVerification() {
    return this._props.kycVerification
  }

  // Method to update liveness status
  updateLivenessStatus(status: StringValue): void {
    this._props.livenessStatus = status
  }

  // Method to update enrollment status
  updateEnrollmentStatus(status: StringValue): void {
    this._props.enrollmentStatus = status
  }

  // Method to update match level
  updateMatchLevel(matchLevel: NumberValue): void {
    this._props.matchLevel = matchLevel
  }

  // Method to set manual review flag
  setManualReviewRequired(required: BooleanValue): void {
    this._props.manualReviewRequired = required
  }

  // Method to update full response
  updateFullResponse(fullResponse: JsonValue): void {
    this._props.fullResponse = fullResponse
  }
} 