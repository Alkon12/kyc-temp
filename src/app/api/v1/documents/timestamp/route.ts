import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextResponse } from 'next/server'
import type DocumentRepository from '@domain/document/DocumentRepository'
import { DocumentId } from '@domain/document/models/DocumentId'

/**
 * Endpoint específico para obtener información del sello de tiempo de un documento
 * 
 * Permite consultar y verificar los datos de sellado de tiempo sin necesidad de acceder
 * a Paperless, útil para aplicaciones que necesitan verificar el sello directamente.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Document ID is required' 
      }, { status: 400 });
    }
    
    // Obtener el documento de la base de datos
    const documentRepository = container.get<DocumentRepository>(DI.DocumentRepository);
    
    try {
      const document = await documentRepository.getById(new DocumentId(documentId));
      
      // Verificar si el documento tiene datos OCR (donde estaría el sello)
      const ocrData = document.getOcrData();
      if (!ocrData) {
        return NextResponse.json({ 
          success: false, 
          error: 'Document does not have metadata',
          documentId: documentId,
          hasMetadata: false
        }, { status: 404 });
      }
      
      // Obtener los metadatos - convertir a unknown primero y luego al tipo deseado
      const metadata = ocrData.toDTO() as unknown as Record<string, any>;
      
      // Primero verificar si existe la estructura nueva optimizada
      if (metadata.timestamp) {
        // Incluir el certificado completo solo si se solicita
        const showFullCertificate = searchParams.get('full') === 'true';
        const timestamp = metadata.timestamp;
        
        // Construir respuesta con los datos del sello usando la estructura optimizada
        const timestampData = {
          documentId: document.getId().toDTO(),
          documentType: document.getDocumentType().toDTO(),
          verificationId: document.getVerificationId().toDTO(),
          timestamp: {
            hash: timestamp.hash,
            algorithm: timestamp.algorithm || 'SHA-256',
            date: timestamp.date || null,
            provider: timestamp.provider || {
              name: 'Unknown',
              url: null
            },
            certificate: timestamp.certificate ? 
              (showFullCertificate ? timestamp.certificate : timestamp.certificate.substring(0, 100) + '...') : 
              null,
            verified: timestamp.verified || true
          }
        };
        
        return NextResponse.json({ 
          success: true, 
          data: timestampData
        });
      }
      
      // Verificar si tiene datos de sello de tiempo en el formato antiguo
      if (!metadata.timestampHash || !metadata.timestampSeal) {
        return NextResponse.json({ 
          success: false, 
          error: 'Document does not have timestamp data',
          documentId: documentId,
          hasMetadata: true,
          hasTimestamp: false,
          availableMetadata: Object.keys(metadata)
        }, { status: 404 });
      }
      
      // Incluir el certificado completo solo si se solicita
      const showFullCertificate = searchParams.get('full') === 'true';
      const seal = metadata.timestampSeal;
      
      // Construir respuesta con los datos del sello
      const timestampData = {
        documentId: document.getId().toDTO(),
        documentType: document.getDocumentType().toDTO(),
        verificationId: document.getVerificationId().toDTO(),
        timestamp: {
          hash: metadata.timestampHash,
          algorithm: seal.hash_algorithm || 'SHA-256',
          date: seal.data?.fechaSello || null,
          provider: {
            name: seal.data?.tsa || 'Unknown',
            url: seal.data?.url || null
          },
          certificate: seal.data?.sello ? 
            (showFullCertificate ? seal.data.sello : seal.data.sello.substring(0, 100) + '...') : 
            null,
          verified: true // En un caso real, aquí verificaríamos el sello criptográficamente
        }
      };
      
      return NextResponse.json({ 
        success: true, 
        data: timestampData
      });
      
    } catch (error) {
      console.error('Error al obtener documento:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Document not found',
        documentId: documentId
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error en API de timestamp:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
} 