import {
  AnalyticsDailySummary,
  AnalyticsService,
  AnalyticsVehicleUsageSummary,
  AnalyticsWeeklySummary,
} from '@/application/service/AnalyticsService'
import { UnexpectedError } from '@domain/error'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { strict } from 'assert'
import { injectable } from 'inversify'

@injectable()
export class AnalyticsGraphile implements AnalyticsService {
  async dailySummary(deviceId: StringValue, date: DateTimeValue): Promise<AnalyticsDailySummary> {
    const url = `${process.env.ANALYTICS_GRAPHILE_URL}/graphql`
    console.log('>>> ANALYTICS URL', url)

    interface gqlResponse {
      data: {
        tripdailysummaryByDeviceIdAndDate: {
          trips: number
          tripsDailyDistance: number
          tripsDailyScoring: number
          tripsEndOdometer: number
          uberDailyDistance: number
          uberFare: number
          uberTrips: number
          uberUsage: number
        }
      }
    }

    const query = `#graphql
      query tripdailysummaryByDeviceIdAndDate($date: Date!, $deviceId: Int!) {
        tripdailysummaryByDeviceIdAndDate(date: $date, deviceId: $deviceId) {
          trips
          tripsDailyDistance
          tripsDailyScoring
          tripsEndOdometer
          uberDailyDistance
          uberFare
          uberTrips
          uberUsage
        }
      }
    `

    try {
      const trackerResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            deviceId: parseInt(deviceId.toDTO()),
            date: date.toDTO(),
          },
        }),
      })

      const responseJson = (await trackerResponse.json()) as gqlResponse

      console.log('Daily Summary responseJson', responseJson)

      const summary = responseJson.data.tripdailysummaryByDeviceIdAndDate
      if (!summary) {
        //throw new UnexpectedError(`Analytics v1, expected Node[0] not found in response`)
        return Promise.resolve({
          trips: new NumberValue(0),
          tripsDailyDistance: new NumberValue(0),
          tripsDailyScoring: new NumberValue(0),
          tripsEndOdometer: new NumberValue(0),
          uberDailyDistance: new NumberValue(0),
          uberFare: new NumberValue(0),
          uberTrips: new NumberValue(0),
          uberUsage: new NumberValue(0),
        })
      }

      return Promise.resolve({
        trips: new NumberValue(summary.trips),
        tripsDailyDistance: new NumberValue(summary.tripsDailyDistance),
        tripsDailyScoring: new NumberValue(summary.tripsDailyScoring),
        tripsEndOdometer: new NumberValue(summary.tripsEndOdometer),
        uberDailyDistance: new NumberValue(summary.uberDailyDistance),
        uberFare: new NumberValue(summary.uberFare),
        uberTrips: new NumberValue(summary.uberTrips),
        uberUsage: new NumberValue(summary.uberUsage),
      })
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Analytics v1 Daily Summary error`)
    }
  }

  async weeklySummary(deviceId: StringValue, weekNumber: NumberValue): Promise<AnalyticsWeeklySummary> {
    const url = `${process.env.ANALYTICS_GRAPHILE_URL}/graphql`
    console.log('>>> ANALYTICS URL', url)

    interface gqlResponse {
      data: {
        tripweeklysummaryByWeekNumberAndDeviceId: {
          trips: number
          tripsWeeklyDistance: number
          tripsWeeklyScoring: number
          tripsWeeklyEndOdometer: number
          uberWeeklyDistance: number
          uberFares: number
          uberTrips: number
          uberUsage: number
        }
      }
    }

    const query = `#graphql
      query tripweeklysummaryByWeekNumberAndDeviceId($weekNumber: Int!, $deviceId: Int!) {
        tripweeklysummaryByWeekNumberAndDeviceId(weekNumber: $weekNumber, deviceId: $deviceId) {
          trips
          tripsWeeklyDistance
          tripsWeeklyScoring
          tripsWeeklyEndOdometer
          uberWeeklyDistance
          uberFares
          uberTrips
          uberUsage
        }
      }
    `

    try {
      const trackerResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            deviceId: parseInt(deviceId.toDTO()),
            weekNumber: weekNumber.toDTO(),
          },
        }),
      })

      const responseJson = (await trackerResponse.json()) as gqlResponse

      console.log('Daily Summary responseJson', responseJson)

      const summary = responseJson.data.tripweeklysummaryByWeekNumberAndDeviceId
      if (!summary) {
        throw new UnexpectedError(`Analytics v1, expected Node[0] not found in response`)
      }

      return Promise.resolve({
        trips: new NumberValue(summary.trips),
        tripsWeeklyDistance: new NumberValue(summary.tripsWeeklyDistance),
        tripsWeeklyScoring: new NumberValue(summary.tripsWeeklyScoring),
        tripsWeeklyEndOdometer: new NumberValue(summary.tripsWeeklyEndOdometer),
        uberWeeklyDistance: new NumberValue(summary.uberWeeklyDistance),
        uberFares: new NumberValue(summary.uberFares),
        uberTrips: new NumberValue(summary.uberTrips),
        uberUsage: new NumberValue(summary.uberUsage),
      })
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Analytics v1 Weekly Summary error`)
    }
  }

  async vehicleUsageSummary(deviceId: StringValue): Promise<AnalyticsVehicleUsageSummary> {
    const url = `${process.env.ANALYTICS_GRAPHILE_URL}/graphql`
    console.log('>>> ANALYTICS URL', url)

    interface gqlResponse {
      data: {
        deviceSummaryByDeviceId: {
          nodeId: string
          deviceId: number
          currentOdometer: number
          weeksSumDistance: number
          uberWeeksSumDistance: number
          uberWeeksUsage: number
          lastLat: number
          lastLon: number
          lastUpdate: string
          motion: boolean
          ignition: boolean
          speed: number
          course: number
          status: string
          lastConnection: string
          drivingScore: number
          totalEvents: number
          totalTrips: number
        }
      }
    }

    const query = `#graphql
      query DeviceSummaryByDeviceId($deviceId: Int!) {
        deviceSummaryByDeviceId(deviceId: $deviceId) {
          nodeId
          deviceId
          currentOdometer
          weeksSumDistance
          uberWeeksSumDistance
          uberWeeksUsage
          lastLat
          lastLon
          lastUpdate
          motion
          ignition
          speed
          course
          status
          lastConnection
          drivingScore
          totalEvents
          totalTrips
        }
      }
    `

    try {
      const deviceSummaryResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            deviceId: parseInt(deviceId.toDTO()),
          },
        }),
      })

      const responseJson = (await deviceSummaryResponse.json()) as gqlResponse
      const summary = responseJson.data.deviceSummaryByDeviceId

      if (!summary) {
        throw new UnexpectedError(`Analytics v1, expected Node[0] not found in response`)
      }

      return Promise.resolve({
        nodeId: new StringValue(summary.nodeId),
        deviceId: new NumberValue(summary.deviceId),
        currentOdometer: new NumberValue(summary.currentOdometer),
        weeksSumDistance: new NumberValue(summary.weeksSumDistance),
        uberWeeksSumDistance: new NumberValue(summary.uberWeeksSumDistance),
        uberWeeksUsage: new NumberValue(summary.uberWeeksUsage),
        lastLat: new NumberValue(summary.lastLat),
        lastLon: new NumberValue(summary.lastLon),
        lastUpdate: new DateTimeValue(summary.lastUpdate),
        motion: new BooleanValue(summary.motion),
        ignition: new BooleanValue(summary.ignition),
        speed: new NumberValue(summary.speed),
        course: new NumberValue(summary.course),
        status: new StringValue(summary.status),
        lastConnection: new DateTimeValue(summary.lastConnection),
        drivingScore: new NumberValue(summary.drivingScore),
        totalEvents: new NumberValue(summary.totalEvents),
        totalTrips: new NumberValue(summary.totalTrips),
      })
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Analytics v1 Daily Summary error`)
    }
  }
}
