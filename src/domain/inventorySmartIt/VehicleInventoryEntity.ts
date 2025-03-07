export class VehicleInventoryEntity {
    constructor(
        public readonly serialNumber: string,
        public readonly inventoryNumber: number,
        public readonly vehicleId: number,
        public readonly brand: string,
        public readonly model: string,
        public readonly version: string,
        public readonly year: number,
        public readonly invoiceValue: number,
        public readonly versionId: number
    ) {}
}
