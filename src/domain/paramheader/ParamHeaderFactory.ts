import { DTO } from '@domain/kernel/DTO'
import { ParamHeaderEntity } from './ParamHeaderEntity'
import { StringValue } from '@domain/shared/StringValue'
import { ParamDetailFactory } from '@domain/paramdetail/ParamDetailFactory'
import { DateTimeValue } from '@domain/shared/DateTime'

export class ParamHeaderFactory {
  static fromDTO(dto: DTO<ParamHeaderEntity>): ParamHeaderEntity {
    return new ParamHeaderEntity({
      id: new StringValue(dto.id),
      description: new StringValue(dto.description),
      createdAt: new DateTimeValue(dto.createdAt),
      paramDetails: dto.paramDetails.map((o) => ParamDetailFactory.fromDTO(o)),
    })
  }
}
