import prisma from '@client/providers/PrismaClient'
import type PermissionRepository from '@domain/permission/PermissionRepository'
import { PermissionFactory } from '@domain/permission/PermissionFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { PermissionEntity } from '@domain/permission/models/PermissionEntity'
import { injectable } from 'inversify'
import { PermissionId } from '@domain/permission/models/PermissionId'
import { NotFoundError } from '@domain/error'

@injectable()
export class PrismaPermissionRepository implements PermissionRepository {
  async getById(permissionId: PermissionId): Promise<PermissionEntity> {
    const permission = await prisma.permission.findUnique({
      where: {
        id: permissionId.toDTO(),
      },
    })

    if (!permission) {
      throw new NotFoundError('Permission not found')
    }

    return PermissionFactory.fromDTO(convertPrismaToDTO<PermissionEntity>(permission))
  }

  async getByName(permissionName: string): Promise<PermissionEntity> {
    const permission = await prisma.permission.findUnique({
      where: {
        permissionName: permissionName,
      },
    })

    if (!permission) {
      throw new NotFoundError('Permission not found')
    }

    return PermissionFactory.fromDTO(convertPrismaToDTO<PermissionEntity>(permission))
  }

  async getAll(): Promise<PermissionEntity[]> {
    const permissions = await prisma.permission.findMany()
    return permissions.map((p) => PermissionFactory.fromDTO(convertPrismaToDTO<PermissionEntity>(p)))
  }

  async create(permission: PermissionEntity): Promise<PermissionEntity> {
    const createdPermission = await prisma.permission.create({
      data: permission.toDTO(),
    })

    return PermissionFactory.fromDTO(convertPrismaToDTO<PermissionEntity>(createdPermission))
  }

  async save(permission: PermissionEntity): Promise<PermissionEntity> {
    const updatedPermission = await prisma.permission.update({
      where: {
        id: permission.getId().toDTO(),
      },
      data: permission.toDTO(),
    })

    return PermissionFactory.fromDTO(convertPrismaToDTO<PermissionEntity>(updatedPermission))
  }
} 