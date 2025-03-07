import { PersonUpdateEntity } from './PersonUpdateEntity';
import { IPersonUpdate } from '@type/IPersonUpdate';

export default interface PersonUpdateRepository {
    updatePerson(data: IPersonUpdate): Promise<PersonUpdateEntity | null>;
}
