import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextResponse } from 'next/server'
import { KycController } from '@interfaces/controllers/KycController'

const kycController = container.get<KycController>(DI.KycController)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (!body.companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    if (!body.verificationType) {
      return NextResponse.json({ error: 'verificationType is required' }, { status: 400 })
    }

    const createKycUseCase = container.get(DI.CreateKycUseCase)
    const result = await createKycUseCase.execute(body)
    
    return NextResponse.json({
      success: true,
      data: result.toDTO()
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error in KYC API route:', error)
    
    // Manejo de errores específicos
    if (error.name === 'ValidationError') {
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
      data: pendingVerifications.map(v => v.toDTO())
    })
  } catch (error) {
    console.error('Error in KYC API route:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}