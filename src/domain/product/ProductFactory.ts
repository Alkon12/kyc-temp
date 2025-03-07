import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { ProductEntity, ProductEntityProps } from './ProductEntity'
import { DateTimeValue } from '../shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'

export type ProductArgs = Merge<
  ProductEntityProps,
  {
    id?: UUID
    isActive?: BooleanValue
  }
>

export class ProductFactory {
  static fromDTO(dto: DTO<ProductEntity>): ProductEntity {
    return new ProductEntity({
      id: new UUID(dto.id),
      title: new StringValue(dto.title),
      brand: new StringValue(dto.brand),
      model: new StringValue(dto.model),
      year: dto.year ? new NumberValue(dto.year) : undefined,
      series: new StringValue(dto.series),
      picture: dto.picture ? new StringValue(dto.picture) : undefined,
      defaultWeeklyPrice: dto.defaultWeeklyPrice ? new NumberValue(dto.defaultWeeklyPrice) : undefined,
      defaultLeasingPeriod: dto.defaultLeasingPeriod ? new NumberValue(dto.defaultLeasingPeriod) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      estimatedAcceleration: dto.estimatedAcceleration ? new NumberValue(dto.estimatedAcceleration) : undefined,
      engineType: dto.engineType ? new StringValue(dto.engineType) : undefined,
      estimatedHorsepower: dto.estimatedHorsepower ? new NumberValue(dto.estimatedHorsepower) : undefined,
      estimatedTopSpeedKmH: dto.estimatedTopSpeedKmH ? new NumberValue(dto.estimatedTopSpeedKmH) : undefined,
      numberOfSpeeds: dto.numberOfSpeeds ? new NumberValue(dto.numberOfSpeeds) : undefined,
      turbo: dto.turbo ? new StringValue(dto.turbo) : undefined,
      isActive: dto.isActive ? new BooleanValue(dto.isActive) : new BooleanValue(false),
      cylinders: dto.cylinders ? new StringValue(dto.cylinders) : undefined,
      fuelType: dto.fuelType ? new StringValue(dto.fuelType) : undefined,
      liters: dto.liters ? new NumberValue(dto.liters) : undefined,
      estimatedTorqueLbFt: dto.estimatedTorqueLbFt ? new NumberValue(dto.estimatedTorqueLbFt) : undefined,
      startStop: dto.startStop ? new StringValue(dto.startStop) : undefined,
      frontElectricWindows: dto.frontElectricWindows ? new StringValue(dto.frontElectricWindows) : undefined,
      transmission: dto.transmission ? new StringValue(dto.transmission) : undefined,
      idversion: dto.idversion ? new NumberValue(dto.idversion) : undefined,
      safetyFeatures: dto.safetyFeatures ? new StringValue(dto.safetyFeatures) : undefined,
      confortFeatures: dto.confortFeatures ? new StringValue(dto.confortFeatures) : undefined,
      highwayFuelEconomy: dto.highwayFuelEconomy ? new NumberValue(dto.highwayFuelEconomy) : undefined,
      cityFuelEconomy: dto.cityFuelEconomy ? new NumberValue(dto.cityFuelEconomy) : undefined,
    })
  }

  static create(args: ProductArgs): ProductEntity {
    return new ProductEntity({
      id: new UUID(),
      isActive: new BooleanValue(false),
      ...args,
    })
  }
}
