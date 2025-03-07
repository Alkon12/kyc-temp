import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractDeviceTokenService from '@domain/deviceToken/AbstractDeviceTokenService'
import { DeviceTokenEntity } from '@domain/deviceToken/DeviceTokenEntity'
import type DeviceTokenRepository from '@domain/deviceToken/DeviceTokenRepository'
import { UUID } from '@domain/shared/UUID'
import { DateTimeValue } from '@domain/shared/DateTime'
@injectable()
export class DeviceTokenService extends AbstractDeviceTokenService {
  constructor(
    @inject(DI.DeviceTokenRepository)
    private readonly repository: DeviceTokenRepository,
  ) {
    super()
  }

  async create(deviceToken: DeviceTokenEntity): Promise<DeviceTokenEntity> {
    return await this.repository.create(deviceToken)
  }

  async findById(id: UUID): Promise<DeviceTokenEntity | null> {
    return await this.repository.findById(id)
  }

  async getTokensByUser(userId: string): Promise<DeviceTokenEntity[]> {
    return await this.repository.getByUser(userId)
  }

  async deleteToken(id: UUID): Promise<void> {
    return await this.repository.delete(id)
  }

  async registerToken(userId: string, token: string, device: string): Promise<DeviceTokenEntity> {
    const deviceToken = new DeviceTokenEntity(
      new UUID(),
      userId,
      token,
      device,
      new DateTimeValue(new Date()),
      new DateTimeValue(new Date()),
    )
    return await this.create(deviceToken)
  }
}
