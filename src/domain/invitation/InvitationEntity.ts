import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { BooleanValue } from '../shared/BooleanValue'
import { DateTimeValue } from '../shared/DateTime'
import { Email } from '@domain/shared/Email'
import { InvitationStatus } from './InvitationStatus'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { BranchId } from '@domain/shared/BranchId'
import { CampaignId } from '@domain/shared/CampaignId'
import { PromotionId } from '@domain/shared/PromotionId'
import { UserId } from '@domain/user/models/UserId'
import { UserEntity } from '@domain/user/models/UserEntity'
import { ProductEntity } from '@domain/product/ProductEntity'
import { ProspectEntity } from '@domain/prospect/ProspectEntity'
import { QuoteEntity } from '@domain/quote/QuoteEntity'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'

export type InvitationEntityProps = {
  id: UUID
  friendlyId?: StringValue
  firstName?: StringValue
  lastName?: StringValue
  email?: Email
  phoneNumber?: PhoneNumber
  productId?: UUID
  isOnsite?: BooleanValue
  referrerId?: UserId
  campaignId?: CampaignId
  branchId?: BranchId
  promotionId?: PromotionId
  comments?: StringValue
  prospectId?: UUID
  quoteId?: UUID
  applicationId?: UUID

  hasUberAccount?: BooleanValue

  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue

  status: InvitationStatus
  referrer?: UserEntity
  product?: ProductEntity
  // branch?: BranchEntity
  // campaign?: CampaignEntity
  // promotion?: PromotionEntity
  prospect?: ProspectEntity
  quote?: QuoteEntity
  application?: ApplicationEntity
}

export class InvitationEntity extends AggregateRoot<'InvitationEntity', InvitationEntityProps> {
  get props(): InvitationEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getFriendlyId() {
    return this._props.friendlyId
  }

  hasUberAccount(): boolean {
    return !!this._props.hasUberAccount?.toDTO()
  }

  isSent(): boolean {
    return this._props.status.sameValueAs(InvitationStatus.SENT)
  }

  isAccepted(): boolean {
    return this._props.status.sameValueAs(InvitationStatus.ACCEPTED)
  }

  isExpired(): boolean {
    return this._props.status.sameValueAs(InvitationStatus.EXPIRED)
  }

  getEmail() {
    return this._props.email
  }

  getFirstName() {
    return this._props.firstName
  }

  getLastName() {
    return this._props.lastName
  }

  getPhoneNumber() {
    return this._props.phoneNumber
  }

  getReferrerId() {
    return this._props.referrerId
  }

  getReferrer() {
    return this._props.referrer
  }

  getProductId() {
    return this._props.productId
  }

  setHasUberAccount(hasUberAccount: boolean) {
    this._props.hasUberAccount = new BooleanValue(hasUberAccount)
  }

  setIsOnsite(isOnsite: boolean) {
    this._props.isOnsite = new BooleanValue(isOnsite)
  }

  setStatus(status: InvitationStatus) {
    this._props.status = status
  }

  setProspectId(id: UUID) {
    this._props.prospectId = id
  }

  setQuoteId(id: UUID) {
    this._props.quoteId = id
  }

  setApplicationId(id: UUID) {
    this._props.applicationId = id
  }

  getLink() {
    return `${process.env.NEXTAUTH_URL}/invitation/${this.getId().toDTO()}/landing`
  }
}
