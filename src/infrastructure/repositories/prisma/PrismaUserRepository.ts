import prisma from '@client/providers/PrismaClient'
import type UserRepository from '@domain/user/UserRepository'
import { UserFactory } from '@domain/user/UserFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UserEntity } from '@domain/user/models/UserEntity'
import { injectable } from 'inversify'
import { Email } from '@domain/shared/Email'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { NotFoundError, UnexpectedError } from '@domain/error'
import { AuthTokenRenewal } from '@/application/service/AuthService'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { AccountType } from '@domain/user/models/AccountType'
import { AccountProvider } from '@domain/user/models/AccountProvider'
import { AccountEntity } from '@domain/user/models/AccountEntity'
import { AccountFactory } from '@domain/user/AccountFactory'
import { GroupId } from '@domain/user/models/GroupId'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: Email): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toDTO(),
      },
      include: {
        groups: {
          select: {
            groupId: true,
          },
          // include: {
          //   group: true
          // }
        },
      },
    })

    if (!user) {
      return null
    }

    return UserFactory.fromDTO(convertPrismaToDTO<UserEntity>(user))
  }

  async getById(userId: UserId): Promise<UserEntity> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId.toDTO(),
      },
      include: {
        quotes: {
          include: {
            offers: {
              include: {
                product: true,
              },
            },
          },
        },
        applications: true,
        groups: {
          include: {
            group: true,
          },
        },
        assignedTasks: true,
        leasings: {
          include: {
            vehicle: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return UserFactory.fromDTO(convertPrismaToDTO<UserEntity>(user))
  }

  async getByGroup(groupId: GroupId): Promise<UserEntity[]> {
    const userGroups = await prisma.userGroup.findMany({
      where: {
        groupId: groupId.toDTO(),
      },
      include: {
        user: {
          include: {
            groups: {
              include: {
                group: true,
              },
            },
          },
        },
      },
    })

    const users = userGroups.map((u) => u.user)

    return users.map((u) => UserFactory.fromDTO(convertPrismaToDTO<UserEntity>(u)))
  }

  async getByName(name: StringValue): Promise<UserEntity | null> {
    console.log('[UserRent] - getByName', name.toDTO())
    // TODO: Fix Add a Unique Smart IT username prop
    let user = null
    try {
      user = await prisma.user.findFirst({
        where: {
          name: name.toDTO(),
        },
        include: {
          quotes: {
            include: {
              offers: {
                include: {
                  product: true,
                },
              },
            },
          },
          applications: true,
          groups: {
            include: {
              group: true,
            },
          },
          assignedTasks: true,
        },
      })
    } catch (ex) {
      // Logs any posible DB error
      console.log('[[UserRent - Prisma] [ERROR]', ex)
      throw ex
    }

    console.log('[UserRent - Prisma]', user)
    if (!user) {
      return null
    }

    return UserFactory.fromDTO(convertPrismaToDTO<UserEntity>(user))
  }

  async create(user: UserEntity, assignedGroups: GroupId[]): Promise<UserEntity> {
    const createdUser = await prisma.user.create({
      data: {
        ...user.toDTO(),
        lead: undefined,
        location: undefined,
        groups: undefined, // TODO add real groups
        accounts: undefined,
        quotes: undefined,
        offers: undefined,
        applications: undefined,
        leasings: undefined,
        assignedTasks: undefined,
        audit: undefined,
      },
    })

    await Promise.all(
      assignedGroups.map(async (ag) => {
        await prisma.userGroup.create({
          data: {
            groupId: ag.toDTO(),
            userId: createdUser.id,
            assignedAt: new Date(),
          },
        })
      }),
    )

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return UserFactory.fromDTO(convertPrismaToDTO<UserEntity>(createdUser))
  }

  async getAccount(userId: UserId, type: AccountType, provider: AccountProvider): Promise<AccountEntity | null> {
    try {
      const account = await prisma.account.findFirstOrThrow({
        where: {
          userId: userId.toDTO(),
          type: type.toDTO(),
          provider: provider.toDTO(),
        },
      })

      if (!account) {
        return null
      }

      return AccountFactory.fromDTO(convertPrismaToDTO<AccountEntity>(account))
    } catch (e) {
      console.error(e)
      throw new UnexpectedError('Account fetch error')
    }
  }

  async updateAccountTokens(
    userId: UserId,
    type: AccountType,
    provider: AccountProvider,
    props: AuthTokenRenewal,
  ): Promise<BooleanValue> {
    try {
      const account = await this.getAccount(userId, type, provider)
      if (!account) {
        throw new NotFoundError(`Account not found for User Id ${userId.toDTO()} with provider ${provider.toDTO()}`)
      }

      await prisma.account.update({
        where: {
          id: account.getId().toDTO(),
        },
        data: {
          access_token: props.accessToken.toDTO(),
          // expires_at: props.accessTokenExpiresAt.toDTO(), FIXME nable to fit integer value '1719365842624' into an INT4 (32-bit signed integer)."), original_code: None, original_message: None }
          refresh_token: props.refreshToken.toDTO(),
        },
      })

      return new BooleanValue(true)
    } catch (e) {
      console.error(e)
      return new BooleanValue(false)
    }
  }

  async updatePersonalInfo(
    userId: UserId,
    rfc: StringValue,
    curp: StringValue,
    firstName: StringValue,
    lastName: StringValue,
    secondLastName?: StringValue
  ): Promise<BooleanValue> {
    try {
      const user = await this.getById(userId)
      if (!user) {
        throw new NotFoundError(`Account not found for User Id ${userId.toDTO()}`)
      }

      let updateData = {
        rfc: rfc.toDTO(),
        curp: curp.toDTO(),
        firstName: firstName.toDTO(),
        lastName: lastName.toDTO(),
        secondLastName: secondLastName ? secondLastName.toDTO() : undefined,
        gender: curp.toDTO().charAt(10) === 'H' ? "Hombre" : curp.toDTO().charAt(10) === 'M' ? 'Mujer' : 'No binario'
      }      

      await prisma.user.update({
        where: {
          id: user.getId().toDTO(),
        },
        data: updateData,
      })

      return new BooleanValue(true)
    } catch (e) {
      console.error(e)
      return new BooleanValue(false)
    }
  }

  async updateDriverLicenseInfo(
    userId: UserId,
    driverLicenseNumber: StringValue,
    driverLicensePermanent: BooleanValue,
    driverLicenseValidity?: DateTimeValue
  ): Promise<BooleanValue> {
    try {
      const user = await this.getById(userId)
      if (!user) {
        throw new NotFoundError(`Account not found for User Id ${userId.toDTO()}`)
      }

      let updateData = {
        driverLicenseNumber: driverLicenseNumber.toDTO(),
        driverLicensePermanent: driverLicensePermanent.toDTO(),
        driverLicenseValidity: driverLicenseValidity ? driverLicenseValidity.toDTO() : undefined,
      }      

      await prisma.user.update({
        where: {
          id: user.getId().toDTO(),
        },
        data: updateData,
      })

      return new BooleanValue(true)
    } catch (e) {
      console.error(e)
      return new BooleanValue(false)
    }
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.getId().toDTO(),
      },
      data: {
        ...user.toDTO(),
        lead: undefined,
        location: undefined,
        groups: undefined, // TODO add real groups
        accounts: undefined,
        quotes: undefined,
        offers: undefined,
        applications: undefined,
        leasings: undefined,
        assignedTasks: undefined,
        audit: undefined,
      },
      include: {},
    })

    return UserFactory.fromDTO(convertPrismaToDTO<UserEntity>(updatedUser))
  }

  async getAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      where: {},
      include: {
        accounts: true,
        // leasings: {
        //   include: {
        //     vehicle: {
        //       include: {
        //         product: true
        //       }
        //     }
        //   }
        // },
      },
    })

    return users.map((u) => UserFactory.fromDTO(convertPrismaToDTO<UserEntity>(u)))
  }
}
