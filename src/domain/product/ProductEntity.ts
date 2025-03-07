import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UUID } from '@domain/shared/UUID'
import { DateTimeValue } from '../shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { ScoringMark } from '@domain/scoring/models/ScoringMark'
import { BooleanValue } from '@domain/shared/BooleanValue'

export type ProductEntityProps = {
  id: UUID
  title: StringValue
  brand: StringValue
  model: StringValue
  year?: NumberValue
  series: StringValue
  picture?: StringValue
  defaultWeeklyPrice?: NumberValue
  defaultLeasingPeriod?: NumberValue
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
  estimatedAcceleration?: NumberValue
  engineType?: StringValue
  estimatedHorsepower?: NumberValue
  estimatedTopSpeedKmH?: NumberValue
  numberOfSpeeds?: NumberValue
  turbo?: StringValue
  cylinders?: StringValue
  fuelType?: StringValue
  liters?: NumberValue
  estimatedTorqueLbFt?: NumberValue
  startStop?: StringValue
  frontElectricWindows?: StringValue
  transmission?: StringValue
  idversion?: NumberValue
  isActive: BooleanValue
  safetyFeatures?: StringValue
  confortFeatures?: StringValue
  highwayFuelEconomy?: NumberValue
  cityFuelEconomy?: NumberValue
}

export class ProductEntity extends AggregateRoot<'ProductEntity', ProductEntityProps> {
  get props(): ProductEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }

  getBrand() {
    return this._props.brand
  }

  getModel() {
    return this._props.model
  }

  getVersion() {
    return this._props.idversion
  }

  isActive() {
    return this._props.isActive.toDTO()
  }

  getDefaultWeeklyPrice(): NumberValue | undefined {
    return this._props.defaultWeeklyPrice
  }

  getDefaultLeasingPeriod(): NumberValue | undefined {
    return this._props.defaultLeasingPeriod
  }
}
