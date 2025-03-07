import { UUID } from '@domain/shared/UUID'
import { LeasingEntity } from './LeasingEntity'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'
export default abstract class AbstractLeasingService {
  abstract getActive(): Promise<LeasingEntity[]>
  abstract getById(leasingId: UUID): Promise<LeasingEntity>
  abstract getCurrentWeekNumber(leasing: LeasingEntity, date: DateTimeValue): NumberValue
}
