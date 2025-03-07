import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { BitacoraEntity } from '@domain/worklog/BitacoraEntity';
import type BitacoraRepository from '@domain/worklog/BitacoraRepository';
import { DateTimeValue } from '@domain/shared/DateTime';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from '@domain/shared/UUID';

@injectable()
export class PrismaBitacoraRepository implements BitacoraRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(bitacora: BitacoraEntity): Promise<BitacoraEntity> {
        const createdBitacora = await this.prisma.bitacora.create({
            data: {
                id: uuidv4(),
                userId: bitacora.getUserId(),
                alarmId: bitacora.getAlarmId(),
                status: bitacora.getStatus(),
                createdAt: bitacora.getCreatedAt().toDate(),
                updatedAt: bitacora.getUpdatedAt().toDate(),
            },
        });

        return new BitacoraEntity(
            new UUID(createdBitacora.id),
            createdBitacora.userId,
            createdBitacora.alarmId,
            createdBitacora.status,
            new DateTimeValue(createdBitacora.createdAt),
            new DateTimeValue(createdBitacora.updatedAt)
        );
    }

    async findById(id: string): Promise<BitacoraEntity | null> {
        const bitacora = await this.prisma.bitacora.findUnique({
            where: { id },
        });

        if (!bitacora) return null;

        return new BitacoraEntity(
            new UUID(bitacora.id),
            bitacora.userId,
            bitacora.alarmId,
            bitacora.status,
            new DateTimeValue(bitacora.createdAt),
            new DateTimeValue(bitacora.updatedAt)
        );
    }

    async findByUser(userId: string): Promise<BitacoraEntity[]> {
        const bitacoras = await this.prisma.bitacora.findMany({
            where: { userId: userId },
        });

        return bitacoras.map(bitacora =>
            new BitacoraEntity(
                new UUID(bitacora.id),
                bitacora.userId,
                bitacora.alarmId,
                bitacora.status,
                new DateTimeValue(bitacora.createdAt),
                new DateTimeValue(bitacora.updatedAt)
            )
        );
    }

    async updateStatus(id: UUID, status: string): Promise<BitacoraEntity> {
        const bitacoraId = id.toString();
        const updatedBitacora = await this.prisma.bitacora.update({
            where: { id: bitacoraId },
            data: { status },
        });

        return new BitacoraEntity(
            new UUID(updatedBitacora.id),
            updatedBitacora.userId,
            updatedBitacora.alarmId,
            updatedBitacora.status,
            new DateTimeValue(updatedBitacora.createdAt),
            new DateTimeValue(updatedBitacora.updatedAt)
        );
    }
}