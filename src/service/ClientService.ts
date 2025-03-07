import { injectable } from 'inversify'
import { OverviewCount } from '@domain/shared/OverviewCount'
import { VehicleEntity } from '@domain/vehicle/models/VehicleEntity'
import AbstractClientService from '@domain/client/KycService'
import { ClientByActivity, ClientOverviewResponse } from '@domain/client/interfaces/ClientOverviewResponse'

@injectable()
export class ClientService implements AbstractClientService {
  async overview(): Promise<ClientOverviewResponse> {
    const vehicles: VehicleEntity[] = [] //await this._vehicleRepository.getAll()

    return {
      byActivity: this._getByActivity(vehicles),
    }
  }

  _getByActivity = (vehicles: VehicleEntity[]): ClientByActivity => {
    // TODO implement
    return {
      withDebt: new OverviewCount(0).toDTO(),
      withoutDebt: new OverviewCount(0).toDTO(),
    }
  }
}
