import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { DeliveryEntity } from '@domain/delivery/DeliveryEntity';
import DeliveryRepository from '@domain/delivery/DeliveryRepository';
import { DeliveryFactory } from '@domain/delivery/DeliveryFactory';

@injectable()
export class DeliveryApi implements DeliveryRepository {
    async generateDelivery(idsmartIt: string, IdContrato: string): Promise<DeliveryEntity | null> {
        const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}entrega/generar`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idsmartIt}`
            },
            body: JSON.stringify({
                IdContrato : IdContrato,
            })
        };

        const response = await fetch(url, options);
        const result = await response.json();

        if (result && result.Message) {
            throw new Error(result.Message || 'Error generating delivery');
        }

        return DeliveryFactory.fromDTO(result);
    }
}
