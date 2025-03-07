import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { VehicleInventoryEntity } from '@domain/inventorySmartIt/VehicleInventoryEntity';
import VehicleInventoryRepository from '@domain/inventorySmartIt/VehicleInventoryRepository';
import { VehicleInventoryFactory } from '@domain/inventorySmartIt/VehicleInventoryFactory';
import { IVehicleInventory } from '@type/IVehicleInventory';

function nullsToUndefined(data: any): any {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === null ? undefined : value])
    );
}

@injectable()
export class VehicleInventoryApi implements VehicleInventoryRepository {
    async getAvailableInventory(): Promise<VehicleInventoryEntity[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SMARTIT}inventario/lista/inventario/disponible`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
            }
        });
        const data = await response.json();

        if (!Array.isArray(data.Object)) {
            throw new Error('Expected an array in the "Object" property but received something else.');
        }

        return data.Object.map((item: any) =>
            VehicleInventoryFactory.fromDTO(
                nullsToUndefined({
                    NumeroDeSerie: item.NumeroDeSerie,
                    NumeroInventario: item.NumeroInventario,
                    IdVehiculo: item.IdVehiculo,
                    MarcaVehiculo: item.MarcaVehiculo,
                    VehiculoModelo: item.VehiculoModelo,
                    VehiculoVersion: item.VehiculoVersion,
                    AnioVehiculo: item.AnioVehiculo,
                    valor_factura: item.valor_factura,
                    IdVersion: item.IdVersion,
                }) as IVehicleInventory
            )
        );
    }
}
