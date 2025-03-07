import { BooleanValue } from '@domain/shared/BooleanValue'
import { BranchId } from '@domain/shared/BranchId'
import { CampaignId } from '@domain/shared/CampaignId'
import { Email } from '@domain/shared/Email'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { PromotionId } from '@domain/shared/PromotionId'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'

export interface CreateInvitationArgs {
  email?: Email
  phoneNumber?: PhoneNumber
  firstName?: StringValue
  lastName?: StringValue
  hasUberAccount?: BooleanValue
  productId?: UUID
  isOnsite?: BooleanValue
  referrerId?: UserId
  campaignId?: CampaignId
  branchId?: BranchId
  promotionId?: PromotionId
  comments?: StringValue
}
