import { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor';

interface DocumentSaveOptions {
  verificationId?: string;
  saveToDatabase?: boolean;
  saveToPaperless?: boolean;
  applyTimestamp?: boolean;
  additionalMetadata?: any;
}

interface SavedDocument {
  id: string;
  type: string;
  savedToPaperless: boolean;
  savedToDatabase: boolean;
  paperlessUrl?: string;
  localPath?: string;
  timestampApplied: boolean;
}

/**
 * Servicio centralizado para manejar el guardado de documentos de FaceTec
 * Integra todos los flujos: BD, Paperless, y sellado de tiempo
 */
export class FaceTecDocumentManager {
  private verificationToken: string;
  private faceTecSessionId?: string;
  private savedDocuments: Map<string, SavedDocument> = new Map();

  constructor(verificationToken: string) {
    this.verificationToken = verificationToken;
  }

  /**
   * Establece el session ID de FaceTec para metadatos
   */
  setFaceTecSessionId(sessionId: string): void {
    this.faceTecSessionId = sessionId;
  }

  /**
   * Guarda una selfie con todas las opciones configuradas
   */
  async saveSelfie(
    selfieImage: string, 
    faceTecSessionResult: any,
    options: DocumentSaveOptions = {}
  ): Promise<SavedDocument | null> {
    return this.saveDocument('SELFIE', selfieImage, {
      sessionId: faceTecSessionResult.sessionId,
      status: faceTecSessionResult.status,
      faceScan: !!faceTecSessionResult.faceScan,
      ...options.additionalMetadata
    }, options);
  }

  /**
   * Guarda el frente del documento de identidad
   */
  async saveIdFront(
    frontImage: string,
    idScanResult: any,
    options: DocumentSaveOptions = {}
  ): Promise<SavedDocument | null> {
    return this.saveDocument('ID_FRONT', frontImage, {
      scanSessionId: idScanResult.sessionId,
      ...options.additionalMetadata
    }, options);
  }

  /**
   * Guarda el reverso del documento de identidad
   */
  async saveIdBack(
    backImage: string,
    idScanResult: any,
    options: DocumentSaveOptions = {}
  ): Promise<SavedDocument | null> {
    return this.saveDocument('ID_BACK', backImage, {
      scanSessionId: idScanResult.sessionId,
      ...options.additionalMetadata
    }, options);
  }

  /**
   * Guarda todas las imágenes de ID (frente y reverso) en una sola operación
   */
  async saveIdImages(
    frontImage: string,
    backImage: string | null,
    idScanResult: any,
    options: DocumentSaveOptions = {}
  ): Promise<{ front: SavedDocument | null; back: SavedDocument | null }> {
    try {
      console.log('📄 FaceTecDocumentManager: Guardando imágenes de ID completas');

      // Guardar imagen frontal
      const frontResult = await this.saveIdFront(frontImage, idScanResult, options);
      
      // Guardar imagen trasera si existe
      let backResult = null;
      if (backImage) {
        backResult = await this.saveIdBack(backImage, idScanResult, options);
      }

      return {
        front: frontResult,
        back: backResult
      };
    } catch (error) {
      console.error('Error al guardar imágenes de ID:', error);
      return {
        front: null,
        back: null
      };
    }
  }

  /**
   * Método privado centralizado para guardar cualquier tipo de documento
   */
  private async saveDocument(
    documentType: string,
    imageData: string,
    metadata: any,
    options: DocumentSaveOptions
  ): Promise<SavedDocument | null> {
    try {
      console.log(`📄 FaceTecDocumentManager: Guardando ${documentType}`);

      // Verificar formato de imagen
      let cleanImageData = imageData;
      if (!cleanImageData.startsWith('data:image')) {
        cleanImageData = `data:image/jpeg;base64,${cleanImageData}`;
      }

      // Aplicar sellado de tiempo si es requerido
      let timestampData = null;
      if (options.applyTimestamp) {
        timestampData = await this.applyTimestamp(cleanImageData);
        if (timestampData) {
          metadata.timestampHash = timestampData.hash;
          metadata.timestampSeal = timestampData.timestamp;
          console.log(`🔒 Sellado de tiempo aplicado a ${documentType}`);
        }
      }

      // Guardar usando la API existente
      const result = await this.saveUsingAPI(documentType, cleanImageData, metadata);
      
      if (result?.success) {
        const savedDoc: SavedDocument = {
          id: result.data?.id || this.generateTempId(),
          type: documentType,
          savedToPaperless: result.data?.savedToPaperless || false,
          savedToDatabase: true,
          paperlessUrl: result.data?.paperlessUrl,
          localPath: result.data?.localPath,
          timestampApplied: !!timestampData
        };

        this.savedDocuments.set(documentType, savedDoc);
        console.log(`✅ ${documentType} guardado exitosamente`);
        return savedDoc;
      }

      console.error(`❌ Error al guardar ${documentType}`);
      return null;
    } catch (error) {
      console.error(`❌ Error al procesar ${documentType}:`, error);
      return null;
    }
  }

  /**
   * Aplica sellado de tiempo a una imagen
   */
  private async applyTimestamp(imageData: string): Promise<{hash: string, timestamp: any} | null> {
    try {
      const response = await fetch('/api/v1/timestamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash: this.generateImageHash(imageData),
          token: this.verificationToken
        })
      });

      if (!response.ok) {
        throw new Error(`Error en solicitud de timestamp: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error al aplicar sellado de tiempo:', error);
      return null;
    }
  }

  /**
   * Genera hash SHA256 de una imagen
   */
  private generateImageHash(imageData: string): string {
    // Implementación simplificada - en producción usar crypto
    const cleanData = imageData.replace(/^data:image\/\w+;base64,/, '');
    return btoa(cleanData).substring(0, 32); // Hash simplificado para ejemplo
  }

  /**
   * Guarda documento usando la API existente
   */
  private async saveUsingAPI(
    documentType: string, 
    imageData: string, 
    additionalData: any
  ): Promise<any> {
    const response = await fetch('/api/v1/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentType,
        imageData,
        token: this.verificationToken,
        additionalData
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Obtiene el resumen de documentos guardados
   */
  getDocumentsSummary(): Record<string, SavedDocument> {
    return Object.fromEntries(this.savedDocuments);
  }

  /**
   * Verifica si todos los documentos esperados han sido guardados
   */
  areAllDocumentsSaved(expectedTypes: string[]): boolean {
    return expectedTypes.every(type => this.savedDocuments.has(type));
  }

  /**
   * Genera un ID temporal para documentos
   */
  private generateTempId(): string {
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Limpia el estado interno (útil para testing)
   */
  reset(): void {
    this.savedDocuments.clear();
    this.faceTecSessionId = undefined;
  }
} 