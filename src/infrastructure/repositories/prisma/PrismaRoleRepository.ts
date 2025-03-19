import prisma from '@client/providers/PrismaClient'
import type RoleRepository from '@domain/role/RoleRepository'
import { RoleFactory } from '@domain/role/RoleFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { RoleEntity } from '@domain/role/models/RoleEntity'
import { injectable } from 'inversify'
import { RoleId } from '@domain/role/models/RoleId'
import { NotFoundError } from '@domain/error'

@injectable()
export class PrismaRoleRepository implements RoleRepository {
  async getById(roleId: RoleId): Promise<RoleEntity> {
    const role = await prisma.role.findUnique({
      where: {
        id: roleId.toDTO(),
      },
    })

    if (!role) {
      throw new NotFoundError('Role not found')
    }

    return RoleFactory.fromDTO(convertPrismaToDTO<RoleEntity>(role))
  }

  async getByName(roleName: string): Promise<RoleEntity> {
    const role = await prisma.role.findUnique({
      where: {
        roleName: roleName,
      },
    })

    if (!role) {
      throw new NotFoundError('Role not found')
    }

    return RoleFactory.fromDTO(convertPrismaToDTO<RoleEntity>(role))
  }

  async getAll(): Promise<RoleEntity[]> {
    const roles = await prisma.role.findMany()
    return roles.map((r) => RoleFactory.fromDTO(convertPrismaToDTO<RoleEntity>(r)))
  }

  async create(role: RoleEntity): Promise<RoleEntity> {
    const createdRole = await prisma.role.create({
      data: role.toDTO(),
    })

    return RoleFactory.fromDTO(convertPrismaToDTO<RoleEntity>(createdRole))
  }

  async save(role: RoleEntity): Promise<RoleEntity> {
    const updatedRole = await prisma.role.update({
      where: {
        id: role.getId().toDTO(),
      },
      data: role.toDTO(),
    })

    return RoleFactory.fromDTO(convertPrismaToDTO<RoleEntity>(updatedRole))
  }
} 