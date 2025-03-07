import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { NumberValue } from '@domain/shared/NumberValue'
import { LocationEntity } from './LocationEntity'

export class LocationFactory {
  static fromDTO(dto: DTO<LocationEntity>): LocationEntity {
    return new LocationEntity({
      id: new UUID(dto.id),
      name: new StringValue(dto.name),
      order: dto.order ? new NumberValue(dto.order) : undefined,
    })
  }
}
