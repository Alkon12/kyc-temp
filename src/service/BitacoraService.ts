import { injectable, inject } from 'inversify'
import { DI } from '@infrastructure'
import AbstractBitacoraService from '@domain/worklog/AbstractBitacoraService'
import { BitacoraEntity } from '@domain/worklog/BitacoraEntity'
import type BitacoraRepository from '@domain/worklog/BitacoraRepository'
import { UUID } from '@domain/shared/UUID'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class BitacoraService implements AbstractBitacoraService {
  constructor(
    @inject(DI.BitacoraRepository)
    private readonly repository: BitacoraRepository,
  ) {}

  async create(userId: string, alarmId: string, status: string): Promise<BitacoraEntity> {
    const bitacora = new BitacoraEntity(
      new UUID(),
      userId,
      alarmId,
      status,
      new DateTimeValue(new Date()),
      new DateTimeValue(new Date()),
    )

    return await this.repository.create(bitacora)
  }

  async findByUser(userId: string): Promise<BitacoraEntity[]> {
    return await this.repository.findByUser(userId)
  }

  async updateStatus(bitacoraId: UUID, status: string): Promise<BitacoraEntity> {
    return await this.repository.updateStatus(bitacoraId, status)
  }
}
