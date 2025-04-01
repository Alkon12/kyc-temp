import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextResponse } from 'next/server'
import { FaceTecDocumentService } from '@service/FaceTecDocumentService'
import fs from 'fs/promises'
import path from 'path'
import type DocumentRepository from '@domain/document/DocumentRepository'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { DocumentEntity } from '@domain/document/models/DocumentEntity'

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
    
    // Guardar el documento
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
    console.log(`API: Ruta virtual del documento: ${document.getFilePath().toDTO()}`)
    
    // Si llegamos a este punto y existe imageData, intentamos guardar la imagen físicamente
    if (document.getImageData()) {
      try {
        // Crear directorio si no existe - ahora en carpeta public
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents')
        console.log(`API: Intentando crear directorio: ${uploadDir}`)
        
        await fs.mkdir(uploadDir, { recursive: true })
        console.log(`API: Directorio creado/verificado correctamente`)
        
        // Preparar los datos de la imagen
        const base64Data = document.getImageData()!.toDTO().replace(/^data:image\/\w+;base64,/, '')
        console.log(`API: Datos base64 preparados (${base64Data.substring(0, 20)}...)`)
        
        const filePath = path.join(uploadDir, document.getFileName().toDTO())
        console.log(`API: Ruta completa del archivo: ${filePath}`)
        
        // Guardar la imagen físicamente
        console.log(`API: Intentando escribir el archivo...`)
        await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'))
        
        console.log(`API: ¡ÉXITO! Imagen guardada físicamente en ${filePath}`)
        console.log(`API: La imagen debería estar accesible en: /uploads/documents/${document.getFileName().toDTO()}`)
        
        // Actualizar el documento para indicar que la imagen se guardó correctamente
        document.updateVerificationStatus('saved')
        
        // Acceder al repositorio directamente desde el contenedor
        const documentRepository = container.get<DocumentRepository>(DI.DocumentRepository)
        await documentRepository.save(document)
        console.log(`API: Estado del documento actualizado a 'saved'`)
      } catch (error) {
        console.error('API: Error al guardar la imagen físicamente:', error)
        // No fallamos la solicitud, solo registramos el error
      }
    } else {
      console.error('API: No hay imageData en el documento para guardar físicamente')
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        id: document.getId().toDTO(),
        documentType: document.getDocumentType().toDTO(),
        filePath: document.getFilePath().toDTO(),
        verificationId: document.getVerificationId().toDTO()
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