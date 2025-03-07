import { PersonUpdateEntity } from './PersonUpdateEntity';
import { IPersonUpdate } from '@type/IPersonUpdate';

export class PersonUpdateFactory {
    public static fromDTO(data: IPersonUpdate): PersonUpdateEntity {
        return new PersonUpdateEntity(
            data.Nombre,
            data.ApellidoPaterno,
            data.ApellidoMaterno,
            data.RazonSocial || null,
            data.RFC,
            data.CURP,
            data.Sexo,
            data.Email,
            data.NumeroCelular,
            data.TelefonoCasa || null,
            data.Calle,
            data.NumeroExterior,
            data.NumeroInterior || null,
            data.CodigoPostal,
            data.ColoniaFraccionamiento,
            data.Ciudad,
            data.Estado,
            data.Pais,
            data.FechaNacimiento,
            data.UsoCFDI,
            data.RegimenFiscal,
            data.UUID
        );
    }
}
