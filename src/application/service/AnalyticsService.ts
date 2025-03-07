import { BooleanValue } from '@domain/shared/BooleanValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'

export interface AnalyticsDailySummary {
  trips: NumberValue
  tripsDailyDistance: NumberValue
  tripsDailyScoring: NumberValue
  tripsEndOdometer: NumberValue
  uberDailyDistance: NumberValue
  uberFare: NumberValue
  uberTrips: NumberValue
  uberUsage: NumberValue
}

export interface AnalyticsWeeklySummary {
  trips: NumberValue
  tripsWeeklyDistance: NumberValue
  tripsWeeklyScoring: NumberValue
  tripsWeeklyEndOdometer: NumberValue
  uberWeeklyDistance: NumberValue
  uberFares: NumberValue
  uberTrips: NumberValue
  uberUsage: NumberValue
}

export interface AnalyticsVehicleUsageSummary {
  nodeId: StringValue
  deviceId: NumberValue
  currentOdometer: NumberValue
  weeksSumDistance: NumberValue
  uberWeeksSumDistance: NumberValue
  uberWeeksUsage: NumberValue
  lastLat: NumberValue
  lastLon: NumberValue
  lastUpdate: DateTimeValue
  motion: BooleanValue
  ignition: BooleanValue
  speed: NumberValue
  course: NumberValue
  status: StringValue
  lastConnection: DateTimeValue
  drivingScore: NumberValue
  totalEvents: NumberValue
  totalTrips: NumberValue
}

export interface AnalyticsService {
  dailySummary(deviceId: StringValue, date: DateTimeValue): Promise<AnalyticsDailySummary>
  weeklySummary(deviceId: StringValue, weekNumber: NumberValue): Promise<AnalyticsWeeklySummary>
  vehicleUsageSummary(deviceId: StringValue): Promise<AnalyticsVehicleUsageSummary>
}
