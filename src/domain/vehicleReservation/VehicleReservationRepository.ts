import { VehicleReservationEntity } from './VehicleReservationEntity';

export default interface VehicleReservationRepository {
    reserveVehicle(data: { 
        IdUsuarioUber: string; 
        IdCotizacion: number; 
        idsmartIt: string; 
    }): Promise<VehicleReservationEntity | null>;
}
