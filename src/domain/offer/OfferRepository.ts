import { OfferEntity } from '@/domain/offer/OfferEntity'
import { BooleanValue } from '../shared/BooleanValue'
import { UUID } from '@domain/shared/UUID'

export default interface OfferRepository {
  create(data: OfferEntity): Promise<OfferEntity>
  getById(offerId: UUID): Promise<OfferEntity | null>
}
