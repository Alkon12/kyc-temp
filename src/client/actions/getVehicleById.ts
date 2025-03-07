import prisma from '@client/providers/PrismaClient'

interface Props {
  vehicleId?: String
}

export default async function getVehicleById(params: Props) {
  try {
    const { vehicleId } = params

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId?.toString(),
      },
      include: {
        applications: true,
      },
    })

    if (!vehicle) {
      return null
    }

    return {
      ...vehicle,
      createdAt: vehicle.createdAt.toString(),
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
