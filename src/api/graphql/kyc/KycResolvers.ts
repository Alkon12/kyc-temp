import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { ApiContext, ApiExternalContext } from '@api/shared/Api'
import { KycVerificationEntity } from '@domain/kycVerification/models/KycVerificationEntity'
import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { UserEntity } from '@domain/user/models/UserEntity'
import { KycPersonEntity } from '@domain/kycPerson/models/KycPersonEntity'
import { CreateKycUseCase } from '@/application/use-cases/CreateKycUseCase'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { StringValue } from '@domain/shared/StringValue'
import AbstractKycVerificationService from '@domain/kycVerification/KycVerificationService'
import { UserId } from '@domain/user/models/UserId'
import { CompanyId } from '@domain/company/models/CompanyId'
import { KycVerificationType } from '@domain/kycVerification/models/KycVerificationType'
import { NumberValue } from '@domain/shared/NumberValue'
import { KycVerificationStatus } from '@domain/kycVerification/models/KycVerificationStatus'
import AbstractKycPersonService from '@domain/kycPerson/KycPersonService'
import { KycPersonId } from '@domain/kycPerson/models/KycPersonId'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NotFoundError } from '@domain/error'

@injectable()
export class KycResolvers {
  build() {
    return {
      Query: {
        kycVerification: this.getKycVerification,
        kycVerificationByExternalId: this.getKycVerificationByExternalId,
        kycVerifications: this.getKycVerifications,
        pendingKycVerifications: this.getPendingKycVerifications,
        assignedKycVerifications: this.getAssignedKycVerifications,
        getKycPersonById: this.getKycPersonById,
      },
      Mutation: {
        createKycVerification: this.createKycVerification,
        updateKycVerificationStatus: this.updateKycVerificationStatus,
        assignKycVerification: this.assignKycVerification,
        createKycPerson: this.createKycPerson,
        updateKycPerson: this.updateKycPerson,
        updateKycPersonContactByToken: this.updateKycPersonContactByToken,
      },
      KycVerification: {
        company: this.getCompany,
        assignedUser: this.getAssignedUser,
        kycPerson: this.getKycPerson,
      },
    }
  }

