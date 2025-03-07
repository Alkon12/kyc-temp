import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import type DeliveryRepository from '@domain/delivery/DeliveryRepository'
import { DeliveryEntity } from '@domain/delivery/DeliveryEntity'

@injectable()
export class DeliveryService {
  constructor(
    @inject(DI.DeliveryRepository)
    private readonly deliveryRepository: DeliveryRepository,
  ) {}

  async generateDelivery(idsmartIt: string, IdContrato: string): Promise<DeliveryEntity | null> {
    return this.deliveryRepository.generateDelivery(idsmartIt, IdContrato)
  }
}
