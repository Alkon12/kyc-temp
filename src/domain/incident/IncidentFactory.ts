import { IncidentEntity } from './IncidentEntity'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UberItemEntity } from '@domain/uberItem/UberItemEntity'
import { UberItemCategoryEntity } from '@domain/uberItemCategory/UberItemCategoryEntity'
import { StringValue } from '@domain/shared/StringValue'

export interface IncidentSmartItResponse {
  FechaRegistro: string
  IdAgencia: number
  Id: number
  IdContrato: number
  Fecha: string
  IdConcepto: number
  Concepto: string
  SubCategoria: string
  Importe: number
}

export class IncidentFactory {
  static fromDTO(dto: IncidentSmartItResponse): IncidentEntity {
    return new IncidentEntity({
      registeredAt: new DateTimeValue(dto.FechaRegistro),
      id: new NumberValue(dto.Id),
      companyId: new NumberValue(dto.IdAgencia),
      contractId: new NumberValue(dto.IdContrato),
      date: new DateTimeValue(dto.Fecha),
      uberItemId: new NumberValue(dto.IdConcepto),
      // type: new StringValue(dto.Concepto),
      // category: new StringValue(dto.SubCategoria),
      amount: new NumberValue(dto.Importe),

      uberItem: new UberItemEntity({
        id: new NumberValue(dto.IdConcepto),
        uberItem: new StringValue(dto.Concepto),
        uberItemCategoryId: new NumberValue(0),
        uberItemCategory: new UberItemCategoryEntity({
          id: new NumberValue(0),
          category: new StringValue(dto.SubCategoria),
        }),
      }),
    })
  }
}
