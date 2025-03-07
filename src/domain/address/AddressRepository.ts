import { AddressEntity } from './AddressEntity'

export default interface AddressRepository {
  create(address: AddressEntity): Promise<AddressEntity>
}
