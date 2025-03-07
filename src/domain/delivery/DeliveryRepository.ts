import { DeliveryEntity } from './DeliveryEntity';

export default interface DeliveryRepository {
    generateDelivery(idsmartIt: string, IdContrato: string): Promise<DeliveryEntity | null>;
}
