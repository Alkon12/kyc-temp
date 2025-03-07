import { VehicleReservationEntity } from './VehicleReservationEntity';

export class VehicleReservationFactory {
    public static fromDTO(data: any): VehicleReservationEntity {
        return new VehicleReservationEntity(
            data.VIN,
            data.IMEI,
            data.Telefono,
            data.IdGPS
        );
    }
}
