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
import AbstractDocumentService from '@domain/document/DocumentService'
import { DocumentEntity } from '@domain/document/models/DocumentEntity'

// We don't directly import entities and services that might not exist yet
// Instead, we'll use any type and check if DI symbols exist at runtime

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
        kycVerificationStats: this.getKycVerificationStats,
        kycVerificationsByStatus: this.getKycVerificationsByStatus,
        kycVerificationsByPriority: this.getKycVerificationsByPriority,
        kycVerificationsByDate: this.getKycVerificationsByDate,
        kycVerificationWithRelations: this.getKycVerificationWithRelations,
        kycVerificationsWithRelations: this.getKycVerificationsWithRelations,
        kycVerificationsWithRelationsByStatus: this.getKycVerificationsWithRelationsByStatus,
        kycVerificationsWithRelationsByPriority: this.getKycVerificationsWithRelationsByPriority,
        kycVerificationsWithRelationsByAssignee: this.getKycVerificationsWithRelationsByAssignee,
        kycVerificationWithRelationsById: this.getKycVerificationWithRelationsById,
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
      KycVerificationWithRelations: {
        company: this.getCompany,
        assignedUser: this.getAssignedUser,
        kycPersons: this.getKycPersons,
        facetecResults: this.getFacetecResults,
        documents: this.getDocuments,
        activityLogs: this.getActivityLogs,
        externalVerifications: this.getExternalVerifications,
        verificationWorkflows: this.getVerificationWorkflows,
        verificationLinks: this.getVerificationLinks,
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
    
    const statusValue = new KycVerificationStatus(status.toLowerCase().replace(/_/g, '-'))
    const notesValue = notes ? new StringValue(notes) : undefined
    
    await kycVerificationService.updateStatus(new KycVerificationId(id), statusValue, notesValue)
    return true
  }

  assignKycVerification = async (
    _parent: unknown,
    { id, userId }: { id: string; userId: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<boolean> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    await kycVerificationService.assignToUser(new KycVerificationId(id), new UserId(userId))
    return true
  }

  // Resolvers para los campos relacionados
  getCompany = (parent: DTO<KycVerificationEntity>): DTO<CompanyEntity> | null => {
    return parent.company || null
  }

  getAssignedUser = (parent: DTO<KycVerificationEntity>): DTO<UserEntity> | null => {
    return parent.assignedUser || null
  }

  getKycPerson = async (parent: DTO<KycVerificationEntity>): Promise<DTO<KycPersonEntity> | null> => {
    const kycPersonService = container.get<AbstractKycPersonService>(DI.KycPersonService)
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
    const verificationLinkService = container.get<any>(DI.VerificationLinkService)
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

  // Dashboard query resolvers
  getKycVerificationStats = async (
    _parent: unknown,
    { companyId }: { companyId?: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<any> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    // Get all verifications, or by company if provided
    let verifications: KycVerificationEntity[]
    if (companyId) {
      verifications = await kycVerificationService.getByCompanyId(new CompanyId(companyId))
    } else {
      verifications = await kycVerificationService.getAll()
    }
    
    // Count by status
    const pending = verifications.filter((v: KycVerificationEntity) => v.getStatus().toDTO() === 'pending').length
    const inProgress = verifications.filter((v: KycVerificationEntity) => v.getStatus().toDTO() === 'in-progress').length
    const approved = verifications.filter((v: KycVerificationEntity) => v.getStatus().toDTO() === 'approved').length
    const rejected = verifications.filter((v: KycVerificationEntity) => v.getStatus().toDTO() === 'rejected').length
    const requiresReview = verifications.filter((v: KycVerificationEntity) => v.getStatus().toDTO() === 'requires-review').length
    
    // Group by company
    const byCompany: Record<string, any> = {}
    for (const verification of verifications) {
      const company = verification.getCompany()
      if (!company) continue
      
      const companyId = company.getId().toDTO()
      if (!byCompany[companyId]) {
        byCompany[companyId] = {
          companyId: companyId,
          companyName: company.getCompanyName().toDTO(),
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        }
      }
      
      byCompany[companyId].total++
      
      const status = verification.getStatus().toDTO()
      if (status === 'pending') byCompany[companyId].pending++
      if (status === 'approved') byCompany[companyId].approved++
      if (status === 'rejected') byCompany[companyId].rejected++
    }
    
    // Group by verification type
    const byType: Record<string, number> = {}
    for (const verification of verifications) {
      const type = verification.getVerificationType().toDTO()
      byType[type] = (byType[type] || 0) + 1
    }
    
    // Get recent activity (last 10 verifications)
    const recentActivity = verifications
      .sort((a, b) => {
        const dateA = a.getUpdatedAt()?.toDTO() || a.getCreatedAt()?.toDTO() || new Date()
        const dateB = b.getUpdatedAt()?.toDTO() || b.getCreatedAt()?.toDTO() || new Date()
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })
      .slice(0, 10)
      .map(v => v.toDTO())
    
    return {
      total: verifications.length,
      pending,
      inProgress,
      approved,
      rejected,
      requiresReview,
      byCompany: Object.values(byCompany),
      byType: Object.entries(byType).map(([verificationType, count]) => ({ verificationType, count })),
      recentActivity,
    }
  }

  getKycVerificationsByStatus = async (
    _parent: unknown,
    { status, companyId }: { status: string; companyId?: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    // Convert GraphQL enum to domain status
    const statusValue = new KycVerificationStatus(status.toLowerCase().replace(/_/g, '-'))
    
    let verifications: KycVerificationEntity[]
    
    // Filter by status
    verifications = await kycVerificationService.getByStatus(statusValue)
    
    // Further filter by company if provided
    if (companyId) {
      verifications = verifications.filter(v => v.getCompanyId().toDTO() === companyId)
    }
    
    return verifications.map(v => v.toDTO())
  }

  getKycVerificationsByPriority = async (
    _parent: unknown,
    { priority, companyId }: { priority: number; companyId?: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    // Get all verifications, then filter by priority
    let verifications: KycVerificationEntity[]
    if (companyId) {
      verifications = await kycVerificationService.getByCompanyId(new CompanyId(companyId))
    } else {
      verifications = await kycVerificationService.getAll()
    }
    
    // Filter by priority
    verifications = verifications.filter(v => v.getPriority().toDTO() === priority)
    
    return verifications.map(v => v.toDTO())
  }

  getKycVerificationsByDate = async (
    _parent: unknown,
    { startDate, endDate, companyId }: { startDate: string; endDate: string; companyId?: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    // Get all verifications, then filter by date range
    let verifications: KycVerificationEntity[]
    if (companyId) {
      verifications = await kycVerificationService.getByCompanyId(new CompanyId(companyId))
    } else {
      verifications = await kycVerificationService.getAll()
    }
    
    // Parse dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Filter by created date within range
    verifications = verifications.filter(v => {
      const createdAt = v.getCreatedAt()?.toDTO()
      if (!createdAt) return false
      
      const date = new Date(createdAt)
      return date >= start && date <= end
    })
    
    return verifications.map(v => v.toDTO())
  }

  // New comprehensive query resolvers
  getKycVerificationWithRelations = async (
    _parent: unknown,
    { id }: { id: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    const verification = await kycVerificationService.getById(new KycVerificationId(id))
    
    return verification.toDTO()
  }

  getKycVerificationsWithRelations = async (
    _parent: unknown,
    { companyId, limit, offset }: { companyId?: string; limit?: number; offset?: number },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    let verifications: KycVerificationEntity[]
    
    if (companyId) {
      verifications = await kycVerificationService.getByCompanyId(new CompanyId(companyId))
    } else {
      verifications = await kycVerificationService.getAll()
    }
    
    // Apply pagination if specified
    if (limit !== undefined && offset !== undefined) {
      verifications = verifications.slice(offset, offset + limit)
    }
    
    return verifications.map(v => v.toDTO())
  }

  getKycVerificationsWithRelationsByStatus = async (
    _parent: unknown,
    { status, companyId, limit, offset }: { status: string; companyId?: string; limit?: number; offset?: number },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    const statusValue = new KycVerificationStatus(status.toLowerCase().replace(/_/g, '-'))
    let verifications = await kycVerificationService.getByStatus(statusValue)
    
    // Filter by company if specified
    if (companyId) {
      verifications = verifications.filter(v => v.getCompanyId().toDTO() === companyId)
    }
    
    // Apply pagination if specified
    if (limit !== undefined && offset !== undefined) {
      verifications = verifications.slice(offset, offset + limit)
    }
    
    return verifications.map(v => v.toDTO())
  }

  getKycVerificationsWithRelationsByPriority = async (
    _parent: unknown,
    { priority, companyId, limit, offset }: { priority: number; companyId?: string; limit?: number; offset?: number },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    // Get all verifications and filter by priority
    let verifications = await kycVerificationService.getAll()
    verifications = verifications.filter(v => v.getPriority().toDTO() === priority)
    
    // Filter by company if specified
    if (companyId) {
      verifications = verifications.filter(v => v.getCompanyId().toDTO() === companyId)
    }
    
    // Apply pagination if specified
    if (limit !== undefined && offset !== undefined) {
      verifications = verifications.slice(offset, offset + limit)
    }
    
    return verifications.map(v => v.toDTO())
  }

  getKycVerificationsWithRelationsByAssignee = async (
    _parent: unknown,
    { userId, limit, offset }: { userId: string; limit?: number; offset?: number },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>[]> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    let verifications = await kycVerificationService.getByAssignedUser(new UserId(userId))
    
    // Apply pagination if specified
    if (limit !== undefined && offset !== undefined) {
      verifications = verifications.slice(offset, offset + limit)
    }
    
    return verifications.map(v => v.toDTO())
  }

  // New resolvers for relationships
  getKycPersons = async (parent: DTO<KycVerificationEntity>): Promise<DTO<KycPersonEntity>[]> => {
    const kycPersonService = container.get<AbstractKycPersonService>(DI.KycPersonService)
    try {
      const people = await kycPersonService.getByVerificationId(new KycVerificationId(parent.id))
      return people.map((p: KycPersonEntity) => p.toDTO())
    } catch (error) {
      console.error('Error fetching KYC Persons for verification:', error)
      return []
    }
  }

  getFacetecResults = async (parent: DTO<KycVerificationEntity>): Promise<any[]> => {
    try {
      if (!DI.FacetecResultService) {
        console.log('FacetecResultService not available')
        return []
      }
      
      const facetecResultService = container.get<any>(DI.FacetecResultService)
      const results = await facetecResultService.getByVerificationId(new KycVerificationId(parent.id))
      return results.map((r: any) => r.toDTO())
    } catch (error) {
      console.error('Error fetching FaceTec results for verification:', error)
      return []
    }
  }

  getDocuments = async (parent: DTO<KycVerificationEntity>): Promise<any[]> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    try {
      const documents = await documentService.getByVerificationId(new KycVerificationId(parent.id))
      return documents.map((d: DocumentEntity) => d.toDTO())
    } catch (error) {
      console.error('Error fetching documents for verification:', error)
      return []
    }
  }

  getActivityLogs = async (parent: DTO<KycVerificationEntity>): Promise<any[]> => {
    try {
      // Check if ActivityLogService is registered in DI
      if (!Object.values(DI).includes(Symbol.for('ActivityLogService'))) {
        console.log('ActivityLogService not yet implemented')
        return []
      }
      
      const activityLogService = container.get<any>(Symbol.for('ActivityLogService'))
      const logs = await activityLogService.getByVerificationId(new KycVerificationId(parent.id))
      return logs.map((l: any) => l.toDTO())
    } catch (error) {
      console.error('Error fetching activity logs for verification:', error)
      return []
    }
  }

  getExternalVerifications = async (parent: DTO<KycVerificationEntity>): Promise<any[]> => {
    try {
      console.log('Getting external verifications for verification ID:', parent.id);
      
      if (!DI.ExternalVerificationService) {
        console.log('Error: ExternalVerificationService symbol not available in DI container');
        return [];
      }
      
      const externalVerificationService = container.get<any>(DI.ExternalVerificationService);
      console.log('ExternalVerificationService resolved from container:', !!externalVerificationService);
      
      // Check for both method names since there might be inconsistency in naming
      if (typeof externalVerificationService.findByKycVerificationId === 'function') {
        console.log('Using findByKycVerificationId method');
        const verifications = await externalVerificationService.findByKycVerificationId(parent.id);
        console.log('External verifications found:', verifications?.length || 0);
        return verifications.map((v: any) => v.toDTO());
      } else if (typeof externalVerificationService.getByVerificationId === 'function') {
        console.log('Using getByVerificationId method');
        const verifications = await externalVerificationService.getByVerificationId(new KycVerificationId(parent.id));
        console.log('External verifications found:', verifications?.length || 0);
        return verifications.map((v: any) => v.toDTO());
      } else {
        console.log('Error: Neither findByKycVerificationId nor getByVerificationId method implemented in ExternalVerificationService');
        console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(externalVerificationService)));
        return [];
      }
    } catch (error) {
      console.error('Error fetching external verifications for verification:', error);
      return [];
    }
  }

  getVerificationWorkflows = async (parent: DTO<KycVerificationEntity>): Promise<any[]> => {
    try {
      // Check if VerificationWorkflowService is registered in DI
      if (!Object.values(DI).includes(Symbol.for('VerificationWorkflowService'))) {
        console.log('VerificationWorkflowService not yet implemented')
        return []
      }
      
      const verificationWorkflowService = container.get<any>(Symbol.for('VerificationWorkflowService'))
      const workflows = await verificationWorkflowService.getByVerificationId(new KycVerificationId(parent.id))
      return workflows.map((w: any) => w.toDTO())
    } catch (error) {
      console.error('Error fetching verification workflows for verification:', error)
      return []
    }
  }

  getVerificationLinks = async (parent: DTO<KycVerificationEntity>): Promise<any[]> => {
    try {
      // Check if VerificationLinkService is registered in DI
      if (!DI.VerificationLinkService) {
        console.log('VerificationLinkService not yet implemented')
        return []
      }
      
      const verificationLinkService = container.get<any>(DI.VerificationLinkService)
      const links = await verificationLinkService.getByVerificationId(new KycVerificationId(parent.id))
      return links.map((l: any) => l.toDTO())
    } catch (error) {
      console.error('Error fetching verification links for verification:', error)
      return []
    }
  }

  getKycVerificationWithRelationsById = async (
    _parent: unknown,
    { id }: { id: string },
    _context: ApiContext | ApiExternalContext,
  ): Promise<DTO<KycVerificationEntity>> => {
    const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService)
    
    try {
      const verification = await kycVerificationService.getById(new KycVerificationId(id))
      if (!verification) {
        throw new NotFoundError(`KYC verification with ID ${id} not found`)
      }
      
      return verification.toDTO()
    } catch (error) {
      console.error('Error fetching KYC verification with relations by ID:', error)
      throw error
    }
  }
}