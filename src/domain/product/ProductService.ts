import { DTO } from '@domain/kernel/DTO'
import { ProductEntity } from './ProductEntity'

export default abstract class AbstractProductService {
  abstract getProducts(): Promise<ProductEntity[]>
}
