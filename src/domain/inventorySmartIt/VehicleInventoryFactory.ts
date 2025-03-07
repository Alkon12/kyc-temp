import { VehicleInventoryEntity } from './VehicleInventoryEntity';
import { IVehicleInventory } from '@type/IVehicleInventory';

export class VehicleInventoryFactory {
    public static fromDTO(data: IVehicleInventory): VehicleInventoryEntity {
        return new VehicleInventoryEntity(
            data.NumeroDeSerie,
            data.NumeroInventario,
            data.IdVehiculo,
            data.MarcaVehiculo,
            data.VehiculoModelo,
            data.VehiculoVersion,
            data.AnioVehiculo,
            data.valor_factura,
            data.IdVersion
        );
    }
}
