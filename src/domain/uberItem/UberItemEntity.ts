import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { UberItemCategoryEntity } from '@domain/uberItemCategory/UberItemCategoryEntity'

export type UberItemEntityProps = {
  id: NumberValue
  uberItem: StringValue
  uberItemCategoryId: NumberValue
  paymentItemId?: NumberValue // SmartIT ConceptoPagoId
  usageTypeId?: NumberValue // Tipo de Aplicación
  contentCategoryId?: NumberValue // SubCategoria Expediente
  billItemId?: NumberValue // Id Concepto Factura

  uberItemCategory?: UberItemCategoryEntity
}

export class UberItemEntity extends AggregateRoot<'UberItemEntity', UberItemEntityProps> {
  get props(): UberItemEntityProps {
    return this._props
  }
}
