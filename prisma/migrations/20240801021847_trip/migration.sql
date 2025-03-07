
-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "aliasOf" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "picture" TEXT,
    "notificationTypeId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "relevance" INTEGER NOT NULL,
    "assignedUserId" TEXT,
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "deliveredAt" TIMESTAMP(3),
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "dismissedAt" TIMESTAMP(3),
    "engaged" BOOLEAN NOT NULL DEFAULT false,
    "engagedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "fareCurrency" TEXT,
    "fareAmount" DECIMAL(8,2),
    "distance" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "pickupAt" TIMESTAMP(3),
    "dropoffAt" TIMESTAMP(3),
    "pickupLat" DECIMAL(11,8),
    "pickupLng" DECIMAL(11,8),
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
