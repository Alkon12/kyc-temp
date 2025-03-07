import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
        return NextResponse.json({ error: 'El campo applicationId es obligatorio.' }, { status: 400 });
    }

    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: { addressId: true }
        });

        if (!application?.addressId) {
            return NextResponse.json({ error: 'No se encontró una dirección asociada al applicationId proporcionado.' }, { status: 404 });
        }

        const address = await prisma.address.findUnique({
            where: { id: application.addressId },
            select: {
                real_time_latitude: true,
                real_time_longitude: true
            }
        });

        if (!address) {
            return NextResponse.json({ error: 'No se encontraron datos de ubicación para la dirección asociada.' }, { status: 404 });
        }

        return NextResponse.json({
            applicationId,
            real_time_latitude: address.real_time_latitude,
            real_time_longitude: address.real_time_longitude,
            message: 'Datos de ubicación recuperados exitosamente.'
        });
    } catch (error) {
        console.error('Error al recuperar los datos de ubicación:', error);
        return NextResponse.json({ error: 'Error interno del servidor al recuperar los datos de ubicación.' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { applicationId, latitude, longitude } = await req.json();

    if (!applicationId || !latitude || !longitude) {
        return NextResponse.json({ error: 'Los campos applicationId, latitude y longitude son obligatorios.' }, { status: 400 });
    }

    try {
        await updateLocationData(applicationId, latitude, longitude);
        return NextResponse.json({ message: 'Datos de ubicación guardados exitosamente.' }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar los datos de ubicación:', error);
        return NextResponse.json({ error: 'Error interno del servidor al actualizar los datos de ubicación.' }, { status: 500 });
    }
}

async function updateLocationData(applicationId: string, latitude: string, longitude: string): Promise<void> {
    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: { addressId: true }
        });

        if (!application?.addressId) {
            throw new Error('No se encontró addressId para el applicationId proporcionado.');
        }

        await prisma.address.update({
            where: { id: application.addressId },
            data: {
                real_time_latitude: latitude,
                real_time_longitude: longitude,
            },
        });
    } catch (error) {
        console.error('Error al actualizar los datos de ubicación:', error);
        throw error;
    }
}