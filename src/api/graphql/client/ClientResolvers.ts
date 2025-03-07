import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { ClientService } from '@service/ClientService'
import { ClientOverview } from '../app.schema.gen'

@injectable()
export class ClientResolvers {
  build() {
    return {
      Query: {
        clientOverview: this.clientOverview,
      },
    }
  }

  clientOverview = async (): Promise<ClientOverview> => {
    const clientService = container.get<ClientService>(DI.ClientService)

    const clientOverview = await clientService.overview()

    return clientOverview
  }
}
