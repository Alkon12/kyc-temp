import { DeviceTokenEntity } from './DeviceTokenEntity';
import { UUID } from '@domain/shared/UUID';
import { injectable } from 'inversify';

@injectable()
export default abstract class AbstractDeviceTokenService {
  abstract create(deviceToken: DeviceTokenEntity): Promise<DeviceTokenEntity>;
  abstract findById(id: UUID): Promise<DeviceTokenEntity | null>;
  abstract getTokensByUser(userId: string): Promise<DeviceTokenEntity[]>;
  abstract deleteToken(id: UUID): Promise<void>;
  abstract registerToken(userId: string, token: string, device: string): Promise<DeviceTokenEntity>;
}
