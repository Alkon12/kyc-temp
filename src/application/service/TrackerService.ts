import { BooleanValue } from '@domain/shared/BooleanValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'

export interface TrackerDeviceStatus {
  currentOdometer?: NumberValue
  status?: StringValue
  motion?: BooleanValue
  ignition?: BooleanValue
  speed?: NumberValue
  lastLat?: NumberValue
  lastLon?: NumberValue
  lastUpdate?: DateTimeValue
  lastConnection?: DateTimeValue

  weeksSumDistance?: NumberValue //  TODO move out from here
  drivingScore?: NumberValue //  TODO move out from here
  totalEvents?: NumberValue //  TODO move out from here
  totalTrips?: NumberValue //  TODO move out from her

  uberWeeksUsage?: NumberValue
  uberWeeksSumDistance?: NumberValue
}

export interface TrackerTrip {
  tripId?: StringValue
  averageSpeed?: NumberValue
  date?: DateTimeValue
  deviceId?: NumberValue
  deviceName?: StringValue
  distance?: NumberValue
  duration?: NumberValue
  startAddress?: StringValue
  startLat?: NumberValue
  startLon?: NumberValue
  startOdometer?: NumberValue
  startTime?: DateTimeValue
  endAddress?: StringValue
  endLat?: NumberValue
  endLon?: NumberValue
  endOdometer?: NumberValue
  endTime?: DateTimeValue
  maxSpeed?: NumberValue
  score?: TrackerTripScore
}

export interface TrackerTripScore {
  contextScore?: StringValue
  distance?: NumberValue
  drivingScore?: NumberValue
  drivingScoreContextualized?: NumberValue
  totalEvents?: NumberValue
  validPositions?: StringValue
  events?: StringValue
}

export interface TrackerService {
  currentVehicleStatus(deviceId: StringValue): Promise<TrackerDeviceStatus>
  trips(deviceId: StringValue, date: DateTimeValue): Promise<TrackerTrip[]>
}
