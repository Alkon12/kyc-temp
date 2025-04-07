import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextRequest, NextResponse } from 'next/server'
import { KycController } from '@interfaces/controllers/KycController'
import { KycVerificationService } from '@service/KycVerificationService'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { apiKeyAuth } from '@/middleware/apiKeyAuth'

const kycController = container.get<KycController>(DI.KycController)

export async function POST(req: Request) {
  // Validar API Key primero
  const authResponse = await apiKeyAuth(req as NextRequest)
  if (authResponse instanceof NextResponse && authResponse.status !== 200) {
    return authResponse
  }

  try {
    const body = await req.json()
    
    // Extraer el company ID del header agregado por el middleware
    const companyId = req.headers.get('x-company-id') || 
                     (req as any).headers?.get?.('x-company-id')
    
    // Crear un objeto Request y Response compatible con Express
    const expressReq = {
      body,
      method: 'POST',
      headers: {
        ...Object.fromEntries(req.headers.entries()),
        'x-company-id': companyId
      },
      url: req.url
    } as any

    const expressRes = {
      status: (code: number) => ({
        json: (data: any) => NextResponse.json(data, { status: code })
      })
    } as any

    // Usar el controlador
    return await kycController.createVerification(expressReq, expressRes)
    
  } catch (error) {
    console.error('Error in KYC API route:', error)
    
    // Manejo de errores específicos
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

export async function GET(req: Request) {
  // Validar API Key primero
  const authResponse = await apiKeyAuth(req as NextRequest)
  if (authResponse instanceof NextResponse && authResponse.status !== 200) {
    return authResponse
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    // Extraer el company ID del header agregado por el middleware
    const companyId = req.headers.get('x-company-id') || 
                     (req as any).headers?.get?.('x-company-id')
    
    // Si no hay ID de compañía, algo está mal con el middleware
    if (!companyId) {
      return NextResponse.json({
        success: false,
        error: 'Company ID missing. Please check your API Key.'
      }, { status: 400 })
    }

    if (id) {
      // Obtener detalles de una verificación específica
      const kycVerificationService = container.get<KycVerificationService>(DI.KycVerificationService)
      const verification = await kycVerificationService.getById(new KycVerificationId(id))
      
      // Verificar que la verificación pertenezca a la compañía
      if (verification.getCompanyId().toDTO() !== companyId) {
        return NextResponse.json({
          success: false,
          error: 'You do not have access to this verification'
        }, { status: 403 })
      }
      
      return NextResponse.json({
        success: true,
        data: verification.toDTO()
      })
    } else {
      // Obtener todas las verificaciones pendientes para la compañía
      const kycVerificationService = container.get<KycVerificationService>(DI.KycVerificationService)
      const pendingVerifications = await kycVerificationService.getPendingByCompany(companyId)
      
      return NextResponse.json({
        success: true,
        data: pendingVerifications.map((v: any) => v.toDTO())
      })
    }
  } catch (error) {
    console.error('Error in KYC API route:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}