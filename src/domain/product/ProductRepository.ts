import { ProductEntity } from '@/domain/product/ProductEntity'

export default interface ProductRepository {
  getAll(): Promise<ProductEntity[]>
}
