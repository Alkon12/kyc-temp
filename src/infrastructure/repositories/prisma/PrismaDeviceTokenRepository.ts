import { PrismaClient } from '@prisma/client';
import { DeviceTokenEntity } from "@/domain/deviceToken/DeviceTokenEntity";
import DeviceTokenRepository from "@/domain/deviceToken/DeviceTokenRepository";
import { UUID } from '@domain/shared/UUID';
import { DateTimeValue } from '@domain/shared/DateTime';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class PrismaDeviceTokenRepository implements DeviceTokenRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(deviceToken: DeviceTokenEntity): Promise<DeviceTokenEntity> {
    const existingToken = await this.prisma.deviceToken.findFirst({
      where: { token: deviceToken.getToken() },
    });

    if (existingToken) {
      throw new Error('El token ya existe');
    }

    const createdToken = await this.prisma.deviceToken.create({
      data: {
        id: uuidv4(),
        userId: deviceToken.getUserId(),
        token: deviceToken.getToken(),
        device: deviceToken.getDevice(),
        createdAt: deviceToken.getCreatedAt().toDate(),
        updatedAt: deviceToken.getUpdatedAt().toDate(),
      },
    });

    return new DeviceTokenEntity(
      new UUID(createdToken.id),
      createdToken.userId,
      createdToken.token,
      createdToken.device,
      new DateTimeValue(createdToken.createdAt),
      new DateTimeValue(createdToken.updatedAt)
    );
  }

  async findById(id: UUID): Promise<DeviceTokenEntity | null> {
    const token = await this.prisma.deviceToken.findUnique({
      where: { id: id.toString() },
    });

    if (!token) return null;

    return new DeviceTokenEntity(
      new UUID(token.id),
      token.userId,
      token.token,
      token.device,
      new DateTimeValue(token.createdAt),
      new DateTimeValue(token.updatedAt)
    );
  }

  async getByUser(userId: string): Promise<DeviceTokenEntity[]> {
    const tokens = await this.prisma.deviceToken.findMany({
      where: { userId },
    });

    return tokens.map(token =>
      new DeviceTokenEntity(
        new UUID(token.id),
        token.userId,
        token.token,
        token.device,
        new DateTimeValue(token.createdAt),
        new DateTimeValue(token.updatedAt)
      )
    );
  }

  async delete(id: UUID): Promise<void> {
    await this.prisma.deviceToken.delete({
      where: { id: id.toString() },
    });
  }
}