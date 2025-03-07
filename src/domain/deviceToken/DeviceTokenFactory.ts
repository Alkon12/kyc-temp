import { DeviceTokenEntity } from './DeviceTokenEntity';
import { DateTimeValue } from '@domain/shared/DateTime';
import { UUID } from '@domain/shared/UUID';

export class DeviceTokenFactory {
  static create(userId: string, token: string, device: string): DeviceTokenEntity {
    return new DeviceTokenEntity(
      new UUID(),
      userId,
      token,
      device,
      new DateTimeValue(new Date()),
      new DateTimeValue(new Date())
    );
  }
}

