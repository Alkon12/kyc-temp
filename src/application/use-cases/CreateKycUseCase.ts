import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { KycVerificationFactory } from '@domain/kycVerification/KycVerificationFactory'
import type KycVerificationRepository from '@domain/kycVerification/KycVerificationRepository'
import { KycVerificationType } from '@domain/kycVerification/models/KycVerificationType'
import { KycVerificationStatus } from '@domain/kycVerification/models/KycVerificationStatus'
import { CompanyId } from '@domain/company/models/CompanyId'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { KycPersonFactory } from '@domain/kycPerson/KycPersonFactory'
import type KycPersonRepository from '@domain/kycPerson/KycPersonRepository'
import { UserId } from '@domain/user/models/UserId'
import { DateTimeValue } from '@domain/shared/DateTime'
import AbstractSignedDocumentService from '@domain/signedDocument/SignedDocumentService'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'
import { BooleanValue } from '@domain/shared/BooleanValue'

export interface CreateKycVerificationDto {
  companyId?: string
  externalReferenceId?: string
  verificationType: string
  priority?: number
  riskLevel?: string
  notes?: string
  personInfo?: {
    firstName?: string
    lastName?: string
    dateOfBirth?: string
    nationality?: string
    documentNumber?: string
    documentType?: string
    email?: string
    phone?: string
    address?: string
  }
  assignToUserId?: string
  requiresDocumentSigning?: boolean
  documentSigningInfo?: {
    templateId: string
    signerEmail?: string
    signerPhone?: string
  }
}

@injectable()
export class CreateKycUseCase {
  constructor(
    @inject(DI.KycVerificationRepository) private kycVerificationRepository: KycVerificationRepository,
    @inject(DI.KycPersonRepository) private kycPersonRepository: KycPersonRepository,
    @inject(DI.SignedDocumentService) private signedDocumentService: AbstractSignedDocumentService
  ) {}

  async execute(dto: CreateKycVerificationDto) {
    // Validar que companyId exista
    if (!dto.companyId) {
      throw new Error('Company ID is required')
    }
    
    // Crear la verificación KYC con la opción de requerir firma de documentos
    const kycVerification = KycVerificationFactory.create({
      companyId: new CompanyId(dto.companyId),
      verificationType: new KycVerificationType(dto.verificationType),
      status: new KycVerificationStatus('pending'),
      priority: new NumberValue(dto.priority || 0),
      riskLevel: dto.riskLevel ? new StringValue(dto.riskLevel) : undefined,
      notes: dto.notes ? new StringValue(dto.notes) : undefined,
      externalReferenceId: dto.externalReferenceId ? new StringValue(dto.externalReferenceId) : undefined,
      assignedTo: dto.assignToUserId ? new UserId(dto.assignToUserId) : undefined,
      requiresDocumentSigning: dto.requiresDocumentSigning ? new BooleanValue(dto.requiresDocumentSigning) : new BooleanValue(false),
    })

    // Guardar la verificación KYC primero
    const createdVerification = await this.kycVerificationRepository.create(kycVerification)

    // Si hay información de persona, crear y asociar a la verificación
    if (dto.personInfo) {
      const kycPerson = KycPersonFactory.create({
        verificationId: createdVerification.getId(),
        firstName: dto.personInfo.firstName ? new StringValue(dto.personInfo.firstName) : undefined,
        lastName: dto.personInfo.lastName ? new StringValue(dto.personInfo.lastName) : undefined,
        dateOfBirth: dto.personInfo.dateOfBirth ? new DateTimeValue(dto.personInfo.dateOfBirth) : undefined,
        nationality: dto.personInfo.nationality ? new StringValue(dto.personInfo.nationality) : undefined,
        documentNumber: dto.personInfo.documentNumber ? new StringValue(dto.personInfo.documentNumber) : undefined,
        documentType: dto.personInfo.documentType ? new StringValue(dto.personInfo.documentType) : undefined,
        email: dto.personInfo.email ? new StringValue(dto.personInfo.email) : undefined,
        phone: dto.personInfo.phone ? new StringValue(dto.personInfo.phone) : undefined,
        address: dto.personInfo.address ? new StringValue(dto.personInfo.address) : undefined,
      })

      await this.kycPersonRepository.create(kycPerson)
    }

    // Si requiere firma de documentos y se proporciona información del template
    if (dto.requiresDocumentSigning && dto.documentSigningInfo?.templateId) {
      console.log('[DEBUG] Intentando crear SignedDocument con los siguientes datos:', {
        requiresDocumentSigning: dto.requiresDocumentSigning,
        templateId: dto.documentSigningInfo.templateId,
        verificationId: createdVerification.getId().toDTO()
      });
      
      try {
        // Preparar los datos para la creación del documento firmado
        const signerEmail = dto.documentSigningInfo.signerEmail 
          ? new StringValue(dto.documentSigningInfo.signerEmail) 
          : (dto.personInfo?.email ? new StringValue(dto.personInfo.email) : undefined);
          
        const signerPhone = dto.documentSigningInfo.signerPhone 
          ? new StringValue(dto.documentSigningInfo.signerPhone) 
          : (dto.personInfo?.phone ? new StringValue(dto.personInfo.phone) : undefined);
        
        // Crear el documento para firma
        const signedDocument = await this.signedDocumentService.create({
          verificationId: createdVerification.getId(),
          templateId: new DocusealTemplateId(dto.documentSigningInfo.templateId),
          status: new StringValue('pending'),
          signerEmail: signerEmail,
          signerPhone: signerPhone
        });
        
        console.log('[DEBUG] SignedDocument creado exitosamente:', signedDocument.toDTO());
      } catch (error) {
        console.error('[ERROR] Error al crear SignedDocument:', error);
      }
    } else {
      console.log('[DEBUG] No se creará SignedDocument:', {
        requiresDocumentSigning: dto.requiresDocumentSigning,
        hasTemplateId: !!dto.documentSigningInfo?.templateId
      });
    }

    return createdVerification
  }
}