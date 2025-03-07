import { injectable, inject } from 'inversify'
import { DI } from '@infrastructure'
import { BitacoraService } from '@service/BitacoraService'
import { BitacoraEntity } from '@domain/worklog/BitacoraEntity'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class BitacoraResolvers {
  constructor(
    @inject(DI.BitacoraService)
    private readonly bitacoraService: BitacoraService,
  ) {}

  build() {
    return {
      Query: {
        getBitacoraByUser: this.getBitacoraByUser,
      },
      Mutation: {
        createBitacora: this.createBitacora,
        updateBitacoraStatus: this.updateBitacoraStatus,
      },
    }
  }

  private getBitacoraByUser = async (
    _parent: unknown,
    { userId }: { userId: string },
  ): Promise<
    Array<{ id: string; userId: string; alarmId: string; status: string; createdAt: Date; updatedAt: Date }>
  > => {
    const bitacora = await this.bitacoraService.findByUser(userId)

    return bitacora.map((bitacora) => ({
      id: bitacora.getId(),
      userId: bitacora.getUserId(),
      alarmId: bitacora.getAlarmId(),
      status: bitacora.getStatus(),
      createdAt: bitacora.getCreatedAt().toDate(),
      updatedAt: bitacora.getUpdatedAt().toDate(),
    }))
  }

  private createBitacora = async (
    _parent: unknown,
    { userId, alarmId, status }: { userId: string; alarmId: string; status: string },
  ): Promise<{ id: string; userId: string; alarmId: string; status: string; createdAt: Date; updatedAt: Date }> => {
    const bitacora = await this.bitacoraService.create(userId, alarmId, status)
    const id = bitacora.getId().toString()
    return {
      id: bitacora.getId(),
      userId: bitacora.getUserId(),
      alarmId: bitacora.getAlarmId(),
      status: bitacora.getStatus(),
      createdAt: bitacora.getCreatedAt().toDate(),
      updatedAt: bitacora.getUpdatedAt().toDate(),
    }
  }

  private updateBitacoraStatus = async (
    _parent: unknown,
    { id, status }: { id: string; status: string },
  ): Promise<BitacoraEntity> => {
    return await this.bitacoraService.updateStatus(new UUID(id), status)
  }
}
