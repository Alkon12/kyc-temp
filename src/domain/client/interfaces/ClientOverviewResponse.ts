import { DTO } from '@domain/kernel/DTO'
import { OverviewCount } from '@domain/shared/OverviewCount'

export interface ClientOverviewResponse {
  byActivity: ClientByActivity
}

export interface ClientByActivity {
  withDebt: DTO<OverviewCount>
  withoutDebt: DTO<OverviewCount>
}
