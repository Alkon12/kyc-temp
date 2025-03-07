export class DeliveryEntity {
    constructor(
        public Id: string | null
    ) {}

    toDTO() {
        return {
            Id: this.Id,
        };
    }
}
