import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { VehicleReservationEntity } from '@domain/vehicleReservation/VehicleReservationEntity';
import VehicleReservationRepository from '@domain/vehicleReservation/VehicleReservationRepository';
import { VehicleReservationFactory } from '@domain/vehicleReservation/VehicleReservationFactory';

@injectable()
export class VehicleReservationApi implements VehicleReservationRepository {
    async reserveVehicle(data: { 
        IdUsuarioUber: string; 
        IdCotizacion: number; 
        idsmartIt: string; 
    }): Promise<VehicleReservationEntity | null> {
        const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}inventario/apartar`;
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
            },
            body: JSON.stringify({
                IdUsuarioUber: data.IdUsuarioUber,
                IdCotizacion: data.IdCotizacion
            })
        };

        const response = await fetch(url, options);
        const result = await response.json();

        if (!result || !result.VIN ) {
            throw new Error(`Mensaje: ${result.Message}`);
        }

        return VehicleReservationFactory.fromDTO(result);
    }
}

