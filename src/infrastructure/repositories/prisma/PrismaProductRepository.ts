import prisma from '@client/providers/PrismaClient'
import ProductRepository from '@/domain/product/ProductRepository'
import { ProductEntity } from '@/domain/product/ProductEntity'
import { injectable } from 'inversify'
import { ProductFactory } from '@domain/product/ProductFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'

@injectable()
export class PrismaProductRepository implements ProductRepository {
  async getAll(): Promise<ProductEntity[]> {
    const products = await prisma.product.findMany()

    return products.map((product) => ProductFactory.fromDTO(convertPrismaToDTO<ProductEntity>(product)))
  }
}
