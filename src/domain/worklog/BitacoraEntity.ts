import { DateTimeValue } from '@domain/shared/DateTime';
import { UUID } from '@domain/shared/UUID';

export class BitacoraEntity {
  constructor(
    private id: UUID,
    private userId: string,
    private alarmId: string, 
    private status: string,
    private createdAt: DateTimeValue,
    private updatedAt: DateTimeValue
  ) {}

  getId(): string {
    return this.id.toDTO();
  }

  getUserId(): string {
    return this.userId;
  }

  getAlarmId(): string {
    return this.alarmId;
  }

  getStatus(): string {
    return this.status;
  }

  getCreatedAt(): DateTimeValue {
    return this.createdAt;
  }

  getUpdatedAt(): DateTimeValue {
    return this.updatedAt;
  }
}