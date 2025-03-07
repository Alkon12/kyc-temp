import { injectable } from 'inversify'
import { UnexpectedError } from '@domain/error/UnexpectedError'
import {
  TrackerDeviceStatus,
  TrackerService,
  TrackerTrip,
  TrackerTripScore,
} from '@/application/service/TrackerService'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class TrackerGraphile implements TrackerService {
  async currentVehicleStatus(deviceId: StringValue): Promise<TrackerDeviceStatus> {
    const url = `${process.env.TRACKER_GRAPHILE_URL}/graphql`
    console.log('>>> TRACKER URL', url)

    interface gqlResponse {
      data: {
        allDeviceSummaries: {
          nodes: {
            deviceId: number
            currentOdometer: number
            weeksSumDistance: number
            uberWeeksSumDistance: number //  TODO move out from here
            uberWeeksUsage: number //  TODO move out from here
            status: string
            motion: string // TODO fix scoring to parse Boolean
            ignition: string // TODO fix scoring to parse Boolean
            speed: number
            lastLat: number
            lastLon: number
            lastUpdate: string
            lastConnection: string
            drivingScore: number //  TODO move out from here
            totalEvents: number //  TODO move out from here
            totalTrips: number //  TODO move out from here
          }[]
        }
      }
    }

    const query = `#graphql
      query allDeviceSummaries($deviceId: Int!) {
        allDeviceSummaries(condition: {deviceId: $deviceId}) {
         nodes {
            deviceId
            currentOdometer
            weeksSumDistance
            uberWeeksSumDistance
            uberWeeksUsage
            status
            motion
            ignition
            speed
            lastLat
            lastLon
            lastUpdate
            lastConnection
            drivingScore
            totalEvents
            totalTrips
          } 
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
          },
        }),
      })

      const responseJson = (await trackerResponse.json()) as gqlResponse

      console.log('Tracker responseJson', responseJson)

      const node =
        responseJson.data.allDeviceSummaries.nodes.length > 0 ? responseJson.data.allDeviceSummaries.nodes[0] : null

      if (!node) {
        throw new UnexpectedError(`Scoring v1, expected Node[0] not found in response`)
      }

      const deviceStatus: TrackerDeviceStatus = {
        currentOdometer: node.currentOdometer ? new NumberValue(node.currentOdometer) : undefined,
        status: node.status ? new StringValue(node.status) : undefined,
        motion: new BooleanValue(node.motion === 'true' ? true : false),
        ignition: new BooleanValue(node.ignition === 'true' ? true : false),
        speed: node.speed ? new NumberValue(Math.floor(node.speed)) : undefined,
        lastLat: node.lastLat ? new NumberValue(node.lastLat) : undefined,
        lastLon: node.lastLon ? new NumberValue(node.lastLon) : undefined,
        lastUpdate: node.lastUpdate ? new DateTimeValue(node.lastUpdate) : undefined,
        lastConnection: node.lastConnection ? new DateTimeValue(node.lastConnection) : undefined,
        weeksSumDistance: node.weeksSumDistance ? new NumberValue(node.weeksSumDistance) : undefined,
        drivingScore: node.drivingScore ? new NumberValue(node.drivingScore) : undefined,
        totalEvents: node.totalEvents ? new NumberValue(node.totalEvents) : undefined,
        totalTrips: node.totalTrips ? new NumberValue(node.totalTrips) : undefined,
        uberWeeksSumDistance: node.uberWeeksSumDistance ? new NumberValue(node.uberWeeksSumDistance) : undefined,
        uberWeeksUsage: node.uberWeeksUsage ? new NumberValue(node.uberWeeksUsage) : undefined,
      }

      return Promise.resolve(deviceStatus)
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Scoring v1 Inform Trip error`)
    }
  }

  async trips(deviceId: StringValue, date: DateTimeValue): Promise<TrackerTrip[]> {
    const url = `${process.env.TRACKER_GRAPHILE_URL}/graphql`
    console.log('>>> TRACKER URL', url)

    interface gqlResponse {
      data: {
        allTrips: {
          nodes: {
            tripId: string
            averageSpeed: number
            date: string
            deviceId: number
            deviceName: string
            distance: number
            duration: number
            startAddress: string
            startLat: number
            startLon: number
            startOdometer: number
            startTime: string
            endAddress: string
            endLat: number
            endLon: number
            endOdometer: number
            endTime: string
            maxSpeed: number
            tripscoreByScoreId: {
              contextScore: string
              distance: number
              drivingScore: number
              drivingScoreContextualized: number
              totalEvents: number
              validPositions: string
              events: string
            }
          }[]
        }
      }
    }

    const query = `#graphql
      query allTrips($deviceId: Int!, $date: Date!) {
        allTrips(condition: {deviceId: $deviceId, date: $date}) {
          nodes {
            tripId
            averageSpeed
            date
            deviceId
            deviceName
            distance
            duration
            startAddress
            startLat
            startLon
            startOdometer
            startTime  
            endAddress
            endLat
            endLon
            endOdometer
            endTime
            maxSpeed     
            tripscoreByScoreId {
              contextScore
              distance
              drivingScore
              drivingScoreContextualized
              totalEvents
              validPositions
              events
            }
          }
        }
      }
    `

    try {
      const tripsResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            deviceId: parseInt(deviceId.toDTO()),
            date: '2024/06/24',
          },
        }),
      })

      const responseJson = (await tripsResponse.json()) as gqlResponse

      console.log('Tracker Trips responseJson', responseJson)

      if (responseJson.data.allTrips.nodes.length === 0) {
        throw new UnexpectedError(`Scoring v1, expected Node[0] not found in response`)
      }
      const trips = responseJson.data.allTrips.nodes

      return trips.map((trip) => {
        const score: TrackerTripScore = {
          contextScore: trip.tripscoreByScoreId.contextScore
            ? new StringValue(trip.tripscoreByScoreId.contextScore)
            : undefined,
          distance: trip.tripscoreByScoreId.distance ? new NumberValue(trip.tripscoreByScoreId.distance) : undefined,
          drivingScore: trip.tripscoreByScoreId.drivingScore
            ? new NumberValue(trip.tripscoreByScoreId.drivingScore)
            : undefined,
          drivingScoreContextualized: trip.tripscoreByScoreId.drivingScoreContextualized
            ? new NumberValue(trip.tripscoreByScoreId.drivingScoreContextualized)
            : undefined,
          totalEvents: trip.tripscoreByScoreId.totalEvents
            ? new NumberValue(trip.tripscoreByScoreId.totalEvents)
            : undefined,
          validPositions: trip.tripscoreByScoreId.validPositions
            ? new StringValue(trip.tripscoreByScoreId.validPositions)
            : undefined,
          events: trip.tripscoreByScoreId.events ? new StringValue(trip.tripscoreByScoreId.events) : undefined,
        }

        return {
          tripId: trip.tripId ? new StringValue(trip.tripId) : undefined,
          averageSpeed: trip.averageSpeed ? new NumberValue(trip.averageSpeed) : undefined,
          date: trip.date ? new DateTimeValue(trip.date) : undefined,
          deviceId: trip.deviceId ? new NumberValue(trip.deviceId) : undefined,
          deviceName: trip.deviceName ? new StringValue(trip.deviceName) : undefined,
          distance: trip.distance ? new NumberValue(trip.distance) : undefined,
          duration: trip.duration ? new NumberValue(trip.duration) : undefined,
          startAddress: trip.startAddress ? new StringValue(trip.startAddress) : undefined,
          startLat: trip.startLat ? new NumberValue(trip.startLat) : undefined,
          startLon: trip.startLon ? new NumberValue(trip.startLon) : undefined,
          startOdometer: trip.startOdometer ? new NumberValue(trip.startOdometer) : undefined,
          startTime: trip.startTime ? new DateTimeValue(trip.startTime) : undefined,
          endAddress: trip.endAddress ? new StringValue(trip.endAddress) : undefined,
          endLat: trip.endLat ? new NumberValue(trip.endLat) : undefined,
          endLon: trip.endLon ? new NumberValue(trip.endLon) : undefined,
          endOdometer: trip.endOdometer ? new NumberValue(trip.endOdometer) : undefined,
          endTime: trip.endTime ? new DateTimeValue(trip.endTime) : undefined,
          maxSpeed: trip.maxSpeed ? new NumberValue(trip.maxSpeed) : undefined,
          score,
        }
      })
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Scoring v1 Inform Trip error`)
    }
  }
}
