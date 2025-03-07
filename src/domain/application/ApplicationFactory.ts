import { UUID } from '@domain/shared/UUID'
import { ApplicationEntity, ApplicationEntityProps } from './ApplicationEntity'
import { DTO } from '@domain/kernel/DTO'
import { DateTimeValue } from '@domain/shared/DateTime'
import { ProductFactory } from '@domain/product/ProductFactory'
import { OfferFactory } from '@domain/offer/OfferFactory'
import { UserFactory } from '@domain/user/UserFactory'
import { QuoteFactory } from '@domain/quote/QuoteFactory'
import { UserId } from '@domain/user/models/UserId'
import { TaskFactory } from '@domain/task/TaskFactory'
import { AddressFactory } from '@domain/address/AddressFactory'
import { ContentKey } from '@domain/content/ContentKey'
import { ApplicationChecklistFactory } from '@domain/applicationChecklist/ApplicationChecklistFactory'
import { VehicleFactory } from '@domain/vehicle/VehicleFactory'
import { StringValue } from '@domain/shared/StringValue'
import { ApplicationStatus } from './ApplicationStatus'
import { ProspectFactory } from '@domain/prospect/ProspectFactory'

export type ApplicationArgs = Merge<
  ApplicationEntityProps,
  {
    id?: UUID
    createdAt?: DateTimeValue
  }
>
export class ApplicationFactory {
  static fromDTO(dto: DTO<ApplicationEntity>): ApplicationEntity {
    return new ApplicationEntity({
      id: new UUID(dto.id),
      friendlyId: dto.friendlyId ? new StringValue(dto.friendlyId) : undefined,
      userId: new UserId(dto.userId),
      prospectId: new UUID(dto.prospectId),
      productId: new UUID(dto.productId),
      offerId: new UUID(dto.offerId),
      quoteId: new UUID(dto.quoteId),
      vehicleId: dto.vehicleId ? new UUID(dto.vehicleId) : undefined,
      addressId: dto.addressId ? new UUID(dto.addressId) : undefined,
      createdAt: new DateTimeValue(dto.createdAt),
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      kycFinishedAt: dto.kycFinishedAt ? new DateTimeValue(dto.kycFinishedAt) : undefined,
      kycDriverEngagedAt: dto.kycDriverEngagedAt ? new DateTimeValue(dto.kycDriverEngagedAt) : undefined,
      finishedAt: dto.finishedAt ? new DateTimeValue(dto.finishedAt) : undefined,
      expiredAt: dto.expiredAt ? new DateTimeValue(dto.expiredAt) : undefined,
      inactivityStatementReason: dto.inactivityStatementReason
        ? new StringValue(dto.inactivityStatementReason)
        : undefined,

      identificationCard: dto.identificationCard ? new ContentKey(dto.identificationCard) : undefined,
      identificationCardReverse: dto.identificationCardReverse ? new ContentKey(dto.identificationCardReverse) : undefined,
      selfiePicture: dto.selfiePicture ? new ContentKey(dto.selfiePicture) : undefined,
      driversLicense: dto.driversLicense ? new ContentKey(dto.driversLicense) : undefined,
      driversLicenseReverse: dto.driversLicenseReverse ? new ContentKey(dto.driversLicenseReverse) : undefined,
      incomeStatement: dto.incomeStatement ? new ContentKey(dto.incomeStatement) : undefined,
      inactivityStatement: dto.inactivityStatement ? new ContentKey(dto.inactivityStatement) : undefined,
      taxIdentification: dto.taxIdentification ? new ContentKey(dto.taxIdentification) : undefined,
      addressProof: dto.addressProof ? new ContentKey(dto.addressProof) : undefined,

      status: dto.status ? new ApplicationStatus(dto.status) : undefined,

      user: dto.user ? UserFactory.fromDTO(dto.user) : undefined,
      prospect: dto.prospect ? ProspectFactory.fromDTO(dto.prospect) : undefined,
      product: dto.product ? ProductFactory.fromDTO(dto.product) : undefined,
      vehicle: dto.vehicle ? VehicleFactory.fromDTO(dto.vehicle) : undefined,
      offer: dto.offer ? OfferFactory.fromDTO(dto.offer) : undefined,
      quote: dto.quote ? QuoteFactory.fromDTO(dto.quote) : undefined,
      address: dto.address ? AddressFactory.fromDTO(dto.address) : undefined,
      checklist: dto.checklist ? dto.checklist.map((c) => ApplicationChecklistFactory.fromDTO(c)) : undefined,
      tasks: dto.tasks ? dto.tasks.map((o) => TaskFactory.fromDTO(o)) : undefined,

      idpersona: dto.idpersona,
      quoteSmartItId: dto.quoteSmartItId,
      contractId: dto.contractId,
      contractDate: dto.contractDate ? new DateTimeValue(dto.contractDate) : undefined,
    })
  }

  static create(args: ApplicationArgs): ApplicationEntity {
    return new ApplicationEntity({
      ...args,
      id: new UUID(),
      createdAt: new DateTimeValue(new Date()),
    })
  }
}