  getKycVerification = async (
    _parent: unknown,
    { id }: { id: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    const verification = await kycVerificationService.getById(new KycVerificationId(id))
    
    return verification.toDTO()
  }

  getKycVerificationByExternalId = async (
    _parent: unknown,
    { externalReferenceId, companyId }: { externalReferenceId: string; companyId: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity> | null> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    const verification = await kycVerificationService.getByExternalReferenceId(externalReferenceId, new CompanyId(companyId))
    
    return verification ? verification.toDTO() : null
  }

  getKycVerifications = async (
    _parent: unknown,
    { companyId }: { companyId?: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    let verifications: KycVerificationEntity[]
    
    if (companyId) {
      verifications = await kycVerificationService.getByCompanyId(new CompanyId(companyId))
    } else {
      verifications = await kycVerificationService.getAll()
    }
    
    return verifications.map(v => v.toDTO())
  }

  getPendingKycVerifications = async (
    _parent: unknown,
    _args: unknown,
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    const verifications = await kycVerificationService.getPendingVerifications()
    
    return verifications.map(v => v.toDTO())
  }

  getAssignedKycVerifications = async (
    _parent: unknown,
    { userId }: { userId: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    const verifications = await kycVerificationService.getByAssignedUser(new UserId(userId))
    
    return verifications.map(v => v.toDTO())
  }

  createKycVerification = async (
    _parent: unknown,
    { input }: { input: any },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>> => {
    const createKycUseCase = container.get<CreateKycUseCase>(DI.CreateKycUseCase)
    
    // Mapear el input de GraphQL al DTO esperado por el caso de uso
    const kycVerificationDto = {
      companyId: input.companyId,
      externalReferenceId: input.externalReferenceId,
      verificationType: input.verificationType.toLowerCase(),
      priority: input.priority || 0,
      riskLevel: input.riskLevel,
      notes: input.notes,
      personInfo: input.personInfo,
      assignToUserId: input.assignToUserId,
    }
    
    const result = await createKycUseCase.execute(kycVerificationDto)
    return result.toDTO()
  }

  updateKycVerificationStatus = async (
    _parent: unknown,
    { id, status, notes }: { id: string; status: string; notes?: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<boolean> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    const statusValue = new KycVerificationStatus(status.toLowerCase().replace('_', '-'))
    const notesValue = notes ? new StringValue(notes) : undefined
    
    const result = await kycVerificationService.updateStatus(new KycVerificationId(id), statusValue, notesValue)
    return result.toDTO()
  }

  assignKycVerification = async (
    _parent: unknown,
    { id, userId }: { id: string; userId: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<boolean> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    const result = await kycVerificationService.assignToUser(new KycVerificationId(id), new UserId(userId))
    return result.toDTO()
  }

  // Resolvers para los campos relacionados
  getCompany = (parent: DTO<KycVerificationEntity>): DTO<CompanyEntity> | null => {
    return parent.company || null
  }

  getAssignedUser = (parent: DTO<KycVerificationEntity>): DTO<UserEntity> | null => {
    return parent.assignedUser || null
  }

  getKycPerson = async (parent: DTO<KycVerificationEntity>): Promise<DTO<KycPersonEntity> | null> => {
    const kycPersonService = container.get(DI.KycPersonService)
    try {
      const people = await kycPersonService.getByVerificationId(new KycVerificationId(parent.id))
      if (people && people.length > 0) {
        return people[0].toDTO()
      }
      return null
    } catch (error) {
      console.error('Error fetching KYC Person for verification:', error)
      return null
    }
  }

  // New KycPerson resolvers
  getKycPersonById = async (
    _parent: unknown,
    { id }: { id: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycPersonEntity>> => {
    const kycPersonService = container.get<AbstractKycPersonService>(DI.KycPersonService)
    const person = await kycPersonService.getById(new KycPersonId(id))
    
    return person.toDTO()
  }

  createKycPerson = async (
    _parent: unknown,
    { input }: { input: any },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycPersonEntity>> => {
    const kycPersonService = container.get<AbstractKycPersonService>(DI.KycPersonService)
    
    const createArgs = {
      verificationId: new KycVerificationId(input.verificationId),
      firstName: input.firstName ? new StringValue(input.firstName) : undefined,
      lastName: input.lastName ? new StringValue(input.lastName) : undefined,
      dateOfBirth: input.dateOfBirth ? new DateTimeValue(new Date(input.dateOfBirth)) : undefined,
      nationality: input.nationality ? new StringValue(input.nationality) : undefined,
      documentNumber: input.documentNumber ? new StringValue(input.documentNumber) : undefined,
      documentType: input.documentType ? new StringValue(input.documentType) : undefined,
      email: input.email ? new StringValue(input.email) : undefined,
      phone: input.phone ? new StringValue(input.phone) : undefined,
      address: input.address ? new StringValue(input.address) : undefined,
    }
    
    const person = await kycPersonService.create(createArgs)
    return person.toDTO()
  }

  updateKycPerson = async (
    _parent: unknown,
    { id, input }: { id: string; input: any },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycPersonEntity>> => {
    const kycPersonService = container.get<AbstractKycPersonService>(DI.KycPersonService)
    
    const updateArgs = {
      firstName: input.firstName ? new StringValue(input.firstName) : undefined,
      lastName: input.lastName ? new StringValue(input.lastName) : undefined,
      dateOfBirth: input.dateOfBirth ? new DateTimeValue(new Date(input.dateOfBirth)) : undefined,
      nationality: input.nationality ? new StringValue(input.nationality) : undefined,
      documentNumber: input.documentNumber ? new StringValue(input.documentNumber) : undefined,
      documentType: input.documentType ? new StringValue(input.documentType) : undefined,
      email: input.email ? new StringValue(input.email) : undefined,
      phone: input.phone ? new StringValue(input.phone) : undefined,
      address: input.address ? new StringValue(input.address) : undefined,
    }
    
    const person = await kycPersonService.update(new KycPersonId(id), updateArgs)
    return person.toDTO()
  }

  // New resolver for updating contact information by token
  updateKycPersonContactByToken = async (
    _parent: unknown,
    { token, email, phone }: { token: string; email: string; phone: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycPersonEntity>> => {
    // Get the verification link from the token
    const verificationLinkService = container.get(DI.VerificationLinkService)
    const verificationLink = await verificationLinkService.getByToken(new StringValue(token))
    
    if (!verificationLink) {
      throw new NotFoundError('Verification link not found')
    }
    
    const verificationId = verificationLink.getVerificationId()
    
    // Get the KYC person associated with the verification
    const kycPersonService = container.get<AbstractKycPersonService>(DI.KycPersonService)
    const people = await kycPersonService.getByVerificationId(verificationId)
    
    if (!people || people.length === 0) {
      throw new NotFoundError('KYC Person not found for this verification')
    }
    
    const person = people[0]
    
    // Update the contact information
    const updateArgs = {
      email: new StringValue(email),
      phone: new StringValue(phone),
    }
    
    const updatedPerson = await kycPersonService.update(person.getId(), updateArgs)
    return updatedPerson.toDTO()
  }
}