import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { VehicleEntity, VehicleEntityProps } from './models/VehicleEntity'
import { DateTimeValue } from '../shared/DateTime'
import { ProductFactory } from '@domain/product/ProductFactory'
import { VehicleColor } from './models/VehicleColor'
import { StringValue } from '@domain/shared/StringValue'
import { IMEI } from '@domain/shared/IMEI'
import { VehicleVin } from '@domain/shared/VehicleVin'

export type VehicleArgs = Merge<
  VehicleEntityProps,
  {
    id?: UUID
  }
>

export class VehicleFactory {
  static fromDTO(dto: DTO<VehicleEntity>): VehicleEntity {
    return new VehicleEntity({
      id: new UUID(dto.id),
      productId: dto.productId ? new UUID(dto.productId) : undefined,
      vin: dto.vin ? new VehicleVin(dto.vin) : undefined,
      trackerDeviceId: dto.trackerDeviceId ? new StringValue(dto.trackerDeviceId) : undefined,
      trackerDeviceSim: dto.trackerDeviceSim ? new StringValue(dto.trackerDeviceSim) : undefined,
      trackerDeviceImei: dto.trackerDeviceImei ? new IMEI(dto.trackerDeviceImei) : undefined,
      contractId: dto.contractId ? new StringValue(dto.contractId) : undefined,
      color: dto.color ? new VehicleColor(dto.color) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      product: dto.product ? ProductFactory.fromDTO(dto.product) : undefined,
    })
  }

  static create(args: VehicleArgs): VehicleEntity {
    return new VehicleEntity({
      id: new UUID(),
      ...args,
    })
  }
}
