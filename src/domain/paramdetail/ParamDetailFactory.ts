import { StringValue } from '@domain/shared/StringValue'
import { ParamDetailEntity } from './ParamDetailEntity'
import { DTO } from '@domain/kernel/DTO'
import { DateTimeValue } from '@domain/shared/DateTime'

export class ParamDetailFactory {
  static fromDTO(dto: DTO<ParamDetailEntity>): ParamDetailEntity {
    return new ParamDetailEntity({
      id: new StringValue(dto.id),
      value: new StringValue(dto.value),
      idParam: dto.idParam ? new StringValue(dto.idParam) : undefined,
      createdAt: new DateTimeValue(dto.createdAt),
    })
  }
}
