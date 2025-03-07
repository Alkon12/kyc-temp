import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { OfferEntity, OfferEntityProps } from '@domain/offer/OfferEntity'
import { OfferFactory } from '@domain/offer/OfferFactory'
import type OfferRepository from '@domain/offer/OfferRepository'
import AbstractOfferService from '@domain/offer/OfferService'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class OfferService implements AbstractOfferService {
  @inject(DI.OfferRepository)
  private readonly _offerRepository!: OfferRepository

  async create(props: DTO<OfferEntityProps>): Promise<OfferEntity> {
    const prepareOffer = OfferFactory.fromDTO(props)
    return this._offerRepository.create(prepareOffer)
  }

  async getById(offerId: UUID): Promise<OfferEntity | null> {
    return this._offerRepository.getById(offerId)
  }
}
