import { DateTimeValue } from '@domain/shared/DateTime';
import { UUID } from '@domain/shared/UUID';

export class DeviceTokenEntity {
  constructor(
    private id: UUID,
    private userId: string,
    private token: string,
    private device: string,
    private createdAt: DateTimeValue,
    private updatedAt: DateTimeValue
  ) {}

  getId(): string {
    return this.id.toString(); 
  }

  getUserId(): string {
    return this.userId;
  }

  getToken(): string {
    return this.token;
  }

  getDevice(): string {
    return this.device;
  }

  getCreatedAt(): DateTimeValue {
    return this.createdAt;
  }

  getUpdatedAt(): DateTimeValue {
    return this.updatedAt;
  }
}
