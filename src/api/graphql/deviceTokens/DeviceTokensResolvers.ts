import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DeviceTokenEntity } from '@domain/deviceToken/DeviceTokenEntity'
import { DeviceTokenService } from '@service/DeviceTokenService'

@injectable()
export class DeviceTokensResolvers {
  constructor(
    @inject(DI.DeviceTokenService)
    private readonly deviceTokenService: DeviceTokenService,
  ) {}

  build() {
    return {
      Query: {
        getDeviceTokensByUser: this.getDeviceTokensByUser,
      },
      Mutation: {
        registerDeviceToken: this.registerDeviceToken,
      },
    }
  }

  private getDeviceTokensByUser = async (
    _parent: unknown,
    { userId }: { userId: string },
  ): Promise<
    Array<{ id: string; userId: string; token: string; device: string; createdAt: Date; updatedAt: Date }>
  > => {
    const deviceTokens = await this.deviceTokenService.getTokensByUser(userId)

    return deviceTokens.map((deviceToken) => ({
      id: deviceToken.getId().toString(),
      userId: deviceToken.getUserId(),
      token: deviceToken.getToken(),
      device: deviceToken.getDevice(),
      createdAt: deviceToken.getCreatedAt().toDate(),
      updatedAt: deviceToken.getUpdatedAt().toDate(),
    }))
  }

  private registerDeviceToken = async (
    _parent: unknown,
    { userId, token, device }: { userId: string; token: string; device: string },
  ): Promise<{ id: string; userId: string; token: string; device: string; createdAt: Date; updatedAt: Date }> => {
    const deviceToken = await this.deviceTokenService.registerToken(userId, token, device)

    return {
      id: deviceToken.getId().toString(),
      userId: deviceToken.getUserId(),
      token: deviceToken.getToken(),
      device: deviceToken.getDevice(),
      createdAt: deviceToken.getCreatedAt().toDate(),
      updatedAt: deviceToken.getUpdatedAt().toDate(),
    }
  }
}
