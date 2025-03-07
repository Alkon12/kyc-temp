import { NumberValue } from "@domain/shared/NumberValue"
import { StringValue } from "@domain/shared/StringValue"
import { VehicleColorSmartIt } from "./VehicleColorSmartIt"
import { GPSSmartIt } from "./GPSSmartIt"
import { AggregateRoot } from "@domain/kernel/AggregateRoot"


export type VehicleSmartItEntityProps = {
  serialNumber: StringValue
  inventoryId: NumberValue
  vehicleSmartItId: NumberValue
  brand: StringValue
  model: StringValue
  version: StringValue
  year: NumberValue
  cost: NumberValue
  versionId: NumberValue
  status: StringValue
  numberPlates: StringValue
  color: VehicleColorSmartIt
  gps?: GPSSmartIt
}

export class VehicleSmartItEntity extends AggregateRoot<'VehicleSmartItEntity', VehicleSmartItEntityProps> {
  get props(): VehicleSmartItEntityProps {
    return this._props
  }
}