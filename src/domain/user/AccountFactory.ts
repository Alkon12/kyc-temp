import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { AccountEntity } from './models/AccountEntity'
import { DateTimeValue } from '../shared/DateTime'
import { StringValue } from '@domain/shared/StringValue'
import { UserId } from './models/UserId'
import { AccountProvider } from './models/AccountProvider'
import { AccountType } from './models/AccountType'
import { NumberValue } from '@domain/shared/NumberValue'

export class AccountFactory {
  static fromDTO(dto: DTO<AccountEntity>): AccountEntity {
    return new AccountEntity({
      id: new UUID(dto.id),
      userId: new UserId(dto.id),
      type: new AccountType(dto.type),
      provider: new AccountProvider(dto.provider),
      providerAccountId: new StringValue(dto.providerAccountId),
      refresh_token: dto.refresh_token ? new StringValue(dto.refresh_token) : undefined,
      access_token: dto.access_token ? new StringValue(dto.access_token) : undefined,
      expires_at: dto.expires_at ? new NumberValue(dto.expires_at) : undefined,
      token_type: dto.token_type ? new StringValue(dto.token_type) : undefined,
      scope: dto.scope ? new StringValue(dto.scope) : undefined,
      id_token: dto.id_token ? new StringValue(dto.id_token) : undefined,
      session_state: dto.session_state ? new StringValue(dto.session_state) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
    })
  }
}
