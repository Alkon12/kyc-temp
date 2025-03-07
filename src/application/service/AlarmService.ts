import { BooleanValue } from '@domain/shared/BooleanValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'

export interface Alarm {
  id?: UUID
  alertLevel?: StringValue
  category?: StringValue
  deviceId?: NumberValue
  date?: DateTimeValue
  lastUpdate?: DateTimeValue
  status?: StringValue
  subcategory?: StringValue
}

export interface AlarmService {
  list(deviceId: StringValue, status: StringValue): Promise<Alarm[]>
}
