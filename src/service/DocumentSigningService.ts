import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { SignedDocumentEntity } from '@domain/signedDocument/models/SignedDocumentEntity'
import AbstractSignedDocumentService from '@domain/signedDocument/SignedDocumentService'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'
import { SignedDocumentId } from '@domain/signedDocument/models/SignedDocumentId'
import { DocusealApiService, DocusealFieldValue } from './DocusealApiService'
import AbstractKycPersonService from '@domain/kycPerson/KycPersonService'
import { StringValue } from '@domain/shared/StringValue'
import AbstractDocusealTemplateService from '@domain/docuseal/DocusealTemplateService'

export interface DocumentToSign {
  documentId: string;
  templateId: string;
  status: string;
  signerEmail?: string;
  signerPhone?: string;
}

export interface SigningData {
  nombre?: string;
  curp?: string;
  [key: string]: string | undefined;
}

@injectable()
export class DocumentSigningService {
  constructor(
    @inject(DI.SignedDocumentService) private signedDocumentService: AbstractSignedDocumentService,
    @inject(DI.DocusealApiService) private docusealApiService: DocusealApiService,
    @inject(DI.KycPersonService) private kycPersonService: AbstractKycPersonService,
    @inject(DI.DocusealTemplateService) private docusealTemplateService: AbstractDocusealTemplateService
  ) {}

  /**
   * Detecta si una verificación KYC tiene documentos pendientes por firmar
   * @param verificationId ID de la verificación KYC
   * @returns Array de documentos por firmar con sus templateIds
   */
  async getDocumentsToSign(verificationId: string): Promise<DocumentToSign[]> {
    try {
      const kycVerificationId = new KycVerificationId(verificationId);
      const pendingDocuments = await this.signedDocumentService.getByVerificationId(kycVerificationId);
      
      // Filtrar solo documentos en estado pendiente
      const documentsToSign = pendingDocuments
        .filter(doc => doc.getStatus().toDTO() === 'pending')
        .map(doc => ({
          documentId: doc.getId().toDTO(),
          templateId: doc.getTemplateId().toDTO(),
          status: doc.getStatus().toDTO(),
          signerEmail: doc.getSignerEmail()?.toDTO(),
          signerPhone: doc.getSignerPhone()?.toDTO()
        }));
      
      return documentsToSign;
    } catch (error) {
      console.error(`Error al obtener documentos para firmar de verificación ${verificationId}:`, error);
      return [];
    }
  }
  
  /**
   * Verifica si una verificación KYC tiene documentos por firmar
   * @param verificationId ID de la verificación KYC
   * @returns true si hay documentos pendientes por firmar, false en caso contrario
   */
  async hasDocumentsToSign(verificationId: string): Promise<boolean> {
    const documentsToSign = await this.getDocumentsToSign(verificationId);
    return documentsToSign.length > 0;
  }
  
  /**
   * Obtiene el ID de la plantilla Docuseal para un documento específico
   * @param documentId ID del documento firmado
   * @returns DocusealTemplateId o undefined si no se encuentra
   */
  async getDocusealTemplateId(documentId: string): Promise<DocusealTemplateId | undefined> {
    try {
      // Convertir el string a SignedDocumentId
      const signedDocumentId = new SignedDocumentId(documentId);
      const document = await this.signedDocumentService.getById(signedDocumentId);
      return document.getTemplateId();
    } catch (error) {
      console.error(`Error al obtener plantilla para documento ${documentId}:`, error);
      return undefined;
    }
  }
  
  /**
   * Obtiene el docusealTemplateId (ID externo en Docuseal) para una plantilla interna
   * @param internalTemplateId ID interno de la plantilla en nuestra base de datos
   * @returns ID externo en Docuseal o undefined si no se encuentra
   */
  async getExternalTemplateId(internalTemplateId: string): Promise<string | undefined> {
    try {
      console.log(`[DocumentSigningService] Buscando docusealTemplateId para plantilla interna: ${internalTemplateId}`);
      const template = await this.docusealTemplateService.getById(new DocusealTemplateId(internalTemplateId));
      
      if (template) {
        const docusealTemplateId = template.getDocusealTemplateId().toDTO();
        console.log(`[DocumentSigningService] Encontrado docusealTemplateId: ${docusealTemplateId}`);
        return docusealTemplateId;
      }
      
      console.log(`[DocumentSigningService] No se encontró docusealTemplateId para plantilla: ${internalTemplateId}`);
      return undefined;
    } catch (error) {
      console.error(`[DocumentSigningService] Error al obtener docusealTemplateId:`, error);
      return undefined;
    }
  }
  
  /**
   * Obtiene datos de la plantilla de Docuseal incluyendo sus campos
   * @param templateId ID de la plantilla
   * @returns Información completa de la plantilla
   */
  async getTemplateDetails(templateId: string) {
    return this.docusealApiService.getTemplateById(templateId);
  }
  
