import { ApplicationFlowStatus } from './ApplicationFlowStatus'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'

export interface CreateApplicationResponse {
  application: ApplicationEntity
  flowStatus: ApplicationFlowStatus
}
