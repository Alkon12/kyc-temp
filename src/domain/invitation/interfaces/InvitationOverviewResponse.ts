import { DTO } from '@domain/kernel/DTO'
import { OverviewCount } from '@domain/shared/OverviewCount'

export interface InvitationOverviewResponse {
  withUberAccount: InvitationOverviewCountRefineResponse
  withoutUberAccount: InvitationOverviewCountRefineResponse
}

export interface InvitationOverviewCountRefineResponse {
  created: DTO<OverviewCount>
  sent: DTO<OverviewCount>
  accepted: DTO<OverviewCount>
  expired: DTO<OverviewCount>
}
