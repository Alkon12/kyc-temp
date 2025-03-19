import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { CompanyId } from './models/CompanyId'

export default interface CompanyRepository {
  getById(companyId: CompanyId): Promise<CompanyEntity>
  getByApiKey(apiKey: string): Promise<CompanyEntity>
  getAll(): Promise<CompanyEntity[]>
  create(company: CompanyEntity): Promise<CompanyEntity>
  save(company: CompanyEntity): Promise<CompanyEntity>
}