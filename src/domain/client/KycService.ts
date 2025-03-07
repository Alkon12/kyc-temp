import { ClientOverviewResponse } from './interfaces/ClientOverviewResponse'

export default abstract class AbstractClientService {
  abstract overview(): Promise<ClientOverviewResponse>
}
