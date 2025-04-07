import prisma from '@client/providers/PrismaClient'
import type CompanyRepository from '@domain/company/CompanyRepository'
import { CompanyFactory } from '@domain/company/CompanyFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { injectable } from 'inversify'
import { CompanyId } from '@domain/company/models/CompanyId'
import { NotFoundError } from '@domain/error'
import { StringValue } from '@domain/shared/StringValue'

@injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  async getById(companyId: CompanyId): Promise<CompanyEntity> {
    const company = await prisma.company.findUnique({
      where: {
        id: companyId.toDTO(),
      },
    })

    if (!company) {
      throw new NotFoundError('Company not found')
    }

    return CompanyFactory.fromDTO(convertPrismaToDTO<CompanyEntity>(company))
  }

  async findByApiKey(apiKey: StringValue): Promise<CompanyEntity | null> {
    const company = await prisma.company.findUnique({
      where: {
        apiKey: apiKey.toDTO(),
      },
    })

    if (!company) {
      return null
    }

    return CompanyFactory.fromDTO(convertPrismaToDTO<CompanyEntity>(company))
  }

  async getAll(): Promise<CompanyEntity[]> {
    const companies = await prisma.company.findMany()
    return companies.map((c) => CompanyFactory.fromDTO(convertPrismaToDTO<CompanyEntity>(c)))
  }

  async create(company: CompanyEntity): Promise<CompanyEntity> {
    const createdCompany = await prisma.company.create({
      data: {
        ...company.toDTO(),
      },
    })

    return CompanyFactory.fromDTO(convertPrismaToDTO<CompanyEntity>(createdCompany))
  }

  async save(company: CompanyEntity): Promise<CompanyEntity> {
    const updatedCompany = await prisma.company.update({
      where: {
        id: company.getId().toDTO(),
      },
      data: {
        ...company.toDTO(),
      },
    })

    return CompanyFactory.fromDTO(convertPrismaToDTO<CompanyEntity>(updatedCompany))
  }
} 