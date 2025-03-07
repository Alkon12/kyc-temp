import dayjs, { Dayjs } from 'dayjs'
import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error'
import { ValueOf } from 'next/dist/shared/lib/constants'

export default abstract class DateTimeAbstract<Brand> extends ValueObject<Brand, Dayjs> {
  constructor(value: string | Date | Dayjs) {
    const valueString: string = value instanceof Date ? value.toISOString() : (value as string)
    const day = dayjs.isDayjs(value) ? value.clone() : dayjs(valueString)

    if (!day.isValid()) {
      throw new ValidationError(`Invalid date time [${value.toString() ?? ''}]`)
    }

    super(day)
  }

  get dayjs(): Dayjs {
    return this._value
  }

  toFormat(format: string) {
    return this.dayjs.format(format)
  }

  toDate() {
    return this.dayjs.toDate()
  }

  isBefore(date: DateTimeParam): boolean {
    return this.dayjs.isBefore(date.toDTO(), 'day')
  }

  diff(date: DateTimeParam, unit: DateTimeDiffUnit): number {
    return this.dayjs.diff(date.toDTO(), unit)
  }

  addDays(days: number): DateTimeParam {
    return new DateTimeParam(this.dayjs.add(days, 'day').toDate())
  }

  subtractHours(days: number): DateTimeParam {
    return new DateTimeParam(this.dayjs.subtract(days, 'hour').toDate())
  }

  startOfDay(): DateTimeParam {
    return new DateTimeParam(this.dayjs.startOf('day'))
  }
}

export enum DateTimeDiffUnit {
  day = 'day',
  week = 'week',
  quarter = 'quarter',
  month = 'month',
  year = 'year',
  hour = 'hour',
  minute = 'minute',
  second = 'second',
  millisecond = 'millisecond',
}

class DateTimeParam extends DateTimeAbstract<'DateTimeValue'> {}
