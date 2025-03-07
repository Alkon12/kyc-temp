import prisma from '@client/providers/PrismaClient'
import QuoteRepository from '@/domain/quote/QuoteRepository'
import { QuoteEntity } from '@/domain/quote/QuoteEntity'
import { injectable } from 'inversify'
import { QuoteFactory } from '@domain/quote/QuoteFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'

@injectable()
export class PrismaQuoteRepository implements QuoteRepository {
  async create(quote: QuoteEntity): Promise<QuoteEntity> {
    const createdQuote = await prisma.quote.create({
      data: {
        ...quote.toDTO(),
        user: undefined,
        offers: undefined,
        applications: undefined,
        prospect: undefined,
      },
    })

    return QuoteFactory.fromDTO(convertPrismaToDTO<QuoteEntity>(createdQuote))
  }

  async save(quote: QuoteEntity): Promise<QuoteEntity> {
    const updatedQuote = await prisma.quote.update({
      where: {
        id: quote.getId().toDTO(),
      },
      data: {
        ...quote.toDTO(),
        user: undefined,
        offers: undefined,
        applications: undefined,
        prospect: undefined,
      },
      include: {
        user: true,
        prospect: true,
        offers: {
          include: {
            product: true,
          },
        },
      },
    })

    return QuoteFactory.fromDTO(convertPrismaToDTO<QuoteEntity>(updatedQuote))
  }

  async getAll(fullObject?: boolean): Promise<QuoteEntity[]> {
    const quotes = await prisma.quote.findMany({
      include: {
        user: true,
        prospect: true,
        ...(fullObject && {
          offers: {
            include: {
              product: true,
            },
          },
        }),
      },
    })

    return quotes.map((i) => QuoteFactory.fromDTO(convertPrismaToDTO<QuoteEntity>(i)))
  }

  async getById(quoteId: UUID): Promise<QuoteEntity | null> {
    const quote = await prisma.quote.findUnique({
      where: {
        id: quoteId.toDTO(),
      },
      include: {
        user: true,
        prospect: true,
        offers: {
          include: {
            product: true,
          },
        },
        applications: true,
      },
    })

    if (!quote) {
      return null
    }

    return QuoteFactory.fromDTO(convertPrismaToDTO<QuoteEntity>(quote))
  }

  async getByUser(userId: UserId): Promise<QuoteEntity[]> {
    const quotes = await prisma.quote.findMany({
      where: {
        userId: userId.toDTO(),
      },
      include: {
        user: true,
        prospect: true,
        offers: {
          include: {
            product: true,
          },
        },
        applications: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return quotes.map((quote) => QuoteFactory.fromDTO(convertPrismaToDTO<QuoteEntity>(quote)))
  }
}
