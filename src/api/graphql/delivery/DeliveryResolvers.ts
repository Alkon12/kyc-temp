import { inject, injectable } from 'inversify'
import { DeliveryEntity } from '@domain/delivery/DeliveryEntity'
import { DeliveryService } from '@service/DeliveryService'
import { DI } from '@infrastructure'

@injectable()
export class DeliveryResolvers {
  constructor(
    @inject(DI.DeliveryService)
    private readonly deliveryService: DeliveryService,
  ) {}

  build() {
    return {
      Mutation: {
        generateDelivery: this.generateDelivery,
      },
    }
  }

  private generateDelivery = async (
    _parent: unknown,
    { idsmartIt, IdContrato }: { idsmartIt: string; IdContrato: string },
  ): Promise<DeliveryEntity | null> => {
    return this.deliveryService.generateDelivery(idsmartIt, IdContrato)
  }
}
