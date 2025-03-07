import { DTO } from "@domain/kernel/DTO";

import { StringValue } from "@domain/shared/StringValue";
import { PersonRegisEntity } from "./PersonRegisEntity";

export class PersonRegiFactory {
    static fromDTO(dto: DTO<PersonRegisEntity>): PersonRegisEntity {        
        return new PersonRegisEntity({
            idGUID: new StringValue(dto.idGUID),
            Nombre: new StringValue(dto.Nombre),
            ApellidoPaterno: new StringValue(dto.ApellidoPaterno),
            ApellidoMaterno: new StringValue(dto.ApellidoMaterno),
            NumeroCelular: new StringValue(dto.NumeroCelular),
            Email: new StringValue(dto.Email),
        });
    }
}