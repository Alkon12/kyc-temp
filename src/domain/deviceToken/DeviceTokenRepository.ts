import { DeviceTokenEntity } from './DeviceTokenEntity';
import { UUID } from '@domain/shared/UUID';

export default interface DeviceTokenRepository {
  create(deviceToken: DeviceTokenEntity): Promise<DeviceTokenEntity>;
  findById(id: UUID): Promise<DeviceTokenEntity | null>;
  getByUser(userId: string): Promise<DeviceTokenEntity[]>;
  delete(id: UUID): Promise<void>;
}
