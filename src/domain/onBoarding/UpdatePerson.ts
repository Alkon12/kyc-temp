export interface UpdatePerson {
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    RazonSocial?: string;
    RFC: string;
    CURP: string;
    Sexo: string;
    Email: string;
    NumeroCelular: string;
    TelefonoCasa?: string | null;
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