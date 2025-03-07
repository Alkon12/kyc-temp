import { IPersonUpdate } from '@type/IPersonUpdate'

export const taxPersonNull = () => {
  const personUpdateDto: IPersonUpdate = {
    ApellidoMaterno: '',
    ApellidoPaterno: '',
    Calle: '',
    Ciudad: '',
    CodigoPostal: '',
    ColoniaFraccionamiento: '',
    CURP: '',
    Estado: '',
    Email: '',
    FechaNacimiento: '',
    Nombre: '',
    NumeroExterior: '',
    NumeroCelular: '',
    NumeroInterior: '',
    Pais: '',
    RazonSocial: '',
    RegimenFiscal: ``,
    RFC: '',
    Sexo: '',
    TelefonoCasa: '',
    UsoCFDI: '',
    UUID: '',
  }

  return personUpdateDto
}
