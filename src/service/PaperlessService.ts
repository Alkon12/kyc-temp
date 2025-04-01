import { injectable } from 'inversify'
import { StringValue } from '@domain/shared/StringValue'

@injectable()
export class PaperlessService {
  private apiUrl: string
  private apiToken: string

  constructor() {
    // Obtener la configuración de las variables de entorno
    this.apiUrl = process.env.PAPERLESS_API_URL || 'http://localhost:8000'
    this.apiToken = process.env.PAPERLESS_TOKEN || ''
    
    if (!this.apiToken) {
      console.error('ADVERTENCIA: No se ha configurado el token de Paperless')
    }
    
    console.log(`PaperlessService inicializado con URL: ${this.apiUrl}`)
  }

  /**
   * Sube un documento a Paperless
   * @param documentBase64 Documento en formato base64
   * @param documentName Nombre del documento
   * @param documentType Tipo de documento (SELFIE, ID_FRONT, ID_BACK)
   * @param verificationId ID de la verificación asociada
   * @returns URL del documento en Paperless o null si falló
   */
  async uploadDocument(
    documentBase64: string,
    documentName: string, 
    documentType: string,
    verificationId: string
  ): Promise<string | null> {
    try {
      if (!this.apiToken) {
        throw new Error('No se ha configurado el token de Paperless')
      }

      console.log(`Paperless: Preparando para subir documento ${documentType} - ${documentName}`)
      
      // Eliminar el prefijo data:image si existe
      const cleanBase64 = documentBase64.replace(/^data:image\/\w+;base64,/, '')
      
      // Crear un FormData para la petición
      const formData = new FormData()
      
      // Convertir a Blob
      const blob = Buffer.from(cleanBase64, 'base64')
      
      // Añadir el documento como un archivo
      formData.append('document', new Blob([blob]), documentName)
      
      // Añadir metadatos como correspondiente tags para Paperless
      formData.append('title', `${documentType} - ${verificationId}`)
      formData.append('correspondent', 'KYC-SERVICE')
      formData.append('tags', documentType)
      formData.append('created', new Date().toISOString())
      
      console.log(`Paperless: Enviando petición a ${this.apiUrl}/api/documents/post_document/`)
      
      // Realizar la petición POST a Paperless
      const response = await fetch(`${this.apiUrl}/api/documents/post_document/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiToken}`
        },
        body: formData
      })
      
      if (!response.ok) {
        console.error(`Error al subir documento a Paperless: ${response.status} ${response.statusText}`)
        
        // Intentar obtener más detalles del error
        try {
          const errorData = await response.text()
          console.error(`Detalles del error: ${errorData}`)
        } catch (e) {
          console.error('No se pudieron obtener detalles adicionales del error')
        }
        
        return null
      }
      
      const result = await response.json()
      console.log(`Paperless: Documento subido exitosamente con ID: ${result.id}`)
      
      // Devolver la URL completa al documento
      return `${this.apiUrl}/documents/${result.id}/`
    } catch (error) {
      console.error('Error al subir documento a Paperless:', error)
      return null
    }
  }
  
  /**
   * Verifica la conectividad con Paperless
   * @returns true si la conexión es exitosa
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiToken) {
        console.error('No se ha configurado el token de Paperless')
        return false
      }
      
      console.log(`Paperless: Probando conexión a ${this.apiUrl}/api/documents/`)
      
      const response = await fetch(`${this.apiUrl}/api/documents/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        console.log('Paperless: Conexión exitosa')
        return true
      } else {
        console.error(`Paperless: Error de conexión - ${response.status} ${response.statusText}`)
        return false
      }
    } catch (error) {
      console.error('Error al conectar con Paperless:', error)
      return false
    }
  }
} 