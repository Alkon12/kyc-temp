import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { CompanyId } from './models/CompanyId'
import { CreateCompanyArgs } from './interfaces/CreateCompanyArgs'
import { StringValue } from '@domain/shared/StringValue'

export default abstract class AbstractCompanyService {
  abstract getById(companyId: CompanyId): Promise<CompanyEntity>
  abstract getByApiKey(apiKey: string): Promise<CompanyEntity>
  abstract getAll(): Promise<CompanyEntity[]>
  abstract create(props: CreateCompanyArgs): Promise<CompanyEntity>
  abstract update(companyId: CompanyId, props: Partial<CreateCompanyArgs>): Promise<CompanyEntity>
  abstract updateStatus(companyId: CompanyId, status: StringValue): Promise<CompanyEntity>
  abstract updateApiKey(companyId: CompanyId, apiKey: StringValue): Promise<CompanyEntity>
}