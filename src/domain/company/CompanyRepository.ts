import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { CompanyId } from './models/CompanyId'
import { StringValue } from '@domain/shared/StringValue'

export default interface CompanyRepository {
  getById(companyId: CompanyId): Promise<CompanyEntity>
  findByApiKey(apiKey: StringValue): Promise<CompanyEntity | null>
  getAll(): Promise<CompanyEntity[]>
  create(company: CompanyEntity): Promise<CompanyEntity>
  save(company: CompanyEntity): Promise<CompanyEntity>
}