import { DTO } from '@domain/kernel/DTO'
import { UUID } from '@domain/shared/UUID'
import { StringValue } from '@domain/shared/StringValue'
import { AddressEntity, AddressEntityProps } from './AddressEntity'

export type AddressArgs = Merge<
  AddressEntityProps,
  {
    id?: UUID
  }
>

export class AddressFactory {
  static fromDTO(dto: DTO<AddressEntity>): AddressEntity {
    return new AddressEntity({
      id: new UUID(dto.id),
      street: new StringValue(dto.street),
      extNumber: new StringValue(dto.extNumber),
      intNumber: new StringValue(dto.intNumber),
      zipCode: new StringValue(dto.zipCode),
      district: new StringValue(dto.district),
      city: new StringValue(dto.city),
      state: new StringValue(dto.state),
      country: new StringValue(dto.country),
      latitude: new StringValue(dto.latitude),
      longitude: new StringValue(dto.longitude),
      real_time_latitude: new StringValue(dto.real_time_latitude || ''),
      real_time_longitude: new StringValue(dto.real_time_longitude || '')
    })
  }

  static create(args: AddressArgs): AddressEntity {
    return new AddressEntity({
      ...args,
      id: new UUID(),
    })
  }
}
