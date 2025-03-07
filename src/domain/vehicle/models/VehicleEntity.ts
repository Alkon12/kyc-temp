import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UUID } from '@domain/shared/UUID'
import { DateTimeValue } from '../../shared/DateTime'
import { ProductEntity } from '@domain/product/ProductEntity'
import { VehicleColor } from './VehicleColor'
import { StringValue } from '@domain/shared/StringValue'
import { IMEI } from '@domain/shared/IMEI'
import { VehicleVin } from '@domain/shared/VehicleVin'

export type VehicleEntityProps = {
  id: UUID
  vin?: VehicleVin
  trackerDeviceId?: StringValue
  trackerDeviceSim?: StringValue
  trackerDeviceImei?: IMEI
  contractId?: StringValue // TODO move to Leasing!!
  color?: VehicleColor
  productId?: UUID
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue

  product?: ProductEntity
}

export class VehicleEntity extends AggregateRoot<'VehicleEntity', VehicleEntityProps> {
  get props(): VehicleEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }

  getTrackerDeviceId() {
    return this._props.trackerDeviceId
  }

  // TODO move to Leasing!!
  getContractId() {
    return this._props.contractId
  }

  setTrackerDevice(trackerDeviceId: StringValue) {
    this._props.trackerDeviceId = trackerDeviceId
  }

  setTrackerDeviceSim(trackerDeviceSim: StringValue) {
    this._props.trackerDeviceSim = trackerDeviceSim
  }

  setTrackerDeviceImei(trackerDeviceImei: IMEI) {
    this._props.trackerDeviceImei = trackerDeviceImei
  }
}
