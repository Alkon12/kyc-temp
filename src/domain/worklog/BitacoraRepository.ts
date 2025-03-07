import { BitacoraEntity } from './BitacoraEntity';
import { UUID } from '@domain/shared/UUID';

export default interface BitacoraRepository {
  create(bitacora: BitacoraEntity): Promise<BitacoraEntity>;
  findByUser(userId: string): Promise<BitacoraEntity[]>;
  updateStatus(id: UUID, status: string): Promise<BitacoraEntity>;
}