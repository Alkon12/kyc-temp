import { DTO } from "@domain/kernel/DTO";
import { PersonUpdateEntity } from "./PersonUpdateEntity";
import { IPersonUpdate } from "@type/IPersonUpdate";

export default abstract class AbstractPersonUpdateService {
    abstract updatePerson(data: DTO<IPersonUpdate>): Promise<DTO<PersonUpdateEntity> | null>;
}
