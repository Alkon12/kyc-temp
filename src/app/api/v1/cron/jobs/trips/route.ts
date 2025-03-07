import { NextResponse } from 'next/server'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { UserService } from '@service/UserService'
import AbstractLeasingService from '@domain/leasing/LeasingService'
import { UberService } from '@/application/service/UberService'
import AbstractTripService from '@domain/trip/TripService'
import { UUID } from '@domain/shared/UUID'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import dayjs from 'dayjs'
import { ScoringService } from '@/application/service/ScoringService'

export async function POST() {
  const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)
  const uberService = container.get<UberService>(DI.UberService)
  const tripService = container.get<AbstractTripService>(DI.TripService)
  const scoringService = container.get<ScoringService>(DI.ScoringService)

  console.log('Cron Job - TRIPS')

  const leasings = await leasingService.getActive()

  await Promise.all(
    leasings.map(async (leasing) => {
      const user = leasing.getUser()
      if (user) {
        const accounts = user?.getAccounts()
        const account = accounts && accounts.length > 0 ? accounts[0] : null
        if (account) {
          let accessToken = account.getAccessToken()?.toDTO()
          if (accessToken) {
            // const refreshToken = uberAccount.getRefreshToken()
            // if(!refreshToken) {
            // throw new UnexpectedError('No refresh token for this User Uber Account')
            // }

            // // TODO move this from here
            // const tokenRefresh = await this._uberService.refreshAccessToken(refreshToken.toDTO())
            // if(tokenRefresh) {
            // await this._userRepository.updateAccountTokens(
            //     new UserId(props.userId),
            //     AccountType.OAUTH,
            //     AccountProvider.UBER,
            //     tokenRefresh
            // )

            // accessToken = tokenRefresh.accessToken
            // }
            // if(!accessToken) {
            // throw new UnexpectedError('No Uber access token could be fetched or renewed for the User')
            // }

            const tripsResponse = await uberService.getTrips(accessToken)
            tripsResponse.trips
              .filter((t) => t.status === 'completed')
              .map(async (trip) => {
                // console.log('Cron Job - TRIP', trip)

                const driverId = user.getDriverId()
                // console.log('Cron Job - USER DriverId vs TRIP DriverID', driverId?.toDTO(), trip.driver_id)

                const existingTrip = await tripService.getById(new UUID(trip.trip_id))
                if (!existingTrip) {
                  const acceptedAt = trip.status_changes.find((sch) => sch.status === 'accepted')?.timestamp
                  const arrivedAt = trip.status_changes.find((sch) => sch.status === 'driver_arrived')?.timestamp

                  const createdTrip = await tripService.create({
                    id: new UUID(trip.trip_id),
                    userId: user?.getId(),
                    vehicleId: leasing.getVehicleId(),
                    fareCurrency: trip.currency_code ? new StringValue(trip.currency_code) : undefined,
                    fareAmount: trip.fare ? new NumberValue(trip.fare) : undefined,
                    distance: trip.distance ? new NumberValue(trip.distance) : undefined,
                    duration: trip.duration ? new NumberValue(trip.duration) : undefined,
                    acceptedAt: acceptedAt ? new DateTimeValue(dayjs.unix(acceptedAt)) : undefined,
                    arrivedAt: arrivedAt ? new DateTimeValue(dayjs.unix(arrivedAt)) : undefined,
                    pickupAt: trip.pickup?.timestamp ? new DateTimeValue(dayjs.unix(trip.pickup.timestamp)) : undefined,
                    dropoffAt: trip.dropoff?.timestamp
                      ? new DateTimeValue(dayjs.unix(trip.dropoff.timestamp))
                      : undefined,
                    pickupLat: trip.start_city.latitude ? new NumberValue(trip.start_city.latitude) : undefined,
                    pickupLng: trip.start_city.longitude ? new NumberValue(trip.start_city.longitude) : undefined,
                  })

                  const trackerDeviceId = leasing.getVehicle()?.getTrackerDeviceId()
                  if (trackerDeviceId) {
                    await scoringService.informTrip(trackerDeviceId, trip)
                  }
                }
              })
          }
        }
      }
    }),
  )

  return NextResponse.json({
    status: 200,
    // addedTrips: trips.map(q => ({
    //     status: q.status,
    //     leasingKey: q.leasingKey.toDTO(),
    //     storaget.toDTO(),
    // }))
  })
}
