import { useState, useEffect, useCallback } from 'react';
import { FaceTecDocumentManager } from '../services/FaceTecDocumentManager';

interface DocumentStatus {
  selfie: boolean;
  idFront: boolean;
  idBack: boolean;
  allSaved: boolean;
  summary: Record<string, any>;
}

interface UseFaceTecDocumentsProps {
  verificationToken: string;
  isHighLevelVerification?: boolean; // Para aplicar sellado de tiempo
}

interface UseFaceTecDocumentsReturn {
  documentManager: FaceTecDocumentManager;
  documentStatus: DocumentStatus;
  saveSelfie: (selfieImage: string, sessionResult: any) => Promise<boolean>;
  saveIdImages: (frontImage: string, backImage: string | null, idScanResult: any) => Promise<boolean>;
  resetDocuments: () => void;
  isDocumentSaved: (type: string) => boolean;
}

/**
 * Hook personalizado para manejar el guardado de documentos de FaceTec
 * Integra el nuevo FaceTecDocumentManager con el flujo refactorizado
 */
export const useFaceTecDocuments = ({
  verificationToken,
  isHighLevelVerification = false
}: UseFaceTecDocumentsProps): UseFaceTecDocumentsReturn => {
  const [documentManager] = useState(() => new FaceTecDocumentManager(verificationToken));
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
    selfie: false,
    idFront: false,
    idBack: false,
    allSaved: false,
    summary: {}
  });

  // Actualizar el estado cuando cambien los documentos guardados
  const updateDocumentStatus = useCallback(() => {
    const summary = documentManager.getDocumentsSummary();
    
    setDocumentStatus({
      selfie: documentManager.areAllDocumentsSaved(['SELFIE']),
      idFront: documentManager.areAllDocumentsSaved(['ID_FRONT']),
      idBack: documentManager.areAllDocumentsSaved(['ID_BACK']),
      allSaved: documentManager.areAllDocumentsSaved(['SELFIE', 'ID_FRONT']), // ID_BACK es opcional
      summary
    });
  }, [documentManager]);

  /**
   * Guarda la selfie con las opciones configuradas
   */
  const saveSelfie = useCallback(async (
    selfieImage: string, 
    sessionResult: any
  ): Promise<boolean> => {
    try {
      console.log('Guardando selfie con FaceTecDocumentManager...');
      
      const result = await documentManager.saveSelfie(
        selfieImage, 
        sessionResult, 
        {
          applyTimestamp: isHighLevelVerification,
          additionalMetadata: {
            sessionTimestamp: new Date().toISOString(),
            verificationType: isHighLevelVerification ? 'PREMIUM' : 'BASIC'
          }
        }
      );
      
      if (result) {
        updateDocumentStatus();
        console.log('Selfie guardada exitosamente:', result);
        return true;
      }
      
      console.error('Error al guardar selfie');
      return false;
    } catch (error) {
      console.error('Error al guardar selfie:', error);
      return false;
    }
  }, [documentManager, isHighLevelVerification, updateDocumentStatus]);

  /**
   * Guarda las imágenes del documento de identidad
   */
  const saveIdImages = useCallback(async (
    frontImage: string, 
    backImage: string | null, 
    idScanResult: any
  ): Promise<boolean> => {
    try {
      console.log('Guardando imágenes de ID con FaceTecDocumentManager...');
      
      const options = {
        applyTimestamp: isHighLevelVerification,
        additionalMetadata: {
          scanTimestamp: new Date().toISOString(),
          verificationType: isHighLevelVerification ? 'PREMIUM' : 'BASIC'
        }
      };
      
      // Guardar imagen frontal
      const frontResult = await documentManager.saveIdFront(frontImage, idScanResult, options);
      if (!frontResult) {
        console.error('Error al guardar imagen frontal del ID');
        return false;
      }
      
      // Guardar imagen trasera si existe
      let backResult = true;
      if (backImage) {
        backResult = !!(await documentManager.saveIdBack(backImage, idScanResult, options));
        if (!backResult) {
          console.error('Error al guardar imagen trasera del ID');
        }
      }
      
      if (frontResult && backResult) {
        updateDocumentStatus();
        console.log('Imágenes de ID guardadas exitosamente');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al guardar imágenes de ID:', error);
      return false;
    }
  }, [documentManager, isHighLevelVerification, updateDocumentStatus]);

  /**
   * Verifica si un tipo específico de documento ha sido guardado
   */
  const isDocumentSaved = useCallback((type: string): boolean => {
    return documentManager.areAllDocumentsSaved([type]);
  }, [documentManager]);

  /**
   * Resetea el estado de documentos
   */
  const resetDocuments = useCallback(() => {
    documentManager.reset();
    updateDocumentStatus();
    console.log('Estado de documentos reseteado');
  }, [documentManager, updateDocumentStatus]);

  // Actualizar el estado inicial
  useEffect(() => {
    updateDocumentStatus();
  }, [updateDocumentStatus]);

  return {
    documentManager,
    documentStatus,
    saveSelfie,
    saveIdImages,
    resetDocuments,
    isDocumentSaved
  };
}; 