import { VehicleReservationEntity } from '@domain/vehicleReservation/VehicleReservationEntity';

export default abstract class AbstractVehicleReservationService {
    abstract reserveVehicle(data: {
        IdUsuarioUber: string;
        IdCotizacion: number;
        idsmartIt: string;
    }): Promise<VehicleReservationEntity | null>;
}
