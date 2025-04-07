import { injectable, inject } from 'inversify'
import { DI } from '@infrastructure'
import { UnauthorizedError } from '@domain/error'
import type CompanyRepository from '@domain/company/CompanyRepository'
import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { StringValue } from '@domain/shared/StringValue'
import { LoggingModule, type LoggingService } from '@/application/service/LoggingService'

@injectable()
export class ApiKeyAuthService {
  @inject(DI.CompanyRepository) private readonly _companyRepository!: CompanyRepository
  @inject(DI.LoggingService) private _logger!: LoggingService

  async validateApiKey(apiKey: string): Promise<CompanyEntity> {
    this._logger.log(LoggingModule.AUTH, 'ApiKeyAuthService validateApiKey', { apiKey })

    if (!apiKey) {
      throw new UnauthorizedError('API Key is required')
    }

    const company = await this._companyRepository.findByApiKey(new StringValue(apiKey))
    
    if (!company) {
      throw new UnauthorizedError('Invalid API Key')
    }

    if (company.getStatus()?.toDTO() !== 'active') {
      throw new UnauthorizedError('Company is not active')
    }

    return company
  }
} 