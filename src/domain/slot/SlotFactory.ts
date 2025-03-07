import { DTO } from '@domain/kernel/DTO'
import { UUID } from '@domain/shared/UUID'
import { SlotEntity, SlotEntityProps } from './SlotEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { SlotType } from './models/SlotType'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UserFactory } from '@domain/user/UserFactory'
import { UserId } from '@domain/user/models/UserId'
import { TaskFactory } from '@domain/task/TaskFactory'
import { ProspectFactory } from '@domain/prospect/ProspectFactory'

export type SlotArgs = Merge<
  SlotEntityProps,
  {
    id?: UUID
  }
>

export class SlotFactory {
  static fromDTO(dto: DTO<SlotEntity>): SlotEntity {
    return new SlotEntity({
      id: new UUID(dto.id),
      slotType: new SlotType(dto.slotType),
      startsAt: dto.startsAt ? new DateTimeValue(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new DateTimeValue(dto.endsAt) : undefined,
      hostUserId: dto.hostUserId ? new UserId(dto.hostUserId) : undefined,
      guestUserId: dto.guestUserId ? new UserId(dto.guestUserId) : undefined,
      free: new BooleanValue(dto.free),
      prospectId: dto.prospectId ? new UUID(dto.prospectId) : undefined,

      hostUser: dto.hostUser ? UserFactory.fromDTO(dto.hostUser) : undefined,
      guestUser: dto.guestUser ? UserFactory.fromDTO(dto.guestUser) : undefined,
      tasks: dto.tasks ? dto.tasks.map((t) => TaskFactory.fromDTO(t)) : [],
      prospect: dto.prospect ? ProspectFactory.fromDTO(dto.prospect) : undefined,
    })
  }

  static create(args: SlotArgs): SlotEntity {
    return new SlotEntity({
      id: new UUID(),
      ...args,
    })
  }
}
