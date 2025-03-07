import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { ProductEntity } from '@domain/product/ProductEntity'
import AbstractProductService from '@domain/product/ProductService'

@injectable()
export class ProductResolvers {
  build() {
    return {
      Query: {
        getProducts: this.getProducts,
      },
    }
  }

  getProducts = async (_parent: unknown): Promise<DTO<ProductEntity[]>> => {
    const productService = container.get<AbstractProductService>(DI.ProductService)
    const products = await productService.getProducts()

    return products && products.map((product) => product.toDTO())
  }
}
