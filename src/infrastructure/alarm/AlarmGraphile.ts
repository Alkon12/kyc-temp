import { injectable } from 'inversify'
import { UnexpectedError } from '@domain/error/UnexpectedError'
import { Alarm, AlarmService } from '@/application/service/AlarmService'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class AlarmGraphile implements AlarmService {
  async list(deviceId: StringValue, status: StringValue): Promise<Alarm[]> {
    const url = `${process.env.ALARM_GRAPHILE_URL}/graphql`
    console.log('>>> ALARM URL', url)

    interface gqlResponse {
      data: {
        allAlarms: {
          nodes: {
            alertLevel: string
            category: string
            date: string
            deviceId: number
            id: string
            lastUpdate: string
            metadata: string
            status: string
            subcategory: string
          }[]
        }
      }
    }

    const query = `#graphql
      query allAlarms($deviceId: Int!, $status: String!) {
        allAlarms(condition: {deviceId: $deviceId, status: $status}) {
          nodes {
            alertLevel
            category
            date
            deviceId
            id
            lastUpdate
            metadata
            status
            subcategory
          }
        }
      }
    `

    try {
      const scoringResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            deviceId: parseInt(deviceId.toDTO()),
            status: status.toDTO(),
          },
        }),
      })

      const responseJson = (await scoringResponse.json()) as gqlResponse

      console.log('Alarms responseJson', responseJson)

      const nodes = responseJson.data.allAlarms.nodes
      if (!nodes || nodes.length === 0) {
        return []
      }

      const alarms: Alarm[] = nodes.map((node) => ({
        alertLevel: node.alertLevel ? new StringValue(node.alertLevel) : undefined,
        category: node.category ? new StringValue(node.category) : undefined,
        date: node.date ? new DateTimeValue(node.date) : undefined,
        deviceId: node.deviceId ? new NumberValue(node.deviceId) : undefined,
        id: node.id ? new UUID(node.id) : undefined,
        lastUpdate: node.lastUpdate ? new DateTimeValue(node.lastUpdate) : undefined,
        // metadata: node.metadata ? new StringValue(node.metadata) : undefined,
        status: node.status ? new StringValue(node.status) : undefined,
        subcategory: node.subcategory ? new StringValue(node.subcategory) : undefined,
      }))

      return Promise.resolve(alarms)
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Alarms v1 error`)
    }
  }
}
