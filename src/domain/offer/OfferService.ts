import { BooleanValue } from '@domain/shared/BooleanValue'
import { OfferEntity, OfferEntityProps } from './OfferEntity'
import { DTO } from '@domain/kernel/DTO'
import { UUID } from '@domain/shared/UUID'

export default abstract class AbstractOfferService {
  abstract create(props: DTO<OfferEntityProps>): Promise<OfferEntity>
  abstract getById(offerId: UUID): Promise<OfferEntity | null>
}
