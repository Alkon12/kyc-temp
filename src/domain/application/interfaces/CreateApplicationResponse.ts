import { ApplicationEntity } from '../ApplicationEntity'
import { ApplicationFlowStatus } from './ApplicationFlowStatus'

export interface CreateApplicationResponse {
  application: ApplicationEntity
  flowStatus: ApplicationFlowStatus
}
