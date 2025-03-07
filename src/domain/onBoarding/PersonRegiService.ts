import { DTO } from "@domain/kernel/DTO";
import { StringValue } from "@domain/shared/StringValue";
import { PersonRegisEntity } from "./PersonRegisEntity";
import Email from "next-auth/providers/email";

export default abstract class AbstractPersonRegiService {
    abstract RegisPerson(
        Nombre: DTO<StringValue>,
        ApellidoPaterno: DTO<StringValue>,
        ApellidoMaterno: DTO<StringValue>,
        NumeroCelular: DTO<StringValue>,
        idGUID: DTO<StringValue>,
        Email: DTO<StringValue>
    ): Promise<DTO<PersonRegisEntity> | null>;
}
