export class PendingDocumentsEntity {
    constructor(
        public Id: number,
        public Descripcion: string,
        public TieneDocumentos: boolean,
        public Subcategorias: PendingDocumentsEntity[] | null
    ) {}

    toDTO(): { 
        Id: number; 
        Descripcion: string; 
        TieneDocumentos: boolean; 
        Subcategorias: any[] | null 
    } {
        return {
            Id: this.Id,
            Descripcion: this.Descripcion,
            TieneDocumentos: this.TieneDocumentos,
            Subcategorias: this.Subcategorias ? this.Subcategorias.map(sub => sub.toDTO()) : null
        };
    }

    static fromDTO(data: any): PendingDocumentsEntity {
        return new PendingDocumentsEntity(
            data.Id,
            data.Descripcion,
            data.TieneDocumentos,
            data.Subcategorias ? data.Subcategorias.map(PendingDocumentsEntity.fromDTO) : null
        );
    }
}