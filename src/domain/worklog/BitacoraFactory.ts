import { BitacoraEntity } from './BitacoraEntity';
import { UUID } from '@domain/shared/UUID';
import { DateTimeValue } from '@domain/shared/DateTime';


export class BitacoraFactory {
  static fromDTO(data: any): BitacoraEntity {
    return new BitacoraEntity(
      new UUID(),
      data.userId,
      data.alarmId,
      data.status,
      new DateTimeValue(data.createdAt),
      new DateTimeValue(data.updatedAt)
    );
  }
}
