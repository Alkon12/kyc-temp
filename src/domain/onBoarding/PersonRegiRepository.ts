import { StringValue } from "@domain/shared/StringValue";
import { PersonRegisEntity } from "./PersonRegisEntity";

export default interface PersonRegisRepository {
    RegisPerson(
        Nombre: StringValue,
        ApellidoPaterno: StringValue,
        ApellidoMaterno: StringValue,
        NumeroCelular: StringValue,
        idGUID: StringValue,
        Email: StringValue
    ): Promise<PersonRegisEntity | null>;
}