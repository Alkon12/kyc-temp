import { LeasingEntity } from '@domain/leasing/LeasingEntity'
import { UUID } from '@domain/shared/UUID'

export default interface LeasingRepository {
  getAll(): Promise<LeasingEntity[]>
  getById(leasingId: UUID): Promise<LeasingEntity>
  save(leasing: LeasingEntity): Promise<void>
  findActiveLeasing(userId: UUID, vehicleId: UUID): Promise<LeasingEntity | null>
}
