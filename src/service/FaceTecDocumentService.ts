import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import type DocumentRepository from '@domain/document/DocumentRepository'
import { DocumentFactory } from '@domain/document/DocumentFactory'
import { StringValue } from '@domain/shared/StringValue'
import { JsonValue } from '@domain/shared/JsonValue'
import { DocumentEntity } from '@domain/document/models/DocumentEntity'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import type VerificationLinkRepository from '@domain/verification-link/VerificationLinkRepository'

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
} 