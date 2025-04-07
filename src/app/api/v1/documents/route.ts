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
        
        // Subir a Paperless usando los datos originales
        console.log(`API: Llamando a paperlessService.uploadDocument...`);
        paperlessUrl = await paperlessService.uploadDocument(
          body.imageData, // Usar los datos originales
          document.getFileName().toDTO(),
          document.getDocumentType().toDTO(),
          document.getVerificationId().toDTO()
        )
        
        console.log(`API: Resultado de uploadDocument: ${paperlessUrl ? 'URL obtenida' : 'NULL - Falló la subida'}`);
        
        if (paperlessUrl) {
          console.log(`API: ¡ÉXITO! Documento subido a Paperless: ${paperlessUrl}`)
          
          // Ya no actualizamos la ruta en la BD, solo guardamos el ID interno de Paperless
          // document.updateFilePath(new StringValue(paperlessUrl))
          
          // Extraer el ID de Paperless de la URL para referencia
          const paperlessId = paperlessUrl.split('/').filter(Boolean).pop()?.replace('details', '') || '';
          
          // Actualizar el nombre del archivo para reflejar el formato usado en Paperless
          const paperlessFileName = `${document.getDocumentType().toDTO()} - ${document.getVerificationId().toDTO()}`;
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
        paperlessUrl: savedToPaperless ? paperlessUrl : null
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
    const { searchParams } = new URL(req.url)
    const verificationId = searchParams.get('verificationId')
    
    if (!verificationId) {
      return NextResponse.json({ 
        success: false, 
        error: 'VerificationId is required' 
      }, { status: 400 })
    }
    
    // Acceder al repositorio directamente desde el contenedor
    const documentRepository = container.get<DocumentRepository>(DI.DocumentRepository)
    
    // Obtenemos todos los documentos para esta verificación
    const documents = await documentRepository.getByVerificationId(
      new KycVerificationId(verificationId)
    )
    
    return NextResponse.json({ 
      success: true, 
      data: documents.map((d: DocumentEntity) => ({
        id: d.getId().toDTO(),
        documentType: d.getDocumentType().toDTO(),
        filePath: d.getFilePath().toDTO(),
        verificationId: d.getVerificationId().toDTO(),
        verificationStatus: d.getVerificationStatus().toDTO()
      }))
    })
  } catch (error) {
    console.error('Error in Documents API route:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
} 