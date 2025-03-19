import prisma from '@client/providers/PrismaClient'
import type RolePermissionRepository from '@domain/rolePermission/RolePermissionRepository'
import { RolePermissionFactory } from '@domain/rolePermission/RolePermissionFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { RolePermissionEntity } from '@domain/rolePermission/models/RolePermissionEntity'
import { injectable } from 'inversify'
import { RoleId } from '@domain/role/models/RoleId'
import { PermissionId } from '@domain/permission/models/PermissionId'
import { NotFoundError } from '@domain/error'

@injectable()
export class PrismaRolePermissionRepository implements RolePermissionRepository {
  async getByRoleId(roleId: RoleId): Promise<RolePermissionEntity[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        roleId: roleId.toDTO(),
      },
      include: {
        role: true,
        permission: true,
      },
    })

    return rolePermissions.map((rp) => RolePermissionFactory.fromDTO(convertPrismaToDTO<RolePermissionEntity>(rp)))
  }

  async getByPermissionId(permissionId: PermissionId): Promise<RolePermissionEntity[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        permissionId: permissionId.toDTO(),
      },
      include: {
        role: true,
        permission: true,
      },
    })

    return rolePermissions.map((rp) => RolePermissionFactory.fromDTO(convertPrismaToDTO<RolePermissionEntity>(rp)))
  }

  async getByRoleAndPermission(roleId: RoleId, permissionId: PermissionId): Promise<RolePermissionEntity | null> {
    const rolePermission = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: roleId.toDTO(),
          permissionId: permissionId.toDTO(),
        },
      },
      include: {
        role: true,
        permission: true,
      },
    })

    if (!rolePermission) {
      return null
    }

    return RolePermissionFactory.fromDTO(convertPrismaToDTO<RolePermissionEntity>(rolePermission))
  }

  async create(rolePermission: RolePermissionEntity): Promise<RolePermissionEntity> {
    const rolePermissionDTO = rolePermission.toDTO()
    const { role, permission, ...rolePermissionData } = rolePermissionDTO

    const createdRolePermission = await prisma.rolePermission.create({
      data: rolePermissionData,
      include: {
        role: true,
        permission: true,
      },
    })

    return RolePermissionFactory.fromDTO(convertPrismaToDTO<RolePermissionEntity>(createdRolePermission))
  }

  async delete(roleId: RoleId, permissionId: PermissionId): Promise<boolean> {
    try {
      await prisma.rolePermission.delete({
        where: {
          roleId_permissionId: {
            roleId: roleId.toDTO(),
            permissionId: permissionId.toDTO(),
          },
        },
      })
      return true
    } catch (error) {
      console.error('Error deleting Role Permission:', error)
      return false
    }
  }
} 