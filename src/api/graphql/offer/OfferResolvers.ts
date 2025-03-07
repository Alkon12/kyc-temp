import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import OfferService from '@domain/offer/OfferService'
import { DI } from '@infrastructure'
import { OfferEntity } from '@domain/offer/OfferEntity'
import { DTO } from '@domain/kernel/DTO'
import { QueryOfferByIdArgs } from '../app.schema.gen'
import { UUID } from '@domain/shared/UUID'
import { OfferFactory } from '@domain/offer/OfferFactory'

type OfferScoringDetail = {
  key: string
  name: string
  rank: string
  value: string
  type: string
  unit: string
}

@injectable()
export class OfferResolvers {
  build() {
    return {
      Query: {
        offerById: this.offerById,
      },
      Offer: {
        scoringDetailsParsed: this.scoringDetailsParsed,
      },
    }
  }

  offerById = async (_parent: unknown, { offerId }: QueryOfferByIdArgs): Promise<DTO<OfferEntity | null>> => {
    const offerService = container.get<OfferService>(DI.OfferService)

    const offer = await offerService.getById(new UUID(offerId))
    if (!offer) {
      return null
    }

    return offer?.toDTO()
  }

  scoringDetailsParsed = async (parent: DTO<OfferEntity>, _: unknown): Promise<OfferScoringDetail[]> => {
    const offer = OfferFactory.fromDTO(parent)

    return offer
      .getScoringDetails()
      .getJson()
      .map((detail: OfferScoringDetail) => ({
        key: detail.key,
        name: detail.name,
        type: detail.type,
        unit: detail.unit,
        rank: detail.rank,
        value: detail.value,
      }))
  }
}
