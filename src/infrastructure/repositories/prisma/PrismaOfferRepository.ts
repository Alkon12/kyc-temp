import prisma from '@client/providers/PrismaClient'
import OfferRepository from '@/domain/offer/OfferRepository'
import { OfferEntity } from '@/domain/offer/OfferEntity'
import { injectable } from 'inversify'
import { OfferFactory } from '@domain/offer/OfferFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class PrismaOfferRepository implements OfferRepository {
  async create(offer: OfferEntity): Promise<OfferEntity> {
    const createdOffer = await prisma.offer.create({
      data: {
        ...offer.toDTO(),
        product: undefined,
        quote: undefined,
        user: undefined,
      },
    })

    return OfferFactory.fromDTO(convertPrismaToDTO<OfferEntity>(createdOffer))
  }

  async getById(offerId: UUID): Promise<OfferEntity | null> {
    const offer = await prisma.offer.findUnique({
      where: {
        id: offerId.toDTO(),
      },
      include: {
        product: true,
        quote: {
          include: {
            prospect: true,
          },
        },
      },
    })

    if (!offer) {
      return null
    }

    return OfferFactory.fromDTO(convertPrismaToDTO<OfferEntity>(offer))
  }
}
