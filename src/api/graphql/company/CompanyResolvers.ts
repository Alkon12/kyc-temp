import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { CompanyId } from '@domain/company/models/CompanyId'
import { StringValue } from '@domain/shared/StringValue'
import AbstractCompanyService from '@domain/company/CompanyService'
import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { CreateCompanyArgs } from '@domain/company/interfaces/CreateCompanyArgs'
import { randomUUID } from 'crypto'

type QueryGetCompanyByIdArgs = {
  companyId: string
}

type MutationCreateCompanyArgs = {
  input: {
    companyName: string
    apiKey?: string
    callbackUrl?: string
    redirectUrl?: string
  }
}

type MutationUpdateCompanyArgs = {
  companyId: string
  input: {
    companyName?: string
    apiKey?: string
    callbackUrl?: string
    redirectUrl?: string
  }
}

type MutationDeleteCompanyArgs = {
  companyId: string
}

type MutationUpdateCompanyStatusArgs = {
  companyId: string
  status: string
}

@injectable()
export class CompanyResolvers {
  build() {
    return {
      Query: {
        getAllCompanies: this.getAllCompanies,
        getCompanyById: this.getCompanyById,
      },
      Mutation: {
        createCompany: this.createCompany,
        updateCompany: this.updateCompany,
        deleteCompany: this.deleteCompany,
        updateCompanyStatus: this.updateCompanyStatus,
        generateCompanyApiKey: this.generateCompanyApiKey,
      }
    }
  }

  getAllCompanies = async (): Promise<DTO<CompanyEntity>[]> => {
    const companyService = container.get<AbstractCompanyService>(DI.CompanyService)
    const companies = await companyService.getAll()
    return companies.map(company => company.toDTO())
  }

  getCompanyById = async (_parent: unknown, { companyId }: QueryGetCompanyByIdArgs): Promise<DTO<CompanyEntity>> => {
    const companyService = container.get<AbstractCompanyService>(DI.CompanyService)
    const company = await companyService.getById(new CompanyId(companyId))
    return company.toDTO()
  }

  createCompany = async (_parent: unknown, { input }: MutationCreateCompanyArgs): Promise<DTO<CompanyEntity>> => {
    const companyService = container.get<AbstractCompanyService>(DI.CompanyService)
    
    // Generar una API Key aleatoria si no se proporciona una
    const apiKey = input.apiKey || `kyc_${randomUUID().replace(/-/g, '')}`
    
    const args: CreateCompanyArgs = {
      companyName: new StringValue(input.companyName),
      apiKey: new StringValue(apiKey),
      callbackUrl: input.callbackUrl ? new StringValue(input.callbackUrl) : undefined,
      redirectUrl: input.redirectUrl ? new StringValue(input.redirectUrl) : undefined
    }
    
    const company = await companyService.create(args)
    return company.toDTO()
  }

  updateCompany = async (_parent: unknown, { companyId, input }: MutationUpdateCompanyArgs): Promise<DTO<CompanyEntity>> => {
    const companyService = container.get<AbstractCompanyService>(DI.CompanyService)
    
    const args: Partial<CreateCompanyArgs> = {}
    
    if (input.companyName) {
      args.companyName = new StringValue(input.companyName)
    }
    
    if (input.apiKey) {
      args.apiKey = new StringValue(input.apiKey)
    }
    
    if (input.callbackUrl !== undefined) {
      args.callbackUrl = input.callbackUrl ? new StringValue(input.callbackUrl) : undefined
    }
    
    if (input.redirectUrl !== undefined) {
      args.redirectUrl = input.redirectUrl ? new StringValue(input.redirectUrl) : undefined
    }
    
    const company = await companyService.update(new CompanyId(companyId), args)
    return company.toDTO()
  }

  deleteCompany = async (_parent: unknown, { companyId }: MutationDeleteCompanyArgs): Promise<boolean> => {
    try {
      // This will need to be implemented in the service
      const companyService = container.get<AbstractCompanyService>(DI.CompanyService)
      await companyService.updateStatus(new CompanyId(companyId), new StringValue('inactive'))
      return true
    } catch (error) {
      console.error('Error deleting company:', error)
      return false
    }
  }

  updateCompanyStatus = async (_parent: unknown, { companyId, status }: MutationUpdateCompanyStatusArgs): Promise<DTO<CompanyEntity>> => {
    const companyService = container.get<AbstractCompanyService>(DI.CompanyService)
    const company = await companyService.updateStatus(new CompanyId(companyId), new StringValue(status))
    return company.toDTO()
  }

  generateCompanyApiKey = async (_parent: unknown, { companyId }: { companyId: string }): Promise<DTO<CompanyEntity>> => {
    const companyService = container.get<AbstractCompanyService>(DI.CompanyService)
    
    // Generar una API Key aleatoria con prefijo
    const apiKey = `kyc_${randomUUID().replace(/-/g, '')}`
    
    // Actualizar la compañía con la nueva API Key
    const company = await companyService.updateApiKey(new CompanyId(companyId), new StringValue(apiKey))
    
    return company.toDTO()
  }
} 