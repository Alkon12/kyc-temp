export class PersonUpdateEntity {
    constructor(
        public Nombre: string,
        public ApellidoPaterno: string,
        public ApellidoMaterno: string,
        public RazonSocial: string | null,
        public RFC: string,
        public CURP: string,
        public Sexo: string,
        public Email: string,
        public NumeroCelular: string,
        public TelefonoCasa: string | null,
        public Calle: string,
        public NumeroExterior: string,
        public NumeroInterior: string | null,
        public CodigoPostal: string,
        public ColoniaFraccionamiento: string,
        public Ciudad: string,
        public Estado: string,
        public Pais: string,
        public FechaNacimiento: string,
        public UsoCFDI: string,
        public RegimenFiscal: string,
        public UUID: string
    ) {}
}
