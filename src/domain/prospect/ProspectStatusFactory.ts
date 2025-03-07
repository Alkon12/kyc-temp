import { DTO } from '@domain/kernel/DTO'
import { ProspectStatusEntity } from './ProspectStatusEntity'
import { StringValue } from '@domain/shared/StringValue'
import { ProspectFactory } from './ProspectFactory'
import { ProspectStatusId } from './models/ProspectStatusId'
import { NumberValue } from '@domain/shared/NumberValue'
import { BooleanValue } from '@domain/shared/BooleanValue'

export class ProspectStatusFactory {
  static fromDTO(dto: DTO<ProspectStatusEntity>): ProspectStatusEntity {
    return new ProspectStatusEntity({
      id: new ProspectStatusId(dto.id),
      name: new StringValue(dto.name),
      order: dto.order ? new NumberValue(dto.order) : undefined,
      manualAssignable: new BooleanValue(dto.manualAssignable),

      prospects: dto.prospects ? dto.prospects.map((t) => ProspectFactory.fromDTO(t)) : [],
    })
  }
}
