export class PaymentBillEntity {
    constructor(public billId: number,public folio: number,public serie: string) {}

    toDTO() {
        return {
            billId: this.billId,
            folio: this.folio,
            serie: this.serie
        };
    }
}
