import { StringValue } from "@domain/shared/StringValue";
import { AggregateRoot } from "@domain/kernel/AggregateRoot";

export type PersonEntityProps = {
    idGUID: StringValue;         
    Nombre: StringValue;           
    ApellidoPaterno: StringValue; 
    ApellidoMaterno: StringValue; 
    NumeroCelular: StringValue;  
    Email: StringValue;
}

export class PersonRegisEntity extends AggregateRoot<'PersonRegisEntity', PersonEntityProps> {
    get props(): PersonEntityProps {
        return this._props;
    }
}
