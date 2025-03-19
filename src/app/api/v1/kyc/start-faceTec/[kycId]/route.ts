import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextResponse } from 'next/server'
import { CreateFaceTecSessionUseCase } from '@/application/use-cases/CreateFaceTecSessionUseCase'

// Iniciar una sesión de FaceTec para una verificación KYC
export async function POST(req: Request, { params }: { params: { kycId: string } }) {
  const { kycId } = params;
  
  try {
    if (!kycId) {
      return NextResponse.json({
        success: false,
        error: 'KYC ID is required'
      }, { status: 400 })
    }

    const createFaceTecSessionUseCase = container.get<CreateFaceTecSessionUseCase>(DI.CreateFaceTecSessionUseCase)
    
    // Iniciar sesión de FaceTec
    const session = await createFaceTecSessionUseCase.execute({
      verificationId: kycId
    })
    
    return NextResponse.json({
      success: true,
      data: session
    })
  } catch (error) {
    console.error('Error in start-faceTec API route:', error)
    
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
