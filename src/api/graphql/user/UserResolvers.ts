import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { UserEntity } from '@domain/user/models/UserEntity'
import { DTO } from '@domain/kernel/DTO'
import AbstractUserService from '@domain/user/UserService'
import {
  ClientApiAuthResponse,
  MutationCreateUserArgs,
  MutationUpdateUserPersonalInfoArgs,
  QueryAuthWithCredentialsArgs,
  QueryUsersByGroupArgs,
} from '../app.schema.gen'
import { GroupEntity } from '@domain/user/models/GroupEntity'
import { ApiContext, ApiExternalContext } from '@api/shared/Api'
import { Email } from '@domain/shared/Email'
import { AuthProvider } from '@domain/shared/AuthProvider'
import { StringValue } from '@domain/shared/StringValue'
import { GroupId } from '@domain/user/models/GroupId'
import { UserId } from '@domain/user/models/UserId'
import { BooleanValue } from '@domain/shared/BooleanValue'

@injectable()
export class UserResolvers {
  build() {
    return {
      Query: {
        user: this.user,
        usersByGroup: this.usersByGroup,
        authWithCredentials: this.authWithCredentials,
      },
      Mutation: {
        createUser: this.createUser,
        updateUserPersonalInfo: this.updateUserPersonalInfo,
      },
      User: {
        groups: this.userGroups,
      },
    }
  }

  user = async (_parent: unknown, _: unknown, context: ApiContext | ApiExternalContext): Promise<DTO<UserEntity>> => {
    const userService = container.get<AbstractUserService>(DI.UserService)
    const user = await userService.getById(context.userId)

    return user.toDTO()
  }

  userFullName = async (
    parent: DTO<UserEntity>,
    _: unknown,
    context: ApiContext | ApiExternalContext,
  ): Promise<string> => {
    return `${parent.firstName} ${parent.lastName}`
  }

  authWithCredentials = async (
    _parent: unknown,
    { email, password, provider }: QueryAuthWithCredentialsArgs,
  ): Promise<ClientApiAuthResponse> => {
    const userService = container.get<AbstractUserService>(DI.UserService)

    const accessToken = await userService.authWithCredentials(
      new Email(email),
      password ? new StringValue(password) : undefined,
      provider ? new AuthProvider(provider) : undefined,
    )

    return {
      accessToken,
    }
  }

  createUser = async (
    _parent: unknown,
    { input }: MutationCreateUserArgs,
    context: ApiContext,
  ): Promise<DTO<UserEntity | null>> => {
    const userService = container.get<AbstractUserService>(DI.UserService)

    const userProps = {
      email: new Email(input.email),
      firstName: new StringValue(input.firstName),
      lastName: new StringValue(input.lastName),
      password: new StringValue(input.password),
      assignedGroups: input.assignedGroups.map((g) => new GroupId(g)),
      name: new StringValue(`${input.firstName} ${input.lastName}`),
    }

    const user = await userService.create(userProps)

    return user.toDTO()
  }

  updateUserPersonalInfo = async (
    _parent: unknown,
    { input }: MutationUpdateUserPersonalInfoArgs,
    context: ApiContext,
  ): Promise<DTO<BooleanValue | null>> => {
    const userService = container.get<AbstractUserService>(DI.UserService)

    const userProps = {
      userId: new UserId(input.userId),
      firstName: new StringValue(input.firstName),
      lastName: new StringValue(input.lastName),
      secondLastName: input.secondLastName ? new StringValue(input.secondLastName) : undefined,
      rfc: new StringValue(input.rfc),
      curp: new StringValue(input.curp),
    }
    const updatedUser = await userService.updatePersonalInfo(userProps)

    return updatedUser.toDTO()
  }

  userGroups = (parent: DTO<UserEntity>): DTO<GroupEntity[]> =>
    parent.groups.map((userGroup) => {
      const group = userGroup.group
      if (!group) {
        throw 'Group should be present here, but no'
      }

      return group
    })

  usersByGroup = async (_parent: unknown, { groupId }: QueryUsersByGroupArgs): Promise<DTO<UserEntity[]>> => {
    const userService = container.get<AbstractUserService>(DI.UserService)

    const users = await userService.getByGroup(new GroupId(groupId))

    return users.map((user) => user.toDTO())
  }
}
