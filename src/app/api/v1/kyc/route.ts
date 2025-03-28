import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextResponse } from 'next/server'
import { KycController } from '@interfaces/controllers/KycController'

const kycController = container.get<KycController>(DI.KycController)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Crear un objeto Request y Response compatible con Express
    const expressReq = {
      body,
      method: 'POST',
      headers: req.headers,
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
  try {
    // Implementar lógica para obtener verificaciones pendientes
    const kycVerificationService = container.get(DI.KycVerificationService)
    const pendingVerifications = await kycVerificationService.getPendingReviews()
    
    return NextResponse.json({
      success: true,
      data: pendingVerifications.map((v: any) => v.toDTO())
    })
  } catch (error) {
    console.error('Error in KYC API route:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}