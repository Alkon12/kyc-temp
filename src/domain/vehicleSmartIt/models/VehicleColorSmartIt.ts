import { AggregateRoot } from "@domain/kernel/AggregateRoot"
import { StringValue } from "@domain/shared/StringValue"

export type VehicleColorSmartItProps = {
    internal: StringValue
    external: StringValue
}

export class VehicleColorSmartIt extends AggregateRoot<'VehicleColorSmartIt', VehicleColorSmartItProps>{
    get props(): VehicleColorSmartItProps {
        return this._props
    }
}