import { container } from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { NextResponse } from 'next/server'
import { AssignManualReviewUseCase } from '@/application/use-cases/AssignManualReviewUseCase'
import { KycVerificationService } from '@service/KycVerificationService'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { KycVerificationStatus } from '@domain/kycVerification/models/KycVerificationStatus'
import { StringValue } from '@domain/shared/StringValue'

// Revisar manualmente una verificación KYC
export async function POST(req: Request, { params }: { params: { kycId: string } }) {
  try {
    if (!params.kycId) {
      return NextResponse.json({
        success: false,
        error: 'KYC ID is required'
      }, { status: 400 })
    }

    const body = await req.json()
    const { decision, reviewerId, notes } = body

    if (!decision || !reviewerId) {
      return NextResponse.json({
        success: false,
        error: 'Decision and reviewer ID are required'
      }, { status: 400 })
    }

    if (decision !== 'approve' && decision !== 'reject') {
      return NextResponse.json({
        success: false,
        error: 'Decision must be either "approve" or "reject"'
      }, { status: 400 })
    }

    // Obtener el servicio de verificación
    const kycVerificationService = container.get<KycVerificationService>(DI.KycVerificationService)
    
    // Obtener la verificación
    const verificationId = new KycVerificationId(params.kycId)
    const verification = await kycVerificationService.getById(verificationId)
    
    // Actualizar el estado según la decisión
    const newStatus = decision === 'approve' ? 'approved' : 'rejected'
    verification.setStatus(new KycVerificationStatus(newStatus))
    
    // Agregar notas si se proporcionaron
    if (notes) {
      verification.setNotes(new StringValue(notes))
    }
    
    // Guardar los cambios
    await kycVerificationService.save(verification)
    
    return NextResponse.json({
      success: true,
      data: verification.toDTO()
    })
  } catch (error) {
    console.error('Error in review API route:', error)
    
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