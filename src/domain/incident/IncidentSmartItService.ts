import { NumberValue } from '@domain/shared/NumberValue'
import { IncidentEntity } from './IncidentEntity'
import { StringValue } from '@domain/shared/StringValue'

export interface IncidentFilesInput {
  filename: StringValue
  content: StringValue
}

export interface IncidentInput {
  uberItemId: NumberValue
  amount: NumberValue
  date?: StringValue
  comments?: StringValue
  files?: IncidentFilesInput[]
}

export default abstract class IncidentSmartItService {
  abstract getIncidentsByContract(contractId: NumberValue): Promise<IncidentEntity[] | null>
  abstract createIncident(
    idSmartIT: StringValue,
    contractId: NumberValue,
    incident: IncidentInput,
  ): Promise<IncidentEntity | null>
}
