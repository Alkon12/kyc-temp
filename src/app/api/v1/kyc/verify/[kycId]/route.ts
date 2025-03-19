import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextResponse } from 'next/server'
import { ProcessFaceTecResultsUseCase } from '@/application/use-cases/ProcessFaceTecResultsUseCase'

// Procesar los resultados de verificación facial de FaceTec
export async function POST(req: Request, { params }: { params: { kycId: string } }) {
  const { kycId } = params;
  
  try {
    if (!kycId) {
      return NextResponse.json({
        success: false,
        error: 'KYC ID is required'
      }, { status: 400 })
    }

    const body = await req.json()
    const { sessionId, faceScanData } = body

    if (!sessionId || !faceScanData) {
      return NextResponse.json({
        success: false,
        error: 'Session ID and face scan data are required'
      }, { status: 400 })
    }

    const processFaceTecResultsUseCase = container.get<ProcessFaceTecResultsUseCase>(DI.ProcessFaceTecResultsUseCase)
    
    // Imprimir valores para depuración
    console.log('KYC ID:', kycId);
    console.log('Session ID:', sessionId);
    console.log('Face Scan Data:', JSON.stringify(faceScanData).substring(0, 100) + '...');
    
    // Procesar los resultados
    const result = await processFaceTecResultsUseCase.execute({
      sessionId,
      verificationId: kycId,
      faceScanData
    })
    
    return NextResponse.json({
      success: true,
      data: result.toDTO()
    })
  } catch (error) {
    console.error('Error in verify API route:', error)
    
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