import OnboardScoreResult from '@domain/scoring/OnboardScoreResult'
import { JsonValue } from '@domain/shared/JsonValue'
import { StringValue } from '@domain/shared/StringValue'

export type OnboardScoringProps = {
  products: {
    ref?: string
    weeklyFare: number
  }[]
}

export interface OnboardScoringResponse {
  engineVersion: StringValue
  errors?: {
    error: StringValue
  }[]
  results: OnboardScoreResult[]
  raw?: JsonValue
}

export interface InformTripProps {
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
    status: string
    timestamp: number
  }[]
  surge_multiplier: number
  pickup: {
    timestamp: number
  }
  driver_id: string
  status: string
  duration: number
  trip_id: string
  currency_code: string
}

export interface ScoringService {
  scoreOnboard(token: string, props: OnboardScoringProps): Promise<OnboardScoringResponse>
  informTrip(deviceId: StringValue, props: InformTripProps): Promise<{ raw?: JsonValue }>
}
