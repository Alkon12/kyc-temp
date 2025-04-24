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
   * Crea y sube archivos adicionales para un documento con sello de tiempo
   * @param verificationId ID de verificación
   * @param documentType Tipo de documento
   * @param timestampData Datos del sello de tiempo
   * @returns true si se subieron correctamente los archivos adicionales
   */
  private async uploadTimestampFiles(
    verificationId: string, 
    docCategory: string, 
    timestampData: any
  ): Promise<boolean> {
    try {
      console.log(`Paperless: Preparando archivos adicionales para sello de tiempo, doc ${docCategory}`);
      
      // Obtener tags necesarios
      const metadata = await this.getMetadataIds();
      
      // Crear map de tipos de documento para identificación
      const docTypeMap: Record<string, string> = {
        'rostro': 'SELFIE',
        'ine_frente': 'ID_FRONT',
        'ine_reverso': 'ID_BACK'
      };
      
      // Obtener tipo de documento original
      const originalDocType = docTypeMap[docCategory] || docCategory.toUpperCase();
      
      // Crear archivo de texto con el hash
      if (timestampData.hash) {
        const hashContent = `${timestampData.algorithm || 'SHA-256'}: ${timestampData.hash}`;
        const hashFileName = `${verificationId}_${docCategory}_hash.txt`;
        
        // Crear FormData para subir el archivo
        const formData = new FormData();
        const textBlob = new Blob([hashContent], { type: 'text/plain' });
        formData.append('document', textBlob, hashFileName);
        
        // Añadir metadatos básicos - Usar título simplificado sin extensión
        const title = `${originalDocType} - ${verificationId} - hash`;
        formData.append('title', title);
        
        // Obtener tags específicos para el archivo de hash
        let hashTagIds: number[] = [];
        
        // Añadir tag del documento original
        if (metadata) {
          const docTag = metadata.tags.find(t => t.name === originalDocType);
          if (docTag) {
            hashTagIds.push(docTag.id);
          } else {
            const newDocTagId = await this.createTag(originalDocType);
            if (newDocTagId) hashTagIds.push(newDocTagId);
          }
          
          // Añadir tag de que es un archivo HASH
          const hashTag = metadata.tags.find(t => t.name === 'HASH');
          if (hashTag) {
            hashTagIds.push(hashTag.id);
          } else {
            const newHashTagId = await this.createTag('HASH');
            if (newHashTagId) hashTagIds.push(newHashTagId);
          }
        }
        
        // Añadir tags al formData
        if (hashTagIds.length > 0) {
          for (const tagId of hashTagIds) {
            formData.append('tags', tagId.toString());
          }
        }
        
        // Configurar formato de archivo personalizado para organizar documentos con "carpetas virtuales"
        formData.append('filename_format', `${verificationId}/${originalDocType}/{title}`);
        
        // Subir archivo de hash
        try {
          const response = await fetch(`${this.apiUrl}/api/documents/post_document/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${this.apiToken}`
            },
            body: formData
          });
          
          if (response.ok) {
            console.log(`Paperless: Archivo de hash subido correctamente`);
          } else {
            console.error(`Paperless: Error al subir archivo de hash: ${response.status}`);
          }
        } catch (error) {
          console.error(`Paperless: Error al subir archivo de hash:`, error);
        }
      }
      
      // Crear archivo con el certificado de sello de tiempo si existe
      if (timestampData.certificate) {
        const certificateContent = timestampData.certificate;
        // Usar extensión .txt en lugar de .tsr para Paperless
        const certFileName = `${verificationId}_${docCategory}_certificate.txt`;
        
        // Crear FormData para subir el archivo
        const formData = new FormData();
        const certBlob = new Blob([certificateContent], { type: 'text/plain' });
        formData.append('document', certBlob, certFileName);
        
        // Añadir metadatos básicos - Usar título simplificado sin extensión
        const title = `${originalDocType} - ${verificationId} - certificate`;
        formData.append('title', title);
        
        // Obtener tags específicos para el archivo de certificado
        let certTagIds: number[] = [];
        
        // Añadir tag del documento original
        if (metadata) {
          const docTag = metadata.tags.find(t => t.name === originalDocType);
          if (docTag) {
            certTagIds.push(docTag.id);
          } else {
            const newDocTagId = await this.createTag(originalDocType);
            if (newDocTagId) certTagIds.push(newDocTagId);
          }
          
          // Añadir tag de que es un archivo CERTIFICATE
          const certTag = metadata.tags.find(t => t.name === 'CERTIFICATE');
          if (certTag) {
            certTagIds.push(certTag.id);
          } else {
            const newCertTagId = await this.createTag('CERTIFICATE');
            if (newCertTagId) certTagIds.push(newCertTagId);
          }
        }
        
        // Añadir tags al formData
        if (certTagIds.length > 0) {
          for (const tagId of certTagIds) {
            formData.append('tags', tagId.toString());
          }
        }
        
        // Configurar formato de archivo personalizado para organizar documentos con "carpetas virtuales"
        formData.append('filename_format', `${verificationId}/${originalDocType}/{title}`);
        
        // Subir archivo de certificado
        try {
          const response = await fetch(`${this.apiUrl}/api/documents/post_document/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${this.apiToken}`
            },
            body: formData
          });
          
          if (response.ok) {
            console.log(`Paperless: Archivo de certificado subido correctamente`);
          } else {
            console.error(`Paperless: Error al subir archivo de certificado: ${response.status}`);
          }
        } catch (error) {
          console.error(`Paperless: Error al subir archivo de certificado:`, error);
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Paperless: Error al crear y subir archivos adicionales:`, error);
      return false;
    }
  }

  /**
   * Sube un documento a Paperless
   * @param documentBase64 Imagen en formato base64
   * @param documentName Nombre del archivo
   * @param documentType Tipo de documento (SELFIE, ID_FRONT, ID_BACK, etc.)
   * @param verificationId ID de la verificación KYC
   * @param customTags Tags personalizados adicionales
   * @param additionalMetadata Metadatos adicionales para el documento
   * @returns URL del documento en Paperless o null si falló
   */
  async uploadDocument(
    documentBase64: string,
    documentName: string, 
    documentType: string,
    verificationId: string,
    customTags: string[] = [],
    additionalMetadata: any = null
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
      let tagIds: number[] = [];
      
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
        
        // Procesar tags personalizados - simplificar para usar solo el tipo de documento
        if (customTags && customTags.length > 0) {
          console.log(`Paperless: Procesando tags personalizados`);
          
          // Solo conservamos el tag de tipo de documento, eliminamos TIMESTAMP y otros tags redundantes
          const relevantTags = customTags.filter(tag => ['SELFIE', 'ID_FRONT', 'ID_BACK'].includes(tag));
          
          if (relevantTags.length > 0) {
            for (const tagName of relevantTags) {
              // Verificar si el tag ya existe
              const existingTag = metadata.tags.find(t => t.name === tagName);
              if (existingTag) {
                tagIds.push(existingTag.id);
                console.log(`Paperless: Usando tag existente para ${tagName} con ID ${existingTag.id}`);
              } else {
                // Crear el tag
                const newTagId = await this.createTag(tagName);
                if (newTagId) {
                  tagIds.push(newTagId);
                  console.log(`Paperless: Tag personalizado creado con ID ${newTagId}`);
                } else {
                  console.log(`Paperless: Error al crear tag para ${tagName}`);
                }
              }
            }
          }
        }
        
        // En lugar de añadir el tag KYC_{verificationId}, asegurarse de que exista el tag del tipo de documento
        const docType = documentType;
        const existingDocTypeTag = metadata.tags.find(t => t.name === docType);
        if (existingDocTypeTag) {
          if (!tagIds.includes(existingDocTypeTag.id)) {
            tagIds.push(existingDocTypeTag.id);
            console.log(`Paperless: Usando tag existente para tipo de documento ${docType} con ID ${existingDocTypeTag.id}`);
          }
        } else {
          // Crear el tag
          const newTagId = await this.createTag(docType);
          if (newTagId) {
            tagIds.push(newTagId);
            console.log(`Paperless: Tag de tipo de documento creado con ID ${newTagId}`);
          } else {
            console.log(`Paperless: Error al crear tag para tipo de documento ${docType}`);
          }
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
        
        // Generar un título que incluya fecha, tipo de documento y verificación para mejor organización
        // Este enfoque ayuda a que se organice correctamente en Paperless
        const currentDate = new Date();
        const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Determinar subtipo de documento para organizarlo mejor
        let docCategory = '';
        if (documentType === 'SELFIE') {
          docCategory = 'rostro';
        } else if (documentType === 'ID_FRONT') {
          docCategory = 'ine_frente';
        } else if (documentType === 'ID_BACK') {
          docCategory = 'ine_reverso';
        } else {
          docCategory = documentType.toLowerCase();
        }
        
        // Construir un título estructurado para mejor organización en Paperless
        // Usamos un formato más simplificado que será visible en la interfaz - Ajustado al formato tipo - id
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
        
        // Añadir tags si existen (opcional) - Ahora con soporte para múltiples tags
        if (tagIds.length > 0) {
          // En Paperless DMS, los tags múltiples se añaden como parámetros separados con el mismo nombre
          for (const tagId of tagIds) {
            formData.append('tags', tagId.toString());
          }
          console.log(`Paperless: ${tagIds.length} tags añadidos: ${tagIds.join(', ')}`);
        } else {
          console.log(`Paperless: No se añadieron tags (array vacío)`);
        }
        
        // Crear un objeto de metadatos completo
        const completeMetadata = {
          ...(additionalMetadata || {}),
          verificationId: verificationId,
          documentType: documentType,
          uploadDate: dateStr,
          category: docCategory
        };
        
        // Variable para almacenar los datos de timestamp para archivos adicionales
        let timestampData = null;
        
        // Si hay timestamp, añadirlo de forma estructurada
        if (additionalMetadata && (additionalMetadata.timestamp || additionalMetadata.timestampHash)) {
          // Si existe la nueva estructura de timestamp, usarla
          if (additionalMetadata.timestamp) {
            timestampData = additionalMetadata.timestamp;
            completeMetadata.timestampHash = timestampData.hash;
            completeMetadata.timestampDate = timestampData.date;
            completeMetadata.timestampProvider = timestampData.provider?.name;
            
            if (timestampData.certificate) {
              completeMetadata.hasCertificate = true;
            }
          } else if (additionalMetadata.timestampHash) {
            // Estructura anterior - construir un objeto para archivos adicionales
            timestampData = {
              hash: additionalMetadata.timestampHash,
              algorithm: additionalMetadata.timestampSeal?.hash_algorithm || 'SHA-256',
              date: additionalMetadata.timestampSeal?.data?.fechaSello,
              provider: {
                name: additionalMetadata.timestampSeal?.data?.tsa || 'Unknown',
                url: additionalMetadata.timestampSeal?.data?.url
              },
              certificate: additionalMetadata.timestampSeal?.data?.sello,
              verified: true
            };
            
            completeMetadata.timestampHash = additionalMetadata.timestampHash;
            if (additionalMetadata.timestampSeal?.data?.fechaSello) {
              completeMetadata.timestampDate = additionalMetadata.timestampSeal.data.fechaSello;
              completeMetadata.timestampProvider = additionalMetadata.timestampSeal.data.tsa;
              completeMetadata.hasCertificate = !!additionalMetadata.timestampSeal.data.sello;
            }
          }
        }
        
        // Añadir los metadatos completos
        try {
          console.log(`Paperless: Añadiendo metadatos completos:`, completeMetadata);
          
          // 1. Convertir los metadatos a JSON string con formato para el campo document_metadata
          const metadataJson = JSON.stringify(completeMetadata);
          formData.append('document_metadata', metadataJson);
          
          // 2. Añadir cada metadato simple como campo individual para mayor compatibilidad
          Object.entries(completeMetadata).forEach(([key, value]) => {
            // Añadir solo si es una string o número
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
              formData.append(`metadata_${key}`, value.toString());
            }
          });
          
          // 3. Crear un mensaje informativo para las notas
          let notes = `Documento KYC - Verificación: ${verificationId} - Tipo: ${docCategory}`;
          
          // Añadir información sobre el sello de tiempo si existe
          if (completeMetadata.timestampDate) {
            notes += `\nSello de tiempo: ${completeMetadata.timestampDate}`;
            if (completeMetadata.timestampProvider) {
              notes += ` - Proveedor: ${completeMetadata.timestampProvider}`;
            }
            if (completeMetadata.timestampHash) {
              notes += `\nHash: ${completeMetadata.timestampHash.substring(0, 16)}...`;
            }
          }
          
          formData.append('notes', notes);
          console.log(`Paperless: Notas añadidas: "${notes}"`);
          
          console.log(`Paperless: ${Object.keys(completeMetadata).length} metadatos añadidos`);
        } catch (metadataError) {
          console.error(`Paperless: Error al añadir metadatos adicionales:`, metadataError);
        }
        
        console.log(`Paperless: FormData preparado correctamente`);
        
        // 4. Configurar formato de archivo personalizado para organizar documentos con "carpetas virtuales"
        // usando PAPERLESS_FILENAME_FORMAT para estructurar como {id_verificacion}/{tipo_documento}
        formData.append('filename_format', `${verificationId}/{document_type}/{title}`);
        
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
        
        console.log(`Paperless: Documento principal subido exitosamente con ID: ${documentId}`);
        
        // Si tenemos datos de timestamp, subir archivos adicionales
        if (timestampData) {
          console.log(`Paperless: Se dispone de datos de timestamp, procesando archivos adicionales...`);
          // Llamar a la función para subir archivos adicionales
          const filesUploaded = await this.uploadTimestampFiles(verificationId, docCategory, timestampData);
          
          if (filesUploaded) {
            console.log(`Paperless: Archivos adicionales de timestamp subidos correctamente`);
          } else {
            console.error(`Paperless: Error al subir algunos archivos adicionales de timestamp`);
          }
        }
        
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