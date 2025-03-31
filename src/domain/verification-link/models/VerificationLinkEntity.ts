import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { VerificationLinkId } from './VerificationLinkId'
import { UUID } from '@domain/shared/UUID'

export type VerificationLinkStatus = 'active' | 'expired' | 'invalidated' | 'accepted' | 'rejected' | 'facetec_completed' | 'contact_submitted'

export type VerificationLinkEntityProps = {
  id: VerificationLinkId
  verificationId: UUID
  token: StringValue
  status: StringValue
  expiresAt?: StringValue
  lastAccessedAt?: StringValue
  accessCount: StringValue
  createdAt: StringValue
  updatedAt: StringValue
  
  kycVerification?: any // Placeholder for KycVerificationEntity
}

export class VerificationLinkEntity extends AggregateRoot<'VerificationLinkEntity', VerificationLinkEntityProps> {
  get props(): VerificationLinkEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getVerificationId() {
    return this._props.verificationId
  }

  getToken() {
    return this._props.token
  }

  getStatus() {
    return this._props.status
  }

  getExpiresAt() {
    return this._props.expiresAt
  }

  getLastAccessedAt() {
    return this._props.lastAccessedAt
  }

  getAccessCount() {
    return this._props.accessCount
  }

  isActive(): boolean {
    const validStatuses = ['active', 'accepted', 'rejected', 'facetec_completed', 'contact_submitted'];
    return validStatuses.includes(this._props.status._value);
  }

  isExpired(): boolean {
    if (this._props.status._value === 'expired') {
      return true
    }

    if (this._props.expiresAt && new Date(this._props.expiresAt._value) < new Date()) {
      const tokenPreview = this._props.token._value.substring(0, 8) + '...'
      console.log(`Enlace con token ${tokenPreview} ha expirado (fecha actual > ${this._props.expiresAt._value})`)
      this.expire()
      return true
    }

    return false
  }

  isValid(): boolean {
    return this.isActive() && !this.isExpired()
  }

  incrementAccessCount() {
    const currentCount = parseInt(this._props.accessCount._value)
    this._props.accessCount = new StringValue((currentCount + 1).toString())
    this._props.lastAccessedAt = new StringValue(new Date().toISOString())
    return this
  }

  expire() {
    this._props.status = new StringValue('expired')
    this._props.updatedAt = new StringValue(new Date().toISOString())
    return this
  }

  invalidate() {
    this._props.status = new StringValue('invalidated')
    this._props.updatedAt = new StringValue(new Date().toISOString())
    return this
  }

  updateStatus(status: string) {
    this._props.status = new StringValue(status)
    this._props.updatedAt = new StringValue(new Date().toISOString())
    return this
  }
} 