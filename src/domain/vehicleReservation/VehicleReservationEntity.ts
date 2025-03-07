export class VehicleReservationEntity {
    constructor(
        public VIN: string,
        public IMEI: string,
        public Telefono: string,
        public IdGPS: number
    ) {}

    toDTO() {
        return {
            VIN: this.VIN,
            IMEI: this.IMEI,
            Telefono: this.Telefono,
            IdGPS: this.IdGPS,
        };
    }
}
