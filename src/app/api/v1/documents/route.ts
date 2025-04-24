import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextResponse } from 'next/server'
import { FaceTecDocumentService } from '@service/FaceTecDocumentService'
import fs from 'fs/promises'
import path from 'path'
import type DocumentRepository from '@domain/document/DocumentRepository'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { DocumentEntity } from '@domain/document/models/DocumentEntity'
import { PaperlessService } from '@service/PaperlessService'
import { StringValue } from '@domain/shared/StringValue'
import { DocumentId } from '@domain/document/models/DocumentId'
import { JsonValue } from '@domain/shared/JsonValue'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validar datos requeridos
    if (!body.imageData || !body.documentType || !body.token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }
    
    console.log(`API: Recibida solicitud para guardar imagen ${body.documentType}`)
    
    // Verificar si hay datos adicionales
    if (body.additionalData) {
      console.log(`API: Datos adicionales recibidos:`, 
        typeof body.additionalData === 'object' 
          ? Object.keys(body.additionalData).join(', ') 
          : typeof body.additionalData
      )
    }
    
    // Obtener el servicio de documentos
    const documentService = container.get<FaceTecDocumentService>(DI.FaceTecDocumentService)
    const paperlessService = container.get<PaperlessService>(DI.PaperlessService)
    
    // Primero verificar la conexión con Paperless
    console.log('API: Verificando conexión con Paperless...')
    let paperlessConnected = false
    try {
      paperlessConnected = await paperlessService.testConnection()
      console.log(`API: Conexión con Paperless: ${paperlessConnected ? 'OK' : 'Fallida'}`)
    } catch (e) {
      console.error('API: Error al verificar conexión con Paperless:', e)
    }
    
    // Guardar el documento en base de datos primero
    const document = await documentService.saveDocumentImage(
      body.imageData,
      body.documentType,
      body.token
    )
    
    if (!document) {
      console.error(`API: No se pudo crear el documento en la base de datos`)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save document' 
      }, { status: 500 })
    }
    
    console.log(`API: Documento creado en DB con ID ${document.getId().toDTO()}`)
    
    // Si hay datos adicionales, guardarlos como metadatos OCR
    if (body.additionalData) {
      try {
        console.log(`API: Guardando metadatos adicionales para el documento ${document.getId().toDTO()}`)
        
        // Crear una estructura específica para los sellos de tiempo que sea más fácil de consultar
        if (body.additionalData.timestampHash && body.additionalData.timestampSeal) {
          // Estructurar los datos de sellado de tiempo de forma más organizada y accesible
          const timestampData = {
            hash: body.additionalData.timestampHash,
            algorithm: body.additionalData.timestampSeal.hash_algorithm || 'SHA-256',
            date: body.additionalData.timestampSeal.data?.fechaSello || null,
            provider: {
              name: body.additionalData.timestampSeal.data?.tsa || 'Unknown',
              url: body.additionalData.timestampSeal.data?.url || null
            },
            certificate: body.additionalData.timestampSeal.data?.sello || null,
            verified: true // Por defecto asumimos verificado
          };
          
          // Añadir nueva estructura de datos de tiempo a los metadatos
          body.additionalData.timestamp = timestampData;
          
          // También guardar documentos auxiliares en la base de datos
          try {
            // Guardar documentos auxiliares (hash, metadata, certificado) en nuestra base de datos
            await documentService.saveTimestampAuxiliaryDocuments(
              document.getId().toDTO(),
              document.getVerificationId().toDTO(),
              body.documentType,
              timestampData
            );
            
            console.log(`API: Documentos auxiliares de timestamp guardados en base de datos`);
          } catch (auxError) {
            console.error(`API: Error al guardar documentos auxiliares:`, auxError);
          }
        }
        
        await documentService.saveOcrData(document.getId().toDTO(), body.additionalData);
        console.log(`API: Metadatos guardados correctamente en base de datos`);
        
        // Log detallado de los metadatos de timestamp con la nueva estructura
        if (body.additionalData.timestamp) {
          console.log(`API: Datos de sello de tiempo guardados con nueva estructura:`, {
            hash: body.additionalData.timestamp.hash?.substring(0, 20) + '...',
            fechaSello: body.additionalData.timestamp.date || 'No disponible',
            provider: body.additionalData.timestamp.provider?.name || 'No disponible'
          });
        }
      } catch (ocrError) {
        console.error(`API: Error al guardar metadatos:`, ocrError)
      }
    }
    
    let savedToPaperless = false
    let paperlessUrl = null
    
    // Intentar guardar en Paperless como primera opción
    if (paperlessConnected && body.imageData) {
      try {
        console.log('API: Subiendo documento a Paperless...')
        
        // Verificar los datos que tenemos
        console.log(`API: VerificationId: ${document.getVerificationId().toDTO()}`)
        console.log(`API: FileName: ${document.getFileName().toDTO()}`)
        console.log(`API: DocumentType: ${document.getDocumentType().toDTO()}`)
        console.log(`API: Tamaño de ImageData: ${body.imageData?.length || 0} caracteres`)
        
        // Verificar si body.imageData tiene el prefijo correcto
        const hasPrefix = body.imageData?.startsWith('data:image');
        console.log(`API: ImageData tiene prefijo data:image? ${hasPrefix ? 'Sí' : 'No'}`);
        
        // Crear nombres de tags para metadatos importantes si hay datos de sellado de tiempo
        const customTags = [];
        
        // Añadir tag con el tipo de documento (único tag necesario)
        customTags.push(body.documentType);
        
        console.log(`API: Llamando a paperlessService.uploadDocument con tag: ${body.documentType}`);
        
        // Preparar metadatos específicos para Paperless en un formato más simple y directo
        const paperlessMetadata: Record<string, any> = {
          documentType: body.documentType,
          verificationId: document.getVerificationId().toDTO(),
          uploadTime: new Date().toISOString()
        };
        
        // Si hay datos de sellado de tiempo, añadirlos al objeto de metadatos
        if (body.additionalData?.timestamp) {
          // Usar la estructura optimizada
          paperlessMetadata.timestamp = body.additionalData.timestamp;
        } else if (body.additionalData?.timestampHash) {
          // Estructura antigua: construir un objeto equivalente
          paperlessMetadata.timestampHash = body.additionalData.timestampHash;
          
          if (body.additionalData?.timestampSeal?.data) {
            const sealData = body.additionalData.timestampSeal.data;
            paperlessMetadata.timestampDate = sealData.fechaSello;
            paperlessMetadata.timestampProvider = sealData.tsa;
            
            // Incluir un extracto del certificado si existe
            if (sealData.sello) {
              paperlessMetadata.hasCertificate = true;
            }
          }
        }
        
        // Para asegurar que los metadatos se muestren correctamente, también los añadimos como parte del título
        let title = `${body.documentType} - ${document.getVerificationId().toDTO()}`;
        if (paperlessMetadata.timestampDate) {
          title += ` [TSA:${paperlessMetadata.timestampDate.substring(0, 10)}]`;
        }
        
        console.log(`API: Subiendo documento a Paperless con metadatos completos`);
        
        // Subir a Paperless usando los datos originales
        paperlessUrl = await paperlessService.uploadDocument(
          body.imageData, // Usar los datos originales
          document.getFileName().toDTO(),
          document.getDocumentType().toDTO(),
          document.getVerificationId().toDTO(),
          customTags, // Añadir tags personalizados para metadatos importantes
          paperlessMetadata // Pasar metadatos completos para Paperless
        )
        
        console.log(`API: Resultado de uploadDocument: ${paperlessUrl ? 'URL obtenida' : 'NULL - Falló la subida'}`);
        
        if (paperlessUrl) {
          console.log(`API: ¡ÉXITO! Documento subido a Paperless: ${paperlessUrl}`)
          
          // Ya no actualizamos la ruta en la BD, solo guardamos el ID interno de Paperless
          // document.updateFilePath(new StringValue(paperlessUrl))
          
          // Extraer el ID de Paperless de la URL para referencia
          const paperlessId = paperlessUrl.split('/').filter(Boolean).pop()?.replace('details', '') || '';
          
          // Actualizar el nombre del archivo para reflejar el formato usado en Paperless
          // Formato: tipo_documento - verificationId
          const paperlessFileName = `${body.documentType} - ${document.getVerificationId().toDTO()}`;
          document.updateFileName(new StringValue(paperlessFileName))
          document.updateVerificationStatus('saved_paperless')
          
          // Guardamos referencia de que está en Paperless sin la URL
          document.updateFilePath(new StringValue(`paperless:${paperlessId}`))
          
          // Guardar los cambios en la base de datos
          const documentRepository = container.get<DocumentRepository>(DI.DocumentRepository)
          await documentRepository.save(document)
          console.log(`API: Estado del documento actualizado a 'saved_paperless'`)
          
          savedToPaperless = true
        } else {
          console.log(`API: La función uploadDocument retornó NULL, fallo al subir a Paperless`);
        }
      } catch (error) {
        console.error('API: Error al subir a Paperless:', error)
        // Mostrar más detalles del error
        if (error instanceof Error) {
          console.error(`API: Mensaje de error: ${error.message}`);
          console.error(`API: Stack trace: ${error.stack}`);
        }
      }
    } else {
      console.log(`API: No se intentó subir a Paperless. Condiciones: paperlessConnected=${paperlessConnected}, body.imageData=${!!body.imageData}`);
    }
    
    // Si no se pudo guardar en Paperless, guardar localmente como fallback
    if (!savedToPaperless) {
      console.log('API: No se pudo subir a Paperless, guardando localmente como fallback')
      
      // IMPORTANTE: Guardar la imagen localmente como fallback
      // Crear directorio para documentos si no existe
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents')
      await fs.mkdir(uploadDir, { recursive: true })
      
      // Preparar nombre del archivo
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const filename = `${body.documentType.toLowerCase()}_${timestamp}_${randomId}.jpg`
      const filePath = path.join(uploadDir, filename)
      
      // Extraer datos de la imagen
      let base64Data = body.imageData
      if (base64Data.includes('data:image')) {
        base64Data = base64Data.replace(/^data:image\/\w+;base64,/, '')
      }
      
      try {
        // Guardar la imagen localmente
        console.log(`API: Guardando imagen localmente en ${filePath}`)
        await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'))
        console.log(`API: Imagen guardada exitosamente en ${filePath}`)
        
        // Actualizar el estado y la ruta del documento para reflejar que se guardó localmente
        document.updateFilePath(new StringValue(`/uploads/documents/${filename}`))
        document.updateVerificationStatus('saved_local')
        
        // Guardar los cambios en la base de datos
        const documentRepository = container.get<DocumentRepository>(DI.DocumentRepository)
        await documentRepository.save(document)
        
        console.log(`API: Documento actualizado con ruta a la imagen guardada localmente`)
      } catch (saveError) {
        console.error("API: Error al guardar imagen localmente:", saveError)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        id: document.getId().toDTO(),
        documentType: document.getDocumentType().toDTO(),
        filePath: document.getFilePath().toDTO(),
        verificationId: document.getVerificationId().toDTO(),
        storedIn: savedToPaperless ? 'paperless' : 'local',
        paperlessUrl: savedToPaperless ? paperlessUrl : null,
        hasMetadata: !!body.additionalData, // Indicar si se guardaron metadatos
        metadataFields: body.additionalData ? Object.keys(body.additionalData) : [], // Lista de campos de metadatos guardados
        additionalFiles: savedToPaperless && body.additionalData?.timestamp ? [
          `${document.getDocumentType().toDTO()} - ${document.getVerificationId().toDTO()} - hash`,
          body.additionalData.timestamp.certificate ? 
            `${document.getDocumentType().toDTO()} - ${document.getVerificationId().toDTO()} - certificate` : 
            null
        ].filter(Boolean) : [] // Lista de archivos adicionales creados sin extensión
      }
    })
  } catch (error) {
    console.error('Error in Documents API route:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

// Función auxiliar para guardar el documento localmente como fallback
async function saveDocumentLocally(document: DocumentEntity) {
  try {
    // Verificar que tenemos los datos de la imagen
    if (!document.getImageData() || document.getImageData()!.toDTO().length < 100) {
      console.error('API: No hay datos de imagen válidos para guardar localmente');
      return;
    }
    
    // Crear directorio si no existe - en carpeta public
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
    console.log(`API: Intentando crear directorio: ${uploadDir}`);
    
    try {
      // Comprobar si el directorio existe
      const dirStat = await fs.stat(uploadDir).catch(() => null);
      
      if (!dirStat) {
        // Crear directorio y padres si no existen
        await fs.mkdir(uploadDir, { recursive: true });
        console.log(`API: Directorio creado correctamente`);
      } else {
        console.log(`API: Directorio ya existe`);
      }
    } catch (dirError) {
      console.error('API: Error al verificar/crear directorio:', dirError);
      
      // Intentar crear solo el directorio uploads
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        console.log(`API: Directorio uploads creado correctamente`);
        
        // Intentar crear documents dentro de uploads
        await fs.mkdir(uploadDir, { recursive: true });
        console.log(`API: Directorio documents creado correctamente`);
      } catch (e) {
        console.error('API: Error al crear directorios alternativos:', e);
        return; // Si no podemos crear el directorio, no podemos continuar
      }
    }
    
    // Preparar los datos de la imagen
    let base64Data = document.getImageData()!.toDTO();
    
    // Verificar formato de base64
    if (base64Data.includes('data:image')) {
      base64Data = base64Data.replace(/^data:image\/\w+;base64,/, '');
    }
    
    // Verificar que los datos son válidos
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer.length < 100) {
        console.error('API: Los datos base64 parecen inválidos (muy pequeños)');
        return;
      }
      console.log(`API: Datos base64 válidos, tamaño: ${buffer.length} bytes`);
    } catch (e) {
      console.error('API: Error al decodificar base64:', e);
      return;
    }
    
    const filePath = path.join(uploadDir, document.getFileName().toDTO());
    console.log(`API: Ruta completa del archivo: ${filePath}`);
    
    // Guardar la imagen físicamente
    try {
      console.log(`API: Intentando escribir el archivo...`);
      await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
      
      console.log(`API: ¡ÉXITO! Imagen guardada físicamente en ${filePath}`);
      console.log(`API: La imagen debería estar accesible en: /uploads/documents/${document.getFileName().toDTO()}`);
      
      // Actualizar el documento para indicar que la imagen se guardó correctamente
      document.updateVerificationStatus('saved_local');
      
      // Actualizar la ruta si es necesario para que sea accesible desde la web
      const webPath = `/uploads/documents/${document.getFileName().toDTO()}`;
      document.updateFilePath(new StringValue(webPath));
      
      // Acceder al repositorio directamente desde el contenedor
      const documentRepository = container.get<DocumentRepository>(DI.DocumentRepository);
      await documentRepository.save(document);
      console.log(`API: Estado del documento actualizado a 'saved_local'`);
    } catch (fileError) {
      console.error('API: Error al guardar la imagen físicamente:', fileError);
      
      // Intentar con otra ubicación como fallback
      try {
        const tempDir = path.join(process.cwd(), 'tmp');
        await fs.mkdir(tempDir, { recursive: true });
        
        const tempFilePath = path.join(tempDir, document.getFileName().toDTO());
        await fs.writeFile(tempFilePath, Buffer.from(base64Data, 'base64'));
        
        console.log(`API: Imagen guardada en ubicación alternativa: ${tempFilePath}`);
        document.updateFilePath(new StringValue(`/tmp/${document.getFileName().toDTO()}`));
        document.updateVerificationStatus('saved_temp');
        
        const documentRepository = container.get<DocumentRepository>(DI.DocumentRepository);
        await documentRepository.save(document);
      } catch (tempError) {
        console.error('API: Error al guardar en ubicación alternativa:', tempError);
      }
    }
  } catch (error) {
    console.error('API: Error al guardar la imagen físicamente:', error);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const verificationId = searchParams.get('verificationId');
    const documentId = searchParams.get('documentId');
    
    // Validar parámetros requeridos
    if (!verificationId && !documentId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Either verificationId or documentId is required' 
      }, { status: 400 });
    }
    
    // Acceder al repositorio desde el contenedor
    const documentRepository = container.get<DocumentRepository>(DI.DocumentRepository);
    let documents: DocumentEntity[] = [];
    
    // Buscar por documentId si está disponible
    if (documentId) {
      try {
        const document = await documentRepository.getById(new DocumentId(documentId));
        documents = [document];
      } catch (error) {
        return NextResponse.json({ 
          success: false, 
          error: 'Document not found' 
        }, { status: 404 });
      }
    } else if (verificationId) {
      // Buscar por verificationId (ya verificamos que al menos uno existe)
      documents = await documentRepository.getByVerificationId(
        new KycVerificationId(verificationId)
      );
    }
    
    // Definir tipos para los documentos mapeados
    interface DocumentWithMetadata {
      id: string;
      documentType: string;
      filePath: string;
      verificationId: string;
      verificationStatus: string;
      hasMetadata: boolean;
      timestamp: null | {
        hash: string;
        date: string | null;
        provider: string | null;
        certificate: string | null;
      };
    }
    
    // Mapear los documentos para incluir metadatos OCR si existen
    const mappedDocuments = await Promise.all(documents.map(async (d: DocumentEntity) => {
      const doc: DocumentWithMetadata = {
        id: d.getId().toDTO(),
        documentType: d.getDocumentType().toDTO(),
        filePath: d.getFilePath().toDTO(),
        verificationId: d.getVerificationId().toDTO(),
        verificationStatus: d.getVerificationStatus().toDTO(),
        hasMetadata: false,
        timestamp: null
      };
      
      // Añadir metadatos OCR si existen
      const ocrData = d.getOcrData();
      if (ocrData) {
        doc.hasMetadata = true;
        
        // Necesitamos acceder al valor real para extraer los metadatos
        const ocrValue = ocrData.toDTO();
        
        // Extraer información de timestamp si existe (verificando que las propiedades existan)
        if (ocrValue && typeof ocrValue === 'object') {
          // Hacer un type cast para acceder a las propiedades
          const metadata = ocrValue as Record<string, any>;
          
          // Primero verificar si existe la estructura nueva optimizada
          if (metadata.timestamp) {
            const timestamp = metadata.timestamp;
            const showFull = searchParams.get('full') === 'true';
            
            doc.timestamp = {
              hash: timestamp.hash,
              date: timestamp.date || null,
              provider: timestamp.provider?.name || null,
              certificate: timestamp.certificate ? 
                (showFull ? timestamp.certificate : timestamp.certificate.substring(0, 50) + '...') : 
                null
            };
          }
          // Si no hay formato nuevo, intentar con el formato antiguo
          else if (metadata.timestampHash && metadata.timestampSeal) {
            const seal = metadata.timestampSeal;
            const showFull = searchParams.get('full') === 'true';
            
            doc.timestamp = {
              hash: metadata.timestampHash as string,
              date: seal.data?.fechaSello || null,
              provider: seal.data?.tsa || null,
              certificate: seal.data?.sello ? 
                (showFull ? seal.data.sello : seal.data.sello.substring(0, 50) + '...') : 
                null
            };
          }
        }
      }
      
      return doc;
    }));
    
    return NextResponse.json({ 
      success: true, 
      count: mappedDocuments.length,
      data: mappedDocuments
    });
  } catch (error) {
    console.error('Error in Documents API route:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

// Función auxiliar para obtener el nombre de categoría de documento
function getDocCategory(documentType: string): string {
  switch (documentType) {
    case 'SELFIE':
      return 'rostro';
    case 'ID_FRONT':
      return 'ine_frente';
    case 'ID_BACK':
      return 'ine_reverso';
    default:
      return documentType.toLowerCase();
  }
} 