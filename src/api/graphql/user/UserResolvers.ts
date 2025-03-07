import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { UserEntity } from '@domain/user/models/UserEntity'
import { DTO } from '@domain/kernel/DTO'
import AbstractUserService from '@domain/user/UserService'
import {
  ClientApiAuthResponse,
  FullTasks,
  MutationCreateUserArgs,
  MutationUpdateUserDriverLicenseInfoArgs,
  MutationUpdateUserPersonalInfoArgs,
  QueryAuthWithCredentialsArgs,
  QueryAuthWithUberDriverArgs,
  QueryUsersByGroupArgs,
} from '../app.schema.gen'
import { GroupEntity } from '@domain/user/models/GroupEntity'
import { ApiContext, ApiExternalContext } from '@api/shared/Api'
import AbstractTaskService from '@domain/task/TaskService'
import AbstractApplicationService from '@domain/application/ApplicationService'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'
import { TaskEntity } from '@domain/task/TaskEntity'
import { Email } from '@domain/shared/Email'
import { AuthProvider } from '@domain/shared/AuthProvider'
import { StringValue } from '@domain/shared/StringValue'
import { GroupId } from '@domain/user/models/GroupId'
import AbstractProspectService from '@domain/prospect/ProspectService'
import { ProspectActivityTypeId } from '@domain/prospect/models/ProspectActivityTypeId'
import { UberRegistrySmartItEntity } from '@domain/uberRegistrySmartIt/UberRegistrySmartItEntity'
import AbstractUberRegistrySmartItService from '@domain/uberRegistrySmartIt/AbstractUberRegistrySmartItService'
import { UserId } from '@domain/user/models/UserId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class UserResolvers {
  build() {
    return {
      Query: {
        user: this.user,
        usersByGroup: this.usersByGroup,
        authWithCredentials: this.authWithCredentials,
        authWithUberDriver: this.authWithUberDriver,
      },
      Mutation: {
        createUser: this.createUser,
        updateUserPersonalInfo: this.updateUserPersonalInfo,
        updateUserDriverLicenseInfo: this.updateUserDriverLicenseInfo,
      },
      User: {
        groups: this.userGroups,
        fullTasks: this.userFullTasks,
        pendingTasks: this.userPendingTasks,
        application: this.userActiveApplication,
        fullName: this.userFullName,
        smartItRegistry: this.userSmartItRegistry,
      },
    }
  }

  // TODO unify ApiExternalContext and ApiContext

  user = async (_parent: unknown, _: unknown, context: ApiContext | ApiExternalContext): Promise<DTO<UserEntity>> => {
    const userService = container.get<AbstractUserService>(DI.UserService)
    const user = await userService.getById(context.userId)

    return user.toDTO()
  }

  userActiveApplication = async (
    parent: DTO<UserEntity>,
    _: unknown,
    context: ApiContext | ApiExternalContext,
  ): Promise<DTO<ApplicationEntity> | null> => {
    const applicationService = container.get<AbstractApplicationService>(DI.ApplicationService)

    const application = await applicationService.getActiveByUser(context.userId)
    if (!application) {
      return null
    }

    return application.toDTO()
  }

  userFullName = async (
    parent: DTO<UserEntity>,
    _: unknown,
    context: ApiContext | ApiExternalContext,
  ): Promise<string> => {
    return `${parent.firstName} ${parent.lastName}`
  }

  userPendingTasks = async (
    _parent: unknown,
    _: unknown,
    context: ApiContext | ApiExternalContext,
  ): Promise<DTO<TaskEntity[]>> => {
    const taskService = container.get<AbstractTaskService>(DI.TaskService)
    const tasks = await taskService.getUserPendingTasks(context.userId)

    return tasks.map((t) => t.toDTO())
  }

  userFullTasks = async (
    _parent: unknown,
    _: unknown,
    context: ApiContext | ApiExternalContext,
  ): Promise<FullTasks> => {
    const taskService = container.get<AbstractTaskService>(DI.TaskService)
    const { userAssigned, userGroupsAssigned } = await taskService.getByUser(context.userId)

    return {
      userAssigned: userAssigned.filter((t) => t.isPending()).map((t) => t.toDTO()) as any, // TODO resolve entities interaction
      userGroupsAssigned: userGroupsAssigned.filter((t) => t.isPending()).map((t) => t.toDTO()) as any, // TODO resolve entities interaction
    }
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

  authWithUberDriver = async (
    _parent: unknown,
    { token }: QueryAuthWithUberDriverArgs,
  ): Promise<ClientApiAuthResponse> => {
    const userService = container.get<AbstractUserService>(DI.UserService)
    const prospectService = container.get<AbstractProspectService>(DI.ProspectService)

    const authResponse = await userService.authWithUberDriver(new StringValue(token))
    const userId = authResponse.user.getId()
    const prospect = await prospectService.getByUserId(userId)

    if (prospect) {
      await prospectService.logActivity({
        userId,
        prospectId: prospect.getId(),
        prospectActivityTypeId: ProspectActivityTypeId.APPLICATION_KYC_USER_LOGGED_IN_APP,
      })
    }

    return {
      accessToken: authResponse.accessToken,
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

  userSmartItRegistry = async (
    parent: DTO<UserEntity>,
    _: unknown,
    context: ApiContext | ApiExternalContext,
  ): Promise<DTO<UberRegistrySmartItEntity> | null> => {
    const uberRegistrySmartItService = container.get<AbstractUberRegistrySmartItService>(DI.UberRegistrySmartItService)

    const uberRegistrySmartIt = await uberRegistrySmartItService.getUberRegistryByUserId(parent.id)

    return uberRegistrySmartIt ? uberRegistrySmartIt.toDTO() : null
  }

  updateUserDriverLicenseInfo = async (
    _parent: unknown,
    { input }: MutationUpdateUserDriverLicenseInfoArgs,
    context: ApiContext,
  ): Promise<DTO<BooleanValue | null>> => {
    const userService = container.get<AbstractUserService>(DI.UserService)

    const userProps = {
      userId: new UserId(input.userId),
      driverLicenseNumber: new StringValue(input.driverLicenseNumber),
      driverLicensePermanent: new BooleanValue(input.driverLicensePermanent),
      driverLicenseValidity: input.driverLicenseValidity ? new DateTimeValue(input.driverLicenseValidity) : undefined,
    }
    const updatedUser = await userService.updateDriverLicenseInfo(userProps)

    return updatedUser.toDTO()
  }
}
