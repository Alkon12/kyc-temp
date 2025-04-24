import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import type DocumentRepository from '@domain/document/DocumentRepository'
import { DocumentFactory } from '@domain/document/DocumentFactory'
import { StringValue } from '@domain/shared/StringValue'
import { JsonValue } from '@domain/shared/JsonValue'
import { DocumentEntity } from '@domain/document/models/DocumentEntity'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import type VerificationLinkRepository from '@domain/verification-link/VerificationLinkRepository'
import { DocumentId } from '@domain/document/models/DocumentId'
import { v4 } from 'uuid'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class FaceTecDocumentService {
  @inject(DI.DocumentRepository) private readonly _documentRepository!: DocumentRepository
  @inject(DI.VerificationLinkRepository) private readonly _verificationLinkRepository!: VerificationLinkRepository

  /**
   * Guarda una imagen de documento escaneado
   * @param base64Image Imagen en base64
   * @param documentType Tipo de documento (SELFIE, ID_FRONT, ID_BACK)
   * @param token Token de verificación
   * @returns DocumentEntity o null si no se pudo guardar
   */
  async saveDocumentImage(
    base64Image: string, 
    documentType: string, 
    token: string
  ): Promise<DocumentEntity | null> {
    try {
      // 0. Verificar y corregir el formato de base64 si es necesario
      let cleanedBase64Image = base64Image;
      
      // Si no tiene prefijo data:image, añadirlo
      if (cleanedBase64Image && !cleanedBase64Image.startsWith('data:image')) {
        console.log(`Añadiendo prefijo data:image/jpeg;base64, a la imagen ${documentType}`);
        cleanedBase64Image = `data:image/jpeg;base64,${cleanedBase64Image}`;
      }
      
      // Verificar que la imagen no esté vacía
      if (!cleanedBase64Image || cleanedBase64Image.length < 100) {
        console.error(`La imagen ${documentType} parece estar vacía o es inválida`);
        return null;
      }
      
      // 1. Obtener la verificación asociada al token
      const verificationLink = await this._verificationLinkRepository.getByToken(new StringValue(token))
      if (!verificationLink) {
        console.error('No se encontró el enlace de verificación con el token:', token)
        return null
      }

      const verificationId = verificationLink.getVerificationId().toDTO()
      
      // 2. Crear un nombre de archivo único - usar Date.now() + random en lugar de crypto
      const fileExtension = 'jpg' // Asumimos que las imágenes son JPG
      const randomId = Date.now().toString(36) + Math.random().toString(36).substring(2, 15)
      const filename = `${documentType.toLowerCase()}_${randomId}.${fileExtension}`
      
      // 3. Definir la ruta virtual donde se guarda el archivo - debe apuntar a carpeta public
      const virtualFilePath = `/uploads/documents/${filename}`
      
      // 4. Log para confirmar que se está procesando
      console.log(`Preparando para guardar ${documentType} con nombre ${filename}`)
      
      // Calcular el tamaño real de los datos después de limpiar el prefijo (solo para el cálculo)
      let fileSize = 0;
      try {
        const base64WithoutPrefix = cleanedBase64Image.replace(/^data:image\/\w+;base64,/, '');
        fileSize = Buffer.from(base64WithoutPrefix, 'base64').length;
        console.log(`Tamaño de la imagen ${documentType}: ${fileSize} bytes`);
      } catch (e) {
        console.error(`Error al calcular el tamaño de la imagen ${documentType}:`, e);
        fileSize = cleanedBase64Image.length; // Usamos el tamaño del string como fallback
      }
      
      // 5. Crear entrada en la base de datos
      const document = DocumentFactory.create({
        verificationId: new KycVerificationId(verificationId),
        documentType: new StringValue(documentType),
        filePath: new StringValue(virtualFilePath),
        fileName: new StringValue(filename),
        fileSize: fileSize,
        mimeType: new StringValue('image/jpeg'),
        verificationStatus: new StringValue('pending'),
        imageData: new StringValue(cleanedBase64Image) // Guardar la imagen corregida
      })
      
      // 6. Guardar en la base de datos
      return await this._documentRepository.create(document)
    } catch (error) {
      console.error('Error al guardar el documento:', error)
      return null
    }
  }

  /**
   * Guarda la información de OCR de un documento escaneado
   * @param documentId ID del documento
   * @param ocrData Datos de OCR
   * @returns DocumentEntity actualizado o null si falló
   */
  async saveOcrData(documentId: string, ocrData: any): Promise<DocumentEntity | null> {
    try {
      const documentEntity = await this._documentRepository.getById(DocumentFactory.create({
        id: documentId,
        verificationId: new KycVerificationId('placeholder'),
        documentType: new StringValue('placeholder'),
        filePath: new StringValue('placeholder'),
        fileName: new StringValue('placeholder')
      }).getId())

      documentEntity.updateOcrData(ocrData)
      return await this._documentRepository.save(documentEntity)
    } catch (error) {
      console.error('Error al guardar los datos OCR:', error)
      return null
    }
  }

  /**
   * Guarda selfie, ID frontal y trasero en una sola llamada
   * @param selfieImage Selfie en base64
   * @param idFrontImage ID frontal en base64
   * @param idBackImage ID trasero en base64
   * @param token Token de verificación
   * @param faceTecSessionId ID de la sesión de FaceTec
   * @returns true si se guardan todos los documentos correctamente
   */
  async saveVerificationDocuments(
    selfieImage: string,
    idFrontImage: string,
    idBackImage: string | null,
    token: string,
    faceTecSessionId: string,
    faceTecData?: any
  ): Promise<boolean> {
    try {
      const selfieDoc = await this.saveDocumentImage(selfieImage, 'SELFIE', token)
      const idFrontDoc = await this.saveDocumentImage(idFrontImage, 'ID_FRONT', token)
      
      let idBackDoc = null
      if (idBackImage) {
        idBackDoc = await this.saveDocumentImage(idBackImage, 'ID_BACK', token)
      }
      
      // Guardar información adicional de FaceTec si existe
      if (faceTecData && selfieDoc) {
        await this.saveOcrData(selfieDoc.getId().toDTO(), {
          faceTecSessionId,
          faceTecData
        })
      }
      
      return !!(selfieDoc && idFrontDoc && (idBackImage ? idBackDoc : true))
    } catch (error) {
      console.error('Error al guardar documentos de verificación:', error)
      return false
    }
  }

  /**
   * Crea y guarda un documento auxiliar de texto en la base de datos
   * @param verificationId ID de verificación a la que pertenece el documento
   * @param documentType Tipo de documento (como "ID_FRONT_HASH")
   * @param content Contenido del documento
   * @param filename Nombre del archivo
   * @returns DocumentEntity del documento creado o null si falla
   */
  async saveTextDocument(
    verificationId: string,
    documentType: string,
    content: string,
    filename: string
  ): Promise<DocumentEntity | null> {
    try {
      console.log(`FaceTecDocumentService: Guardando documento auxiliar ${documentType} para verificación ${verificationId}`);
      
      // 1. Crear la entidad de documento usando los argumentos correctos
      const document = DocumentFactory.create({
        id: v4(), // UUID como string, no DocumentId
        verificationId: new KycVerificationId(verificationId),
        documentType: new StringValue(documentType),
        filePath: new StringValue('paperless'), // Solo indicamos que está en paperless sin URL específica
        fileName: new StringValue(filename),
        fileSize: content.length, // número primitivo, no NumberValue
        mimeType: new StringValue(documentType.includes('HASH') || documentType.includes('CERTIFICATE') ? 'text/plain' : 'application/json'),
        verificationStatus: new StringValue('saved_paperless'),
        // Guardamos el contenido como metadata OCR para que sea accesible
        ocrData: new JsonValue({ textContent: content }),
        // No necesitamos pasar createdAt y updatedAt, se establecen por defecto
      })
      
      // 2. Guardar en la base de datos
      return await this._documentRepository.create(document)
    } catch (error) {
      console.error(`Error al guardar documento auxiliar:`, error);
      return null;
    }
  }

  /**
   * Guarda documentos auxiliares de timestamp
   * @param documentId ID del documento original
   * @param verificationId ID de verificación
   * @param originalType Tipo de documento original (SELFIE, ID_FRONT, ID_BACK)
   * @param timestampData Datos del timestamp
   * @returns true si se guardaron correctamente
   */
  async saveTimestampAuxiliaryDocuments(
    documentId: string,
    verificationId: string,
    originalType: string,
    timestampData: any
  ): Promise<boolean> {
    try {
      console.log(`FaceTecDocumentService: Guardando documentos auxiliares de timestamp para ${originalType}`);
      
      // 1. Guardar archivo de hash
      if (timestampData.hash) {
        const hashContent = `${timestampData.algorithm || 'SHA-256'}: ${timestampData.hash}`;
        // Usar nombre simplificado sin extensión para base de datos
        const hashFileName = `${originalType} - ${verificationId} - hash`;
        const hashType = `${originalType}_HASH`;
        
        await this.saveTextDocument(
          verificationId,
          hashType,
          hashContent,
          hashFileName
        );
      }
      
      // 2. Guardar archivo de certificado (el archivo de metadatos ya no se guarda)
      if (timestampData.certificate) {
        const certificateContent = timestampData.certificate;
        // Usar nombre simplificado sin extensión para base de datos
        const certFileName = `${originalType} - ${verificationId} - certificate`;
        const certType = `${originalType}_CERTIFICATE`;
        
        await this.saveTextDocument(
          verificationId,
          certType,
          certificateContent,
          certFileName
        );
      }
      
      return true;
    } catch (error) {
      console.error(`Error al guardar documentos auxiliares:`, error);
      return false;
    }
  }
} 