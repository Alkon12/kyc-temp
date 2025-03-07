import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { InvitationEntity, InvitationEntityProps } from './InvitationEntity'
import { BooleanValue } from '../shared/BooleanValue'
import { DateTimeValue } from '../shared/DateTime'
import { Email } from '@domain/shared/Email'
import { InvitationStatus } from './InvitationStatus'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { UserId } from '@domain/user/models/UserId'
import { CampaignId } from '@domain/shared/CampaignId'
import { BranchId } from '@domain/shared/BranchId'
import { PromotionId } from '@domain/shared/PromotionId'
import { UserFactory } from '@domain/user/UserFactory'
import { ProductFactory } from '@domain/product/ProductFactory'
import { ProspectFactory } from '@domain/prospect/ProspectFactory'
import { QuoteFactory } from '@domain/quote/QuoteFactory'
import { ApplicationFactory } from '@domain/application/ApplicationFactory'

export type InvitationArgs = Merge<
  InvitationEntityProps,
  {
    id?: UUID
  }
>

export class InvitationFactory {
  static fromDTO(dto: DTO<InvitationEntity>): InvitationEntity {
    return new InvitationEntity({
      id: new UUID(dto.id),
      firstName: dto.firstName ? new StringValue(dto.firstName) : undefined,
      lastName: dto.lastName ? new StringValue(dto.lastName) : undefined,
      email: dto.email ? new Email(dto.email) : undefined,
      phoneNumber: dto.phoneNumber ? new PhoneNumber(dto.phoneNumber) : undefined,
      hasUberAccount: dto.hasUberAccount ? new BooleanValue(dto.hasUberAccount) : new BooleanValue(false),

      productId: dto.productId ? new UUID(dto.productId) : undefined,
      isOnsite: dto.isOnsite ? new BooleanValue(dto.isOnsite) : new BooleanValue(false),
      referrerId: dto.referrerId ? new UserId(dto.referrerId) : undefined,
      campaignId: dto.campaignId ? new CampaignId(dto.campaignId) : undefined,
      branchId: dto.branchId ? new BranchId(dto.branchId) : undefined,
      promotionId: dto.promotionId ? new PromotionId(dto.promotionId) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      status: new InvitationStatus(dto.status),
      comments: dto.comments ? new StringValue(dto.comments) : undefined,
      prospectId: dto.prospectId ? new UUID(dto.prospectId) : undefined,
      quoteId: dto.quoteId ? new UUID(dto.quoteId) : undefined,
      applicationId: dto.applicationId ? new UUID(dto.applicationId) : undefined,

      referrer: dto.referrer ? UserFactory.fromDTO(dto.referrer) : undefined,
      product: dto.product ? ProductFactory.fromDTO(dto.product) : undefined,
      // branch: dto.branch ? BranchFactory.fromDTO(dto.branch) : undefined,
      // campaign: dto.campaign ? CampaignFactory.fromDTO(dto.campaign) : undefined,
      // promotion: dto.promotion ? PromotionFactory.fromDTO(dto.promotion) : undefined,
      prospect: dto.prospect ? ProspectFactory.fromDTO(dto.prospect) : undefined,
      quote: dto.quote ? QuoteFactory.fromDTO(dto.quote) : undefined,
      application: dto.application ? ApplicationFactory.fromDTO(dto.application) : undefined,
    })
  }

  static create(args: InvitationArgs): InvitationEntity {
    return new InvitationEntity({
      id: new UUID(),
      ...args,
    })
  }
}
