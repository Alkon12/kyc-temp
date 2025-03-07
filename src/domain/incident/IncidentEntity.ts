import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { UberItemEntity } from '@domain/uberItem/UberItemEntity'

export type IncidentEntityProps = {
  companyId: NumberValue
  id: NumberValue
  uberItemId: NumberValue
  contractId: NumberValue
  registeredAt: DateTimeValue
  date: DateTimeValue // Fecha Incidencia
  amount: NumberValue // Importe
  // typeId: NumberValue // IdConcepto
  // type: StringValue // Concepto
  // category: StringValue // SubCategoria

  uberItem?: UberItemEntity
}

export class IncidentEntity extends AggregateRoot<'IncidentEntity', IncidentEntityProps> {
  get props(): IncidentEntityProps {
    return this._props
  }
}
