import { BitacoraEntity } from './BitacoraEntity';
import { UUID } from '@domain/shared/UUID';

export default abstract class AbstractBitacoraService {
  abstract create(userId: string, alarmId: string, status: string ): Promise<BitacoraEntity>;

  abstract findByUser(userId: string): Promise<BitacoraEntity[]>;

  abstract updateStatus(id: UUID, status: string): Promise<BitacoraEntity>;
}
