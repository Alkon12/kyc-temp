import { DTO } from '@domain/kernel/DTO'
import { OverviewCount } from '@domain/shared/OverviewCount'

export interface LeadOverviewResponse {
  withUberAccount: LeadOverviewCountRefineResponse
  withoutUberAccount: LeadOverviewCountRefineResponse
}

export interface LeadOverviewCountRefineResponse {
  arrived: DTO<OverviewCount>
  beingManaged: DTO<OverviewCount>
  dismissed: DTO<OverviewCount>
  converted: DTO<OverviewCount>
}
