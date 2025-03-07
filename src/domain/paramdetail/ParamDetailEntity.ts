import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { DateTimeValue } from '@domain/shared/DateTime'
import { StringValue } from '@domain/shared/StringValue'

export type ParamDetailEntityProps = {
  id: StringValue
  value: StringValue
  idParam?: StringValue
  createdAt: DateTimeValue
}

export class ParamDetailEntity extends AggregateRoot<'ParamDetailEntity', ParamDetailEntityProps> {
  get props(): ParamDetailEntityProps {
    return this.props
  }
}
