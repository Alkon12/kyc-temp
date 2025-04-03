import prisma from '@client/providers/PrismaClient'
import type UserRoleRepository from '@domain/userRole/UserRoleRepository'
import { UserRoleFactory } from '@domain/userRole/UserRoleFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UserRoleEntity } from '@domain/userRole/models/UserRoleEntity'
import { injectable } from 'inversify'
import { UserId } from '@domain/user/models/UserId'
import { RoleId } from '@domain/role/models/RoleId'
import { CompanyId } from '@domain/company/models/CompanyId'
import { NotFoundError } from '@domain/error'

@injectable()
export class PrismaUserRoleRepository implements UserRoleRepository {
  async getByUserId(userId: UserId): Promise<UserRoleEntity[]> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: userId.toDTO(),
      },
      include: {
        user: true,
        role: true,
        company: true,
      },
    })

    return userRoles.map((ur) => UserRoleFactory.fromDTO(convertPrismaToDTO<UserRoleEntity>(ur)))
  }

  async getByRoleId(roleId: RoleId): Promise<UserRoleEntity[]> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        roleId: roleId.toDTO(),
      },
      include: {
        user: true,
        role: true,
        company: true,
      },
    })

    return userRoles.map((ur) => UserRoleFactory.fromDTO(convertPrismaToDTO<UserRoleEntity>(ur)))
  }

  async getByCompanyId(companyId: CompanyId): Promise<UserRoleEntity[]> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        companyId: companyId.toDTO(),
      },
      include: {
        user: true,
        role: true,
        company: true,
      },
    })

    return userRoles.map((ur) => UserRoleFactory.fromDTO(convertPrismaToDTO<UserRoleEntity>(ur)))
  }

  async getByUserAndCompany(userId: UserId, companyId: CompanyId): Promise<UserRoleEntity[]> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: userId.toDTO(),
        companyId: companyId.toDTO(),
      },
      include: {
        user: true,
        role: true,
        company: true,
      },
    })

    return userRoles.map((ur) => UserRoleFactory.fromDTO(convertPrismaToDTO<UserRoleEntity>(ur)))
  }

  async getByAll(userId: UserId, roleId: RoleId, companyId?: CompanyId): Promise<UserRoleEntity | null> {
    let userRole;
    
    if (companyId) {
      userRole = await prisma.userRole.findUnique({
        where: {
          userId_roleId_companyId: {
            userId: userId.toDTO(),
            roleId: roleId.toDTO(),
            companyId: companyId.toDTO(),
          },
        },
        include: {
          user: true,
          role: true,
          company: true,
        },
      });
    } else {
      // Para roles sin companyId, buscar solo por userId y roleId
      userRole = await prisma.userRole.findFirst({
        where: {
          userId: userId.toDTO(),
          roleId: roleId.toDTO(),
          companyId: null as any,
        },
        include: {
          user: true,
          role: true,
          company: true,
        },
      });
    }

    if (!userRole) {
      return null
    }

    return UserRoleFactory.fromDTO(convertPrismaToDTO<UserRoleEntity>(userRole))
  }

  async create(userRole: UserRoleEntity): Promise<UserRoleEntity> {
    const userRoleDTO = userRole.toDTO()
    const { user, role, company, ...userRoleData } = userRoleDTO

    // Usar cast para evitar error de tipo
    const data = {
      ...userRoleData,
      companyId: userRoleData.companyId || null,
    } as any;

    const createdUserRole = await prisma.userRole.create({
      data,
      include: {
        user: true,
        role: true,
        company: true,
      },
    });

    return UserRoleFactory.fromDTO(convertPrismaToDTO<UserRoleEntity>(createdUserRole));
  }

  async delete(userId: UserId, roleId: RoleId, companyId?: CompanyId): Promise<boolean> {
    try {
      if (companyId) {
        await prisma.userRole.delete({
          where: {
            userId_roleId_companyId: {
              userId: userId.toDTO(),
              roleId: roleId.toDTO(),
              companyId: companyId.toDTO(),
            },
          },
        });
      } else {
        // Para roles sin companyId, eliminar buscando primero y luego eliminando
        const userRole = await prisma.userRole.findFirst({
          where: {
            userId: userId.toDTO(),
            roleId: roleId.toDTO(),
            companyId: null as any,
          },
        });
        
        if (userRole) {
          await prisma.userRole.delete({
            where: {
              userId_roleId_companyId: {
                userId: userRole.userId,
                roleId: userRole.roleId,
                companyId: userRole.companyId,
              },
            },
          });
        }
      }
      return true
    } catch (error) {
      console.error('Error deleting User Role:', error)
      return false
    }
  }
} 