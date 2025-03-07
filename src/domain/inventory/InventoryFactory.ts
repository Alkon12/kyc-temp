import { StringValue } from '@domain/shared/StringValue'
import { DTO } from '@domain/kernel/DTO'
import { InventoryEntity } from './InventoryEntity'
import { NumberValue } from '@domain/shared/NumberValue'

export class InventoryFactory {
  static fromDTO(dto: DTO<InventoryEntity>): InventoryEntity {
    return new InventoryEntity({
      vin: new StringValue(dto.vin),
      ref: new StringValue(dto.ref),
      brand: new StringValue(dto.brand),
      model: new StringValue(dto.model),
      version: new StringValue(dto.version),
      year: new NumberValue(dto.year ?? 0),
      price: new NumberValue(dto.price),
      gps: new StringValue(dto.gps),
      sim: new StringValue(dto.sim),
    })
  }
}
