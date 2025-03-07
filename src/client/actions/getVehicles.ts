import prisma from '@client/providers/PrismaClient'

export default async function getVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        applications: true,
      },
    })

    return vehicles
  } catch (error: any) {
    throw new Error(error)
  }
}
