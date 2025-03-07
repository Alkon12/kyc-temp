import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { ParamDetailEntity } from '@domain/paramdetail/ParamDetailEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { StringValue } from '@domain/shared/StringValue'
import { ParamDetail } from '@prisma/client'

export type ParamHeaderEntityProps = {
  id: StringValue
  description: StringValue
  createdAt: DateTimeValue
  paramDetails: ParamDetailEntity[]
}

export class ParamHeaderEntity extends AggregateRoot<'ParamHeaderEntity', ParamHeaderEntityProps> {
  get props(): ParamHeaderEntityProps {
    return this.props
  }
}
