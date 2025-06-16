import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { CompanyId } from '@domain/company/models/CompanyId'
import { CreateCompanyArgs } from '@domain/company/interfaces/CreateCompanyArgs'
import { StringValue } from '@domain/shared/StringValue'
import { CompanyFactory } from '@domain/company/CompanyFactory'
import type CompanyRepository from '@domain/company/CompanyRepository'
import AbstractCompanyService from '@domain/company/CompanyService'

@injectable()
export class CompanyService implements AbstractCompanyService {
  @inject(DI.CompanyRepository) private readonly _companyRepository!: CompanyRepository

  async getById(companyId: CompanyId): Promise<CompanyEntity> {
    return this._companyRepository.getById(companyId)
  }

  async getByApiKey(apiKey: string): Promise<CompanyEntity> {
    const company = await this._companyRepository.findByApiKey(new StringValue(apiKey))
    if (!company) {
      throw new Error('Company not found with the provided API Key')
    }
    return company
  }

  async getAll(): Promise<CompanyEntity[]> {
    return this._companyRepository.getAll()
  }

  async create(props: CreateCompanyArgs): Promise<CompanyEntity> {
    const company = CompanyFactory.create({
      companyName: props.companyName,
      apiKey: props.apiKey,
      callbackUrl: props.callbackUrl,
      redirectUrl: props.redirectUrl,
      status: new StringValue('active'),
    })

    return this._companyRepository.create(company)
  }

  async update(companyId: CompanyId, props: Partial<CreateCompanyArgs>): Promise<CompanyEntity> {
    const existingCompany = await this.getById(companyId)
    const dto = existingCompany.toDTO()
    
    const updatedCompany = CompanyFactory.create({
      companyName: props.companyName || new StringValue(dto.companyName),
      apiKey: props.apiKey || new StringValue(dto.apiKey),
      callbackUrl: props.callbackUrl ? new StringValue(props.callbackUrl.toDTO()) : dto.callbackUrl ? new StringValue(dto.callbackUrl) : undefined,
      redirectUrl: props.redirectUrl ? new StringValue(props.redirectUrl.toDTO()) : dto.redirectUrl ? new StringValue(dto.redirectUrl) : undefined,
      status: new StringValue(dto.status),
      id: companyId,
    })

    return this._companyRepository.save(updatedCompany)
  }

  async updateStatus(companyId: CompanyId, status: StringValue): Promise<CompanyEntity> {
    const existingCompany = await this.getById(companyId)
    const dto = existingCompany.toDTO()
    
    const updatedCompany = CompanyFactory.create({
      companyName: new StringValue(dto.companyName),
      apiKey: new StringValue(dto.apiKey),
      callbackUrl: dto.callbackUrl ? new StringValue(dto.callbackUrl) : undefined,
      redirectUrl: dto.redirectUrl ? new StringValue(dto.redirectUrl) : undefined,
      status,
      id: companyId,
    })

    return this._companyRepository.save(updatedCompany)
  }

  async updateApiKey(companyId: CompanyId, apiKey: StringValue): Promise<CompanyEntity> {
    const company = await this.getById(companyId)
    company.setApiKey(apiKey)
    return this._companyRepository.save(company)
  }
} 