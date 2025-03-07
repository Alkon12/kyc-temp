import { AuthTokenRenewal } from './AuthService'

export interface GetTripsResponse {
  count: number
  limit: number
  trips: {
    fare: number
    dropoff: {
      timestamp: number
    }
    vehicle_id: string
    distance: number
    start_city: {
      latitude: number
      display_name: string
      longitude: number
    }
    status_changes: {
      status: string // accepted, driver_arrived, trip_began, completed
      timestamp: number
    }[]
    surge_multiplier: number
    pickup: {
      timestamp: number
    }
    driver_id: string
    status: string //  completed, ..
    duration: number
    trip_id: string
    currency_code: string // USD
  }[]
  offset: number
}

export interface UberService {
  getDriver(accessToken: string): Promise<object>
  searchDriverByEmail(email: string): Promise<object | null>
  searchDriverByPhoneNumber(countryCode: string, nationalPhoneNumber: string): Promise<object | null>
  refreshAccessToken(refreshToken: string): Promise<AuthTokenRenewal | null>
  getTrips(accessToken: string): Promise<GetTripsResponse>
  assignVehicle(accessToken: string, vehicleId: string, driverId: string): Promise<boolean>
  unassignVehicle(accessToken: string, vehicleId: string, driverId: string): Promise<boolean>
}
