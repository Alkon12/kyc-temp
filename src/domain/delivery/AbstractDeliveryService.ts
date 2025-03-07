import { DeliveryEntity } from './DeliveryEntity';

export default abstract class AbstractDeliveryService {
    abstract generateDelivery(idsmartIt: string, IdContrato: string): Promise<DeliveryEntity | null>;
}
