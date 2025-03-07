import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import type ProductRepository from '@domain/product/ProductRepository'
import AbstractProductService from '@domain/product/ProductService'
import { ProductEntity } from '@domain/product/ProductEntity'

@injectable()
export class ProductService implements AbstractProductService {
  @inject(DI.ProductRepository)
  private readonly _productRepository!: ProductRepository

  async getProducts(): Promise<ProductEntity[]> {
    return await this._productRepository.getAll()
  }

  async getAvailableProducts(): Promise<ProductEntity[]> {
    const products = await this._productRepository.getAll()
    return products.filter((product) => product.isActive())
  }
}
