import { DTO } from '@domain/kernel/DTO'
import { OverviewCount } from '@domain/shared/OverviewCount'

export interface ProspectOverviewResponse {
  byQuoteScoringMark: ProspectCountByScoringMark
  bySituation: ProspectSituationCount
}

export interface ProspectSituationCount {
  recent: DTO<OverviewCount>
  active: DTO<OverviewCount>
  expired: DTO<OverviewCount>
}

export type ProspectCountByScoringMark = Dict<DTO<OverviewCount>>
