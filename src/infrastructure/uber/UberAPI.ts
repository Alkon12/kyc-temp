import { GetTripsResponse, UberService } from '@/application/service/UberService'
import { injectable } from 'inversify'
import { AuthTokenRenewal } from '@/application/service/AuthService'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { UnexpectedError } from '@domain/error'

// TODO move to ENV
const UBER_API_VEHICLE_SUPPLIERS_V1_URL = 'https://api.uber.com/v1/vehicle-suppliers'
const UBER_API_PARTNERS_V2_URL = 'https://api.uber.com/v1/partners'
const UBER_AUTH_V2_URL = 'https://auth.uber.com/oauth/v2'

@injectable()
export class UberAPI implements UberService {
  async getDriver(accessToken: string): Promise<object> {
    // TODO type response

    const response = await fetch(`${UBER_API_PARTNERS_V2_URL}/me`, {
      method: 'GET',
      headers: this._prepareHeaders(accessToken),
    })
    if (!response.ok) {
      throw new UnexpectedError(`Failed to fetch driver info:  ${response.statusText}`)
    }

    const data = await response.json()

    return {
      ...data,
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthTokenRenewal | null> {
    try {
      const params = new URLSearchParams({
        client_id: process.env.UBER_CLIENT_ID as string,
        client_secret: process.env.UBER_CLIENT_SECRET as string,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })

      const response = await fetch(`${UBER_AUTH_V2_URL}/token`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: params,
      })

      const authJson = await response.json()

      if (!response.ok) {
        throw authJson
      }

      return {
        accessToken: new StringValue(authJson.access_token),
        accessTokenExpiresAt: new NumberValue(Date.now() + authJson.expires_in * 1000),
        refreshToken: new StringValue(authJson.refresh_token),
      }
    } catch (error) {
      console.log(error)

      return null
    }
  }

  async searchDriverByEmail(email: string): Promise<object | null> {
    const clientToken = process.env.UBER_PARTNER_TOKEN as string

    try {
      const response = await fetch(`${UBER_API_VEHICLE_SUPPLIERS_V1_URL}/drivers/search`, {
        method: 'POST',
        headers: this._prepareHeaders(clientToken),
        body: JSON.stringify({
          filters: {
            email,
          },
        }),
      })
      if (response.status === 404) {
        return null
      }
      if (!response.ok) {
        throw new UnexpectedError(`Driver found but unexpected error:  ${response.statusText}`)
      }

      const data = await response.json()

      // console.log('DATA', data)

      return {
        ...data,
      }
    } catch (error) {
      console.log(error)

      return null
    }
  }

  async searchDriverByPhoneNumber(countryCode: string, nationalPhoneNumber: string): Promise<object | null> {
    const clientToken = process.env.UBER_PARTNER_TOKEN as string

    try {
      const response = await fetch(`${UBER_API_VEHICLE_SUPPLIERS_V1_URL}/drivers/search`, {
        method: 'POST',
        headers: this._prepareHeaders(clientToken),
        body: JSON.stringify({
          filters: {
            phoneNumber: {
              countryCode,
              nationalPhoneNumber,
            },
          },
        }),
      })
      if (response.status === 404) {
        return null
      }
      if (!response.ok) {
        throw new UnexpectedError(`Driver found but unexpected error:  ${response.statusText}`)
      }

      const data = await response.json()

      // console.log('DATA', data)

      return {
        ...data,
      }
    } catch (error) {
      console.log(error)

      return null
    }
  }

  async getTrips(accessToken: string): Promise<GetTripsResponse> {
    const response = await fetch(`${UBER_API_PARTNERS_V2_URL}/trips`, {
      method: 'GET',
      headers: this._prepareHeaders(accessToken),
    })
    if (!response.ok) {
      throw new UnexpectedError(`Failed to fetch trips data from uber:  ${response.statusText}`)
    }

    const data = await response.json()
    return {
      ...data,
    }
  }

  async assignVehicle(accessToken: string, vehicleId: string, driverId: string): Promise<boolean> {
    const response = await fetch(`${UBER_API_VEHICLE_SUPPLIERS_V1_URL}/vehicles/${vehicleId.trim()}/assign`, {
      method: 'POST',
      headers: this._prepareHeaders(accessToken),
      body: JSON.stringify({
        driver_id: driverId,
      }),
    })
    if (!response.ok) {
      throw new UnexpectedError(`Failed to assign vehicle:  ${response.statusText}`)
    }

    return true
  }

  async unassignVehicle(accessToken: string, vehicleId: string, driverId: string): Promise<boolean> {
    const response = await fetch(`${UBER_API_VEHICLE_SUPPLIERS_V1_URL}/vehicles/${vehicleId.trim()}/unassign`, {
      method: 'POST',
      headers: this._prepareHeaders(accessToken),
      body: JSON.stringify({
        driver_id: driverId,
      }),
    })
    if (!response.ok) {
      throw new UnexpectedError(`Failed to unassign vehicle:  ${response.statusText}`)
    }

    return true
  }

  private _prepareHeaders(accessToken: string): Headers {
    return new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json',
    })
  }
}
