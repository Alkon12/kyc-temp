export class PaymentValidationEntity {
    constructor(public idPayment: string) {}

    toDTO() {
        return {
            idPayment: this.idPayment,
        };
    }
}
