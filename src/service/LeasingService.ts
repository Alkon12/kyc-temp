import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractLeasingService from '@domain/leasing/LeasingService'
import { LeasingEntity } from '@domain/leasing/LeasingEntity'
import type LeasingRepository from '@domain/leasing/LeasingRepository'
import { UUID } from '@domain/shared/UUID'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import moment, { Moment } from 'moment'
import { DateTimeDiffUnit } from '@domain/shared/base/DateTimeAbstract'

@injectable()
export class LeasingService implements AbstractLeasingService {
  @inject(DI.LeasingRepository)
  private readonly _leasingRepository!: LeasingRepository

  async getActive(): Promise<LeasingEntity[]> {
    const leasings = await this._leasingRepository.getAll()

    const activeLeasings = leasings.filter((l) => l.isActive())

    return activeLeasings
  }

  async getById(leasingId: UUID): Promise<LeasingEntity> {
    return this._leasingRepository.getById(leasingId)
  }

  getCurrentWeekNumber(leasing: LeasingEntity, date: DateTimeValue): NumberValue {
    return new NumberValue(date.diff(leasing.getStartDate(), DateTimeDiffUnit.week) + 1)
  }
}
