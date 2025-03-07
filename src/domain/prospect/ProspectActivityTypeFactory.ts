import { DTO } from '@domain/kernel/DTO'
import { ProspectActivityTypeEntity } from './ProspectActivityTypeEntity'
import { StringValue } from '@domain/shared/StringValue'
import { ProspectActivityTypeId } from './models/ProspectActivityTypeId'
import { ProspectActivityFactory } from './ProspectActivityFactory'

export class ProspectActivityTypeFactory {
  static fromDTO(dto: DTO<ProspectActivityTypeEntity>): ProspectActivityTypeEntity {
    return new ProspectActivityTypeEntity({
      id: new ProspectActivityTypeId(dto.id),
      name: new StringValue(dto.name),

      prospectActivity: dto.prospectActivity ? dto.prospectActivity.map((t) => ProspectActivityFactory.fromDTO(t)) : [],
    })
  }
}
