import { DTO } from '@domain/kernel/DTO'
import { OverviewCount } from '@domain/shared/OverviewCount'

export interface KycOverviewResponse {
  byProgress: KycApplicationsByProgress
  byActivity: KycApplicationsByActivity
}

export interface KycApplicationsByProgress {
  kycDriverEngaged: DTO<OverviewCount>
  kycComplete: DTO<OverviewCount>
  deliveryProcess: DTO<OverviewCount>
}

export interface KycApplicationsByActivity {
  onTime: DTO<OverviewCount>
  delayedByDriver: DTO<OverviewCount>
  delayedByBackoffice: DTO<OverviewCount>
  delayedByManager: DTO<OverviewCount>
}
