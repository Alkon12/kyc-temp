import { DeliveryEntity } from './DeliveryEntity';
import { IDelivery } from '@type/IDelivery';

export class DeliveryFactory {
    public static fromDTO(id: string): DeliveryEntity {
        return new DeliveryEntity(id);
    }
}
