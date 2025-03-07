import { AggregateRoot } from "@domain/kernel/AggregateRoot";
import { DateTimeValue } from "@domain/shared/DateTime";
import { NumberValue } from "@domain/shared/NumberValue";
import { StringValue } from "@domain/shared/StringValue";

export type DeliveryLocationProps = {
    id: NumberValue
    companyId: NumberValue
    categoryId: NumberValue
    location: StringValue
    address: StringValue
    latitude: NumberValue
    longitude: NumberValue
}

export class DeliveryLocation extends AggregateRoot<'DeliveryLocation', DeliveryLocationProps> {
    get props(): DeliveryLocationProps {
        return this._props
    }
}

export type ContractEntityProps = {
    id: NumberValue
    companyId: NumberValue
    pathContract: StringValue
    pathBankReference: StringValue
    pathDeliveryLetter: StringValue
    insurancePolicyFolio: StringValue
    banckReference: StringValue
    status: StringValue
    startDate: DateTimeValue
    endDate?: DateTimeValue
    deliveryDate?: DateTimeValue
    contractWeeks: NumberValue
    weeklyCost: NumberValue
    interestRate: NumberValue
    clientId: NumberValue
    deliveryLocation?: DeliveryLocation
}

export class ContractEntity extends AggregateRoot<'ContractEntity', ContractEntityProps> {
    get props(): ContractEntityProps {
        return this._props
    }
}