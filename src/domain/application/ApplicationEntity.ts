import { AddressEntity } from '@domain/address/AddressEntity'
import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { OfferEntity } from '@domain/offer/OfferEntity'
import { ProductEntity } from '@domain/product/ProductEntity'
import { QuoteEntity } from '@domain/quote/QuoteEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { TaskEntity } from '@domain/task/TaskEntity'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'
import { VehicleEntity } from '@domain/vehicle/models/VehicleEntity'
import { ContentKey } from '@domain/content/ContentKey'
import { ApplicationChecklistEntity } from '@domain/applicationChecklist/ApplicationChecklistEntity'
import { StringValue } from '@domain/shared/StringValue'
import { ApplicationStatus } from './ApplicationStatus'
import { ProspectEntity } from '@domain/prospect/ProspectEntity'

export type ApplicationEntityProps = {
  id: UUID
  prospectId: UUID
  friendlyId?: StringValue
  userId: UserId
  productId: UUID
  offerId: UUID
  quoteId: UUID
  vehicleId?: UUID
  addressId?: UUID
  kycDriverEngagedAt?: DateTimeValue
  kycFinishedAt?: DateTimeValue
  finishedAt?: DateTimeValue
  expiredAt?: DateTimeValue
  createdAt: DateTimeValue
  updatedAt?: DateTimeValue
  inactivityStatementReason?: StringValue

  idpersona?: string
  quoteSmartItId?: string
  contractId?: string
  contractDate?: DateTimeValue

  identificationCard?: ContentKey
  identificationCardReverse?: ContentKey
  selfiePicture?: ContentKey
  driversLicense?: ContentKey
  driversLicenseReverse?: ContentKey
  incomeStatement?: ContentKey
  inactivityStatement?: ContentKey
  taxIdentification?: ContentKey
  addressProof?: ContentKey

  status?: ApplicationStatus

  user?: UserEntity
  prospect?: ProspectEntity
  product?: ProductEntity
  offer?: OfferEntity
  vehicle?: VehicleEntity
  quote?: QuoteEntity
  address?: AddressEntity

  tasks?: TaskEntity[]
  checklist?: ApplicationChecklistEntity[]
}

export class ApplicationEntity extends AggregateRoot<'ApplicationEntity', ApplicationEntityProps> {
  get props(): ApplicationEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }

  getFriendlyId() {
    return this._props.friendlyId
  }

  getQuoteId(): UUID {
    return this._props.quoteId
  }

  getOfferId(): UUID {
    return this._props.offerId
  }

  getOffer() {
    return this._props.offer
  }

  getProductId(): UUID {
    return this._props.productId
  }

  getProspectId(): UUID {
    return this._props.prospectId
  }

  getVehicleId() {
    return this._props.vehicleId
  }

  getUserId() {
    return this._props.userId
  }

  getQuote() {
    return this._props.quote
  }

  getChecklist() {
    return this._props.checklist
  }

  getIdentificationCard() {
    return this._props.identificationCard
  }

  getIdPersona(): string | undefined {
    return this._props.idpersona
  }

  getQuoteSmartItId(): string | undefined {
    return this._props.quoteSmartItId
  }

  getContractId(): string | undefined {
    return this._props.contractId
  }

  getAddressId(): UUID | undefined {
    return this._props.addressId
  }

  getContractDate(): DateTimeValue | undefined {
    return this._props.contractDate
  }

  hasDriverEngaged() {
    return !!this._props.kycDriverEngagedAt
  }

  hasKycFinished() {
    return !!this._props.kycFinishedAt
  }

  isFinished() {
    return !!this._props.finishedAt
  }

  isActive() {
    return !this.isFinished()
  }

  markDriverAsEngaged() {
    this._props.kycDriverEngagedAt = new DateTimeValue(new Date())
  }

  markKycAsComplete() {
    this._props.kycFinishedAt = new DateTimeValue(new Date())
  }

  markAsComplete() {
    this._props.finishedAt = new DateTimeValue(new Date())
  }

  revoke() {
    this._props.finishedAt = new DateTimeValue(new Date())
  }

  expire() {
    this._props.finishedAt = new DateTimeValue(new Date())
    this._props.expiredAt = new DateTimeValue(new Date())
  }

  setIdentificationCard(contentKey: ContentKey) {
    this._props.identificationCard = contentKey
  }

  setIdentificationCardReverse(contentKey: ContentKey) {
    this._props.identificationCardReverse = contentKey
  }

  setSelfiePicture(contentKey: ContentKey) {
    this._props.selfiePicture = contentKey
  }

  setDriversLicense(contentKey: ContentKey) {
    this._props.driversLicense = contentKey
  }

  setDriversLicenseReverse(contentKey: ContentKey) {
    this._props.driversLicenseReverse = contentKey
  }

  setIncomeStatement(contentKey: ContentKey) {
    this._props.incomeStatement = contentKey
  }

  setInactivityStatement(contentKey: ContentKey) {
    this._props.inactivityStatement = contentKey
  }

  setTaxIdentification(contentKey: ContentKey) {
    this._props.taxIdentification = contentKey
  }

  setAddress(addressId: UUID) {
    this._props.addressId = addressId
  }

  setAddressProof(contentKey: ContentKey) {
    this._props.addressProof = contentKey
  }

  setVehicle(vehicleId: UUID) {
    this._props.vehicleId = vehicleId
  }

  clearVehicle() {
    this._props.vehicleId = undefined
    this._props.vehicle = undefined
  }

  setInactivityStatementReason(reason: StringValue) {
    this._props.inactivityStatementReason = reason
  }

  setIdPersona(idpersona: string) {
    this._props.idpersona = idpersona
  }

  setQuoteSmartItId(quoteSmartItId: string) {
    this._props.quoteSmartItId = quoteSmartItId
  }

  setContractId(contractId: string) {
    this._props.contractId = contractId
  }

  setContractDate(contractDate: DateTimeValue) {
    this._props.contractDate = contractDate
  }
}
