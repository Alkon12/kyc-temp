import { Prisma } from '@prisma/client'

export const DATA_LOCATIONS: Prisma.LocationCreateInput[] = [
  {
    name: 'CDMX',
    id: '8592c79a-cba6-4bea-b33b-3a4fb0ddc1ee',
    order: 1,
  },
  {
    name: 'Costa Este',
    id: 'dadccb40-d7d6-4c04-ad85-832adec28a67',
    order: 2,
  },
  {
    name: 'Costa Oeste',
    id: '2cd1e428-eab1-4d31-9247-d32c6a36b79b',
    order: 3,
  },
]
