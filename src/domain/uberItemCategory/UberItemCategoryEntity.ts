import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'

export type UberItemCategoryEntityProps = {
  id: NumberValue
  category: StringValue
  categoryId?: NumberValue // SubCategoria

  parentCateogory?: UberItemCategoryEntity
}

export class UberItemCategoryEntity extends AggregateRoot<'UberItemCategoryEntity', UberItemCategoryEntityProps> {
  get props(): UberItemCategoryEntityProps {
    return this._props
  }
}
