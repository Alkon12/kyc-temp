import { NumberValue } from "@domain/shared/NumberValue"
import { StringValue } from "@domain/shared/StringValue"
import { SIMCardSmartIt } from "./SIMCardSmartIt"
import { AggregateRoot } from "@domain/kernel/AggregateRoot"

export type GPSSmartItProps = {
    id: NumberValue
    partNumber: StringValue
    serialNumber: StringValue
    imei: StringValue
    simCard?: SIMCardSmartIt
}


export class GPSSmartIt extends AggregateRoot<'GPSSmartIt', GPSSmartItProps> {
    get props(): GPSSmartItProps {
        return this._props
    }
}

/* 
type GPS {
  Id: Int
  NumeroParte: Int
  NumeroSerie: String
  IMEI: String
  SIMCard: SIMCard
}
*/