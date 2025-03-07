import { AggregateRoot } from "@domain/kernel/AggregateRoot"
import { NumberValue } from "@domain/shared/NumberValue"
import { StringValue } from "@domain/shared/StringValue"

export type SIMCardSmartItProps = {
    id: NumberValue
    serialNumber: StringValue
    phoneNumber: StringValue
}

export class SIMCardSmartIt extends AggregateRoot<'SIMCardSmartIt', SIMCardSmartItProps> {
    get props(): SIMCardSmartItProps {
        return this._props
    }
}