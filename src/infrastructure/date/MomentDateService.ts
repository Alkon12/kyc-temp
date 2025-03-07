import { injectable } from 'inversify'
import moment, { Moment } from 'moment'
import { DateService } from '@/application/service/DateService'

@injectable()
export class MomentDateService implements DateService {
  getDateRange = (firstDate: string, lastDate: string): Date[] => {
    if (moment(firstDate, 'YYYY-MM-DD').isSame(moment(lastDate, 'YYYY-MM-DD'), 'day')) {
      return [moment(lastDate, 'YYYY-MM-DD').toDate()]
    }

    let date: Moment = moment(firstDate, 'YYYY-MM-DD')
    const dates: Date[] = [date.toDate()]
    do {
      date = date.add(1, 'day')
      dates.push(date.toDate())
    } while (date.isBefore(lastDate))

    return dates
  }
}
