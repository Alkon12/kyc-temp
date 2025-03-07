import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { LeasingEntity, LeasingEntityProps } from './LeasingEntity'
import { DateTimeValue } from '../shared/DateTime'
import { ProductFactory } from '@domain/product/ProductFactory'
import { UserFactory } from '@domain/user/UserFactory'
import { VehicleFactory } from '@domain/vehicle/VehicleFactory'
import { LocationFactory } from '@domain/location/LocationFactory'
import { UserId } from '@domain/user/models/UserId'

export type LeasingArgs = Merge<
  LeasingEntityProps,
  {
    id?: UUID
  }
>

export class LeasingFactory {
  static fromDTO(dto: DTO<LeasingEntity>): LeasingEntity {
    return new LeasingEntity({
      id: new UUID(dto.id),
      userId: new UserId(dto.userId),
      vehicleId: new UUID(dto.vehicleId),
      locationId: dto.locationId ? new UUID(dto.locationId) : undefined,
      productId: dto.productId ? new UUID(dto.productId) : undefined,
      startDate: new DateTimeValue(dto.startDate),
      endDate: new DateTimeValue(dto.endDate),
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      expiredAt: dto.expiredAt ? new DateTimeValue(dto.expiredAt) : undefined,
      user: dto.user ? UserFactory.fromDTO(dto.user) : undefined,
      vehicle: dto.vehicle ? VehicleFactory.fromDTO(dto.vehicle) : undefined,
      location: dto.location ? LocationFactory.fromDTO(dto.location) : undefined,
      product: dto.product ? ProductFactory.fromDTO(dto.product) : undefined,
    })
  }

  static create(args: LeasingArgs): LeasingEntity {
    return new LeasingEntity({
      id: new UUID(),
      ...args,
    })
  }
}
