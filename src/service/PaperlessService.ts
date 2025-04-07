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
   * Obtiene los IDs de los correspondientes y tags necesarios para subir documentos
   * @returns Objeto con IDs o null si hay error
   */
  private async getMetadataIds(): Promise<{ correspondents: any[], tags: any[] } | null> {
    try {
      // Obtener correspondents
      const correspondentsResponse = await fetch(`${this.apiUrl}/api/correspondents/`, {
        headers: {
          'Authorization': `Token ${this.apiToken}`
        }
      });
      
      if (!correspondentsResponse.ok) {
        console.error('Error al obtener correspondents');
        return null;
      }
      
      // Obtener tags
      const tagsResponse = await fetch(`${this.apiUrl}/api/tags/`, {
        headers: {
          'Authorization': `Token ${this.apiToken}`
        }
      });
      
      if (!tagsResponse.ok) {
        console.error('Error al obtener tags');
        return null;
      }
      
      const correspondents = await correspondentsResponse.json();
      const tags = await tagsResponse.json();
      
      console.log(`Paperless: Encontrados ${correspondents.count} correspondents y ${tags.count} tags`);
      
      return {
        correspondents: correspondents.results || [],
        tags: tags.results || []
      };
    } catch (error) {
      console.error('Error al obtener metadatos:', error);
      return null;
    }
  }

  /**
   * Crea un correspondent en Paperless
   * @param name Nombre del correspondent
   * @returns ID del correspondent creado o null si hay error
   */
  private async createCorrespondent(name: string): Promise<number | null> {
    try {
      console.log(`Paperless: Creando correspondent "${name}"`);
      
      const response = await fetch(`${this.apiUrl}/api/correspondents/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name
        })
      });
      
      if (!response.ok) {
        console.error(`Paperless: Error al crear correspondent: ${response.status}`);
        const errorText = await response.text();
        console.error(`Detalles: ${errorText}`);
        return null;
      }
      
      const result = await response.json();
      console.log(`Paperless: Correspondent creado con ID ${result.id}`);
      return result.id;
    } catch (error) {
      console.error('Paperless: Error al crear correspondent:', error);
      return null;
    }
  }
  
  /**
   * Crea un tag en Paperless
   * @param name Nombre del tag
   * @returns ID del tag creado o null si hay error
   */
  private async createTag(name: string): Promise<number | null> {
    try {
      console.log(`Paperless: Creando tag "${name}"`);
      
      // Generar un color aleatorio para el tag
      const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      
      const response = await fetch(`${this.apiUrl}/api/tags/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          color: color
        })
      });
      
      if (!response.ok) {
        console.error(`Paperless: Error al crear tag: ${response.status}`);
        const errorText = await response.text();
        console.error(`Detalles: ${errorText}`);
        return null;
      }
      
      const result = await response.json();
      console.log(`Paperless: Tag creado con ID ${result.id}`);
      return result.id;
    } catch (error) {
      console.error('Paperless: Error al crear tag:', error);
      return null;
    }
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

      console.log(`Paperless: Preparando para subir documento ${documentType} - ${documentName} - ID: ${verificationId}`)
      
      // Verificar que documentBase64 no sea undefined o null
      if (!documentBase64) {
        console.error('Paperless: Error - documentBase64 es null o undefined');
        return null;
      }
      
      // Verificar longitud inicial del string
      console.log(`Paperless: Longitud inicial de documentBase64: ${documentBase64.length} caracteres`);
      
      // Eliminar el prefijo data:image si existe
      let cleanBase64 = documentBase64;
      if (cleanBase64.includes('data:image')) {
        const oldLength = cleanBase64.length;
        cleanBase64 = cleanBase64.replace(/^data:image\/\w+;base64,/, '');
        console.log(`Paperless: Prefijo eliminado. Longitud antes: ${oldLength}, después: ${cleanBase64.length}`);
      } else {
        console.log(`Paperless: No se encontró prefijo data:image en los datos`);
      }
      
      // Log del tamaño de la imagen para depuración
      let imageBytes;
      try {
        imageBytes = Buffer.from(cleanBase64, 'base64');
        console.log(`Paperless: Tamaño de imagen para subir: ${imageBytes.length} bytes`);
      } catch (bufferError) {
        console.error('Paperless: Error al crear buffer desde base64:', bufferError);
        return null;
      }
      
      // Verificar que la imagen tenga un tamaño razonable
      if (imageBytes.length < 100) {
        console.error(`Paperless: Error - La imagen es demasiado pequeña (${imageBytes.length} bytes), posible error en datos base64`);
        // Mostrar los primeros 100 caracteres para diagnóstico
        console.error(`Paperless: Primeros 100 caracteres de base64: ${cleanBase64.substring(0, 100)}...`);
        return null;
      }
      
      // Obtener o crear metadatos necesarios
      let correspondentId = null;
      let tagId = null;
      
      // Primero verificar si existe el correspondent
      console.log(`Paperless: Obteniendo metadatos...`);
      const metadata = await this.getMetadataIds();
      
      if (!metadata) {
        console.error('Paperless: Error al obtener metadatos, continuando sin correspondent ni tags');
      } else {
        // Procesamiento de correspondent y tags
        console.log(`Paperless: Procesando correspondent y tags...`);
        
        // Buscar si ya existe correspondent KYC-SERVICE
        const kycCorrespondent = metadata.correspondents.find(c => c.name === 'KYC-SERVICE');
        if (kycCorrespondent) {
          correspondentId = kycCorrespondent.id;
          console.log(`Paperless: Usando correspondent existente con ID ${correspondentId}`);
        } else {
          // Crear el correspondent
          correspondentId = await this.createCorrespondent('KYC-SERVICE');
          console.log(`Paperless: Correspondent creado con ID ${correspondentId || 'NULL - Error'}`);
        }
        
        // Buscar tag que coincida con el tipo de documento
        const docTypeTag = metadata.tags.find(t => t.name === documentType);
        if (docTypeTag) {
          tagId = docTypeTag.id;
          console.log(`Paperless: Usando tag existente para ${documentType} con ID ${tagId}`);
        } else {
          // Crear el tag
          tagId = await this.createTag(documentType);
          console.log(`Paperless: Tag creado con ID ${tagId || 'NULL - Error'}`);
        }
      }
      
      // ENFOQUE ALTERNATIVO: Usar FormData nativo de node-fetch si está disponible, 
      // o una librería como form-data si es necesario
      console.log(`Paperless: Utilizando aproximación con multipart/form-data nativo`);
      
      try {
        // Usar el FormData que está en el entorno global
        // Esto funcionará en navegadores y Node.js >= 18 o con polyfills adecuados
        const formData = new FormData();
        
        // Determinar el tipo MIME basado en datos o nombre de archivo
        let mimeType = 'image/jpeg';
        if (documentName.toLowerCase().endsWith('.png')) {
          mimeType = 'image/png';
        }
        console.log(`Paperless: Usando MIME type: ${mimeType}`);
        
        // USANDO APROXIMACIÓN ALTERNATIVA CON BUFFER DIRECTO
        // Crear un archivo a partir del buffer
        console.log(`Paperless: Creando archivo desde buffer (${imageBytes.length} bytes)`);
        
        // Intentar opciones diferentes para máxima compatibilidad
        try {
          // Opción 1: Aproximación con Blob
          const blob = new Blob([imageBytes], { type: mimeType });
          formData.append('document', blob, documentName);
          console.log(`Paperless: Opción 1 (Blob) utilizada correctamente`);
        } catch (blobError) {
          console.error(`Paperless: Error con Blob, intentando con opciones alternativas:`, blobError);
          
          try {
            // Opción 2: Usar File si está disponible
            const file = new File([imageBytes], documentName, { type: mimeType });
            formData.append('document', file);
            console.log(`Paperless: Opción 2 (File) utilizada correctamente`);
          } catch (fileError) {
            console.error(`Paperless: Error con File, intentando con buffer:`, fileError);
            
            // Opción 3: Usar Buffer directamente (puede funcionar dependiendo de la implementación de FormData)
            try {
              // Asignar un filename manualmente para compatibilidad máxima
              const options = {
                filename: documentName,
                contentType: mimeType
              };
              
              // Añadir el buffer como archivo, usando opciones si el FormData las soporta
              // Convertir el buffer a Blob para compatibilidad
              const bufferBlob = new Blob([new Uint8Array(imageBytes)], { type: mimeType });
              formData.append('document', bufferBlob, documentName);
              console.log(`Paperless: Opción 3 (Buffer convertido a Blob) utilizada correctamente`);
            } catch (bufferAppendError) {
              // Último recurso - añadir como string
              console.error(`Paperless: Error al añadir buffer:`, bufferAppendError);
              console.log(`Paperless: Intentando último recurso - convertir a string base64`);
              
              // Añadir como string base64 con un nombre de archivo
              const base64String = imageBytes.toString('base64');
              formData.append('document', base64String);
              formData.append('filename', documentName);
              console.log(`Paperless: Último recurso utilizado - base64 string`);
            }
          }
        }
        
        // Añadir título - Este siempre es requerido
        const title = `${documentType} - ${verificationId}`;
        formData.append('title', title);
        console.log(`Paperless: title añadido: "${title}"`);
        
        // Añadir correspondent si existe (opcional)
        if (correspondentId) {
          formData.append('correspondent', correspondentId.toString());
          console.log(`Paperless: correspondent añadido: ${correspondentId}`);
        } else {
          console.log(`Paperless: No se añadió correspondent (valor null)`);
        }
        
        // Añadir tags si existen (opcional)
        if (tagId) {
          formData.append('tags', tagId.toString());
          console.log(`Paperless: tag añadido: ${tagId}`);
        } else {
          console.log(`Paperless: No se añadió tag (valor null)`);
        }
        
        console.log(`Paperless: FormData preparado correctamente`);
        
        // Mostrar el tamaño aproximado del FormData (no es preciso)
        try {
          // Intentar obtener una métrica del tamaño
          const keys = Array.from((formData as any).keys ? (formData as any).keys() : []);
          console.log(`Paperless: FormData contiene ${keys.length} campos`);
        } catch (e) {
          console.log(`Paperless: No se pudo determinar el tamaño del FormData`);
        }
        
        console.log(`Paperless: Enviando petición a ${this.apiUrl}/api/documents/post_document/`);
        
        // Realizar la petición POST a Paperless
        console.log(`Paperless: Iniciando fetch request...`);
        const response = await fetch(`${this.apiUrl}/api/documents/post_document/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${this.apiToken}`
            // No añadir Content-Type, FormData lo establece con el boundary correcto
          },
          body: formData
        });
        
        console.log(`Paperless: Respuesta recibida con status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          console.error(`Error al subir documento a Paperless: ${response.status} ${response.statusText}`);
          
          // Intentar obtener más detalles del error
          try {
            const errorData = await response.text();
            console.error(`Detalles del error: ${errorData}`);
          } catch (e) {
            console.error('No se pudieron obtener detalles adicionales del error');
          }
          
          return null;
        }
        
        // Parsear la respuesta
        const responseText = await response.text();
        console.log(`Paperless: Respuesta del servidor: "${responseText}"`);
        
        let documentId;
        
        try {
          // Intentar parsear como JSON
          const result = JSON.parse(responseText);
          documentId = result.id || responseText.replace(/"/g, '');
          console.log(`Paperless: JSON parseado, ID: ${documentId}`);
        } catch (e) {
          // Si no es JSON, podría ser solo el ID como string con comillas
          documentId = responseText.replace(/"/g, '');
          console.log(`Paperless: No es JSON válido, ID extraído: ${documentId}`);
        }
        
        console.log(`Paperless: Documento subido exitosamente con ID: ${documentId}`);
        
        // Devolver la URL completa al documento
        const documentUrl = `${this.apiUrl}/documents/${documentId}/details`;
        console.log(`Paperless: URL del documento: ${documentUrl}`);
        return documentUrl;
      } catch (formError) {
        console.error(`Paperless: Error general en proceso de FormData:`, formError);
        if (formError instanceof Error) {
          console.error(`Paperless: Mensaje: ${formError.message}`);
          console.error(`Paperless: Stack: ${formError.stack}`);
        }
        return null;
      }
    } catch (error) {
      console.error('Error al subir documento a Paperless:', error);
      if (error instanceof Error) {
        console.error(`Mensaje: ${error.message}`);
        console.error(`Stack: ${error.stack}`);
      }
      return null;
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