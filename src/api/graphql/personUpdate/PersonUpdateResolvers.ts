import { injectable, inject } from 'inversify';
import { DI } from '@infrastructure';
import AbstractPersonUpdateService from '@domain/personUpdate/PersonUpdateService';
import { PersonUpdateEntity } from '@domain/personUpdate/PersonUpdateEntity';

@injectable()
export class PersonUpdateResolvers {
    constructor(
        @inject(DI.PersonUpdateService)
        private readonly personUpdateService: AbstractPersonUpdateService
    ) { }

    build() {
        return {
            Mutation: {
                updatePerson: this.updatePerson,
            },
        };
    }

    private updatePerson = async (
        _parent: unknown,
        args: {
            Nombre: string;
            ApellidoPaterno: string;
            ApellidoMaterno: string;
            RazonSocial?: string;
            RFC: string;
            CURP: string;
            Sexo: string;
            Email: string;
            NumeroCelular: string;
            TelefonoCasa?: string;
            Calle: string;
            NumeroExterior: string;
            NumeroInterior?: string;
            CodigoPostal: string;
            ColoniaFraccionamiento: string;
            Ciudad: string;
            Estado: string;
            Pais: string;
            FechaNacimiento: string;
            UsoCFDI: string;
            RegimenFiscal: string;
            UUID: string;
        }
    ): Promise<PersonUpdateEntity | null> => {
        const updateData = {
            Nombre: args.Nombre,
            ApellidoPaterno: args.ApellidoPaterno,
            ApellidoMaterno: args.ApellidoMaterno,
            RazonSocial: args.RazonSocial || null,
            RFC: args.RFC,
            CURP: args.CURP,
            Sexo: args.Sexo,
            Email: args.Email,
            NumeroCelular: args.NumeroCelular,
            TelefonoCasa: args.TelefonoCasa || null,
            Calle: args.Calle,
            NumeroExterior: args.NumeroExterior,
            NumeroInterior: args.NumeroInterior || null,
            CodigoPostal: args.CodigoPostal,
            ColoniaFraccionamiento: args.ColoniaFraccionamiento,
            Ciudad: args.Ciudad,
            Estado: args.Estado,
            Pais: args.Pais,
            FechaNacimiento: args.FechaNacimiento,
            UsoCFDI: args.UsoCFDI,
            RegimenFiscal: args.RegimenFiscal,
            UUID: args.UUID,
        };

        return await this.personUpdateService.updatePerson(updateData);
    };
}