  /**
   * Envía un documento para firma con valores prellenados
   * @param documentId ID del documento a enviar
   * @param data Datos opcionales para prellenar en el documento
   * @returns Resultado de la operación
   */
  async sendDocumentForSigning(documentId: string, data?: Record<string, any>): Promise<any> {
    try {
      // Obtener el documento
      const signedDocumentId = new SignedDocumentId(documentId);
      const document = await this.signedDocumentService.getById(signedDocumentId);
      
      // Obtener el ID de la plantilla INTERNA (no el ID de Docuseal)
      const internalTemplateId = document.getTemplateId().toDTO();
      
      console.log(`[DocumentSigningService] Documento encontrado, templateId interno: ${internalTemplateId}`);
      
      // Obtener el ID EXTERNO de la plantilla (docusealTemplateId) a través del servicio de plantillas
      let docusealTemplateId;
      
      try {
        docusealTemplateId = await this.getExternalTemplateId(internalTemplateId);
        
        if (!docusealTemplateId) {
          // Si no se encuentra el ID externo, usar el ID 1 como fallback
          console.log(`[DocumentSigningService] ⚠️ No se encontró docusealTemplateId, usando ID 1 como fallback`);
          docusealTemplateId = "1";
        } else {
          console.log(`[DocumentSigningService] ✅ Usando docusealTemplateId: ${docusealTemplateId}`);
        }
      } catch (templateError) {
        console.error(`[DocumentSigningService] Error al obtener docusealTemplateId, usando ID 1:`, templateError);
        docusealTemplateId = "1";
      }
      
      // Obtener el email y teléfono del firmante si existen
      const signerEmail = document.getSignerEmail()?.toDTO();
      const signerPhone = document.getSignerPhone()?.toDTO();
      
      // Intentar obtener los detalles de la plantilla para identificar campos
      let template;
      let usedTemplateId = docusealTemplateId;
      
      try {
        template = await this.docusealApiService.getTemplateById(docusealTemplateId);
      } catch (templateError) {
        console.error(`Error al obtener plantilla Docuseal ${docusealTemplateId}:`, templateError);
        
        // Fallback: intentar con la plantilla ID 1
        console.log('⚠️ Intentando con la plantilla de fallback ID: 1');
        try {
          template = await this.docusealApiService.getTemplateById('1');
          usedTemplateId = '1';
          console.log('✅ Plantilla de fallback obtenida correctamente');
        } catch (fallbackError) {
          console.error('❌ Error al obtener plantilla de fallback:', fallbackError);
          throw new Error(`No se pudo obtener la plantilla original ni la de fallback: ${templateError instanceof Error ? templateError.message : 'Error desconocido'}`);
        }
      }
      
      if (!template || !template.submitters || template.submitters.length === 0) {
        throw new Error(`No se encontró la plantilla con ID ${usedTemplateId} o no tiene firmantes configurados`);
      }
      
      // Obtener el UUID del primer firmante
      const submitterUuid = template.submitters[0].uuid;
      
      // Convertir los valores al formato de objeto que espera Docuseal (uuid: value)
      const fieldValues: Record<string, string> = {};
      
      // Si tenemos datos para prellenar, buscar los campos correspondientes en la plantilla
      if (data && template.fields) {
        // Recorrer los campos disponibles en la plantilla
        for (const field of template.fields) {
          // Obtener el nombre del campo en minúsculas para hacer la comparación insensible a mayúsculas
          const fieldNameLower = field.name.toLowerCase();
          
          // Recorrer los datos proporcionados buscando coincidencias
          for (const [dataKey, dataValue] of Object.entries(data)) {
            // Si el nombre del campo coincide con alguna de las claves de datos
            if (fieldNameLower === dataKey.toLowerCase() && dataValue) {
              // Añadir el campo al objeto de valores
              fieldValues[field.uuid] = String(dataValue);
              
              console.log(`Campo encontrado: ${field.name}, valor: ${dataValue}`);
              break;
            }
          }
        }
      }
      
      // Preparar datos para el envío
      const submissionData = {
        submitter_uuid: submitterUuid,
        values: fieldValues,
        email: signerEmail,
        phone: signerPhone,
        name: data?.nombre || data?.name || undefined
      };
      
      console.log(`Enviando documento para firma con email: ${signerEmail}, usando template ID: ${usedTemplateId}`);
      
      // Asegurar que el templateId sea un número para la API
      // Docuseal a veces espera valores numéricos para template_id
      const numericTemplateId = parseInt(usedTemplateId);
      const finalTemplateId = !isNaN(numericTemplateId) ? numericTemplateId : usedTemplateId;
      
      // Enviar la solicitud de firma
      const result = await this.docusealApiService.createSubmissionWithPrefill(String(finalTemplateId), submissionData);
      
      // Actualizar el documento con el ID de la solicitud
      if (result && result.length > 0 && result[0].id) {
        await this.signedDocumentService.updateDocusealSubmissionId(
          signedDocumentId,
          String(result[0].id)
        );
        
        // También actualizar el estado a "in_progress"
        await this.signedDocumentService.updateStatus(
          signedDocumentId,
          "in_progress"
        );
        
        // Log de éxito
        console.log(`✅ Documento enviado correctamente. ID de submission: ${result[0].id}, estado: ${result[0].status}`);
      } else {
        console.log(`⚠️ Documento enviado pero no se recibió ID de submission en la respuesta`);
      }
      
      return result;
    } catch (error) {
      console.error(`Error al enviar documento ${documentId} para firma:`, error);
      throw error;
    }
  }
} 