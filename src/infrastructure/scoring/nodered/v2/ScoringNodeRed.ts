import {
  InformTripProps,
  OnboardScoringResponse,
  OnboardScoringProps,
  ScoringService,
} from '@/application/service/ScoringService'
import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { UnexpectedError } from '@domain/error'
import { ScoringMark } from '@domain/scoring/models/ScoringMark'
import { ScoringResolution } from '@domain/scoring/models/ScoringResolution'
import { JsonValue } from '@domain/shared/JsonValue'
import { StringValue } from '@domain/shared/StringValue'
import { injectable } from 'inversify'

type ScoringResponse = {
  riskEngineVersion: string
  errors?: ScoringError[]
  driverInfo: ScoringDriverInfo
  scoringResults: ScoringResult[]
}

type ScoringError = {
  property?: string
  error: string
}

type ScoringDriverInfo = {
  driver_id: string
  first_name: string
  last_name: string
  phone_number: string
  email: string
  picture: string
  rating: number
  promo_code: string
  activation_status: string
  date_of_birth: string
  city_name: string
  partner_role: string
  city_identifier: number
  earnings_retention: {
    active: boolean
  }
}

type ScoringResult = {
  ref: string
  verdict: {
    resolution: string
    finalScore: string
    checkList: string[]
    date: string
  }
  score: object
  details: object
  analysis: object
}

@injectable()
export class ScoringNodeRed implements ScoringService {
  async scoreOnboard(token: string, props: OnboardScoringProps): Promise<OnboardScoringResponse> {
    const url = `${process.env.SCORING_NODERED_V2_URL}/onboarding/scoring`
    console.log('>>> SCORING URL', url)

    const jsonBody = {
      uberDriverAccessToken: token,
      products: props.products.map((p) => ({
        ref: p.ref,
        weeklyFare: p.weeklyFare,
      })),
    }

    try {
      const scoringResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      })

      const responseJson = (await scoringResponse.json()) as ScoringResponse

      console.log('Scoring responseJson', responseJson) // TODO remove

      if (responseJson.errors && responseJson.errors.length > 0) {
        console.error(
          'ScoringNodeRed errors',
          responseJson.errors.map((e) => e.error),
        )
        return Promise.resolve({
          results: [],
          errors: responseJson.errors.map((e) => ({
            error: new StringValue(e.error),
          })),
          raw: new JsonValue(responseJson),
          engineVersion: new StringValue(responseJson.riskEngineVersion),
        })
      }

      return Promise.resolve({
        results: responseJson.scoringResults.map((r) => ({
          ref: new StringValue(r.ref),
          verdict: new JsonValue(r.verdict || {}),
          brief: new JsonValue(r.score || {}),
          details: new JsonValue(r.details || []),
          analysis: new JsonValue(r.analysis || {}),
          mark: new ScoringMark(r.verdict.finalScore),
          resolution: new ScoringResolution(r.verdict.resolution),
          checkList: r.verdict.checkList.map((i) => new ChecklistId(i)),
        })),
        engineVersion: new StringValue(responseJson.riskEngineVersion),
        raw: new JsonValue(responseJson),
      })
    } catch (error) {
      console.error(error)
      return Promise.resolve({
        results: [],
        errors: [
          {
            error: new StringValue(`Scoring v2 error: ${(error as Error).message}`),
          },
        ],
        engineVersion: new StringValue('?'),
      })
    }
  }
  async informTrip(deviceId: StringValue, props: InformTripProps): Promise<{ raw?: JsonValue }> {
    const url = `${process.env.SCORING_NODERED_V2_URL}/webhook/trip`
    console.log(`INFORM TRIP URL: ${url}, DeviceID: ${deviceId}`)

    const jsonBody = {
      deviceId: parseInt(deviceId.toDTO()), // TODO update Scoring to accept string
      trip: props,
    }

    try {
      const scoringResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      })

      const responseJson = await scoringResponse.json()

      return Promise.resolve({
        raw: new JsonValue(responseJson),
      })
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Scoring v2 Inform Trip error`)
    }
  }
}
